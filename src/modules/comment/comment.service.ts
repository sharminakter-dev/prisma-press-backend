import { prisma } from "../../lib/prisma";
import type { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayload } from "./comment.interface";

const createComment = async(authorId:string, payload:ICreateCommentPayload)=>{
    // console.log("author = ",authorId);
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id: payload.postId
        }
    });
    // console.log("post = ", post);

    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    });

    return comment;
};

const getCommentsByAuthorId =  async(authorId: string)=>{
    const comments = await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id: true,
                    title: true,
                    author:{
                        select:{
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    })

    return comments;
};

const getCommentByPostId =  async(postId: string)=>{
    const comment = await prisma.comment.findMany({
        where: {
             postId
        },
    });

    return comment
};

const updateComment =  async(commentId: string, authorId: string, payload: IUpdateCommentPayload)=>{

    const comment = await prisma.comment.findUniqueOrThrow({
        where : {
            id: commentId
        }
    });
    // console.log(comment);

    if(comment.authorId !== authorId){
        throw new Error("You Dont have Permission To Edit This Comment.")
    }

    const updatedComment = await prisma.comment.update({
        where:{
            id: commentId
        },
        data:payload,
        include: {
            post: {
                select: {
                    title: true,
                }
            }
        }
    });

    return updatedComment;

};

const deleteComment =  async(commentId: string, authorId: string, isAdmin: boolean)=>{
    const comment = await prisma.comment.findUniqueOrThrow({
        where:{
            id: commentId
        }
    });

    if(!isAdmin && comment.authorId !== authorId){
        throw new Error("You Dont Have Permission To Delete.");
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    });

};

const moderateComment =  async(commentId: string, payload:IModerateCommentPayload)=>{
    const comment = await prisma.comment.findFirstOrThrow({
        where: {
            id: commentId
        }
    });

    if(comment.status === payload.status){
        throw new Error(`Your Provided Status ${payload.status} is already up to date.`);
    }

    const moderatedComment = await prisma.comment.update({
        where:{
            id: commentId
        },
        data: payload,
        include:{
            author:{
                select: {
                    name: true,
                    email: true
                }
            },
            post: {
                select: {
                    title: true,
                    views: true,
                    authorId: true
                }
            }
        }
    });

    return moderatedComment;

};

export const commentService = {
    createComment,
    getCommentsByAuthorId,
    getCommentByPostId,
    updateComment,
    deleteComment,
    moderateComment
}