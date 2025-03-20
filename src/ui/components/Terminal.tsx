import React, { useEffect } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";
import { debounce } from "../../utils";
import "./Terminal.css";

const term = new XTerminal();
const fitAddon = new FitAddon();

term.loadAddon(fitAddon);

interface ITerminalProps {
  connection: ConnectionData;
}

export const Terminal = ({ connection }: ITerminalProps) => {
  useEffect(() => {
    term.open(document.getElementById("terminal") as any);

    fitAddon.fit();

    term.onData((e) => {
      window.electron.runShhCmd(e);
    });

    window.electron.subscribeToLogs((log) => term.write(log));

    let sshCommand = `ssh ${connection.username}@${connection.host} -p ${
      connection.port
    } ${connection.keyFilePath ? ` -i "${connection.keyFilePath}"` : ``}`;

    window.electron.runShhCmd(sshCommand + "\r");
  }, [connection]);

  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(() => fitAddon.fit(), 100)
    );
  }, []);

  return <div className="terminal" id="terminal"></div>;
};
