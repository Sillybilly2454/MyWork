const { app, BrowserWindow, ipcMain } = require('electron');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');  

// Set the serial port path
const portPath = 'COM7';

// Initialize the serial port with specified path and baud rate
const port = new SerialPort({ path: portPath, baudRate: 115200 });

// Create a parser for reading serial data line by line
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Control testing mode: true enables debugging and development, false locks the app interface
let testing = false; 

// Keep a reference to the window
let win; 

if (testing == true) {
  console.log('Testing mode Enabled');
}


function createWindow() {
  if(testing == false) {
    // Configure window for production (kiosk mode, always on top)
    win = new BrowserWindow({
      alwaysOnTop: true,
      kiosk: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    win.on('closed', () => {
      win = null
    })

    win.on('close', event => {
      event.preventDefault(); // Prevent window from closing
    });

    win.setMenu(null); // Hide menu bar
  } else {
    // Configure window for testing (no kiosk mode)
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
  }

  // Load the main application URL 
  win.loadURL('http://localhost');
}

// Event to create the window when the app is ready
app.on('ready', createWindow);

app.on('before-quit', event => {
  if (!testing) {
    event.preventDefault(); // Prevent the app from quitting in production mode
  }
});

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window if app is activated and no window exists
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// Keep the app in focus in production mode
app.on('browser-window-blur', (event, bw) => {
  if (!testing) {
    bw.restore();
    bw.focus();
  }
});

// Serial port event when opened
port.on('open', () => {
  console.log(`Serial port ${portPath} opened successfully`);
});

// Event for handling received RFID data and sending it to the renderer
parser.on('data', (rfid) => {
  console.log(`RFID received: ${rfid}`);
  win.webContents.send('rfid', rfid);
});

// Handle serial port errors
port.on('error', (err) => {
  console.error('Serial port error: ', err.message);
});

// Close the app when receiving a 'close-app' event from the renderer
ipcMain.on('close-app', (event) => {
  console.log('Received close-app event. Terminating app...');
  process.exit(0);  // Exit the app with success code
});