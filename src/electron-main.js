'use strict'

// This intercepts the error message box shown by Electron in case of an uncaughtException. Needs to be on top of the main process.
process.on('uncaughtException', (error => {
    console.error(error);
}));

const { app, BrowserWindow } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('disable-site-isolation-trials');

// Get and switch Vuelectro build type
process.env.VUELECTRO_ENV = process.env.VUELECTRO_ENV || 'build';

// Set global variables for the resource path and Vue static path to be used throughout the app (both in main and renderer)
global.__resPath = path.join(process.cwd(), 'resources');
global.__staticPath = path.join(process.cwd(), 'public');
global.__appPath = path.join(process.cwd(), 'app');

let rndURL = `file://${__dirname}/renderer/index.html`; // Renderer entry URL
let isDev = false; // Set the Electron environment to development or production

// Change running environment and renderer source according to the executed command
switch (process.env.VUELECTRO_ENV) {
    case 'run':
    case 'devprod':
        isDev = true;
        break;
    case 'serve':
        isDev = true;
        rndURL = 'http://localhost:8080/';
        break;
    case 'build':
        global.__resPath = process.resourcesPath;
        global.__staticPath = path.join(__dirname, 'renderer');
        global.__appPath = __dirname;
        break;
}

function createWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        show: false,
        webPreferences: {
            webSecurity: false,
            nativeWindowOpen: true,
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [JSON.stringify({
                VUELECTRO_RES_PATH: __resPath,
                VUELECTRO_STATIC_PATH: __staticPath,
                VUELECTRO_APP_PATH: __appPath,
                VUELECTRO_ENV: process.env.VUELECTRO_ENV
            })]
        }
    });

    // Use the promise returned by loadURL() in combination with show:false and win.show() to avoid showing the window before content is loaded
    win.loadURL(rndURL).then(() => {
        win.show();
        if (isDev) win.webContents.openDevTools(); // Open dev tools on development mode
    });
}

app.on('ready', async () => {
    if (isDev) {
        // Install Vue Devtools
        try {
            await require('electron-devtools-installer').default({
                id: 'ljjemllljcmogpfapbkkighbhhppjdbg', // Vue Devtools beta
                electron: '>=1.2.1'
            });
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }

    createWindow();
});

// Prevent app from hanging around if all windows are closed
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// End main process if Electron instance has already been terminated
app.on('quit', () => {
    process.exit();
});
