import styles from "./HomepageRequestTable.module.scss";

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
    <table className={`${styles.table} table table-bordered`}>
      <thead>
        <tr className={styles.tr}>
          <th scope="col" className={`${styles.th}`}>
            AVAILABILITY
          </th>
          <th scope="col" className={`${styles.th}`}>
            STATUS CODE
          </th>
          <th scope="col" className={`${styles.th}`}>
            DURATION
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className={`${styles.tr}`}>
          <td className={`${styles.td}`}>
            {getIsAvailable ? (
              <i className={`bi bi-check-circle ${styles.available}`}></i>
            ) : (
              <i className={`bi bi-x-circle ${styles.notAvailable}`}></i>
            )}
          </td>
          <td className={`${styles.td}`}>{statusCode}</td>
          <td className={`${styles.td}`}>{duration}ms</td>
        </tr>
      </tbody>
    </table>
  );
};

export default HomepageRequestTable;
