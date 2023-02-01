import { ApolloError, gql, useMutation } from "@apollo/client";
import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessage";
import HomepageRequestTable from "../../components/HomepageRequestTable/HomepageRequestTable";
import { CheckUrlMutation, CheckUrlMutationVariables } from "../../gql/graphql";
import { getErrorMessage } from "../../utils/error-messages";

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

const URL_REG_EXP = new RegExp(
  /^(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
);

const renderErrorSwitch = (error: ApolloError | undefined) => {
  switch (getErrorMessage(error)) {
    case REQUEST_TIMEOUT_ERROR_MESSAGE:
      return (
        <View>
          Maximum duration for request exceeded (
          {parseInt(process.env.REACT_APP_REQUEST_TIMEOUT!) / 1000} seconds)
        </View>
      );
    case FETCH_FAILED_ERROR_MESSAGE:
      return <View>No response from this URL, try another URL</View>;
    case INVALID_URL_ERROR_MESSAGE:
      return <View>This URL's format is invalid</View>;
    // It should never reach the default case, put here just in case
    default:
      return <></>;
  }
};

const Home = () => {
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
          console.log(error);
        // toast.error(SERVER_IS_KO_ERROR_MESSAGE, {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        //   toastId: 1,
        // });
      }
    },
  });
  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchInput>({ criteriaMode: "all" });

  const onSubmit: SubmitHandler<any> = async (urlToTest) => {
    setUrl(urlToTest.url);
    console.log(urlToTest.url);
    await search({
      variables: { url: urlToTest.url },
    });
    console.log('search complete')
  };

  return (
    <View>
      <View style={{}}>
        <Text style={{ fontSize: 32 }}>
          Enter a website URL and check its availability
        </Text>
        <View style={{}}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                data-testid="url-input"
                style={{}}
                // onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                // defaultValue={""}
                placeholder="https://example.com"
                {...register("url", {
                  required: "URL is required",
                  pattern: {
                    value: URL_REG_EXP,
                    message: "URL format is invalid",
                  },
                })}
              />
            )}
            name="url"
            // rules={{ required: true }}
          />
          {/* <TextInput
            style={{}}
            defaultValue={""}
            placeholder="https://example.com"
            {...register("url", {
              required: "URL is required",
              pattern: {
                value: URL_REG_EXP,
                message: "URL format is invalid",
              },
            })}
          /> */}
          <Button
            data-testid="url-button"
            disabled={loading}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
          <View style={{}}>
            <FormErrorMessage errors={errors} name={"url"} />
          </View>
        </View>
      </View>

      <View style={{}}>
        {loading ||
        data ||
        (error && ERROR_MESSAGE_ARRAY.includes(getErrorMessage(error))) ? (
          <View style={{}}>
            <Text style={styles.bsPMarginBottom}>
              {loading ? (
                `We are testing ${url}`
              ) : data || error ? (
                `Result for ${url} :`
              ) : (
                <></>
              )}
            </Text>
            <View style={{}}>
              {loading ? (
                <View style={{}}></View>
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
            </View>
          </View>
        ) : (
          <></>
        )}

        <View style={{}}>
          <Text style={styles.H2}>How it works</Text>
          <Text style={styles.bsPMarginBottom}>
            HealthCheck allows you to test if a website is operational by
            sending a request and analyzing the response.
          </Text>
        </View>

        <View style={{}}>
          <View style={{}}>
            <Text style={styles.H2}>A tool for managing websites</Text>
            <Text style={styles.bsPMarginBottom}>
              You can test as many sites as you want. With your account, set the
              testing frequency for each site and be notified automatically if
              any of the ones you monitor are unavailable.
            </Text>
          </View>

          <Link style={{}} to="/sign-up">
            <Button title="Create your free account" />
          </Link>
        </View>

        <View style={{}}>
          <View style={{}}>
            <Text style={styles.H2}>Go further with Premium</Text>
            <Text style={styles.bsPMarginBottom}>
              Customized alerts only for specific error codes, better management
              of testing frequency, grouped actions to save time and many other
              great features with Premium.
            </Text>
          </View>
          <Link style={{}} to="/premium">
            <Button title="Discover Premium" />
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  H2: {
    fontSize: 24,
  },
  bsPMarginBottom: {
    marginBottom: 16,
  },
  bold: {
    fontWeight: "600", // variabiliser
  },
  contentContainer: {
    padding: 24, // variabiliser
  },
  btn: {
    height: 60,
    borderRadius: 5,
    marginTop: 16,
    alignItems: "center", // align horizontally
    justifyContent: "center", // align vertically
  }, // variabiliser
  btnPrimary: {
    backgroundColor: "#195078", // variabiliser
    border: "none", // variabiliser
  },
  btnText: {
    color: "white", // variabiliser
    fontSize: 16, // trouver où le mettre dans l'app
  },
});

export default Home;
