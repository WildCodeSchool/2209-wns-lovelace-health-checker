import "@testing-library/jest-dom";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as toastify from "react-toastify";
import * as router from "react-router";

import { ResetPasswordMutation } from "../../gql/graphql";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/error-messages";
import ResetPassword, { RESET_PASSWORD } from "./ResetPassword";
import {
  RESET_PASSWORD_ROUTE,
  RESET_PASSWORD_WITH_TOKEN_ROUTE,
  SIGN_IN_ROUTE,
} from "../../routes";

jest.mock("react-toastify");
const navigate = jest.fn();

const renderResetPassword = (token: string, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter initialEntries={[`${RESET_PASSWORD_ROUTE}/${token}`]}>
        <Routes>
          <Route
            path={RESET_PASSWORD_WITH_TOKEN_ROUTE}
            element={<ResetPassword />}
          />
        </Routes>
      </MemoryRouter>
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
  fireEvent.click(screen.getByRole("button", { name: "Reset your password" }));
};

const RESET_PASSWORD_SUCCESS: MockedResponse<ResetPasswordMutation> = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      token: VALID_TOKEN,
      password: "Vianney13",
      passwordConfirmation: "Vianney13",
    },
  },
  result: {
    data: {
      resetPassword: "Your password has been updated successfully",
    },
  },
};

const RESET_PASSWORD_ERROR: MockedResponse<ResetPasswordMutation> = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      token: INVALID_TOKEN,
      password: "Vianney13",
      passwordConfirmation: "Vianney13",
    },
  },
  error: new Error("Your reset password token is no longer valid"),
};

const SERVER_IS_KO: MockedResponse<ResetPasswordMutation> = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      token: VALID_TOKEN,
      password: "Vianney13",
      passwordConfirmation: "Vianney13",
    },
  },
  error: new Error(),
};

describe("ResetPassword", () => {
  it("should renders", async () => {
    renderResetPassword(VALID_TOKEN);
  });
  describe("after form submission", () => {
    it("renders a loader awaiting response", async () => {
      renderResetPassword(VALID_TOKEN, [RESET_PASSWORD_SUCCESS]);
      submitForm("Vianney13", "Vianney13");
      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });
    });
    describe("when request responds with status 200", () => {
      it("renders a success toast with informative message", async () => {
        renderResetPassword(VALID_TOKEN, [RESET_PASSWORD_SUCCESS]);
        submitForm("Vianney13", "Vianney13");
        await waitFor(() => {
          expect(toastify.toast.success).toHaveBeenCalledWith(
            "Your password has been updated successfully",
            { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 1 }
          );
        });
      });
      it('should call navigate with "/sign-in"', async () => {
        jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
        renderResetPassword(VALID_TOKEN, [RESET_PASSWORD_SUCCESS]);
        submitForm("Vianney13", "Vianney13");
        await waitFor(() => {
          expect(navigate).toHaveBeenCalledWith(SIGN_IN_ROUTE);
        });
      });
    });
    describe("when token is no longer valid", () => {
      it("renders an error toast with 'Your reset password token is no longer valid'", async () => {
        renderResetPassword(INVALID_TOKEN, [RESET_PASSWORD_ERROR]);
        submitForm("Vianney13", "Vianney13");
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledWith(
            "Your reset password token is no longer valid",
            { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 4 }
          );
        });
      });
    });
    describe("server is KO", () => {
      it("renders an error toast", async () => {
        renderResetPassword(VALID_TOKEN, [SERVER_IS_KO]);
        submitForm("Vianney13", "Vianney13");
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
