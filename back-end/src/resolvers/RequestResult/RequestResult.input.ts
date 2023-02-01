import { ArgsType, Field } from "type-graphql";
import { IsNotEmpty, Matches } from "class-validator";
import { URL_REG_EXP } from "../../utils/regular-expressions";
import { INVALID_URL_FORMAT_ERROR_MESSAGE } from "../../utils/form-validations";

@ArgsType()
export class checkUrlArgs {
  @Field()
  @IsNotEmpty()
  @Matches(URL_REG_EXP, { message: INVALID_URL_FORMAT_ERROR_MESSAGE })
  url: string;
}
