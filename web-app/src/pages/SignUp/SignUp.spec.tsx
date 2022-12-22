import '@testing-library/jest-dom';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import * as toastify from 'react-toastify';

import { SignUpMutation } from '../../gql/graphql';
import SignUp, { SIGN_UP } from './SignUp';

jest.mock("react-toastify");

const renderSignUp = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    </MockedProvider>
  );
};

const renderSignUpWithHistory = (history: MemoryHistory, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <Router location={history.location} navigator={history}>
        <SignUp />
      </Router>
    </MockedProvider>
  );
};

const submitForm = (
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  passwordConfirmation: string
) => {
  fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
    target: { value: email },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Firstname" }), {
    target: { value: firstname },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Lastname" }), {
    target: { value: lastname },
  });
  fireEvent.change(screen.getByTestId("password"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByTestId("passwordConfirmation"), {
    target: { value: passwordConfirmation },
  });
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "I agree to the terms and conditions",
    })
  );
  fireEvent.click(screen.getByRole("button", { name: "Create your account" }));
};

const SIGN_UP_SUCCESS_MOCK: MockedResponse<SignUpMutation> = {
  request: {
    query: SIGN_UP,
    variables: {
      firstname: "Vianney",
      lastname: "Accart",
      email: "vianneyaccart@gmail.com",
      password: "Vianney69",
      passwordConfirmation: "Vianney69",
    },
  },
  result: {
    data: {
      signUp: {
        firstname: "Vianney",
        lastname: "Accart",
        email: "vianneyaccart@gmail.com",
      },
    },
  },
};

const SIGN_UP_EMAIL_ALREADY_USED_MOCK: MockedResponse<SignUpMutation> = {
  request: {
    query: SIGN_UP,
    variables: {
      firstname: "Vianney",
      lastname: "Accart",
      email: "vianneyaccart@gmail.com",
      password: "Vianney69",
      passwordConfirmation: "Vianney69",
    },
  },
  error: new Error("This email is already used"),
};

describe("SignUp", () => {
  it("should renders", async () => {
    renderSignUp();
  });

  it("render link to sign in", () => {
    renderSignUp();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });
  it("navigate to /sign-in when click sign in link", async () => {
    const history = createMemoryHistory();
    renderSignUpWithHistory(history);
    fireEvent.click(screen.getByRole("link", { name: "Sign in" }));
    await waitFor(() => {
      expect(history.location.pathname).toBe("/sign-in");
    });
  });

  describe("form", () => {
    describe("password visibility toggle", () => {
      it("should switch between type password (masked) and type text (readable)", () => {
        renderSignUp();
        const passwordInput = screen.getByTestId("password");
        const eyeIcon = screen.getByTestId("passwordEye");
        expect(passwordInput).toHaveAttribute("type", "password");
        fireEvent.click(eyeIcon);
        expect(passwordInput).toHaveAttribute("type", "text");
        fireEvent.click(eyeIcon);
        expect(passwordInput).toHaveAttribute("type", "password");
      });
    });
    it("render link to terms and conditions", () => {
      renderSignUp();
      expect(
        screen.getByRole("link", { name: "terms and conditions" })
      ).toBeInTheDocument();
    });
    it("navigate to /terms when click terms link", async () => {
      const history = createMemoryHistory();
      renderSignUpWithHistory(history);
      fireEvent.click(
        screen.getByRole("link", { name: "terms and conditions" })
      );
      await waitFor(() => {
        expect(history.location.pathname).toBe("/terms");
      });
    });
    describe("after form submission", () => {
      it("render required errors messages when inputs are empty and terms checkbox is unchecked", async () => {
        renderSignUp();
        fireEvent.click(
          screen.getByRole("button", { name: "Create your account" })
        );
        await waitFor(() => {
          expect(screen.getByText("Email is required")).toBeInTheDocument();
        });
      });

      it("render error toast if email is already used", async () => {
        renderSignUp([SIGN_UP_EMAIL_ALREADY_USED_MOCK]);
        submitForm(
          "vianneyaccart@gmail.com",
          "Vianney",
          "Accart",
          "Vianney69",
          "Vianney69"
        );
        await waitFor(() => {
          expect(toastify.toast.error).toHaveBeenCalledTimes(1);
        });
        expect(toastify.toast.error).toHaveBeenCalledWith(
          "This email is already used",
          { position: "bottom-right", toastId: 2 }
        );
      });

      it("renders a loader awaiting response", async () => {
        renderSignUp([SIGN_UP_SUCCESS_MOCK]);
        submitForm(
          "vianneyaccart@gmail.com",
          "Vianney",
          "Accart",
          "Vianney69",
          "Vianney69"
        );
        await waitFor(() => {
          expect(screen.getByRole("status")).toBeInTheDocument();
        });
      });
      describe("when account is created successfully", () => {
        it("no longer renders loader, form and sign in message", async () => {
          renderSignUp([SIGN_UP_SUCCESS_MOCK]);
          submitForm(
            "vianneyaccart@gmail.com",
            "Vianney",
            "Accart",
            "Vianney69",
            "Vianney69"
          );
          await waitFor(() => {
            expect(
              screen.queryByTestId("formContainer")
            ).not.toBeInTheDocument();
          });
          await waitFor(() => {
            expect(
              screen.queryByTestId("alreadyRegistered")
            ).not.toBeInTheDocument();
          });
        });
        it("renders success icon and message", async () => {
          renderSignUp([SIGN_UP_SUCCESS_MOCK]);
          submitForm(
            "vianneyaccart@gmail.com",
            "Vianney",
            "Accart",
            "Vianney69",
            "Vianney69"
          );
          await waitFor(() => {
            expect(screen.getByTestId("successIcon")).toBeInTheDocument();
          });
          await waitFor(() => {
            expect(
              screen.getByText(/Your account has been created successfully/i)
            ).toBeInTheDocument();
          });
        });
      });
    });
  });
});
