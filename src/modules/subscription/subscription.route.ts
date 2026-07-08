import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { subscriptionController } from "./subscription.controller";

const router = Router();

router.post(
    "/checkout", 
    auth(Role.USER, Role.AUTHOR, Role.ADMIN),
    subscriptionController.createCheckOutSession
);

router.post(
    "/webhook",
    subscriptionController.handleWebHook
);

router.get(
    "/status",
    auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    subscriptionController.getSubscriptionStatus
)

//todo cancel subscription route

export const subscriptionRoutes = router;