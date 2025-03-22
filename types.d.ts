type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

interface IRunShhCmd {
  cmd: string;
  id: string;
}

interface ITermLogs {
  log: string;
  id: string;
}

type EventPayloadMapping = {
  sendFrameAction: FrameWindowAction;
  openFiles: Promise<OpenDialogReturnValue>;
  runShhCmd: IRunShhCmd;
  "ssh-log": ITermLogs;
  saveConnection: Promise<ConnectionData[]>;
  fetchConnections: ConnectionData[];
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    sendFrameAction: (payload: FrameWindowAction) => void;
    openFiles: () => Promise<OpenDialogReturnValue>;
    runShhCmd: (payload: IRunShhCmd) => void;
    subscribeToLogs: (callback: (log: ITermLogs) => void) => void;
    saveConnection: (
      connectionData: ConnectionData
    ) => Promise<ConnectionData[]>;
    fetchConnections: () => Promise<ConnectionData[]>;
  };
}

interface ConnectionData {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  keyFilePath: string;
}

interface UserData {
  email: string;
  serialNumber: string;
}

interface StoreSchema {
  connections: ConnectionData[];
  userInfo: UserData;
}
