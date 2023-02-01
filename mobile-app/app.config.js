require("dotenv").config();

console.log("env", process.env.GRAPHQL_API_URL);

export default {
  extra: {
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
  },
};
