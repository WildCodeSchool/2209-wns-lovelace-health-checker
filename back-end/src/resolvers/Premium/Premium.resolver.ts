import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import StripeCheckout from "../../models/StripeCheckout";
import { Context } from "../..";
import PremiumService from "../../services/Premium/Premium.service";
import User from "../../entities/User.entity";

@Resolver()
export default class PremiumResolver {
  //@Authorized()
  @Mutation(() => StripeCheckout)
  async subscribePremium(
    @Arg("plan") plan: "monthly" | "annually",
    @Ctx() context: Context
  ): Promise<StripeCheckout> {
    return await PremiumService.premiumSubscription(plan, context.user as User);
  }
}
