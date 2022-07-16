import React from "react";
import "./App.css";
import GenderSeparatedLists from "./components/CatLists";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>A sorted list of male & female cats</h1>
      </header>
      <body>
        <GenderSeparatedLists jsonFileName="people.json" />
      </body>
    </div>
  );
}

export default App;
