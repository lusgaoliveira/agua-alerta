const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    receiveSerialData: (callback) => ipcRenderer.on("serial-data", (event, data) => callback(data)),
});
