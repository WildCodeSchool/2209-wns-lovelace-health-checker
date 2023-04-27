import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ArgsType, Field, InputType, Int } from "type-graphql";
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

@ArgsType()
export class UpdateRequestSettingArgs extends CreateRequestSettingArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ArgsType()
export class GetRequestSettingByIdArgs {
  @Field()
  @IsString()
  id: string;
}

@ArgsType()
export class GetPageOfRequestSetting {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  limit: number;
}

@InputType()
class FilterConstraint {
  @Field()
  value: string;

  @Field()
  matchMode: string;
}

@InputType()
class Filter {
  @Field()
  operator: string;

  @Field()
  field: string;

  @Field(() => [FilterConstraint])
  constraints: FilterConstraint[];
}

@ArgsType()
export class LazyTableStateArgs {
  @Field(() => Int)
  first: number;

  @Field(() => Int)
  rows: number;

  @Field(() => Int)
  page: number;

  @Field()
  sortField: string;

  @Field(() => Int)
  sortOrder: number;

  @Field(() => [Filter], { nullable: true })
  filters?: Filter[];
}
