import { app, BrowserWindow, dialog, Menu } from "electron";
import { ipcMainHandle, ipcMainOn, ipcWebContentsSend, isDev } from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";
import { exec, spawn } from "child_process";

let process = spawn("ssh", ["demo@test.rebex.net"]);

app.on("ready", () => {
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
    console.log(payload);
    // process = exec(payload);
  });

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
  handleShhCmd(mainWindow);
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

ipcMainHandle("openFiles", () => {
  return openFiles();
});

async function openFiles() {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  return result;
}

function handleShhCmd(mainWindow: BrowserWindow) {
  let output = "";

  process.stdout.on("data", (data: Buffer) => {
    output += data.toString();
    console.log("-=----------");
    console.log(data.toString());
    ipcWebContentsSend("ssh-log", mainWindow.webContents, data.toString());
  });

  process.stderr.on("data", (data: string) => {
    output += data.toString();
    console.log("-=----------");
    console.log(data.toString());
    ipcWebContentsSend("ssh-log", mainWindow.webContents, data.toString());
  });

  process.on("close", (code: string) => {
    // resolve({ output, exitCode: code });
    console.log({ output, exitCode: code });
  });
}
