const { app, BrowserWindow, Menu } = require("electron");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

let mainWindow;

const port = new SerialPort(
  {
    // Porta serial do arduíno no linux, windows são os comp
    path: "/dev/ttyUSB0",
    baudRate: 9600,
  },
  (err) => {
    if (err) {
      console.error("Erro ao abrir a porta serial:", err.message);
    } else {
      console.log("Porta serial aberta com sucesso!");
    }
  }
);

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js", 
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Menu.setApplicationMenu(null);

  parser.on("data", (data) => {
    console.log("Recebido:", data.trim());
    mainWindow.webContents.send("serial-data", data.trim()); //Dados que serão enviados para renderização
  });

  port.on("error", (err) => console.error("Erro na porta serial:", err.message));
});

app.on("window-all-closed", () => {
  app.quit();
});
