import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResonse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync( async(req: Request, res: Response)=>{
    const authorId = req.user?.id;
    const payload = req.body;

    if(!authorId){
        throw new Error("You Are Not Logged In.");
    }

    const result = await commentService.createComment(authorId, payload);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Comment Created Successfully.",
        data: result
    });
});

const getCommentByAuthorId = catchAsync( async(req: Request, res: Response)=>{

    const authorId = req.params.authorId;

    const result = await commentService.getCommentsByAuthorId(authorId as string);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment Retrieved Successfully.",
        data: result
    });
});

const getCommentByPostId = catchAsync( async(req: Request, res: Response)=>{
    const postId = req.params.commentId;

    const result = await commentService.getCommentByPostId(postId as string);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment Retrieved Successfully.",
        data: result
    });
});

const updateComment = catchAsync( async(req: Request, res: Response)=>{

    const authorId = req.user?.id;
    const commentId = req.params.commentId;
    const payload = req.body;

    if(!authorId){
        throw new Error("You are not logged in!");
    }

    const result = await commentService.updateComment(commentId as string, authorId, payload);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment Updated Successfully.",
        data: result
    });
});

const deleteComment = catchAsync( async(req: Request, res: Response)=>{
    const commentId = req.params.commentId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if(!authorId){
        throw new Error("You Are Not Logged In");
    }

    await commentService.deleteComment(commentId as string, authorId, isAdmin);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment Deleted Successfully.",
        data: null
    });

});

const moderateComment = catchAsync( async(req: Request, res: Response)=>{

    const {commentId} = req.params;
    const payload = req.body;

    if(!req.user){
        throw new Error("You Are Not Logged In.");
    }

    const result = await commentService.moderateComment(commentId as string, payload);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment Moderated Successfully.",
        data: result
    });
});

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByPostId,
    updateComment,
    deleteComment,
    moderateComment
}