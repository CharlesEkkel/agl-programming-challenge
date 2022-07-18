import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Smoke test for entire app.
test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Here we have/i);
  expect(linkElement).toBeInTheDocument();
});
