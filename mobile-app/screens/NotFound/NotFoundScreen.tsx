import { Link } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import components from "../../style/components";
import { styles } from "./NotFoundStyle";

import variables from "../../style/variables";

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

export default NotFoundScreen;
