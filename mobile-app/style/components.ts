import { StyleSheet, Animated, Easing } from "react-native";
import { variables } from "./variables";

const sharedProperties = StyleSheet.create({
  bold: {
    fontWeight: variables.$fontWeight600,
  },
  btn: {
    transition: "all 0.3s ease-in-out",
    width: variables.$widthXXXL,
    height: variables.$heightXL,
    borderRadius: variables.$borderRadiusSM,
    textAlign: "center",
    justifyContent: "center"
  },
});

export const components = StyleSheet.create({
  bold: {
    ...sharedProperties.bold,
  },
  contentContainer: {
    padding: variables.$paddingXL,
  },
  separator: {
    color: variables.$neutral800,
    margin: `${variables.$marginXL} 0`,
  },
  btn: {
    ...sharedProperties.btn,
    ...sharedProperties.bold,
  },
  btnMobile: {
    ...sharedProperties.btn,
    width: "100%",
  },
  btnPrimary: {
    backgroundColor: variables.$primary800,
    color: "white",
    border: "none",
    // &:hover : {
    //   backgroundColor: "white",
    //   border: `2px solid ${variables.$primary800}`,
    //   color: variables.$primary800,
    // },
  },
  btnTextPrimary: {
    color: "white",
    fontSize: 16,
  },
  btnSecondary: {
    backgroundColor: "white",
    color: variables.$primary800,
    border: `2px solid ${variables.$primary800}`,
    // &:hover : {
    //   backgroundColor: variables.$primary800,
    //   color: "white",
    // },
  },
  btnTextSecondary: {
    color: variables.$primary800,
    fontSize: 16,
  },
  clickableText: {
    margin: 0,
    color: variables.$primary800,
    ...sharedProperties.bold,
  },
  loader: {
    width: variables.$widthSM,
    height: variables.$heightLG,
    border: `5px solid ${variables.$primary800}`,
    borderBottomColor: "transparent",
    borderRadius: variables.$borderRadiusRound,
    // display: "inlineBlock",
    display: "flex",
    boxSizing: "borderBox",
    // animation: "rotation 1s linear infinite",
    // @keyframes rotation : {
    //   0% : {
    //     transform: rotate(0deg),
    //   },
    //   100% : {
    //     transform: rotate(360deg),
    //   },
    // },
  },
  errorMessage: {
    color: variables.$red1000,
  },
});

const rotation = new Animated.Value(0);

Animated.timing(rotation, {
  toValue: 1,
  duration: 1000,
  easing: Easing.linear,
  useNativeDriver: false,
  isInteraction: false,
}).start(() => {
  rotation.setValue(0);
  Animated.timing(rotation, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: false,
    isInteraction: false,
  }).start();
});

const rotateInterpolation = rotation.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

export const animatedStyle = {
  transform: [{ rotate: rotateInterpolation }],
};
