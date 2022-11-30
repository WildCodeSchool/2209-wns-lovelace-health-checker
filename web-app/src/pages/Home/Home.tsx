import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

import HomepageRequestTable from '../../components/HomepageRequestTable/HomepageRequestTable';
import SearchContainer from '../../components/SearchContainer/SearchContainer';
import styles from './Home.module.scss';

const TEST_URL = gql`
  query TestURL {
    availability
    statusCode
    duration
  }
`;

const Home = () => {
  const [url, setUrl] = useState("DUMMY_URL");
  const { data, loading, error } = useQuery<any>(TEST_URL);

  return (
    <>
      <SearchContainer />
      <div className={styles.container}>
        {/* Result container */}
        {loading || data || error ? (
          <div className="mb-5">
            <p className="m-0">
              {loading
                ? "We are testing " + url
                : data || error
                ? "Result for " + url
                : ""}
            </p>
            <div
              className={`d-flex justify-content-center align-items-center ${styles.requestContainer}`}
            >
              {false ? (
                <div className={styles.loader}></div>
              ) : (
                <HomepageRequestTable
                  availability={true}
                  statusCode={200}
                  duration={700}
                />
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="col-12 col-md-6 mt-3">
          <h2 className={styles.title}>How it works</h2>
          <p className={styles.text}>
            HealthCheck allows you to test if a website is operational by
            sending a request and analyzing the response.
          </p>
        </div>

        <div className="d-flex align-items-center flex-wrap mt-5">
          <div className="col-12 col-md-6">
            <h2 className={styles.title}>A tool for managing websites</h2>
            <p className={styles.text}>
              You can test as many sites as you want. With your account, set the
              testing frequency for each site and be notified automatically if
              any of the ones you monitor are unavailable.
            </p>
          </div>
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <button className={`${styles.button} ${styles.primaryButton}`}>
              Create your free account
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap mt-5 mb-3">
          <div className="col-12 col-md-6">
            <h2 className={styles.title}>Go further with Premium</h2>
            <p className={styles.text}>
              Customized alerts only for specific error codes, better management
              of testing frequency, grouped actions to save time and many other
              great features with Premium.
            </p>
          </div>
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <button className={`${styles.button} ${styles.secondaryButton}`}>
              Discover Premium
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
