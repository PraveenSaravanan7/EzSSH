import React, { useState } from "react";
import "./AddConnection.css";
import { v4 as uuid } from "uuid";
import { Modal } from "../commonComponents/Modal";

interface IAddConnectionProps {
  onCancel: () => void;
  onSave: (connectionData: any) => void;
}

export const AddConnection = ({ onCancel, onSave }: IAddConnectionProps) => {
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keyFilePath, setKeyFilePath] = useState("");

  const handleSave = () => {
    if (!host || !port || !username) {
      alert("Please fill in all required fields.");
      return;
    }

    const connectionData = {
      id: uuid(),
      name,
      host,
      port,
      username,
      password,
      keyFilePath,
    };

    onSave(connectionData);
  };

  const handleFileSelect = async () => {
    const result = await window.electron.openFiles(); // Call Electron Main Process
    if (result && !result.canceled) {
      setKeyFilePath(result.filePaths[0]); // Get file path
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      onCtaClick={handleSave}
      ctaText="Save"
      title="New Connection"
    >
      <div>
        <div className="connectionConfigForm">
          <div>
            <div className="label">Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="group">
            <div>
              <div className="label">Host</div>
              <input
                style={{ width: "300px" }}
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <div>
              <div className="label">Port</div>
              <input
                style={{ width: "100px" }}
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
          </div>
          <div className="group">
            <div>
              <div className="label">Username</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="label">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="label">Key file</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                style={{ width: "350px" }}
                type="text"
                value={keyFilePath}
                readOnly
              />
              <button
                onClick={handleFileSelect}
                style={{
                  marginLeft: "10px",
                  height: "32px",
                  fontSize: "14px",
                  padding: "0px 8px",
                }}
              >
                Browse
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
