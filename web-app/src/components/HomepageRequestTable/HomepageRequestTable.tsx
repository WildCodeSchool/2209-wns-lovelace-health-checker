import styles from './HomepageRequestTable.module.scss';

const HomepageRequestTable = ({
  statusCode,
  duration,
}: {
  statusCode: number;
  duration: number;
}) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr className={styles.tr}>
          <th scope="col">AVAILABILITY</th>
          <th scope="col">STATUS CODE</th>
          <th scope="col">DURATION</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {/* {isAvailable ? (
              <i className={`bi bi-check-circle ${styles.available}`}></i>
            ) : (
              <i className={`bi bi-x-circle ${styles.notAvailable}`}></i>
            )} */}
            Availability
          </td>
          <td>{statusCode}</td>
          <td>{duration}ms</td>
        </tr>
      </tbody>
    </table>
  );
};

export default HomepageRequestTable;
