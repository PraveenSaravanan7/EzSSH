type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EventPayloadMapping = {
  sendFrameAction: FrameWindowAction;
  openFiles: OpenDialogReturnValue;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    sendFrameAction: (payload: FrameWindowAction) => void;
    openFiles: () => Promise<OpenDialogReturnValue>;
  };
}
