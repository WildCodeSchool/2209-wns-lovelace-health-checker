import styles from './SearchContainer.module.scss';

const SearchContainer = () => {
  return (
    <div className={`d-flex flex-column ${styles.searchBarContainer}`}>
      <h1 className="col-sm-5 col-9 my-5">
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
  );
};

export default SearchContainer;
