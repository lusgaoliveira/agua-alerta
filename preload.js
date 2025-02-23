const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    // Envia mensagens para o processo principal
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },

    // Recebe mensagens do processo principal
    on: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },

    // Remove um listener de um canal específico
    removeListener: (channel, callback) => {
        ipcRenderer.removeListener(channel, callback);
    },

    // Recebe dados da porta serial
    onSerialData: (callback) => {
        ipcRenderer.on("serial-data", (event, data) => callback(data));
    },
});