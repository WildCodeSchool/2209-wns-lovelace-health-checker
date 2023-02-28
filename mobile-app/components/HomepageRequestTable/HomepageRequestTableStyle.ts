import { StyleSheet } from "react-native";
import { variables } from "../../styles/variables";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: variables.$primary200 },
  text: { margin: 6 },
});