import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import HomepageRequestTable from "../../components/HomepageRequestTable/HomepageRequestTable";
import { CheckUrlMutation, CheckUrlMutationVariables } from "../../gql/graphql";
import styles from "./Home.module.scss";

const URL = gql`
  mutation CheckUrl($url: String!) {
    checkUrl(url: $url) {
      getIsAvailable
      duration
      statusCode
    }
  }
`;

type SearchInput = {
  url: string;
};
const expression =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const urlRegExp = new RegExp(expression);

const Home = () => {
  const [url, setUrl] = useState("");
  const [search, { data, loading }] = useMutation<
    CheckUrlMutation,
    CheckUrlMutationVariables
  >(URL);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchInput>({ criteriaMode: "all" });

  const onSubmit: SubmitHandler<any> = async (urlToTest) => {
    setUrl(urlToTest.url);
    try {
      await search({
        variables: { url: urlToTest.url },
      });
    } catch (error) {
      toast.error(
        "Oops, it seems that something went wrong... Please try again",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          toastId: 1,
        }
      );
    }
  };

  return (
    <div>
      <div className={`d-flex flex-column ${styles.searchBarContainer}`}>
        <h1 className="col-sm-5 col-10 my-5">
          Enter a website URL and check its availability
        </h1>
        <div className="col-sm-6 col-12">
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex">
            <input
              className={`is-invalid ${styles.searchBar}`}
              type="text"
              defaultValue={""}
              placeholder="https://example.com"
              {...register("url", {
                required: "URL is required",
                pattern: { value: urlRegExp, message: "URL format is invalid" },
              })}
            />
            <button
              type="submit"
              className={`d-flex justify-content-center align-items-center ${styles.searchButton}`}
            >
              <i className="bi bi-search"></i>
            </button>
          </form>
          <div className={styles.errorMessage}>
            <FormErrorMessage errors={errors} name={"url"} />
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {loading || data ? (
          <div className="mb-5">
            <p className="m-0">
              {loading ? (
                "We are testing " + url
              ) : data ? (
                "Result for " + url
              ) : (
                <></>
              )}
            </p>
            <div
              className={`d-flex justify-content-center align-items-center ${styles.requestContainer}`}
            >
              {loading ? (
                <div className={styles.loader}></div>
              ) : data ? (
                <HomepageRequestTable
                  getIsAvailable={data.checkUrl.getIsAvailable}
                  statusCode={data.checkUrl.statusCode}
                  duration={data.checkUrl.duration}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="col-12 col-md-6 mt-3">
          <h2>How it works</h2>
          <p>
            HealthCheck allows you to test if a website is operational by
            sending a request and analyzing the response.
          </p>
        </div>

        <div className="d-flex align-items-center flex-wrap mt-5">
          <div className="col-12 col-md-6">
            <h2>A tool for managing websites</h2>
            <p>
              You can test as many sites as you want. With your account, set the
              testing frequency for each site and be notified automatically if
              any of the ones you monitor are unavailable.
            </p>
          </div>

          <Link
            className="m-0 col-12 col-md-6 d-flex justify-content-center"
            to="/sign-up"
          >
            <button className={`${styles.button} ${styles.primaryButton}`}>
              Create your free account
            </button>
          </Link>
        </div>

        <div className="d-flex align-items-center flex-wrap mt-5 mb-3">
          <div className="col-12 col-md-6">
            <h2>Go further with Premium</h2>
            <p>
              Customized alerts only for specific error codes, better management
              of testing frequency, grouped actions to save time and many other
              great features with Premium.
            </p>
          </div>
          <Link
            className="m-0 col-12 col-md-6 d-flex justify-content-center"
            to="/premium"
          >
            <button className={`${styles.button} ${styles.secondaryButton}`}>
              Discover Premium
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
