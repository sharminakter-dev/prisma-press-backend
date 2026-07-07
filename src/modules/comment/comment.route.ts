import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    commentController.createComment
);

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.get("/:commentId", commentController.getCommentByCommentId);

router.patch("/:commnetId",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    commentController.updateComment
);

router.delete("/:commnetId",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    commentController.deleteComment
);

router.patch("/commnetId/moderate",
    auth(Role.ADMIN),
    commentController.moderateComment
);



export const commentRoutes = router;