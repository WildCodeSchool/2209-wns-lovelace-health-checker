import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ArgsType, Field } from "type-graphql";
import { Frequency } from "../../entities/RequestSetting.entity";
import {
  INVALID_URL_FORMAT_ERROR_MESSAGE,
  REQUEST_SETTING_NAME_MAX_LENGTH,
  REQUEST_SETTING_NAME_MAX_LENGTH_ERROR_MESSAGE,
  REQUEST_SETTING_NAME_MIN_LENGTH,
  REQUEST_SETTING_NAME_MIN_LENGTH_ERROR_MESSAGE,
} from "../../utils/form-validations";
import { URL_REG_EXP } from "../../utils/regular-expressions";

@ArgsType()
export class CreateRequestSettingArgs {
  @Field()
  @IsNotEmpty()
  @Matches(URL_REG_EXP, {
    message: INVALID_URL_FORMAT_ERROR_MESSAGE,
  })
  url: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @Field({ nullable: true })
  @MinLength(REQUEST_SETTING_NAME_MIN_LENGTH, {
    message: REQUEST_SETTING_NAME_MIN_LENGTH_ERROR_MESSAGE,
  })
  @MaxLength(REQUEST_SETTING_NAME_MAX_LENGTH, {
    message: REQUEST_SETTING_NAME_MAX_LENGTH_ERROR_MESSAGE,
  })
  name?: string;

  @Field({ nullable: true })
  @MinLength(2)
  headers?: string;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  allErrorsEnabledEmail: boolean;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  allErrorsEnabledPush: boolean;

  @Field(() => [Number], { nullable: true })
  @IsArray()
  @ArrayUnique()
  customEmailErrors?: number[];

  @Field(() => [Number], { nullable: true })
  @IsArray()
  @ArrayUnique()
  customPushErrors?: number[];
}
