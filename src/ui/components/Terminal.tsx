import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";
import { debounce } from "../../utils";
import "./Terminal.css";

interface ITerminalProps {
  connection: ConnectionData;
}

export const Terminal = ({ connection }: ITerminalProps) => {
  const terminalId = `terminal-${connection.id}`;

  const term = useRef(new XTerminal()).current;
  const fitAddon = useRef(new FitAddon()).current;

  useEffect(() => {
    term.open(document.getElementById(terminalId) as any);

    term.loadAddon(fitAddon);

    fitAddon.fit();

    term.onData((e) => {
      window.electron.runShhCmd({ id: connection.id, cmd: e });
    });

    window.electron.subscribeToLogs((log) => term.write(log));

    let sshCommand = `ssh ${connection.username}@${connection.host} -p ${
      connection.port
    } ${connection.keyFilePath ? ` -i "${connection.keyFilePath}"` : ``}`;

    window.electron.runShhCmd({ id: connection.id, cmd: sshCommand + "\r" });
  }, [connection]);

  useEffect(() => {
    term.loadAddon(fitAddon);

    window.addEventListener(
      "resize",
      debounce(() => fitAddon.fit(), 100)
    );
  }, []);

  return (
    <div className="terminalsContainer">
      <div className="terminal" id={terminalId}></div>
    </div>
  );
};
