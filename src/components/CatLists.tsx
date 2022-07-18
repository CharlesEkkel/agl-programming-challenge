import { useEffect, useState } from "react";
import { z } from "zod";
import _ from "lodash";
import axios from "axios";

/* SCHEMAS FOR JSON VALIDATION */

const Pet = z.object({
  name: z.string(),
  /** In practice, type is only ever 'Cat' or 'Dog' */
  type: z.string(),
});

const Person = z.object({
  name: z.string(),
  /** Gender assumed binary for the sake of the excercise. */
  gender: z.union([z.literal("Female"), z.literal("Male")]),
  age: z.number().nonnegative().int(),
  /** Some people don't have any pets! Shocking, I know. */
  pets: z.array(Pet).nullable(),
});

/* TYPES */

type PetT = z.infer<typeof Pet>;
type PersonT = z.infer<typeof Person>;

/* FUNCTIONS */

/**
 * Make a sorted list of all cats owned by a group of people.
 * Other pets are discarded - unfortunate, but necessary :(
 *
 * @param people: Array of PersonT values, each containing an array of pets.
 * @returns Sorted list of cats
 */
export const getSortedCats = (people: PersonT[]): PetT[] =>
  people
    .flatMap((person) => (person.pets ? person.pets : []))
    .filter((pet) => pet.type === "Cat")
    .sort((petA, petB) => (petA.name >= petB.name ? 1 : -1));

/**
 * Efficiently split an array of PersonT objects by their gender (male and female),
 * and returns sorted arrays of their respective cats.
 *
 * @param data: Array of PersonT objects with any gender.
 * @returns Tuple of two arrays containing cats which have female and male
 * owners respectively.
 */
export const processPeople = (data: PersonT[]): [PetT[], PetT[]] => {
  const [women, men] = _.partition(
    data,
    // If more genders are added in future, this approach will no longer be
    // sufficient.
    (person) => person.gender === "Female"
  );

  // Need to return explicitly for the tuple to typecheck.
  return [getSortedCats(women), getSortedCats(men)];
};

/* COMPONENTS */

interface CatListsProps {
  /** The url to an API which provides an array of PersonT objects.
   *  Useful for code-reuse and to faciliate component testing. */
  apiUrl: string;
}

/**
 * Display two lists of cats, each sorted by name and separated by the
 * gender of their owners.
 */
const CatLists = (props: CatListsProps) => {
  const [listF, setListF] = useState<PetT[]>([]);
  const [listM, setListM] = useState<PetT[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(
    "Waiting for response..."
  );

  useEffect(
    () => {
      // Fetch asynchronously so that the user still sees the rest of the page
      // when initially loading. And using axios because the default fetch api doesn't
      // handle code 400+ errors automatically.
      axios
        .get(props.apiUrl)
        // This is where our schema comes in handy, for safe parsing.
        .then((result) => z.array(Person).safeParse(result.data))
        .then((parsedResult) => {
          if (parsedResult.success) {
            // Also process the data here because we want to do so as little as possible.
            const [petsF, petsM] = processPeople(parsedResult.data);
            setListF(petsF);
            setListM(petsM);
            setErrorMessage(null);
          } else {
            setErrorMessage(`Parsing Error: ${parsedResult.error.message}`);
          }
        })
        .catch((error) => setErrorMessage(error.toString()));
    },
    // Since the given API appears to contain frozen data, we only need to
    // re-fetch data if the API url were to change.
    [props.apiUrl]
  );

  const errorDisplay = (
    <>
      <h2 className="text-3xl">Error occurred while retrieving API data:</h2>
      <p className="text-2xl">{errorMessage}</p>
    </>
  );

  return (
    <div
      data-testid="catLists"
      className="flex items-start justify-evenly w-full"
    >
      {errorMessage ? (
        errorDisplay
      ) : (
        // No error, so just display the data.
        <>
          <List
            id="maleOwned"
            heading="Cats with male owners"
            items={listM.map((pet) => pet.name)}
          />
          <List
            id="femaleOwned"
            heading="Cats with female owners"
            items={listF.map((pet) => pet.name)}
          />
        </>
      )}
    </div>
  );
};

interface ListProps {
  /** Element id, re-used to derive heading and list ids. */
  id: string;
  heading: string;
  /** Order will be maintained so long as item strings are unique. */
  items: string[];
}

/**
 * Display a list of ordered values.
 */
const List = (props: ListProps) => {
  return (
    <div id={props.id} className="flex flex-col items-center">
      <h4 id={`${props.id}-heading`} className="text-3xl font-semibold p-10">
        {props.heading}
      </h4>
      <ol
        aria-labelledby={`${props.id}-heading`}
        className="text-xl list-disc text-justify"
      >
        {props.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default CatLists;
