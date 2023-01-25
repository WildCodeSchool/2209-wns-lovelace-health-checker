import '@testing-library/jest-dom';

import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import AccountConfirmation, { CONFIRM_ACCOUNT } from './AccountConfirmation';

const renderAccountConfirmation = (token: string, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter initialEntries={[`/account-confirmation/${token}`]}>
        <Routes>
          <Route
            path="/account-confirmation/:confirmationToken"
            element={<AccountConfirmation />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("Account Confirmation", () => {
  const valid_token = "valid-token";
  const invalid_token = "invalid-token";
  it("should render", () => {
    renderAccountConfirmation(valid_token);
  });

  describe("when confirmationToken is valid", () => {
    const CONFIRM_ACCOUNT_SUCCESS_MOCK = {
      request: {
        query: CONFIRM_ACCOUNT,
        variables: { token: "valid-token" },
      },
      result: {
        data: {
          confirmAccount: true,
        },
      },
    };
    it("should display success message", async () => {
      renderAccountConfirmation(valid_token, [CONFIRM_ACCOUNT_SUCCESS_MOCK]);
      await screen.findByTestId("successIcon");

      expect(screen.getByTestId("successIcon")).toBeInTheDocument();
      expect(screen.queryByTestId("errorIcon")).not.toBeInTheDocument();
    });
  });

  describe("when confirmationToken is invalid", () => {
    const CONFIRM_ACCOUNT_FAIL_MOCK = {
      request: {
        query: CONFIRM_ACCOUNT,
        variables: { token: invalid_token },
      },
      error: new Error("Invalid confirmation token"),
    };

    it("should display error message", async () => {
      renderAccountConfirmation(invalid_token, [CONFIRM_ACCOUNT_FAIL_MOCK]);
      await screen.findByTestId("errorIcon");
      expect(screen.queryByTestId("successIcon")).not.toBeInTheDocument();
      expect(screen.getByTestId("errorIcon")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your unique confirmation token is invalid or has already been used."
        )
      ).toBeInTheDocument();
    });
  });
});
