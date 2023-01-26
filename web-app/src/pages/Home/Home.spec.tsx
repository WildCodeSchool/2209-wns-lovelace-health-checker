import "@testing-library/jest-dom";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as toastify from "react-toastify";

import { CheckUrlMutation } from "../../gql/graphql";
import Home, { URL } from "./Home";

jest.mock("react-toastify");

const renderHome = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </MockedProvider>
  );
};

const submitForm = (url: string) => {
  fireEvent.change(screen.getByTestId("url-input"), {
    target: { value: url },
  });
  fireEvent.click(screen.getByTestId("url-button"));
};

const CHECK_URL_SUCCESS_MOCK: MockedResponse<CheckUrlMutation> = {
  request: {
    query: URL,
    variables: {
      url: "https://www.youtube.com",
    },
  },
  result: {
    data: {
      checkUrl: {
        getIsAvailable: true,
        duration: 531,
        statusCode: 200,
      },
    },
  },
};

const CHECK_URL_SUCCESS_MOCK_ANOTHER: MockedResponse<CheckUrlMutation> = {
  request: {
    query: URL,
    variables: {
      url: "http://www.youtube.com",
    },
  },
  result: {
    data: {
      checkUrl: {
        getIsAvailable: true,
        duration: 532,
        statusCode: 200,
      },
    },
  },
};

const CHECK_URL_SUCCESS_MOCK_AGAIN: MockedResponse<CheckUrlMutation> = {
  request: {
    query: URL,
    variables: {
      url: "https://youtube.com",
    },
  },
  result: {
    data: {
      checkUrl: {
        getIsAvailable: true,
        duration: 533,
        statusCode: 200,
      },
    },
  },
};

const CHECK_URL_NO_RESPONSE_MOCK: MockedResponse<CheckUrlMutation> = {
  request: {
    query: URL,
    variables: {
      url: "https://www.wrongurlthatreturnserror.com",
    },
  },
  error: new Error("Fetch Failed"),
};

const CHECK_URL_TIMEOUT_MOCK: MockedResponse<CheckUrlMutation> = {
  request: {
    query: URL,
    variables: {
      url: "https://www.wrongurlthatreturnserror.com",
    },
  },
  error: new Error("Request Timeout"),
};

const CHECK_URL_UNKNOWN_ERROR_MOCK: MockedResponse<CheckUrlMutation> = {
  request: {
    query: URL,
    variables: {
      url: "https://youtube.com",
    },
  },
  error: new Error(),
};

describe("Home", () => {
  it("should renders", async () => {
    renderHome();
  });

  describe("form", () => {
    describe("before form submission", () => {
      it("renders required url error message when input is empty", async () => {
        renderHome();
        submitForm("");
        await waitFor(() => {
          expect(screen.getByText("URL is required")).toBeInTheDocument();
        });
      });

      it("renders invalid url error message when input doesn't start with 'http://' or 'https://'", async () => {
        renderHome();
        submitForm("www.youtube.com");
        await waitFor(() => {
          expect(screen.getByText("URL format is invalid")).toBeInTheDocument();
        });
      });

      it("renders invalid url error message when input ends with a dot", async () => {
        renderHome();
        submitForm("https://www.youtube.");
        await waitFor(() => {
          expect(screen.getByText("URL format is invalid")).toBeInTheDocument();
        });
      });
    });

    describe("after form submission", () => {
      it("renders a loader awaiting response", async () => {
        renderHome();
        const url = "https://www.youtube.com";
        submitForm(url);
        await waitFor(() => {
          expect(screen.getByText("We are testing " + url)).toBeInTheDocument();
        });
      });

      it("renders results with correct input", async () => {
        const url = "https://www.youtube.com";
        renderHome([CHECK_URL_SUCCESS_MOCK]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.getByText("Result for " + url + " :")
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("AVAILABILITY")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("STATUS CODE")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("DURATION")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("531ms")).toBeInTheDocument();
        });
      });

      it("renders results with another correct input", async () => {
        const url = "http://www.youtube.com";
        renderHome([CHECK_URL_SUCCESS_MOCK_ANOTHER]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.getByText("Result for " + url + " :")
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("AVAILABILITY")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("STATUS CODE")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("DURATION")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("532ms")).toBeInTheDocument();
        });
      });

      it("renders results with another correct input again", async () => {
        const url = "https://youtube.com";
        renderHome([CHECK_URL_SUCCESS_MOCK_AGAIN]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.getByText("Result for " + url + " :")
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("AVAILABILITY")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("STATUS CODE")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("DURATION")).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.getByText("533ms")).toBeInTheDocument();
        });
      });

      it("no longer renders a loader awaiting response after the response", async () => {
        const url = "https://youtube.com";
        renderHome([CHECK_URL_SUCCESS_MOCK_AGAIN]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.getByText("Result for " + url + " :")
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.queryByText("We are testing " + url)
          ).not.toBeInTheDocument();
        });
      });

      it("throws a timeout error message when the request took too much time", async () => {
        const url = "https://www.wrongurlthatreturnserror.com";
        // TODO : variabiliser
        const defaultRequestTimeoutDuration: number = 15000;
        renderHome([CHECK_URL_TIMEOUT_MOCK]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.getByText("Result for " + url + " :")
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.getByText(
              "Maximum duration for request exceeded (" +
                defaultRequestTimeoutDuration / 1000 +
                " seconds)"
            )
          ).toBeInTheDocument();
        });
      });

      it("throws a no response error message when the url doesn't give a response", async () => {
        const url = "https://www.wrongurlthatreturnserror.com";
        renderHome([CHECK_URL_NO_RESPONSE_MOCK]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.getByText("Result for " + url + " :")
          ).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(
            screen.getByText("No response from this URL, try another URL")
          ).toBeInTheDocument();
        });
      });

      it("renders a toaster when an unknown error is throw from the back and don't show result", async () => {
        const url = "https://youtube.com";
        renderHome([CHECK_URL_UNKNOWN_ERROR_MOCK]);
        submitForm(url);
        await waitFor(() => {
          expect(
            screen.queryByText("Result for " + url + " :")
          ).not.toBeInTheDocument();
        });
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledTimes(1);
        });
        expect(toastify.toast.error).toHaveBeenCalledWith(
          "Oops, it seems that something went wrong... Please try again",
          { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 1 }
        );
      });
    });
  });
});
