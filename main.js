const { app, BrowserWindow, ipcMain } = require('electron');
const PresentController = require('./backend/controllers/presentables');
const UserController = require('./backend/controllers/users');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1920, 
    height: 1080,
    backgroundColor: '#efefef',
    darkTheme: true,
    icon: `file://${__dirname}/dist/AE-PresenTables/assets/fav-abacus.ico`,
    fullscreen: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  win.loadURL(`file://${__dirname}/dist/AE-PresenTables/index.html`);

  win.on('closed', function () {
    win = null;
  });
}

app.on('ready', createWindow);

ipcMain.on('login', UserController.loginUser);
ipcMain.on('signup', UserController.signupUser);

ipcMain.on('creating', PresentController.createPresentable);
ipcMain.on('getting', PresentController.getPresentables);
ipcMain.on('deleting', PresentController.deletePresentable);
ipcMain.on('updating', PresentController.updatePresentable);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (win === null) {
    createWindow();
  }
});