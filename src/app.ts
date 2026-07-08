import cookieParser from "cookie-parser";
import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus  from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { premiumRoutes } from "./modules/premium/premium.route";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));


app.use("/api/subscription/webhook",  express.raw({type: 'application/json'}))

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", async(req: Request, res: Response)=>{
    const user = await prisma.user.findMany();
    console.log(user);
    res.send("Hello, world");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/premium", premiumRoutes);

app.use(notFound);

// * Error handler
app.use(globalErrorHandler);

export default app;