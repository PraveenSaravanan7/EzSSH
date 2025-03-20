import { app, BrowserWindow, dialog, Menu } from "electron";
import { ipcMainHandle, ipcMainOn, ipcWebContentsSend, isDev } from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import os from "os";
import pty from "node-pty";
import { dataStore } from "./store.js";

app.on("ready", () => {
  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

  const ptyProcessMap: Record<string, pty.IPty> = {};

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    // disables default system frame (dont do this if you want a proper working menu bar)
    frame: false,
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  ipcMainOn("sendFrameAction", (payload) => {
    console.log("sendFrameAction payload is : " + payload);

    switch (payload) {
      case "CLOSE":
        mainWindow.close();
        break;
      case "MAXIMIZE":
        mainWindow.maximize();
        break;
      case "MINIMIZE":
        mainWindow.minimize();
        break;
    }
  });

  ipcMainOn("runShhCmd", (payload) => {
    if (!ptyProcessMap[payload.id]) {
      const ptyProcess = pty.spawn(shell, [], {
        // name: "xterm-color",
        cwd: process.env.HOME,
        env: process.env,
      });

      ptyProcess.onData((data: any) => {
        ipcWebContentsSend("ssh-log", mainWindow.webContents, data);
      });

      ptyProcess.onExit((e: any) => {
        console.log(`PTY process ${payload.id} exited with code: `, e);
      });

      ptyProcessMap[payload.id] = ptyProcess;
    }

    ptyProcessMap[payload.id]?.write(payload.cmd);
  });

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}

ipcMainHandle("openFiles", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  return result;
});

ipcMainHandle("saveConnection", async (connectionData: ConnectionData) => {
  try {
    const connections = dataStore.get("connections") || [];
    connections.push(connectionData);
    dataStore.set("connections", connections);

    return connections;
  } catch (error) {
    console.error("Error saving connection:", error);
    throw error;
  }
});

ipcMainHandle("fetchConnections", () => {
  try {
    return dataStore.get("connections") || [];
  } catch (error) {
    console.error("Error saving connection:", error);
    throw error;
  }
});
