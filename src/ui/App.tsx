import { useState } from "react";
import "./App.css";

const App = () => {
  const [showAddScreen, setShowAddScreen] = useState(false);

  return (
    <div className="app">
      <div className="itemContainer">
        <div></div>
        <div>
          <button
            onClick={() => setShowAddScreen((prev) => !prev)}
            className="button"
            style={{ width: "100%" }}
          >
            + Add
          </button>
        </div>
      </div>
      {showAddScreen ? <Add></Add> : <div className="terminal"></div>}
    </div>
  );
};

const Add = () => {
  return (
    <div>
      <h2>Add</h2>
    </div>
  );
};

export default App;
