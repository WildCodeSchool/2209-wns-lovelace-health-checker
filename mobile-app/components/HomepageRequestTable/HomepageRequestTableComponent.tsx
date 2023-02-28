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
    <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
      <Row
        data={["AVAILABILITY", "STATUS CODE", "DURATION"]}
        style={styles.head}
        textStyle={styles.text}
      />
      <Rows
        data={[[getIsAvailable ? "OK" : "KO", statusCode, duration + "ms"]]}
        textStyle={styles.text}
      />
    </Table>
  );
};

export default HomepageRequestTable;
