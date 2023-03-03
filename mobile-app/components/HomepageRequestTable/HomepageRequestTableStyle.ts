import { StyleSheet } from "react-native";
import { variables } from "../../styles/variables";
import { bootstrap } from "../../styles/bootstrapConvert";

export const styles = StyleSheet.create({
  table: { flex: 1 },
  head: { backgroundColor: variables.$primary100, flex: 1 },
  headText: { fontWeight: variables.$fontWeight600 },
  datas: { flex: 1 },
  text: {
    color: variables.$primary1000,
    textAlign: "center",
    fontSize: 12,
    ...bootstrap.table,
  },
  available: { color: variables.$green1000, textAlign: "center" },
  notAvailable: { color: variables.$red1000, textAlign: "center" },
});
