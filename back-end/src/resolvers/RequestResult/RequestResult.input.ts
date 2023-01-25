import { ArgsType, Field } from "type-graphql";
import { Matches } from "class-validator";

const urlRegExp = RegExp(
  /^(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
);

@ArgsType()
export class checkUrlArgs {
  @Field()
  @Matches(urlRegExp, { message: "Invalid URL" })
  url: string;
}
