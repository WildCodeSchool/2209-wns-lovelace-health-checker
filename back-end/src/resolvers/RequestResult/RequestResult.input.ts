import { ArgsType, Field } from "type-graphql";

// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number, for special character, add " (?=.*[*.!@$%^&(){}[]:;<>/,.?~_+-=|\]) "
const passwordRegExp = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");

// Support international names with super sweet unicode
const regExp = RegExp(
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
);

@ArgsType()
export class checkUrlArgs {
  @Field()
  url: string;
}
