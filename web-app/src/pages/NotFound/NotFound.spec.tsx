import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { HOMEPAGE_ROUTE } from "../../routes";
import NotFound from "./NotFound";

const renderNotFound = (mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    </MockedProvider>
  );
};

const renderNotFoundWithHistory = (history: MemoryHistory, mock?: any) => {
  render(
    <MockedProvider mocks={mock}>
      <Router location={history.location} navigator={history}>
        <NotFound />
      </Router>
    </MockedProvider>
  );
};

describe("NotFound", () => {
  it("should renders", async () => {
    renderNotFound();
    expect(screen.getByText("Page not found")).toBeTruthy();
  });

  it("render button go to home page", () => {
    renderNotFound();
    expect(screen.getByRole("button", { name: "Go to homepage" })).toBeTruthy();
  });

  it("navigate to / when click Go to home page button", async () => {
    const history = createMemoryHistory();
    renderNotFoundWithHistory(history);
    fireEvent.click(screen.getByRole("button", { name: "Go to homepage" }));
    await waitFor(() => {
      expect(history.location.pathname).toBe(HOMEPAGE_ROUTE);
    });
  });
});
