// Think about check if these regular expressions exist in back-end to modify them if necessary
export const passwordRegExp = new RegExp(
  "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
);
export const firstNameAndLastNameRegExp = new RegExp(
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
);
