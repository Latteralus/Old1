// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'gameAPI', {
    saveGame: (gameData) => {
      return ipcRenderer.invoke('save-game', gameData);
    },
    loadGame: () => {
      return ipcRenderer.invoke('load-game');
    },
    updateSettings: (settings) => {
      return ipcRenderer.invoke('update-settings', settings);
    },
    // File system access for game data
    readFile: (filePath, options = {}) => {
      return fs.promises.readFile(filePath, options);
    },
    writeFile: (filePath, data, options = {}) => {
      return fs.promises.writeFile(filePath, data, options);
    },
    // Add listeners for game events
    onGameEvent: (channel, callback) => {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
);

// Expose electron-specific APIs
contextBridge.exposeInMainWorld(
  'electronAPI', {
    onUpdateAvailable: (callback) => {
      ipcRenderer.on('update-available', callback);
    },
    onUpdateDownloaded: (callback) => {
      ipcRenderer.on('update-downloaded', callback);
    },
    quitAndInstall: () => {
      ipcRenderer.send('quit-and-install');
    }
  }
);

// Expose window file system API for game data
contextBridge.exposeInMainWorld('fs', {
  readFile: async (filepath, options = {}) => {
    try {
      return await fs.promises.readFile(filepath, options);
    } catch (error) {
      console.error(`Error reading file ${filepath}:`, error);
      throw error;
    }
  }
});