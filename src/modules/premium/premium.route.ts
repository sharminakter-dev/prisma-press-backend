import { Router, type Request, type Response } from "express";
import { auth } from "../../middlewares/auth";
import { premiumController } from "./premium.controller";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGuard } from "../../middlewares/premiumGuard";

const router = Router();

router.get("/",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    subscriptionGuard(),
    premiumController.getPrimumContent
)

export const premiumRoutes = router;