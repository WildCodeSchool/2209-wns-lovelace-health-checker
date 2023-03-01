import { StyleSheet } from "react-native";
import { variables } from "../../styles/variables";
import { bootstrap } from "../../styles/bootstrapConvert";
import { components } from "../../styles/components";

const sharedProperties = StyleSheet.create({
  list: {
    color: "white",
    margin: 0,
    fontSize: 14,
  },
});

export const styles = StyleSheet.create({
  footer: {
    backgroundColor: variables.$primary800,
    height: 120,
    paddingHorizontal: variables.$paddingXL,
    paddingVertical: 0,
  },
  copyright: { ...sharedProperties.list },
  flatlist: {
    ...sharedProperties.list,
    padding: 0,
  },
  p: {
    ...components.p,
  },
  link: { color: "white", marginBottom: 4 },
});
