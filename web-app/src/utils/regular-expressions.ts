// Think about check if these regular expressions exist in back-end to modify them if necessary
export const PASSWORD_REG_EXP = new RegExp(
  "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
);
export const FIRSTNAME_AND_LASTNAME_REG_EXP = new RegExp(
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
);

export const URL_REG_EXP = new RegExp(
  /^(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
);
