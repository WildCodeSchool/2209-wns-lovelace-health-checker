import Premium from "../../entities/Premium.entity";
import User from "../../entities/User.entity";
import StripeCheckout from "../../models/StripeCheckout";
import PremiumRepository from "../../repositories/Premium.repository";
import Stripe from "stripe";

enum PREMIUM_PLAN {
  MONTHLY = "price_1NBecxHX9gwxpIP0Djr8zRBv",
  ANNUALLY = "price_1NBedUHX9gwxpIP0P6N7VKwN",
}

export default class PremiumService extends PremiumRepository {
  public static getPremiumByUserId = (
    userId: string
  ): Promise<Premium | null> => {
    return PremiumRepository.getPremiumByUserId(userId);
  };

  static premiumSubscription = async (
    plan: "monthly" | "annually",
    user: User
  ): Promise<StripeCheckout> => {
    // Check if user not already suscribed to a Premium plan
    // Into Premium, check for user_uuid and end_date
    // Other checks ?...

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2022-11-15",
    });

    let selectedPlan = "";

    if (plan !== "monthly" && plan !== "annually")
      throw new Error("Invalid Premium plan");

    if (plan === "monthly") selectedPlan = PREMIUM_PLAN.MONTHLY;
    else if (plan === "annually") selectedPlan = PREMIUM_PLAN.ANNUALLY;

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.FRONT_END_URL}/requests`,
      customer_email: user.email,
      line_items: [{ price: selectedPlan, quantity: 1 }],
      mode: "subscription",
    });

    if (session.url) return { url: session.url };
    return { url: null };
  };
}
