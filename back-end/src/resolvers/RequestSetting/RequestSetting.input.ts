import { IsNotEmpty } from "class-validator";
import { ArgsType, Field } from "type-graphql";
import { Frequency } from "../../entities/RequestSetting.entity";

@ArgsType()
export class CreateRequestSettingArgs {
  @Field()
  //@IsNotEmpty()
  /*   @MinLength(2, {
    message: "First name must have at least 2 characters",
  })
  @MaxLength(100, { message: "First name must have maximum 100 characters" })
  @Matches(regExp, {
    message: "First name must not contain numbers or special characters",
  }) */
  url: string;

  @Field()
  frequency: Frequency;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  headers?: string;

  @Field()
  allErrorsEnabledEmail: boolean;

  @Field()
  allErrorsEnabledPush: boolean;

  @Field(() => [Number], { nullable: true })
  customEmailErrors?: number[];

  @Field(() => [Number], { nullable: true })
  customPushErrors?: number[];
}
