import { Link } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./NotFoundStyle";

const NotFoundScreen = () => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.h1}>Page not found</Text>
      <View>
        <Text style={styles.p}>
          We can't seem to find the page you're looking for. Try going back to
          the previous page or click the button below to go back to homepage.
        </Text>
        <Link to="/">
          <Pressable style={[styles.btn, styles.btnPrimary]}>
            <Text style={[styles.btnTextPrimary]}>Go to homepage</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default NotFoundScreen;
