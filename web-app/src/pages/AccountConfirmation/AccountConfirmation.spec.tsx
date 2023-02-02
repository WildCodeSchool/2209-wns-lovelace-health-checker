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
            element={<AccountConfirmation onSuccess={() => {}} />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("Account Confirmation", () => {
  const VALID_TOKEN = "valid-token";
  const INVALID_TOKEN = "invalid-token";
  it("should render", () => {
    renderAccountConfirmation(VALID_TOKEN);
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
      renderAccountConfirmation(VALID_TOKEN, [CONFIRM_ACCOUNT_SUCCESS_MOCK]);
      await screen.findByTestId("successIcon");

      expect(screen.getByTestId("successIcon")).toBeInTheDocument();
      expect(screen.queryByTestId("errorIcon")).not.toBeInTheDocument();
    });
  });

  describe("when confirmationToken is invalid", () => {
    const CONFIRM_ACCOUNT_FAIL_MOCK = {
      request: {
        query: CONFIRM_ACCOUNT,
        variables: { token: INVALID_TOKEN },
      },
      error: new Error("Invalid confirmation token"),
    };

    it("should display error message", async () => {
      renderAccountConfirmation(INVALID_TOKEN, [CONFIRM_ACCOUNT_FAIL_MOCK]);
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
