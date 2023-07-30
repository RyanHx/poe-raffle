const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updateKeyword: (keyword) => ipcRenderer.send('keyword-changed', keyword),
  addEntry: (callback) => ipcRenderer.on("add-entry", callback),
  toastError: (callback) => ipcRenderer.on("toast-error", callback),
  toastPrimary: (callback) => ipcRenderer.on("toast-primary", callback),
  toggleLogListener: (shouldRun) => ipcRenderer.send("toggle-listener", shouldRun),
  openFile: () => ipcRenderer.invoke('open-client-file'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setLanguage: (lang) => ipcRenderer.send('set-lang', lang),
  setClipboard: (data) => ipcRenderer.send('set-clipboard', data)
});