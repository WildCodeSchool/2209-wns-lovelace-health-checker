import { StyleSheet, View, Text, Button, TextInput } from "react-native";

import components from "../../components";

export const styles = StyleSheet.create({
  H2: {
    fontSize: 24,
  },
  bsPMarginBottom: {
    marginBottom: 16,
  },
  bold: {
    ...components.bold
  },
  contentContainer: {
    ...components.contentContainer
  },
  btn: {
    ...components.btn
  },
  btnPrimary: {
    ...components.btnPrimary
  },
  btnText: {
    color: "white", // variabiliser
    fontSize: 16, // trouver où le mettre dans l'app
  },
});