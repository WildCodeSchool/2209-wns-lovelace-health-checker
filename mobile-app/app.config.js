require("dotenv").config();

export default {
  extra: {
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
  },
};
