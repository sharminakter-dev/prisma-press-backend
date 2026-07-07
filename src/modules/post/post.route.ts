import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/",
    auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    postController.createPost
);

router.get("/", postController.getAllPosts);

router.get("/stats",
    auth(Role.ADMIN),
    postController.getPostStats
);

router.get("/my-posts",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    postController.getMyPosts
);

router.get("/:postId", postController.getPostsById);

router.patch("/:postId",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    postController.updatePost
);

router.delete("/:postId",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    postController.deletePost
);


export const postRoutes = router;