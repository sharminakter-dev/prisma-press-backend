import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginUser } from "./auth.interface";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async(payload: ILoginUser)=>{
    const{email, password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    });

    if(user.activeStatus === "BLOCKED"){
            throw new Error("Your account has been blocked. Please contact support.")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name : user.name,
        email: user.email,
        role : user.role,
    }

    // const accessToken = jwt.sign(
    //     jwtPayload, 
    //     config.jwt_access_secret, 
    //     {
    //         expiresIn : config.jwt_access_expires_in
    //     } as SignOptions
    // );

    const accessToken = jwtUtils.createToken(
        jwtPayload, 
        config.jwt_access_secret, 
        config.jwt_access_expires_in as SignOptions
    );

    // const refreshToken = jwt.sign(
    //     jwtPayload, 
    //     config.jwt_refresh_secret, 
    //     {
    //         expiresIn : config.jwt_refresh_expires_in
    //     } as SignOptions
    // );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )

    return {
        accessToken,
        refreshToken
    };
}

const refreshToken = async(refreshToken: string)=>{
    const verifyRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if(!verifyRefreshToken.success){
        throw new Error(verifyRefreshToken.error);
    }

    const {id} = verifyRefreshToken.data as JwtPayload;
    console.log(verifyRefreshToken);

    const user = await prisma.user.findUniqueOrThrow({
        where: {id}
    });
    if(user.activeStatus === "BLOCKED"){
        throw new Error("User Is Blocked!");
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret, 
        config.jwt_access_expires_in as SignOptions
    );

    return {accessToken};

};

export const authService = {
    loginUser,
    refreshToken
    
}