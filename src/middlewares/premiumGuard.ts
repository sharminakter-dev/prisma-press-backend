import type { NextFunction, Request, Response } from "express";
import { SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export const subscriptionGuard = ()=>{
    return catchAsync( async(req: Request, res: Response, next:NextFunction)=>{
        const userId = req.user?.id;

        const subscription = await prisma.subscription.findUnique({
            where: {
                userId
            }
        });

        if(!subscription){
            throw new Error("Please Subscribe To Get Primium Content.")
        }

        if( subscription?.status != SubscriptionStatus.ACTIVE ){
            throw new Error("Please Subscribe Again To Get Premium Content");
        }

        next();
    });

}