import React from "react";
import { StyleSheet, Text, View } from "react-native";

const $appBackgroundImage = "url('./assets/images/background_image.png')";
const $appMinWidth = 360;
const $desktopContainerSize = 992;
const $mobileBreakpoint = 576;
const $heightXXS = 8;
const $heightXS = 16;
const $heightSM = 24;
const $heightMD = 32;
const $heightLG = 48;
const $heightXL = 60;
const $heightXXL = 120;
const $widthXXS = 16;
const $widthXS = 32;
const $widthSM = 48;
const $widthMD = 64;
const $widthLG = 80;
const $widthXL = 128;
const $widthXXL = 256;
const $widthXXXL = 320;
const $paddingXXS = 4;
const $paddingXS = 8;
const $paddingSM = 12;
const $paddingMD = 16;
const $paddingLG = 20;
const $paddingXL = 24;
const $paddingXXL = 48;
const $marginXXS = 4;
const $marginXS = 8;
const $marginSM = 12;
const $marginMD = 16;
const $marginLG = 20;
const $marginXL = 24;
const $marginXXL = 48;
const $borderRadiusNone = 0;
const $borderRadiusXS = 3;
const $borderRadiusSM = 5;
const $borderRadiusMD = 10;
const $borderRadiusLG = 20;
const $borderRadiusRound = 9999; // The value was "50%" on web-app, but you can't use percentage on React Native so we put 9999 pixels
const $fontXXS = 8;
const $fontXS = 12;
const $fontSM = 16;
const $fontMD = 20;
const $fontLG = 24;
const $fontXL = 32;
const $fontXXL = 40;
const $fontWeight400 = "400";
const $fontWeight600 = "600";
const $primary1000 = "#0f2837";
const $primary900 = "#143c5f";
const $primary800 = "#195078";
const $primary700 = "#1e5f9b";
const $primary600 = "#2378b9";
const $primary500 = "#4191d7";
const $primary400 = "#6eafe1";
const $primary300 = "#a5d2f0";
const $primary200 = "#dcebfb";
const $primary100 = "#ebf5ff";
const $primary50 = "#ebf5ff9e";
const $neutral1000 = "#212529";
const $neutral800 = "#595959";
const $yellow1000 = "#e5ae21";
const $red1000 = "#a42e0a";
const $red200 = "rgb(164, 46, 10, 0.08)";
const $green1000 = "#196713";
const $blue1000 = "#168ce9";
const $loaderTransparentBg = "rgba(255, 255, 255, 0.667)";
const $btnDisabledBg = "rgba(89, 89, 89, 0.1)";
const $btnDisabledBorderColor = "rgba(89, 89, 89, 0.4)";
const $btnDisabledColor = "rgba(89, 89, 89, 0.65)";

const sharedProperties = StyleSheet.create({
  bold: {
    fontWeight: $fontWeight600,
  },
  btn: {
    transition: "all 0.3s ease-in-out",
    width: $widthXXXL,
    height: $heightXL,
    borderRadius: $borderRadiusSM,
  },
});

const components = StyleSheet.create({
  bold: {
    ...sharedProperties.bold,
  },

  contentContainer: {
    padding: $paddingXL,
  },

  separator: {
    color: $neutral800,
    margin: `${$marginXL} 0`,
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
    backgroundColor: $primary800,
    color: "white",
    border: "none",
    // &:hover : {
    //   background-color: white,
    //   border: 2px solid variables.$primary-800,
    //   color: variables.$primary-800,
    // },
  },

  btnSecondary: {
    backgroundColor: "white",
    color: $primary800,
    border: `2px solid ${$primary800}`,
    // &:hover : {
    //   background-color: variables.$primary-800,
    //   color: white,
    // },
  },

  clickableText: {
    margin: 0,
    color: $primary800,
    ...sharedProperties.bold,
  },

  loader: {
    width: $widthSM,
    height: $heightLG,
    border: `5px solid ${$primary800}`,
    borderBottomColor: "transparent",
    borderRadius: $borderRadiusRound,
    // display: "inlineBlock",
    display: "flex",
    boxSizing: "borderBox",
    animation: "rotation 1s linear infinite",
    // @keyframes rotation : {
    //   0% : {
    //     transform: rotate(0deg),
    //   },
    //   100% : {
    //     transform: rotate(360deg),
    //   },
    // },
  },

  // errorMessage : {
  //   color: variables.$red-1000,
  // }
});

export default components;
