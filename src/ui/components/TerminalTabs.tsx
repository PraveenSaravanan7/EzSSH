import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "./Terminal";

interface ITerminalTabs {
  activeConnection: ConnectionData;
}

export const TerminalTabs = ({ activeConnection }: ITerminalTabs) => {
  const [terminal, setTerminal] = useState<JSX.Element>(<></>);
  const terminals = useRef<Record<string, JSX.Element>>({}).current;

  useEffect(() => {
    if (!terminals[activeConnection.id]) {
      terminals[activeConnection.id] = (
        <Terminal key={activeConnection.id} connection={activeConnection} />
      );
    }

    setTerminal(terminals[activeConnection.id]);
  }, [activeConnection]);

  return <>{terminal || <div>No Active Terminal</div>}</>;
};
