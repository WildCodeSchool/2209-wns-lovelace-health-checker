import '@testing-library/jest-dom';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { SignUpMutation } from '../../gql/graphql';
import SignUp, { SIGN_UP } from './SignUp';

const renderSignUp = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <SignUp />
    </MockedProvider>,
    { wrapper: BrowserRouter }
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

describe("SignUp", () => {
  it("should renders", async () => {
    renderSignUp();
  });

  it("render link to sign in", () => {});

  describe("form", () => {
    describe("password visibility", () => {
      it("should display password when click on eye icon", () => {});
      it("should not display password when click on slash eye icon", () => {});
    });
    it("render link to terms and conditions", () => {});
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
