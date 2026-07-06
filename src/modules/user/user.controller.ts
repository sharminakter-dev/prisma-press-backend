import type { Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { userService } from "./user.service";
import type { NextFunction } from "express-serve-static-core";
import { catchAsync } from "../../utils/catchAsync";
import { sendResonse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken"
import { jwtUtils } from "../../utils/jwt";


// const registerUser = async(req: Request, res: Response)=>{
//     try{
//         const payload = req.body;

//         const user = await userService.registerUserIntoDB(payload);

//         res.status(httpStatus.CREATED).json({
//             success: true, 
//             statusCode: httpStatus.CREATED,
//             message: "User registered successfully",
//             data: {
//                 user
//             }
//         });
//     }catch(error){
//         console.log(error);
        
//         res.status(httpStatus.CREATED).json({
//             success: false, 
//             statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//             message: "Failed to register user",
//             error: (error as Error).message
//         });
//     }
// }

const registerUser = catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);

    sendResonse(res, {
        success: true, 
        statusCode: httpStatus.CREATED,
        message: "user registered successfully",
        data: {user}
    });
    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     statusCode : httpStatus.CREATED,
    //     message: "user registered successfully",
    //     data:{
    //         user
    //     }
    // })
});

const getMyProfile = catchAsync( async(req: Request, res: Response)=>{
    // const cookies = req.cookies;
    // console.log(req.cookies);

    // const {accessToken} = req.cookies;
    
    // const verifyToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
    
    // if( typeof verifyToken === "string"){
    //     throw new Error(verifyToken);
    // }
    
    // const profile = await userService.getMyProfileFromDB(verifyToken.id);

    // console.log(req.user);

    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Profile Fetched Successfully.",
        data: {profile}
    })
    
});

const updateMyProfile = catchAsync( async(req: Request, res: Response)=>{
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile = await userService.updateMyProfileIntoDB(userId, payload);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Profile Updated Successfully",
        data:{
            updatedProfile
        }
    })
})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}