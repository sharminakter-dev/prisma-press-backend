import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResonse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { premiumServices } from "./premium.service";

const getPrimumContent = catchAsync( async(req: Request, res: Response)=>{

    const query = req.query;

    const result = await premiumServices.getPrimumContent(query);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "PremiumContent Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
});

export const premiumController = {
    getPrimumContent
}