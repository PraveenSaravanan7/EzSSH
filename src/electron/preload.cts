const electron = require("electron");

// INFO: the renderer process has no Node.js or Electron module access. As an app developer, you need to choose which APIs to expose from your preload script using the contextBridge API.
electron.contextBridge.exposeInMainWorld("electron", {
  sendFrameAction: (payload) => ipcSend("sendFrameAction", payload),
  openFiles: () => ipcInvoke("openFiles"),
  runShhCmd: (payload) => ipcSend("runShhCmd", payload),
  subscribeToLogs: (callback) => {
    ipcOn("ssh-log", (log) => {
      callback(log);
    });
  },
  saveConnection: async (connectionData) =>
    ipcInvoke("saveConnection", connectionData),
} satisfies Window["electron"]);

// INFO: Renderer to main (two-way). ipcMainHandle is the handler
function ipcInvoke<Key extends keyof EventPayloadMapping, Args extends any[]>(
  key: Key,
  ...args: Args
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, ...args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

// INFO: Renderer to main (one-way). ipcOn is the handler
function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
