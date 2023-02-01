import { Link } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import components from "../../components";

import variables from "../../variables";

const NotFoundScreen = () => {
  return (
    <View style={styles.contentContainer}>
      <Text style={{ fontSize: 32, marginBottom: 24 }}>Page not found</Text>
      <View>
        <Text style={styles.bsPMarginBottom}>
          We can't seem to find the page you're looking for. Try going back to
          the previous page or click the button below to go back to homepage.
        </Text>
        <Pressable
          onPress={() => {
            console.log("button pressed");
          }}
          style={[styles.btn, styles.btnPrimary]}
        >
          <Text style={[styles.bold, styles.btnText]}>Go to homepage</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  bsPMarginBottom: {
    marginBottom: 16
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
    justifyContent: "center" // align vertically
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

export default NotFoundScreen;
