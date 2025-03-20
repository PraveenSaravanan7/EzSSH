import { useEffect, useState } from "react";
import "./App.css";
import { ConnectionList } from "./components/ConnectionList";
import { Header } from "./components/Header";
import { AddConnection } from "./components/AddConnection";
import { Terminal } from "./components/Terminal";

const App = () => {
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [activeConnection, setActiveConnection] = useState<ConnectionData>();

  const [connections, setConnections] = useState<ConnectionData[]>([]);

  const fetchConnections = async () => {
    const connections = await window.electron.fetchConnections();
    setConnections(connections || []);
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const onSave = async (connectionData: ConnectionData) => {
    console.log(connectionData);
    const connections = await window.electron.saveConnection(connectionData);
    setConnections(connections);
    setShowAddConnection(false);
  };

  return (
    <>
      <div className="app">
        <ConnectionList
          connections={connections}
          showAddConnectionForm={() => setShowAddConnection(true)}
          activeConnection={activeConnection}
          setActiveConnection={(activeConnection) =>
            setActiveConnection(activeConnection)
          }
        />

        {showAddConnection && (
          <AddConnection
            onSave={onSave}
            onCancel={() => setShowAddConnection(false)}
          />
        )}
        {!!activeConnection && (
          <div className="terminalsContainer">
            <Terminal connection={activeConnection} />
          </div>
        )}
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
