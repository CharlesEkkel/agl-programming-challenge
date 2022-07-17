import React from "react";
import "./App.css";
import CatLists from "./components/CatLists";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>A sorted list of male & female cats</h1>
        <CatLists />
      </header>
    </div>
  );
}

export default App;
