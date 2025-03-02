import { useState } from "react";
import "./App.css";
import { ConnectionList } from "./components/ConnectionList";
import { Header } from "./components/Header";
import { AddConnection } from "./components/AddConnection";
import { Terminal } from "./components/Terminal";

const App = () => {
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [activeConnection, setActiveConnection] = useState("");

  return (
    <>
      <Header />
      <div className="app">
        <ConnectionList
          showAddConnectionForm={() => setShowAddConnection(true)}
        />

        {showAddConnection && (
          <AddConnection onCancel={() => setShowAddConnection(false)} />
        )}
        {!!activeConnection && <Terminal />}
        {!showAddConnection && !activeConnection && <WelcomeMessage />}
      </div>
    </>
  );
};

const WelcomeMessage = () => {
  return (
    <div className="welcomeMessage">
      <span>EzSSH</span>
    </div>
  );
};

export default App;
