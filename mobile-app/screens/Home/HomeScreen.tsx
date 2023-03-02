import { ApolloError, gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Link } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import FormErrorMessage from "../../components/ErrorMessage/FormErrorMessageComponent";

import HomepageRequestTable from "../../components/HomepageRequestTable/HomepageRequestTableComponent";
import { CheckUrlMutation, CheckUrlMutationVariables } from "../../gql/graphql";
import {
  getErrorMessage,
  SERVER_IS_KO_ERROR_MESSAGE_LINE1,
  SERVER_IS_KO_ERROR_MESSAGE_LINE2,
} from "../../utils/error-messages";
import { styles } from "./HomeStyle";
import { bootstrap } from "../../styles/bootstrapConvert";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { animatedStyle } from "../../styles/components";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../components/Footer/FooterComponent";

const REQUEST_TIMEOUT = Constants?.expoConfig?.extra?.REQUEST_TIMEOUT;

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
          {parseInt(REQUEST_TIMEOUT!) / 1000} seconds)
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
          Toast.show({
            type: "error",
            text1: SERVER_IS_KO_ERROR_MESSAGE_LINE1,
            text2: SERVER_IS_KO_ERROR_MESSAGE_LINE2,
          });
      }
    },
  });
  const {
    register,
    control,
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
    <ScrollView>
      <View
        style={[
          bootstrap.dFlex,
          bootstrap.flexColumn,
          styles.searchBarContainer,
        ]}
      >
        <Text style={[bootstrap.my5, bootstrap.col10, styles.h1]}>
          Enter a website URL and check its availability
        </Text>
        <View style={[bootstrap.positionRelative, bootstrap.col12]}>
          <View style={bootstrap.dFlex}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  data-testid="url-input"
                  style={[{ backgroundColor: "white" }, styles.searchBar]}
                  onChangeText={(value) => onChange(value)}
                  value={value}
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
            />
            <Pressable
              data-testid="url-button"
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
              style={[
                bootstrap.dFlex,
                bootstrap.justifyContentCenter,
                bootstrap.alignItemsCenter,
                styles.searchButton,
              ]}
            >
              <Ionicons style={{}} name="search" />
            </Pressable>
          </View>
          <View style={[bootstrap.positionAbsolute]}>
            <FormErrorMessage errors={errors} name={"url"} />
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {loading ||
        data ||
        (error && ERROR_MESSAGE_ARRAY.includes(getErrorMessage(error))) ? (
          <View style={bootstrap.mb3}>
            <Text style={bootstrap.m0}>
              {loading ? (
                `We are testing ${url}`
              ) : data || error ? (
                `Result for ${url} :`
              ) : (
                <></>
              )}
            </Text>
            <View
              style={[
                bootstrap.dFlex,
                bootstrap.justifyContentCenter,
                bootstrap.alignItemsCenter,
                styles.requestContainer,
              ]}
            >
              {loading ? (
                <Animated.View style={[styles.loader, animatedStyle]} />
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

        <View style={[bootstrap.mt3, bootstrap.col12]}>
          <Text style={styles.h2}>How it works</Text>
          <Text style={styles.p}>
            HealthCheck allows you to test if a website is operational by
            sending a request and analyzing the response.
          </Text>
        </View>

        <View
          style={[
            bootstrap.dFlex,
            bootstrap.alignItemsCenter,
            bootstrap.flexWrap,
            bootstrap.mt3,
          ]}
        >
          <View style={bootstrap.col12}>
            <Text style={styles.h2}>A tool for managing websites</Text>
            <Text style={styles.p}>
              You can test as many sites as you want. With your account, set the
              testing frequency for each site and be notified automatically if
              any of the ones you monitor are unavailable.
            </Text>
          </View>

          <Link
            style={[
              bootstrap.m0,
              bootstrap.col12,
              bootstrap.dFlex,
              bootstrap.justifyContentCenter,
            ]}
            to="/sign-up"
          >
            <Pressable style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.btnTextPrimary}>
                Create your free account
              </Text>
            </Pressable>
          </Link>
        </View>

        <View
          style={[
            bootstrap.dFlex,
            bootstrap.alignItemsCenter,
            bootstrap.flexWrap,
            bootstrap.mt5,
            bootstrap.mb3,
          ]}
        >
          <View style={bootstrap.col12}>
            <Text style={styles.h2}>Go further with Premium</Text>
            <Text style={styles.p}>
              Customized alerts only for specific error codes, better management
              of testing frequency, grouped actions to save time and many other
              great features with Premium.
            </Text>
          </View>
          <Link
            style={[
              bootstrap.m0,
              bootstrap.col12,
              bootstrap.dFlex,
              bootstrap.justifyContentCenter,
            ]}
            to="/premium"
          >
            <Pressable style={[styles.btn, styles.btnSecondary]}>
              <Text style={styles.btnTextSecondary}>Discover Premium</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <Footer></Footer>
    </ScrollView>
  );
};

export default Home;
