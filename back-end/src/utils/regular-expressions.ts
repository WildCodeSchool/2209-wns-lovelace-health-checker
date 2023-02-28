export const URL_REG_EXP = RegExp(
  /^(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
);

// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number, for special character, add " (?=.*[*.!@$%^&(){}[]:;<>/,.?~_+-=|\]) "
export const PASSWORD_REG_EXP = new RegExp(
  "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
);

// Support international names with super sweet unicode
export const FIRSTNAME_AND_LASTNAME_REG_EXP = RegExp(
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
);
