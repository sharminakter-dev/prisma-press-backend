import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResonse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createPost = catchAsync( async(req: Request, res: Response)=>{
    const id = req.user?.id;

    const payload = req.body;

    const result = await postService.createPost(id as string, payload)

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post Created Successfully",
        data: result
    });

});

const getAllPosts = catchAsync( async(req: Request, res: Response)=>{

    const query = req.query;
    // console.log(query);

    const result = await postService.getAllPosts(query);

    sendResonse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Posts Retrived Successfully.",
        data: result
    })
});

const getPostStats = catchAsync( async(req: Request, res: Response)=>{
    const result = await postService.getPostsStats();

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Post Stats Retrived Successfully",
        data: result
    });

});

const getMyPosts = catchAsync( async(req: Request, res: Response)=>{
    const authorId = req.user?.id;

    console.log(authorId)

    const result = await postService.getMypost(authorId as string);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Post Retrived Successfully.",
        data: result
    });


});

const getPostsById =  catchAsync( async(req: Request, res: Response)=>{
    const postId = req.params.postId;

    if(!postId){
        throw new Error("Post Id Required in Params.");
    }

    const result = await postService.getPostById(postId as string);

    sendResonse(res,{
        success : true,
        statusCode: httpStatus.OK,
        message: "Post Retrieved Successfully.",
        data: result
    });

});

const updatePost =  catchAsync( async(req: Request, res: Response)=>{
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    
    const postId = req.params.postId;
    const payload = req.body;

    if(!postId){
        throw new Error("Post Id Required in Params.")
    }

    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin);

    sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Post Updated Successfully.",
        data: result
    });
});

const deletePost =  catchAsync( async(req: Request, res: Response)=>{

    const authorId = req.user?.id;

    const postId = req.params.postId;
    const isAdmin = req.user?.role === "ADMIN"

    if(!postId){
        throw new Error("Post Id Required in Params.");
    }

    await postService.deletePost(postId as string, authorId as string, isAdmin);

        sendResonse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Post Deleted Successfully.",
        data: null
    });
});

export const postController = {
    createPost,
    getAllPosts,
    getPostStats,
    getMyPosts,
    getPostsById,
    updatePost,
    deletePost
}