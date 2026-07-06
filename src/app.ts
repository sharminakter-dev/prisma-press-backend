import cookieParser from "cookie-parser";
import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus  from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

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

export default app;