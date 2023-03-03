import { StyleSheet } from "react-native";

import { components } from "../../styles/components";

import { variables } from "../../styles/variables";

export const styles = StyleSheet.create({
  h1: {
    ...components.h1,
  },
  contentContainer: {
    ...components.contentContainer,
  },
  requestContainer: {
    width: "100%",
    height: variables.$heightXXL,
  },
  btn: {
    ...components.btnMobile,
    marginTop: variables.$marginMD,
  },
  p: {
    ...components.p,
  },
  btnPrimary: {
    ...components.btnPrimary,
  },
  btnTextPrimary: {
    ...components.btnTextPrimary,
  },
});
