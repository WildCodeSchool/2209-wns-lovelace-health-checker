import "./index.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPageOfRequestSettingWithLastResult: {
            keyArgs: ["pageNumber"],
            merge(existing = { requestSettingsWithLastResult: [] }, incoming) {
              return {
                ...incoming,
                requestSettingsWithLastResult: [
                  ...incoming.requestSettingsWithLastResult,
                ],
              };
            },
          },
        },
      },
    },
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
