import { View, Text, StyleSheet, Button, Pressable } from "react-native";

export const styles = StyleSheet.create({
  bsPMarginBottom: {
    marginBottom: 16,
  },
  bold: {
    fontWeight: "600", // variabiliser
  },
  contentContainer: {
    padding: 24, // variabiliser
  },
  btn: {
    height: 60,
    borderRadius: 5,
    marginTop: 16,
    alignItems: "center", // align horizontally
    justifyContent: "center", // align vertically
  }, // variabiliser
  btnPrimary: {
    backgroundColor: "#195078", // variabiliser
    border: "none", // variabiliser
  },
  btnText: {
    color: "white", // variabiliser
    fontSize: 16, // trouver où le mettre dans l'app
  },
});
