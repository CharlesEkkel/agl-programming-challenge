import React from "react";
import CatLists from "./components/CatLists";

function App() {
  return (
    <div
      id="App"
      className="flex flex-col justify-around h-screen w-full p-20
                 bg-sky-900 text-sky-300 text-center"
    >
      <h1 className="font-bold text-4xl">
        Here we have two sorted lists of cats, arranged by the gender of their
        owners.
      </h1>
      <CatLists
        apiUrl={"https://agl-developer-test.azurewebsites.net/people.json"}
      />
      <h1 className="font-bold text-4xl">Thanks to AGL for the data.</h1>
    </div>
  );
}

export default App;
