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

@ArgsType()
export class SignUpArgs {
  @Field()
  @IsNotEmpty()
  @MinLength(2, {
    message: "First name must have at least 2 characters",
  })
  @MaxLength(100, { message: "First name must have maximum 100 characters" })
  @Matches(FIRSTNAME_AND_LASTNAME_REG_EXP, {
    message: "First name must not contain numbers or special characters",
  })
  firstname: string;

  @Field()
  @IsNotEmpty()
  @MinLength(2, { message: "Last name must have at least 2 characters" })
  @MaxLength(100, { message: "Last name must have maximum 100 characters" })
  @Matches(FIRSTNAME_AND_LASTNAME_REG_EXP, {
    message: "Last name must not contain numbers or special characters",
  })
  lastname: string;

  @Field()
  @IsEmail({ message: "Email format is incorrect" })
  @MaxLength(320, {
    message: "Email must have maximum 320 characters",
  })
  email: string;

  @Field()
  @Matches(PASSWORD_REG_EXP, {
    message:
      "Password must have at least 8 characters, one upper case, one lower case, and one number",
  })
  password: string;

  @Field()
  @Match("password", {
    message: "Passwords don't match",
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
    message:
      "Password must have at least 8 characters, one upper case, one lower case, and one number",
  })
  password: string;

  @Field()
  @Match("password", {
    message: "Passwords don't match",
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
    message:
      "Password must have at least 8 characters, one upper case, one lower case, and one number",
  })
  newPassword: string;

  @Field()
  @Match("newPassword", {
    message: "Passwords don't match",
  })
  newPasswordConfirmation: string;

  @Field()
  disconnectMe: boolean;
}
