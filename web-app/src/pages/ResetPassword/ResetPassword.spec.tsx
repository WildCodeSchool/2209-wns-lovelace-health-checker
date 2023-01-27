import "@testing-library/jest-dom";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { MemoryRouter, Route, Router, Routes } from "react-router-dom";
import * as toastify from "react-toastify";

import { ResetPasswordMutation } from "../../gql/graphql";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/error-messages";
import ResetPassword, { RESET_PASSWORD } from "./ResetPassword";

jest.mock("react-toastify");

const renderResetPassword = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    </MockedProvider>
  );
};

const renderResetPasswordWithToken = (token: string, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route
            path="/reset-password/:resetPasswordToken"
            element={<ResetPassword />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );
};

const renderResetPasswordWithHistory = (history: MemoryHistory, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <Router location={history.location} navigator={history}>
        <ResetPassword />
      </Router>
    </MockedProvider>
  );
};

const VALID_TOKEN = "valid-token";
const INVALID_TOKEN = "invalid-token";

const submitForm = (password: string, passwordConfirmation: string) => {
  fireEvent.change(screen.getByTestId("password"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByTestId("passwordConfirmation"), {
    target: { value: passwordConfirmation },
  });
};

const RESET_PASSWORD_SUCCESS: MockedResponse<ResetPasswordMutation> = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      token: VALID_TOKEN,
      password: "password",
      passwordConfirmation: "password",
    },
  },
  result: {
    data: {
      resetPassword: "Your password has been updated successfully",
    },
  },
};

const SERVER_IS_KO: MockedResponse<ResetPasswordMutation> = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      token: VALID_TOKEN,
      password: "password",
      passwordConfirmation: "password",
    },
  },
  error: new Error(),
};

describe("ResetPassword", () => {
  it("should renders", async () => {
    renderResetPasswordWithToken(VALID_TOKEN);
  });
  describe("after form submission", () => {
    it("renders a loader awaiting response", async () => {
      renderResetPasswordWithToken(VALID_TOKEN, [RESET_PASSWORD_SUCCESS]);
      submitForm("password", "password");
      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });
    });
    describe("when request responds with status 200", () => {
      it("renders a success toast with informative message", async () => {
        renderResetPasswordWithToken(VALID_TOKEN, [RESET_PASSWORD_SUCCESS]);
        submitForm("password", "password");
        await waitFor(() => {
          expect(toastify.toast.success).toHaveBeenCalledWith(
            "Your password has been updated successfully",
            { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 1 }
          );
        });
      });
      it("redirects to sign in", async () => {
        const history = createMemoryHistory();
        renderResetPasswordWithHistory(history, [RESET_PASSWORD_SUCCESS]);
        submitForm("password", "password");
        await waitFor(() => {
          expect(history.location.pathname).toBe("/sign-in");
        });
      });
    });
    describe("server is KO", () => {
      it("renders an error toast", async () => {
        renderResetPasswordWithToken(VALID_TOKEN, [SERVER_IS_KO]);
        submitForm("password", "password");
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledWith(
            SERVER_IS_KO_ERROR_MESSAGE,
            { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 5 }
          );
        });
      });
    });
  });
});
