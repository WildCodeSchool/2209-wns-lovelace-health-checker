import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ArgsType, Field } from "type-graphql";

import { Match } from "../../utils/match.decorator";
import {
  PASSWORD_REG_EXP,
  FIRSTNAME_AND_LASTNAME_REG_EXP,
} from "../../utils/regular-expressions";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MAX_LENGTH_ERROR_MESSAGE,
  FIRSTNAME_MAX_LENGTH,
  FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE,
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE,
  FIRSTNAME_PATTERN_ERROR_MESSAGE,
  LASTNAME_MAX_LENGTH,
  LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
  LASTNAME_PATTERN_ERROR_MESSAGE,
  PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
  PASSWORD_PATTERN_ERROR_MESSAGE,
} from "../../utils/form-validations";
import { OnPremiumCancellation } from "../../entities/User.entity";

@ArgsType()
export class SignUpArgs {
  @Field()
  @IsNotEmpty()
  @MinLength(FIRSTNAME_MIN_LENGTH, {
    message: FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE,
  })
  @MaxLength(FIRSTNAME_MAX_LENGTH, {
    message: FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE,
  })
  @Matches(FIRSTNAME_AND_LASTNAME_REG_EXP, {
    message: FIRSTNAME_PATTERN_ERROR_MESSAGE,
  })
  firstname: string;

  @Field()
  @IsNotEmpty()
  @MinLength(LASTNAME_MIN_LENGTH, {
    message: LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
  })
  @MaxLength(LASTNAME_MAX_LENGTH, {
    message: LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
  })
  @Matches(FIRSTNAME_AND_LASTNAME_REG_EXP, {
    message: LASTNAME_PATTERN_ERROR_MESSAGE,
  })
  lastname: string;

  @Field()
  @IsEmail()
  @MaxLength(EMAIL_MAX_LENGTH, {
    message: EMAIL_MAX_LENGTH_ERROR_MESSAGE,
  })
  email: string;

  @Field()
  @Matches(PASSWORD_REG_EXP, {
    message: PASSWORD_PATTERN_ERROR_MESSAGE,
  })
  password: string;

  @Field()
  @Match("password", {
    message: PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
  })
  passwordConfirmation: string;
}

@ArgsType()
export class SignInArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class ResendAccountConfirmationTokenArgs {
  @Field()
  @IsEmail()
  email: string;
}

@ArgsType()
export class AskForNewPasswordArgs {
  @Field()
  @IsEmail()
  email: string;
}

@ArgsType()
export class ResetPasswordArgs {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field()
  @Matches(PASSWORD_REG_EXP, {
    message: PASSWORD_PATTERN_ERROR_MESSAGE,
  })
  password: string;

  @Field()
  @Match("password", {
    message: PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
  })
  passwordConfirmation: string;
}

@ArgsType()
export class ConfirmAccountArgs {
  @Field()
  token: string;
}

@ArgsType()
export class UpdateIdentityArgs {
  @Field()
  lastname?: string;

  @Field()
  firstname?: string;
}

@ArgsType()
export class UpdatePasswordArgs {
  @Field()
  currentPassword: string;

  @Field()
  @Matches(PASSWORD_REG_EXP, {
    message: PASSWORD_PATTERN_ERROR_MESSAGE,
  })
  newPassword: string;

  @Field()
  @Match("newPassword", {
    message: PASSWORD_CONFIRMATION_MATCH_ERROR_MESSAGE,
  })
  newPasswordConfirmation: string;

  @Field()
  disconnectMe: boolean;
}

@ArgsType()
export class ModifyPremiumSubscriptionArgs {
  @Field()
  @IsNotEmpty()
  onPremiumCancellation: OnPremiumCancellation;
}
