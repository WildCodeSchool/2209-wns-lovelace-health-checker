import styles from './Home.module.scss';

const Home = () => {
  return (
    <>
      <div
        className={`d-flex flex-wrap justify-content-between align-items-center ${styles.searchBarContainer}`}
      >
        <h1 className="col-sm-5 col-9">
          Enter a website URL and check its availability
        </h1>
        <div className="col-sm-6 col-12">
          <form className="d-flex">
            <input className={styles.searchBar} type="text" />
            <div
              className={`d-flex justify-content-center align-items-center ${styles.searchButton}`}
            >
              <i className="bi bi-search"></i>
            </div>
          </form>
        </div>
      </div>
      <div className="container">
        <h1 className={styles.title}>How it works</h1>
        <p className={styles.text}>
          HealthCheck allows you to test if a website is operational by sending
          a request and analyzing the response.
        </p>
      </div>
    </>
  );
};

export default Home;
