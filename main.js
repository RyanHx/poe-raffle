const { app, BrowserWindow, Menu, dialog, ipcMain, clipboard, shell } = require('electron');
const { Language, PathOfExileLog } = require('poe-log-events');
const path = require('path');
const fs = require('fs');
const fsP = require('fs/promises');

const isDev = process.env.NODE_ENV === 'development';
const settingsPath = path.join(app.getPath("userData"), "config.json");
let raffleString = "",
  running = false,
  poeLog = undefined,
  mainWindow = undefined,
  clientLogPath = "C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt",
  clientLang = Language.English;

function createLogListener(language, path) {
  if (poeLog) poeLog.removeAllListeners();
  const logOptions = {
    logFilePath: path,
    ignoreDebug: true,
    language: language,
  };
  poeLog = new PathOfExileLog(logOptions);
  poeLog.on("error", (err) => {
    console.error(err);
  });
  poeLog.on("whisperReceived", (event) => {
    if ((isDev || running) && (!raffleString || event.whisper === raffleString)) {
      console.log(`Matched whisper from ${event.player}`);
      mainWindow.webContents.send("add-entry", event.player);
    }
  });
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openFile'], filters: [{ name: "Text Document", extensions: ['txt'] }] });
  if (!canceled) {
    if (filePaths[0] !== clientLogPath) {
      clientLogPath = filePaths[0];
      saveSettings();
      try {
        createLogListener(clientLang, clientLogPath);
      } catch (err) {
        console.error(err);
      }
    }
    return filePaths[0];
  }
}

function saveSettings() {
  let settings = {
    logPath: clientLogPath,
    clientLang: clientLang
  }
  settings = JSON.stringify(settings);
  fs.writeFile(settingsPath, settings, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function getSettings() {
  const data = await fsP.readFile(settingsPath, 'utf8');
  const settings = JSON.parse(data);
  //console.log(settings);
  clientLogPath = settings.logPath;
  clientLang = settings.clientLang;
  return settings;
}

function setLanguage(lan) {
  poeLog.changeLanguage(lan);
  clientLang = lan;
  saveSettings();
}

let testCounter = 0; // <-- for adding test entries
function createWindow() {
  const win = new BrowserWindow({
    width: isDev ? 800 : 400,
    height: 600,
    minWidth: 350,
    minHeight: 450,
    webPreferences: {
      preload: path.join(__dirname, './renderer/preload.js')
    }
  });
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send('add-entry', `test${testCounter++}`),
          label: 'Add test entry'
        },
        {
          click: () => win.webContents.openDevTools(),
          label: 'Open dev tools'
        }
      ]
    }
  ]);
  win.loadFile('./renderer/index.html');
  Menu.setApplicationMenu(null);
  mainWindow = win;
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url === "https://www.buymeacoffee.com/ryanhx") {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
  if (isDev) {
    Menu.setApplicationMenu(menu)
    win.webContents.openDevTools();
  }
}
if (require('electron-squirrel-startup')) app.quit();
app.whenReady().then(() => {
  // IPC handlers
  ipcMain.on('keyword-changed', (event, keyword) => {
    raffleString = keyword;
    if (isDev) console.log(raffleString);
  });
  ipcMain.on("toggle-listener", (event, shouldRun) => {
    running = shouldRun;
    if (isDev) console.log(`Raffle running: ${running}`);
  });
  ipcMain.on('set-lang', (event, lang) => {
    setLanguage(lang);
    if (isDev) console.log(`Language set to ${lang}`);
  });
  ipcMain.on('set-clipboard', (event, data) => clipboard.writeText(data));
  ipcMain.handle('open-client-file', handleFileOpen);
  ipcMain.handle('get-settings', getSettings);
  // Settings
  if (!fs.existsSync(settingsPath)) {
    saveSettings();
    try {
      createLogListener(clientLang, clientLogPath);
    } catch (err) {
      console.error(err);
    }
  } else {
    getSettings()
      .then(settings => {
        createLogListener(settings.clientLang, settings.logPath);
      })
      .catch(err => console.error(err));
  }
  // Window
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});