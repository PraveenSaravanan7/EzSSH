import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [showAddScreen, setShowAddScreen] = useState(false);

  return (
    <>
      <Header />
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
    </>
  );
};

const Add = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [port, setPort] = useState("22");
  const [keyFilePath, setKeyFilePath] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    let sshCommand = `ssh ${username}@${host} -p ${port}`;

    if (keyFilePath) {
      sshCommand += ` -i "${keyFilePath}"`;
    }

    alert(sshCommand);
  };

  const handleFileSelect = async () => {
    const result = await window.electron.openFiles(); // Call Electron Main Process
    if (result && !result.canceled) {
      setKeyFilePath(result.filePaths[0]); // Get file path
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="addContainer">
        <div>
          <span>Username </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
        </div>
        <div>
          <span>Host </span>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
        </div>
        <div>
          <span>Port </span>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
        </div>
        <div>
          <span>Key File </span>
          <button type="button" onClick={handleFileSelect}>
            {keyFilePath ? keyFilePath : "Select Private Key"}
          </button>
        </div>

        <button type="submit" className="button">
          Generate SSH Command
        </button>
      </form>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction("CLOSE")}
      />
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction("MINIMIZE")}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
      />
    </header>
  );
};

export default App;
