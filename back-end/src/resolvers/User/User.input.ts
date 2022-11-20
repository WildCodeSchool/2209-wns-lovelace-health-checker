import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
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
  @MinLength(2, {
    message: "Firstname must have at least 2 characters",
  })
  @MaxLength(100, { message: "Firstname must have maximum 100 characters" })
  @Matches(regExp, {
    message: "Firstname must not contain numbers or special characters",
  })
  firstname: string;

  @Field()
  @MinLength(2, { message: "Lastname must have at least 2 characters" })
  @MaxLength(100, { message: "Lastname must have maximum 100 characters" })
  @Matches(regExp, {
    message: "Lastname must not contain numbers or special characters",
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
