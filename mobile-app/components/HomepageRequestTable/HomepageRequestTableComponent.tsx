import { Ionicons } from "@expo/vector-icons";
import { Row, Rows, Table } from "react-native-table-component";
import { styles } from "./HomepageRequestTableStyle";

const HomepageRequestTable = ({
  statusCode,
  duration,
  getIsAvailable,
}: {
  statusCode: number;
  duration: number;
  getIsAvailable: boolean;
}) => {
  return (
    <Table
      style={styles.table}
      borderStyle={{ borderWidth: 2, borderColor: "#dee2e6" }}
    >
      <Row
        data={["AVAILABILITY", "STATUS CODE", "DURATION"]}
        style={styles.head}
        textStyle={[styles.text, styles.headText]}
      />
      <Rows
        data={[
          [
            getIsAvailable ? (
              <Ionicons
                style={styles.available}
                name="checkmark-circle-outline"
              />
            ) : (
              <Ionicons
                style={styles.notAvailable}
                name="close-circle-outline"
              />
            ),
            statusCode,
            duration + "ms",
          ],
        ]}
        style={styles.datas}
        textStyle={styles.text}
      />
    </Table>
  );
};

export default HomepageRequestTable;
