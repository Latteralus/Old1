// preload.js
const { contextBridge, ipcRenderer } = require('electron');

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
    getSettings: () => {
      return ipcRenderer.invoke('get-settings');
    },
    getSavedGames: () => {
      return ipcRenderer.invoke('get-saved-games');
    },
    deleteSavedGame: (index) => {
      return ipcRenderer.invoke('delete-saved-game', index);
    },
    startNewGame: (gameData) => {
      return ipcRenderer.invoke('start-new-game', gameData);
    },
    getNewGameOptions: () => {
      return ipcRenderer.invoke('get-new-game-options');
    },
    // File system access for game data
    readFile: async (filePath, options = {}) => {
      try {
        return await ipcRenderer.invoke('read-file', filePath, options);
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
      }
    },
    writeFile: async (filePath, data, options = {}) => {
      try {
        return await ipcRenderer.invoke('write-file', filePath, data, options);
      } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        throw error;
      }
    },
    // Add simple quit function
    quit: () => {
      ipcRenderer.send('quit-app');
    },
    // Log errors to main process
    logError: (error) => {
      ipcRenderer.send('log-error', error);
    }
  }
);

// Expose electron-specific APIs
contextBridge.exposeInMainWorld(
  'electronAPI', {
    onUpdateAvailable: (callback) => {
      ipcRenderer.on('update-available', (event, ...args) => callback(...args));
    },
    onUpdateDownloaded: (callback) => {
      ipcRenderer.on('update-downloaded', (event, ...args) => callback(...args));
    },
    quitAndInstall: () => {
      ipcRenderer.send('quit-and-install');
    }
  }
);

// Expose window file system API for game data - but use IPC instead of direct fs access
contextBridge.exposeInMainWorld('fs', {
  readFile: async (filepath, options = {}) => {
    try {
      // Use ipcRenderer.invoke instead of direct fs access
      return await ipcRenderer.invoke('read-file', filepath, options);
    } catch (error) {
      console.error(`Error reading file ${filepath}:`, error);
      throw error;
    }
  }
});