type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EventPayloadMapping = {
  sendFrameAction: FrameWindowAction;
  openFiles: Promise<OpenDialogReturnValue>;
  runShhCmd: string;
  "ssh-log": string;
  saveConnection: Promise<ConnectionData[]>;
  fetchConnections: ConnectionData[];
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    sendFrameAction: (payload: FrameWindowAction) => void;
    openFiles: () => Promise<OpenDialogReturnValue>;
    runShhCmd: (payload: string) => void;
    subscribeToLogs: (callback: (log: string) => void) => void;
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
