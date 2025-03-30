import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "./Terminal";
import "./TerminalTabs.css";

interface ITerminalTabs {
  activeConnection: ConnectionData;
  setActiveConnection: (activeConnection: ConnectionData) => void;
}

export const TerminalTabs = ({
  activeConnection,
  setActiveConnection,
}: ITerminalTabs) => {
  const [connectionsInOrder, setConnectionsInOrder] = useState<
    ConnectionData[]
  >([]);

  const [terminals, setTerminals] = useState<JSX.Element[]>([]);

  const isNewConnection = !connectionsInOrder.find(
    (i) => i.id === activeConnection.id
  );

  const showOnlyActiveTerminal = () => {
    const terminalContainers =
      document.getElementsByClassName("terminalContainer");

    for (let i = 0; i < terminalContainers.length; i++) {
      (terminalContainers[i] as HTMLElement).style.display = "none";
    }

    const activeTerminalContainer = document.getElementById(
      "terminalContainer-" + activeConnection.id
    );

    if (activeTerminalContainer) {
      (activeTerminalContainer as HTMLElement).style.display = "block";
    }
  };

  useEffect(() => {
    if (isNewConnection) {
      console.log("creating new terminal " + activeConnection.id);
      setTerminals((prev) => [
        ...prev,
        <Terminal
          key={activeConnection.id}
          connection={{ ...activeConnection }}
        />,
      ]);
    }

    setConnectionsInOrder((prev) => {
      if (!isNewConnection) return prev;

      return [...prev, activeConnection];
    });

    showOnlyActiveTerminal();
  }, [activeConnection]);

  return (
    <>
      <div className="tabList">
        {connectionsInOrder?.map((connection) => (
          <div
            className={`tab ${
              connection.id === activeConnection.id ? "active" : ""
            }`}
            onClick={() => setActiveConnection(connection)}
          >
            {connection.name}

            <div className="tabClose">&times;</div>
          </div>
        ))}
      </div>

      {terminals}
    </>
  );
};
