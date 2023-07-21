import { Field, ObjectType } from "type-graphql";

@ObjectType()
class StripeCheckout {
  @Field(() => String, { nullable: true })
  url?: string | null;
}
export default StripeCheckout;
