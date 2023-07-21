import { ApolloError, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";

import HomepageRequestTable from "../../components/HomepageRequestTable/HomepageRequestTable";
import { CheckUrlMutation, CheckUrlMutationVariables } from "../../gql/graphql";
import { ACCOUNT_ROUTE, PREMIUM_ROUTE, SIGN_UP_ROUTE } from "../../routes";
import {
  getErrorMessage,
  SERVER_IS_KO_ERROR_MESSAGE,
} from "../../utils/info-and-error-messages";
import {
  URL_IS_REQUIRED_ERROR_MESSAGE,
  URL_PATTERN_ERROR_MESSAGE,
  URL_PLACEHOLDER,
} from "../../utils/form-validations";
import { URL_REG_EXP } from "../../utils/regular-expressions";
import styles from "./Home.module.scss";

export const URL = gql`
  mutation CheckUrl($url: String!) {
    checkUrl(url: $url) {
      getIsAvailable
      duration
      statusCode
    }
  }
`;

const REQUEST_TIMEOUT_ERROR_MESSAGE = "Request Timeout";
const FETCH_FAILED_ERROR_MESSAGE = "Fetch Failed";
const INVALID_URL_ERROR_MESSAGE = "Invalid URL";
const ERROR_MESSAGE_ARRAY = [
  REQUEST_TIMEOUT_ERROR_MESSAGE,
  FETCH_FAILED_ERROR_MESSAGE,
  INVALID_URL_ERROR_MESSAGE,
];

type SearchInput = {
  url: string;
};

const renderErrorSwitch = (error: ApolloError | undefined) => {
  switch (getErrorMessage(error)) {
    case REQUEST_TIMEOUT_ERROR_MESSAGE:
      return (
        <div>
          Maximum duration for request exceeded (
          {parseInt(process.env.REACT_APP_REQUEST_TIMEOUT!) / 1000} seconds)
        </div>
      );
    case FETCH_FAILED_ERROR_MESSAGE:
      return <div>No response from this URL, try another URL</div>;
    case INVALID_URL_ERROR_MESSAGE:
      return <div>This URL's format is invalid</div>;
    // It should never reach the default case, put here just in case
    default:
      return <></>;
  }
};

const Home = (props: any) => {
  const isLogged: boolean = props.logged;
  const isPremium: boolean = props.isPremium;
  const [url, setUrl] = useState("");
  const [search, { data, loading, error }] = useMutation<
    CheckUrlMutation,
    CheckUrlMutationVariables
  >(URL, {
    onError: (error) => {
      switch (getErrorMessage(error)) {
        case REQUEST_TIMEOUT_ERROR_MESSAGE:
          break;
        case FETCH_FAILED_ERROR_MESSAGE:
          break;
        case INVALID_URL_ERROR_MESSAGE:
          break;
        default:
          toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastId: 1,
          });
      }
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchInput>({ criteriaMode: "all" });

  const onSubmit: SubmitHandler<any> = async (urlToTest) => {
    setUrl(urlToTest.url);
    await search({
      variables: { url: urlToTest.url },
    });
  };

  return (
    <div>
      <div className={`d-flex flex-column ${styles.searchBarContainer}`}>
        <h1 className="col-sm-5 col-10 my-5">
          Enter a website URL and check its availability !
        </h1>
        <div className="col-sm-6 col-12 position-relative">
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex">
            <input
              data-testid="url-input"
              className={`is-invalid ${styles.searchBar}`}
              type="text"
              defaultValue={""}
              placeholder={URL_PLACEHOLDER}
              {...register("url", {
                required: URL_IS_REQUIRED_ERROR_MESSAGE,
                pattern: {
                  value: URL_REG_EXP,
                  message: URL_PATTERN_ERROR_MESSAGE,
                },
              })}
            />
            <button
              data-testid="url-button"
              disabled={loading}
              type="submit"
              className={`d-flex justify-content-center align-items-center ${styles.searchButton}`}
            >
              <i className="bi bi-search"></i>
            </button>
          </form>
          <div className={`position-absolute ${styles.errorMessage}`}>
            <FormErrorMessage errors={errors} name={"url"} />
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {loading ||
        data ||
        (error && ERROR_MESSAGE_ARRAY.includes(getErrorMessage(error))) ? (
          <div className="mb-5">
            <p className="m-0">
              {loading ? (
                `We are testing ${url}`
              ) : data || error ? (
                `Result for ${url} :`
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
              ) : error ? (
                renderErrorSwitch(error)
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
              You can test your websites easily. Register to be able to set the
              testing frequency for each site and be notified automatically if
              any of the ones you monitor are unavailable.
            </p>
          </div>

          <Link
            className="m-0 col-12 col-md-6 d-flex justify-content-center"
            to={isLogged ? ACCOUNT_ROUTE : SIGN_UP_ROUTE}
          >
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              {isLogged ? "See your account" : "Create your free account"}
            </button>
          </Link>
        </div>

        <div className="d-flex align-items-center flex-wrap mt-5 mb-3">
          <div className="col-12 col-md-6">
            <h2>Go further with Premium</h2>
            <p>
              You'll unlock customized alerts for chosen error codes and have
              more testing frequency possibilities. With Premium, your
              experience will be easier, and you'll save time.
            </p>
          </div>
          <Link
            className="m-0 col-12 col-md-6 d-flex justify-content-center"
            to={isPremium ? ACCOUNT_ROUTE : PREMIUM_ROUTE}
          >
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              {isPremium ? "See your plan" : "Discover Premium"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
