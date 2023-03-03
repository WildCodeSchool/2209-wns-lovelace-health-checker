import { GetPageOfRequestSettingWithLastResultQuery } from "../../gql/graphql";
import styles from "./RequestsTable.module.scss";

interface RequestsTableProps {
  requests: GetPageOfRequestSettingWithLastResultQuery | undefined;
  loading: boolean;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
}

const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear().toString();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const formatFrequency = (frequency: number): string => {
  if (frequency >= 2592000) {
    const numMonths = Math.round(frequency / 2592000);
    return `${numMonths} ${numMonths > 1 ? "months" : "month"}`;
  } else if (frequency >= 86400) {
    const numDays = Math.round(frequency / 86400);
    return `${numDays} ${numDays > 1 ? "days" : "day"}`;
  } else if (frequency >= 3600) {
    const numHours = Math.round(frequency / 3600);
    return `${numHours} ${numHours > 1 ? "hrs" : "hr"}`;
  } else if (frequency >= 60) {
    const numMinutes = Math.round(frequency / 60);
    return `${numMinutes} ${numMinutes > 1 ? "mins" : "min"}`;
  } else {
    return `${frequency} ${frequency > 1 ? "secs" : "sec"}`;
  }
};

const RequestsTable = (
  pageOfRequestSettingWithLastResult: RequestsTableProps
) => {
  if (pageOfRequestSettingWithLastResult.loading) {
    return <div className={`${styles.loader}`}></div>;
  }

  return (
    <>
      <table className={`${styles.table}`}>
        <thead>
          <tr className={`${styles.tableHeader}`}>
            <th className={`col-5 ${styles.paddingLeft}`}>NAME</th>
            <th className="col-3">LAST</th>
            <th className="col-1 text-center">AV.</th>
            <th className="col-1 text-center">STAT.</th>
            <th className="col-1 text-center">FREQ.</th>
            <th className="col-1"></th>
          </tr>
        </thead>
        <tbody>
          {pageOfRequestSettingWithLastResult?.requests?.getPageOfRequestSettingWithLastResult.requestSettingsWithLastResult.map(
            (request) => (
              <tr key={request.requestSetting.id} className={styles.tableRows}>
                <td className={`col-5 ${styles.paddingLeft}`}>
                  {request.requestSetting.name
                    ? request.requestSetting.name
                    : request.requestSetting.url}
                </td>
                <td className="col-3">
                  {request.requestResult?.createdAt
                    ? formatDateString(request.requestResult?.createdAt)
                    : "-"}
                </td>
                <td className="col-1 text-center">
                  {request.requestResult?.getIsAvailable === true ? (
                    <i className={`bi bi-check-circle ${styles.available}`}></i>
                  ) : request.requestResult?.getIsAvailable === false ? (
                    <i className={`bi bi-x-circle ${styles.notAvailable}`}></i>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="col-1 text-center">
                  {request.requestResult?.statusCode
                    ? request.requestResult?.statusCode
                    : "-"}
                </td>
                <td className="col-1 text-center">
                  {formatFrequency(request.requestSetting.frequency)}
                </td>
                <td className="col-1 text-center">
                  <i className="bi bi-gear"></i>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default RequestsTable;
