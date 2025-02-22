const { app, BrowserWindow, ipcMain } = require("electron");
const { SerialPort, ReadlineParser } = require("serialport");
const path = require("path");

let mainWindow;
let port;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.webContents.openDevTools();
}

// Função para iniciar a comunicação serial
function initializeSerialPort(portName) {
    try {
        port = new SerialPort({ path: portName, baudRate: 9600 });
        const parser = new ReadlineParser();
        port.pipe(parser);

        parser.on("data", (data) => {
            console.log("Recebido:", data.trim());
            mainWindow.webContents.send("serial-data", data.trim());
        });

        port.on("error", (err) => {
            console.error("Erro na porta serial:", err.message);
        });
    } catch (error) {
        console.error("Falha ao iniciar a porta serial:", error.message);
    }
}

// Função para gerar dados simulados (caso não tenha o Arduino conectado)
function generateMockData() {
    const distancia1 = Math.floor(Math.random() * 100); // Valor entre 0 e 100 cm
    const distancia2 = Math.floor(Math.random() * 100);
    const distanciaCalculada = Math.floor((distancia1 + distancia2) / 2);

    const mockData = JSON.stringify({
        distancia1,
        distancia2,
        distanciaCalculada
    });

    console.log("Dados mockados enviados:", mockData);
    mainWindow.webContents.send("serial-data", mockData);
}

// Ativa os dados simulados a cada 3 segundos se a porta serial não estiver definida
setInterval(() => {
    if (!port || !port.isOpen) {
        generateMockData();
    }
}, 3000);

app.whenReady().then(() => {
    createWindow();

    // Substitua 'COM3' pelo nome correto da porta serial do seu Arduino
    initializeSerialPort("COM3");

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
    if (port && port.isOpen) {
        port.close();
    }
});
