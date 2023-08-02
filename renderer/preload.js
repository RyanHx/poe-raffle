const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addEntry: (callback) => ipcRenderer.on("add-entry", callback),
  toastError: (callback) => ipcRenderer.on("toast-error", callback),
  toastPrimary: (callback) => ipcRenderer.on("toast-primary", callback),
  updateKeyword: (keyword) => ipcRenderer.send('keyword-changed', keyword),
  toggleLogListener: (shouldRun) => ipcRenderer.send("toggle-listener", shouldRun),
  setLanguage: (lang) => ipcRenderer.send('set-lang', lang),
  openFile: () => ipcRenderer.invoke('open-client-file'),
  getSettings: () => ipcRenderer.invoke('get-settings')
});