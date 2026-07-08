import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionServices } from "./subscription.service";
import { sendResonse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";


const createCheckOutSession = catchAsync( async(req: Request, res: Response)=>{
    const userId = req.user?.id;

    if(!userId){
        throw new Error("You Are Not Logged In.");
    }

    const result = await subscriptionServices.createCheckOutSession(userId);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message:"Checkout Completed Successfully.",
        data: result
    })

});

const handleWebHook = catchAsync( async(req: Request, res: Response)=>{

    let event = req.body as Buffer;
    const signature = req.headers['stripe-signature'];

    const result =  await subscriptionServices.handleWebHook(event, signature as string);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "WEBHOOK Triggered Successfully.",
        data: null
    })
});

const getSubscriptionStatus = catchAsync( async(req: Request, res: Response)=>{
    const userId = req.user?.id;

    const result = await subscriptionServices.getSubscriptionStatus(userId as string);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Subscription Status Retrieved Successfully",
        data: result
    })

})

export const subscriptionController = {
    createCheckOutSession,
    handleWebHook,
    getSubscriptionStatus
}