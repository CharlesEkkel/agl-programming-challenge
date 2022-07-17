import { useEffect, useState } from "react";
import { z } from "zod";
import _ from "lodash";

/* SCHEMAS FOR JSON VALIDATION */

const Pet = z.object({
  name: z.string(),
  type: z.string(),
});

const Person = z.object({
  name: z.string(),
  // Gender assumed binary for the sake of the excercise.
  gender: z.union([z.literal("Female"), z.literal("Male")]),
  age: z.number().nonnegative().int(),
  // If a null value is encountered for pets, replace it with an empty array,
  // which is semantically easier to use.
  pets: z
    .array(Pet)
    .nullable()
    .default(() => []),
});

const People = z.array(Person);

/* TYPES */

type PetT = z.infer<typeof Pet>;
type PersonT = z.infer<typeof Person>;
type PeopleT = z.infer<typeof People>;

interface GenderSeparatedListsProps {}

/* FUNCTIONS */

const getSortedCats = (people: PeopleT) =>
  people
    .flatMap((person) => (person.pets ? person.pets : []))
    .filter((pet) => pet.type === "Cat")
    .sort((petA, petB) => (petA.name >= petB.name ? 1 : -1));

const processPeople = (data: PeopleT): [PetT[], PetT[]] => {
  const [women, men] = _.partition(
    data,
    (person) => person.gender === "Female"
  );
  return [getSortedCats(women), getSortedCats(men)];
};

/* COMPONENTS */

const CatLists = (props: GenderSeparatedListsProps) => {
  const [listF, setListF] = useState<PetT[]>([]);
  const [listM, setListM] = useState<PetT[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchAll = async () => {
      const jsonData = await fetch(
        "https://agl-developer-test.azurewebsites.net/people.json"
      );
      const res = await jsonData.json();
      const parseResult = People.safeParse(res);

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
  });

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
  pet: PetT;
}

const PetInfo = (props: PetInfoProps) => <li>{props.pet.name}</li>;

export default CatLists;
