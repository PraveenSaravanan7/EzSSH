import { useEffect, useState } from "react";
import "./App.css";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";

const term = new Terminal();
const fitAddon = new FitAddon();

term.loadAddon(fitAddon);

const App = () => {
  const [showAddScreen, setShowAddScreen] = useState(true);

  useEffect(() => {
    if (showAddScreen) return;

    term.open(document.getElementById("terminal") as any);

    fitAddon.fit();

    term.onData((e) => {
      window.electron.runShhCmd(e);
    });

    window.electron.subscribeToLogs((log) => term.write(log));
  }, [showAddScreen]);

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
        {showAddScreen ? (
          <Add setShowAddScreen={(d: boolean) => setShowAddScreen(d)}></Add>
        ) : (
          <div>
            <div id="terminal" className="terminal"></div>
          </div>
        )}
      </div>
    </>
  );
};

const Add = ({
  setShowAddScreen,
}: {
  setShowAddScreen: (d: boolean) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [host, setHost] = useState("test.rebex.net");
  const [username, setUsername] = useState("demo");
  const [port, setPort] = useState("22");
  const [keyFilePath, setKeyFilePath] = useState("");
  const [logs, setLogs] = useState("test logs");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    let sshCommand = `ssh ${username}@${host} -p ${port}`;

    if (keyFilePath) {
      sshCommand += ` -i "${keyFilePath}"`;
    }

    setShowAddScreen(false);

    window.electron.runShhCmd(sshCommand + "\r");
  };

  const handleFileSelect = async () => {
    const result = await window.electron.openFiles(); // Call Electron Main Process
    if (result && !result.canceled) {
      setKeyFilePath(result.filePaths[0]); // Get file path
    }
  };

  useEffect(() => {}, []);

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

      <div id="logs">{logs}</div>
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
