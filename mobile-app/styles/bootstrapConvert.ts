import { StyleSheet } from "react-native";

export const bootstrap = StyleSheet.create({
  dFlex: {
    display: "flex",
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  m0: {
    margin: 0,
  },
  mt3: {
    marginTop: 16,
  },
  mt5: {
    marginTop: 48,
  },
  mb3: {
    marginBottom: 16,
  },
  mb5: {
    marginBottom: 48,
  },
  my5: {
    marginVertical: 48,
  },
  col10: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    width: `${80 + 10 / 3}%`,
  },
  col12: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    width: "100%",
  },
  positionRelative: {
    position: "relative",
  },
  positionAbsolute: {
    position: "absolute",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  // Was padding in bootstrap, but we have to use margin for react-native-table-component
  table: {
    margin: 8,
  },
});
