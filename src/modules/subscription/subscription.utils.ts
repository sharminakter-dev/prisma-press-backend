import type Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

export const getPeriod = (payload: Stripe.Subscription)=>{
    const currentPeriodStartInMiliSec  = payload.items.data[0]?.current_period_start;
    const currentPeriodEndInMiliSec = payload.items.data[0]?.current_period_end!;

    const currentPeriodEnd = new Date (currentPeriodEndInMiliSec * 1000);

    return {currentPeriodEnd}
}

export const handleCheckoutCompleted = async(session: Stripe.Checkout.Session)=>{

    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if(!userId || !stripeCustomerId || !stripeSubscriptionId){
        console.log("Webhook : Missing Values For Creating Checkout Session");
        return
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string);

    const {currentPeriodEnd} = getPeriod(stripeSubscription);

    await prisma.subscription.upsert({
        where: {
            userId: userId
        },
        create: {
            userId,
            status: "ACTIVE",
            currentPeriodEnd,
            stripeSubscriptionId,
            stripeCustomerId
        },

        update: {
            stripeCustomerId,
            stripeSubscriptionId,
            status: "ACTIVE",
            currentPeriodEnd
        }

    });
}

export const handleChangeSubscription = async(payload: Stripe.Subscription)=>{

    const stripeSubscriptionId = payload.id;

    const status = 
            (payload.status === "active" || payload.status === "trialing") ? SubscriptionStatus.ACTIVE
            : payload.status === "canceled" ? SubscriptionStatus.CANCELED
                :  SubscriptionStatus.EXPIRED;

    const {currentPeriodEnd} = getPeriod(payload);

    const isSubscriptionExist = await prisma.subscription.findUnique({
        where : {
            stripeSubscriptionId
        }
    });

    if(!isSubscriptionExist){
        console.log(`Webhook : No Subscription found for subscription id : ${stripeSubscriptionId} `);
        return;
    }

    await prisma.subscription.update({
            where: {
                stripeSubscriptionId
            },
            data: {
                status,
                currentPeriodEnd
            }
        })
    
};

 