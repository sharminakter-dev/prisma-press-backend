import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { ICreatepostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async(userId: string, payload: ICreatepostPayload)=>{
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    });
    return result;
};

const getAllPosts = async()=>{
    const posts =  await prisma.post.findMany(
        {
            include: {
                author: {
                    select:{
                        name: true,
                        email: true
                    }
                },
                comments: true,
            }
        }
    );

    return posts;
};

const getPostById = async(postId: string)=>{

    // const post = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id: postId
    //     },
    // });

    // const updatedPost = await prisma.post.update({
    //     where: {
    //         id: postId
    //     },
    //     data: {
    //         views: {
    //             increment : 1
    //         }
    //     },
    //      include:{
    //         author: {
    //             omit: {
    //                 password: true
    //             }
    //         },
    //         comments: true
    //     }
    // });
    

    // await prisma.post.update({
    //     where: {
    //         id: postId
    //     },
    //     data:{
    //         views:{
    //             increment: 1
    //         }
    //     }
    // });

    // // throw new Error("Fake Error");

    // const post = await prisma.post.findUniqueOrThrow({
    //     where:{
    //         id: postId
    //     },
    //     include:{
    //         comments:{
    //             where:{
    //                 status: CommentStatus.APPROVED
    //             },
    //             orderBy:{
    //                 createdAt: "desc"
    //             }
    //         },
    //         author:{
    //             select:{
    //                 name: true,
    //                 email: true
    //             },
    //         }
    //     }
    // });

    // return post;

    const transactionResult = await prisma.$transaction(
        async(tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views:{
                        increment: 1
                    }
                }
            });
            
            // throw new Error(" Fake Error");

            const post = await tx.post.findUniqueOrThrow({
                where:{
                    id: postId
                },
                include:{
                    author:{
                        select:{
                            name: true,
                            email: true
                        }
                    },
                    comments:{
                        where:{
                            status: CommentStatus.APPROVED
                        },
                        orderBy:{
                            createdAt: "desc"
                        }
                    }
                }
            });

            return post;
        }
    );

    return transactionResult;
};


const getPostsStats = async()=>{
    const transactionResult = await prisma.$transaction(
        async(tx)=>{
            // const totalPosts = await tx.post.count();

            // const totalPublishedPosts = await tx.post.count({
            //     where:{
            //         status: PostStatus.PUBLISHED
            //     }
            // });

            // const totalDraftPosts = await tx.post.count({
            //     where:{
            //         status: PostStatus.DRAFT
            //     }
            // });

            // const totalArchivedPosts = await tx.post.count({
            //     where:{
            //         status: PostStatus.ARCHIVED
            //     }
            // });

            // const totalComments = await tx.comment.count();

            // const totalApprovedComments = await tx.comment.count({
            //     where:{
            //         status: CommentStatus.APPROVED
            //     }
            // });

            // const totalRejectedComments = await tx.comment.count({
            //     where:{
            //         status: CommentStatus.REJECTED
            //     }
            // });

            // //! Not a good Approach
            // // const allPosts = await tx.post.findMany();

            // // let totalPostViews = 0;

            // // allPosts.forEach((post)=>{
            // //     totalPostViews  += post.views
            // // });

            // // * better approach
            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum :{
            //         views: true
            //     }
            // });

            // const totalPostViews = totalPostViewsAggregate._sum.views;

            // return {
            //     totalPosts,
            //     totalPublishedPosts,
            //     totalDraftPosts,
            //     totalArchivedPosts,
            //     totalPostViews,
            //     totalComments,
            //     totalApprovedComments,
            //     totalRejectedComments
            // }

            const [
                totalPosts, 
                totalPublishedPosts, 
                totalDraftPosts,
                totalArchivedPosts,
                totalPostViewsAggregate,
                totalComments,
                totalApprovedComments,
                totalRejectedComments

            ] = await Promise.all([

                await tx.post.count(),

                await tx.post.count({
                    where:{
                        status: PostStatus.PUBLISHED
                    }
                }),

                await tx.post.count({
                    where:{
                        status: PostStatus.DRAFT
                    }
                }),

                await tx.post.count({
                    where:{
                        status: PostStatus.ARCHIVED
                    }
                }),

                await tx.post.aggregate({
                    _sum: {views: true}
                }),

                await tx.comment.count(),

                await tx.comment.count({
                    where:{
                        status: CommentStatus.APPROVED
                    }
                }),

                await tx.comment.count({
                    where:{
                        status: CommentStatus.REJECTED
                    }
                }),

            ]);

            return {
                totalPosts, 
                totalPublishedPosts, 
                totalDraftPosts,
                totalArchivedPosts,
                totalPostViews : totalPostViewsAggregate._sum.views,
                totalComments,
                totalApprovedComments,
                totalRejectedComments
            }
        }
    );
    return transactionResult;
}; 

const getMypost = async(authorId: string)=>{
    const result = await prisma.post.findMany({
        where:{
            authorId
        },
        
        orderBy:{
            createdAt: "desc"
        },

        include:{
            comments: true,
            author:{
                select:{
                    name: true,
                    email: true
                }
            },

            _count :{
                select: {
                    comments: true
                }
            }
        }

    });
    
    return result;
}; 

const updatePost = async(
    postId: string, 
    payload: IUpdatePostPayload, 
    authorId : string,
    isAdmin: boolean
)=>{
    const post = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        }
    });

    if(!isAdmin && post.authorId !== authorId){
        throw new Error("You Dont Have Permission To Update This Post");
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include:{
            comments: true,
            author:{
                select:{
                    name: true, 
                    email: true
                }
            },
            _count:{
                select:{
                    comments: true
                }
            }
        },
        
        
    });

    return result;

};

const deletePost = async(postId: string, authorId: string, isAdmin: boolean)=>{
    const post = await prisma.post.findFirstOrThrow({
        where :{
            id: postId
        }
    });

    if(!isAdmin && post.authorId !== authorId){
        throw new Error("You Are Not The Owner Of The Post");
    }

    await prisma.post.delete({
        where:{
            id: postId
        }
    });


};

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMypost
}