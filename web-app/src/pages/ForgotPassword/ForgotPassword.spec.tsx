import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AskForNewPasswordMutation } from "../../gql/graphql";
import ForgotPassword, { ASK_FOR_NEW_PASSWORD } from "./ForgotPassword";
import * as toastify from "react-toastify";
import { SERVER_IS_KO_ERROR_MESSAGE } from "../../utils/error-messages";

jest.mock("react-toastify");

const renderForgotPassword = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    </MockedProvider>
  );
};

const submitForm = (email: string) => {
  fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
};

const ASK_FOR_NEW_PASSWORD_SUCCESS: MockedResponse<AskForNewPasswordMutation> =
  {
    request: {
      query: ASK_FOR_NEW_PASSWORD,
      variables: {
        email: "vianneyaccart@gmail.com",
      },
    },
    result: {
      data: {
        askForNewPassword:
          "If this email address exists, you'll receive an email to regenerate your password. Check your inbox.",
      },
    },
  };

const SERVER_IS_KO: MockedResponse<AskForNewPasswordMutation> = {
  request: {
    query: ASK_FOR_NEW_PASSWORD,
    variables: {
      email: "vianneyaccart@gmail.com",
    },
  },
  error: new Error(),
};

describe("ForgotPassword", () => {
  it("should renders", async () => {
    renderForgotPassword();
  });
  describe("after form submission", () => {
    it("render 'Email is required' if email input is empty", async () => {
      renderForgotPassword();
      fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });
    it("renders a loader awaiting response", async () => {
      renderForgotPassword([ASK_FOR_NEW_PASSWORD_SUCCESS]);
      submitForm("vianneyaccart@gmail.com");
      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });
    });
    describe("when request responds with status 200", () => {
      it("resets email input", async () => {
        renderForgotPassword([ASK_FOR_NEW_PASSWORD_SUCCESS]);
        submitForm("vianneyaccart@gmail.com");
        await waitFor(() => {
          expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
            ""
          );
        });
      });
      it("renders a success toast with informative message", async () => {
        renderForgotPassword([ASK_FOR_NEW_PASSWORD_SUCCESS]);
        submitForm("vianneyaccart@gmail.com");
        await waitFor(() => {
          expect(toastify.toast.success).toHaveBeenCalledWith(
            "If this email address exists, you'll receive an email to regenerate your password. Check your inbox.",
            { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 1 }
          );
        });
      });
    });
    describe("server is KO", () => {
      it("renders an error toast", async () => {
        renderForgotPassword([SERVER_IS_KO]);
        submitForm("vianneyaccart@gmail.com");
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledWith(
            SERVER_IS_KO_ERROR_MESSAGE,
            { position: toastify.toast.POSITION.BOTTOM_RIGHT, toastId: 2 }
          );
        });
      });
    });
  });
});
