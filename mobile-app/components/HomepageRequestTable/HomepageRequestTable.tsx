import { Row, Rows, Table } from "react-native-table-component";

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
    <Table style={{}}>
      <Row data={["AVAILABILITY", "STATUS CODE", "DURATION"]} />
      <Rows
        data={[[getIsAvailable ? "OK" : "KO", statusCode, duration + "ms"]]}
      />
    </Table>
  );
};

export default HomepageRequestTable;
