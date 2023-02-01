import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

import { Match } from '../../utils/match.decorator';

// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number, for special character, add " (?=.*[*.!@$%^&(){}[]:;<>/,.?~_+-=|\]) "
const passwordRegExp = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");

// Support international names with super sweet unicode
const regExp = RegExp(
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
);

@ArgsType()
export class SignUpArgs {
  @Field()
  @IsNotEmpty()
  @MinLength(2, {
    message: "First name must have at least 2 characters",
  })
  @MaxLength(100, { message: "First name must have maximum 100 characters" })
  @Matches(regExp, {
    message: "First name must not contain numbers or special characters",
  })
  firstname: string;

  @Field()
  @IsNotEmpty()
  @MinLength(2, { message: "Last name must have at least 2 characters" })
  @MaxLength(100, { message: "Last name must have maximum 100 characters" })
  @Matches(regExp, {
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
  @Matches(passwordRegExp, {
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
  @Matches(passwordRegExp, {
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
  @Matches(passwordRegExp, {
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
