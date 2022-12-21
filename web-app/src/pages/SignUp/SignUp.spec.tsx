import '@testing-library/jest-dom';

import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { SignUpMutation } from '../../gql/graphql';
import SignUp, { SIGN_UP } from './SignUp';

const renderSignUp = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    </MockedProvider>
  );
};

const SIGN_UP_SUCCESS_MOCK: MockedResponse<SignUpMutation> = {
  request: { query: SIGN_UP },
  result: {
    data: {
      signUp: {
        firstname: "Vianney",
        lastname: "Accart",
        email: "vianneyaccart2222@gmail.com",
      },
    },
  },
};

describe("SignUp", () => {
  it("should renders", async () => {
    renderSignUp();
  });
  describe("sign up form", () => {
    describe("after form submission", () => {
      /* This test should be used everywhere */
      describe("if server is unavailable", () => {
        it("renders a toast with error message", () => {
          renderSignUp();
          // Create dummy server ?
        });
      });
      describe("if server is available", () => {
        it("renders a loader awaiting server response", () => {
          renderSignUp();
        });
        describe("when account is created successfully", () => {
          it("renders a success icon", () => {
            renderSignUp();
          });
          it("renders a success message", () => {
            renderSignUp([SIGN_UP_SUCCESS_MOCK]);
            expect(
              screen.getByText(/Your account has been created successfully/i)
            ).toBeInTheDocument();
          });
        });
      });
    });
  });
});
