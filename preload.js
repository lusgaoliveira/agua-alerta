const { contextBridge, ipcRenderer } = require("electron");

// Canal de comunicação do main process para o renderer
contextBridge.exposeInMainWorld("electron", {
  onSerialData: (callback) => ipcRenderer.on("serial-data", callback), 
});
