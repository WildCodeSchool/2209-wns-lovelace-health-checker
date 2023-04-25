/* eslint-disable testing-library/no-unnecessary-act */
import "@testing-library/jest-dom";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Router } from "react-router-dom";
import * as toastify from "react-toastify";

import { SignInMutation } from "../../gql/graphql";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/info-and-error-messages";
import SignIn, { SIGN_IN } from "./SignIn";
import { HOMEPAGE_ROUTE } from "../../routes";

jest.mock("react-toastify");
const mockRefetch = jest.fn();

const renderSignIn = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter>
        <SignIn onSuccess={mockRefetch} />
      </MemoryRouter>
    </MockedProvider>
  );
};

const renderSignInWithHistory = (history: MemoryHistory, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <Router location={history.location} navigator={history}>
        <SignIn onSuccess={mockRefetch} />
      </Router>
    </MockedProvider>
  );
};

const submitForm = (email: string, password: string) => {
  fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
    target: { value: email },
  });
  fireEvent.change(screen.getByTestId("password"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
};

const SIGN_IN_SUCCESS: MockedResponse<SignInMutation> = {
  request: {
    query: SIGN_IN,
    variables: {
      email: "vianneyaccart@gmail.com",
      password: "password",
    },
  },
  result: {
    data: {
      signIn: {
        id: "1",
        firstname: "Vianney",
        role: "USER",
      },
    },
  },
};

const SIGN_IN_FAILURE: MockedResponse<SignInMutation> = {
  request: {
    query: SIGN_IN,
    variables: {
      email: "vianneyaccart@gmail.com",
      password: "wrong-password",
    },
  },
  error: new Error("Incorrect credentials"),
};

const SIGN_IN_PENDING: MockedResponse<SignInMutation> = {
  request: {
    query: SIGN_IN,
    variables: {
      email: "vianneyaccart@gmail.com",
      password: "password",
    },
  },
  error: new Error(
    "Your account is not active, click on the link in your email to activate it"
  ),
};

const SERVER_IS_KO: MockedResponse<SignInMutation> = {
  request: {
    query: SIGN_IN,
    variables: {
      email: "vianneyaccart@gmail.com",
      password: "password",
    },
  },
  error: new Error(),
};

describe("SignIn", () => {
  it("should renders", async () => {
    renderSignIn();
  });
  describe("after form submission", () => {
    it("renders a loader awaiting response", async () => {
      renderSignIn([SIGN_IN_SUCCESS]);
      submitForm("vianneyaccart@gmail.com", "password");
      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });
    });
    describe("when request responds with status 200", () => {
      it("redirects to homepage", async () => {
        const history = createMemoryHistory();
        renderSignInWithHistory(history, [SIGN_IN_SUCCESS]);

        submitForm("vianneyaccart@gmail.com", "password");

        await act(async () => {
          await waitFor(() => {
            expect(history.location.pathname).toBe(HOMEPAGE_ROUTE);
          });
        });
      });
      it("renders success toast", async () => {
        renderSignIn([SIGN_IN_SUCCESS]);
        submitForm("vianneyaccart@gmail.com", "password");
        await waitFor(() => {
          expect(toastify.toast.success).toBeCalledWith("Welcome Vianney !", {
            position: toastify.toast.POSITION.BOTTOM_RIGHT,
            toastId: 1,
          });
        });
      });
    });

    describe("when user status is pending", () => {
      it("renders an information toast", async () => {
        renderSignIn([SIGN_IN_PENDING]);
        submitForm("vianneyaccart@gmail.com", "password");
        await waitFor(() => {
          expect(toastify.toast.info).toHaveBeenCalledWith(
            "Please check your email to confirm your account",
            {
              position: toastify.toast.POSITION.BOTTOM_RIGHT,
              toastId: 4,
            }
          );
        });
      });
      it("displays a message to resend a confirmation link", async () => {
        renderSignIn([SIGN_IN_PENDING]);
        submitForm("vianneyaccart@gmail.com", "password");
        await waitFor(() => {
          expect(
            screen.getByTestId("resendConfirmationEmail")
          ).toBeInTheDocument();
        });
        expect(screen.getByTestId("errorMessage")).toBeInTheDocument();
      });
    });

    describe('when request responds with "Incorrect credentials"', () => {
      it("renders an error toast", async () => {
        renderSignIn([SIGN_IN_FAILURE]);
        submitForm("vianneyaccart@gmail.com", "wrong-password");
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledWith(
            "Incorrect credentials",
            {
              position: toastify.toast.POSITION.BOTTOM_RIGHT,
              toastId: 3,
            }
          );
        });
      });
    });

    describe("server is KO", () => {
      it("renders an error toast", async () => {
        renderSignIn([SERVER_IS_KO]);

        submitForm("vianneyaccart@gmail.com", "password");
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledWith(
            SERVER_IS_KO_ERROR_MESSAGE,
            {
              position: toastify.toast.POSITION.BOTTOM_RIGHT,
              toastId: 5,
            }
          );
        });
      });
    });
  });
});
