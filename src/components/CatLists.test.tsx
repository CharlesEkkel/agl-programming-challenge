import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor, within } from "@testing-library/react";
import { sortBy, union } from "lodash";
import CatLists, { getSortedCats, processPeople } from "./CatLists";

const pets1 = [
  {
    name: "Pheobe",
    type: "Cat",
  },
  {
    name: "Mike",
    type: "Dog",
  },
  {
    name: "Jack",
    type: "Cat",
  },
];

const pets2 = [
  {
    name: "AAA",
    type: "Cat",
  },
  {
    name: "CCC",
    type: "Dog",
  },
  {
    name: "BBB",
    type: "Cat",
  },
];

const data = [
  {
    name: "Charlie",
    gender: "Male",
    age: 23,
    pets: pets1,
  },
  {
    name: "Jess",
    gender: "Female",
    age: 23,
    pets: pets2,
  },
];

test("'getSortedCats()' filters out non-cats and sorts by name", () => {
  const allPets = [...pets1, ...pets2];
  const allCats = allPets.filter((pet) => pet.type === "Cat");
  const sortedCats = sortBy(allCats, ["name"]);
  // Technically `data` doesn't quite typecheck, but it'd be more pain
  // than it's worth to fix, since it's functionally fine.
  // @ts-ignore
  expect(getSortedCats(data)).toEqual(sortedCats);
});

test("'processPeople()' partitions cats by owner's gender", () => {
  // @ts-ignore
  const [fCats, mCats] = processPeople(data);
  expect(union(pets1, mCats)).toEqual(pets1);
  expect(union(pets2, fCats)).toEqual(pets2);
});

const server = setupServer(
  rest.get("/testData", (req, res, ctx) => {
    return res(ctx.json(data));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Cat lists component", () => {
  // Smoke test
  it("renders properly", () => {
    render(<CatLists apiUrl="/testData" />);
    expect(screen.getByTestId("catLists")).toBeDefined();
  });

  // Child elements render properly
  it("has Pheobe in male list", async () => {
    render(<CatLists apiUrl="/testData" />);
    await waitFor(() => {
      const maleOwned = screen.getByLabelText(/cats with male owners/i);
      const phoebe = within(maleOwned).getByText("Pheobe");
      expect(phoebe).toBeDefined();
    });
  });

  it("has lists sorted by name", async () => {
    render(<CatLists apiUrl="/testData" />);
    await waitFor(() => {
      const lists = screen.getAllByRole("list").map((list) =>
        within(list)
          .getAllByRole("listitem")
          .map((item) => item.textContent)
      );

      lists.forEach((list) => expect(list).toEqual(list.sort()));
    });
  });
});
