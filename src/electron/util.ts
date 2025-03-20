import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

// INFO: Handle events from ipcInvoke
export function ipcMainHandle<
  Key extends keyof EventPayloadMapping,
  Args extends any[]
>(key: Key, handler: (...args: Args) => EventPayloadMapping[Key]) {
  ipcMain.handle(key, (event, ...args: Args) => {
    validateEventFrame(event.senderFrame);
    return handler(...args);
  });
}

// INFO: Handle events from ipcSend
export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    validateEventFrame(event.senderFrame);
    return handler(payload);
  });
}

// INFO: Main to renderer. ipcOn handles it
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event");
  }
}
