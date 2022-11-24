import styles from './Home.module.scss';

const Home = () => {
  return (
    <>
      <div className={styles.searchBarContainer}>
        <h1 className="col-5">
          Enter a website URL and check its availability
        </h1>
        <div className="col-6">
          <form>
            <input type="text" />
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
