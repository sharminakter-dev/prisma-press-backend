import { Router, type NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import type { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";


const router = Router();

router.post("/register", userController.registerUser);

router.get("/me", 
 //    (req: Request, res: Response, next: NextFunction)=>{
//     // res.status(200).json({
//     //     success: true,
//     //     statusCode: 200,
//     //     message: "good",

//     // });
//     // console.log(req.cookies);

//     const {accessToken} = req.cookies;
    
//     const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
//     // console.log(verifiedToken);
    
//     if( typeof verifiedToken === "string"){
//         throw new Error(verifiedToken);
//     }
    
//     const {id, name, email, role} = verifiedToken as JwtPayload;

//     // const requiredRoles = ["ADMIN", "USER", "AUTHOR"];
//     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

//     if(!requiredRoles.includes(role)){
//         return res.status(httpStatus.FORBIDDEN).json({
//             success: false,
//             statusCode: httpStatus.FORBIDDEN,
//             message: "Forbidden, you dont have the permission to access this resouce.",
//         });
//     }

//     // * set user in request
//     req.user = {
//         id, 
//         name,
//         email,
//         role 
//     }

//     next();
// }, 
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    userController.getMyProfile
);

router.put("/my-profile", 
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    userController.updateMyProfile
)

export const userRoutes = router;