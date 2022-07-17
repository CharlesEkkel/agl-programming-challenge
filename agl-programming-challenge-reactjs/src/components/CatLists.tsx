import { useEffect, useState } from "react";
import { z } from "zod";
import _ from "lodash";

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
const getSortedCats = (people: PersonT[]): PetT[] =>
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
const processPeople = (data: PersonT[]): [PetT[], PetT[]] => {
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

  const [errorMessage, setErrorMessage] = useState<string>(
    "Waiting for response..."
  );

  useEffect(
    () => {
      // Async fetching so that the user still sees the rest of the page
      // when initially loading.
      const fetchAll = async () => {
        const jsonData = await fetch(props.apiUrl);
        const result = await jsonData.json();
        const parseResult = z.array(Person).safeParse(result);

        if (parseResult.success) {
          const [petsF, petsM] = processPeople(parseResult.data);
          setListF(petsF);
          setListM(petsM);
          setErrorMessage("");
        } else {
          // Handle errors
          setErrorMessage(parseResult.error.message);
        }
      };

      fetchAll();
    },
    // Since the given API appears to contain frozen data, we only need to
    // re-fetch data if the API url were to change.
    [props.apiUrl]
  );

  if (errorMessage === "") {
    return (
      <>
        <h4>Cats with male owners</h4>
        <ol>
          {listM.map((pet) => (
            <PetInfo pet={pet} />
          ))}
        </ol>
        <h4>Cats with female owners</h4>
        <ol>
          {listF.map((pet) => (
            <PetInfo pet={pet} />
          ))}
        </ol>
      </>
    );
  } else {
    return <h2>{errorMessage}</h2>;
  }
};

interface PetInfoProps {
  /** Pet data to display. Only name used currently. */
  pet: PetT;
}

/**
 * List component for showing information about a pet; currently very simple,
 * but is abstracted out for possible future extension/decoration.
 */
const PetInfo = (props: PetInfoProps) => <li>{props.pet.name}</li>;

export default CatLists;
