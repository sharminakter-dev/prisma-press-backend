import type { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

export const catchAsync = (fn : RequestHandler)=>{
    return async(req: Request, res: Response, next: NextFunction) =>{
        try{
            await fn(req, res, next);
        }catch(err){
            // console.log(err);
        
            // res.status(httpStatus.CREATED).json({
            //     success: false, 
            //     statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            //     message: "Failed to register user",
            //     error: (err as Error).message
            // });

            next(err);
        }
    }
}
