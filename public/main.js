const { app, BrowserWindow, protocol } = require('electron')
const { ipcMain } = require('electron');
const url = require('url');


const path = require('path')
const isDev = require('electron-is-dev')

require('@electron/remote/main').initialize()

protocol.registerSchemesAsPrivileged([
  {
    scheme: "root",
    privileges: {
      standard: true,
      secure: true
    }
  }
])

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


let cache = {
  data: undefined,
};

let hiddenWindow;

ipcMain.on('START_BACKGROUND_VIA_MAIN', (event, args) => {
  const backgroundFileUrl = url.format({
    pathname: path.join(__dirname, '/../background_tasks/background.html'),
    protocol: 'file:',
    slashes: true,
  });
  hiddenWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });
  hiddenWindow.loadURL(backgroundFileUrl);

  hiddenWindow.webContents.openDevTools();

  hiddenWindow.on('closed', () => {
    hiddenWindow = null;
  });

  cache.data = args.number;
});

ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
  win.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
});

ipcMain.on('BACKGROUND_READY', (event, args) => {
  event.reply('START_PROCESSING', {
    data: cache.data,
  });
});
