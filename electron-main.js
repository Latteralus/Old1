const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const gameIntegration = require('./game-integration');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  // Load the index.html of the app
  mainWindow.loadFile(path.join(app.getAppPath(), 'index.html'));

  // Initialize game integration
  gameIntegration.initGameIntegration(mainWindow);
  
  // Always open DevTools to help debug the white screen issue
  mainWindow.webContents.openDevTools();
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  return mainWindow;
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  
  // On macOS, re-create a window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Setup IPC handlers for game-related functionality
ipcMain.handle('get-settings', async () => {
  return gameIntegration.loadSettings();
});

ipcMain.handle('save-game', async (event, gameData) => {
  return gameIntegration.saveGameState(gameData);
});

ipcMain.handle('load-game', async () => {
  return gameIntegration.loadGameState();
});

ipcMain.handle('update-settings', async (event, settings) => {
  return gameIntegration.saveSettings(settings);
});

// Handle quit request from renderer
ipcMain.on('quit-app', () => {
  app.quit();
});