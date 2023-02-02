import { StyleSheet, View, Text, Button, TextInput } from "react-native";

import { components } from "../../style/components";

import { variables } from "../../style/variables";

export const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: variables.$primary800,
    height: 340,
    paddingVertical: 0,
    paddingHorizontal: variables.$paddingXL,
  },
  h1: {
    fontSize: 32, // TODO: à mettre dans components
    color: "#ffffff",
  },
  searchBar: {
    height: variables.$heightLG,
    width: "100%",
    paddingLeft: variables.$heightMD,
    color: variables.$neutral800,
    border: "none",
    borderTopLeftRadius: variables.$borderRadiusXS,
    borderBottomLeftRadius: variables.$borderRadiusXS,
  },
  searchButton: {
    minWidth: variables.$widthSM,
    maxWidth: variables.$widthSM,
    minHeight: variables.$widthSM,
    maxHeight: variables.$widthSM,
    backgroundColor: variables.$primary200,
    borderTopRightRadius: variables.$borderRadiusXS,
    borderBottomRightRadius: variables.$borderRadiusXS,
    border: "none",
  },
  contentContainer: {
    ...components.contentContainer,
  },
  requestContainer: {
    width: "100%",
    height: variables.$heightXXL,
  },
  loader: {
    ...components.loader,
  },
  h2: {
    marginTop: variables.$marginMD,
    fontSize: 24,
  },
  btn: {
    ...components.btnMobile,
    marginTop: variables.$marginMD,
  },
  bsPMarginBottom: {
    marginBottom: 16,
  },
  btnPrimary: {
    ...components.btnPrimary,
  },
  btnSecondary: {
    ...components.btnSecondary,
  },
  btnTextPrimary: {
    ...components.btnTextPrimary,
  },
  btnTextSecondary: {
    ...components.btnTextSecondary,
  },
});
