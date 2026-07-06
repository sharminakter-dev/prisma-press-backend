import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import type { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";



declare global{
    namespace Express{
        interface Request{
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role
            }
        }
    }
}


// auth(Role.ADMIN, Role.USER, Role.AUTHOR)
export const auth = (...requiresRoles: Role[])=>{
    return catchAsync( async (req: Request, res: Response, next: NextFunction)=>{
        const token = req.cookies.accessToken? 
            req.cookies.accessToken 
            :
            req.headers.authorization?.startsWith("Bearer")?
                req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if(!token){
            throw new Error("You are not logged in. Please log in to access this resouce.");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if(!verifiedToken.success){
            throw new Error(verifiedToken.error);
        }

        const {id, name, email, role} = verifiedToken.data as JwtPayload;

        if(requiresRoles.length && !requiresRoles.includes(role)){
            throw new Error("Forbidden, you dont have the permission to access this resouce.");
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id, 
                email,
                name
            }
        });

        if(user.activeStatus === "BLOCKED"){
            throw new Error("Your account has been blocked. Please contact support.")
        }

        req.user = {
            id, 
            name,
            email,
            role
        }

        next();

    });
}