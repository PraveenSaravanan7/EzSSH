type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EventPayloadMapping = {
  sendFrameAction: FrameWindowAction;
  openFiles: OpenDialogReturnValue;
  runShhCmd: string;
  "ssh-log": string;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    sendFrameAction: (payload: FrameWindowAction) => void;
    openFiles: () => Promise<OpenDialogReturnValue>;
    runShhCmd: (payload: string) => void;
    subscribeToLogs: (callback: (log: string) => void) => void;
  };
}
