// game-integration.js
const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Game state management
let gameState = null;

// Initialize game integration
function initGameIntegration(mainWindow) {
  // Set up IPC listeners for game events
  setupIpcListeners(mainWindow);
  
  // Load initial game state
  loadGameState();
}

// Set up IPC listeners to handle game-related events
function setupIpcListeners(mainWindow) {
  // Handle save game requests
  ipcMain.on('save-game', (event, gameData) => {
    saveGameState(gameData);
    event.reply('save-game-response', { success: true });
  });
  
  // Handle load game requests
  ipcMain.on('load-game', (event) => {
    const gameData = loadGameState();
    event.reply('load-game-response', gameData);
  });

  // Handle game settings changes
  ipcMain.on('update-settings', (event, settings) => {
    // Update settings in storage
    saveSettings(settings);
    event.reply('update-settings-response', { success: true });
  });
}

// Save game state to file
function saveGameState(gameData) {
  try {
    const userDataPath = getUserDataPath();
    const savePath = path.join(userDataPath, 'saves');
    
    // Create saves directory if it doesn't exist
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    
    // Write game data to file
    fs.writeFileSync(
      path.join(savePath, 'pharmacy_save.json'), 
      JSON.stringify(gameData, null, 2)
    );
    
    console.log('Game saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
}

// Load game state from file
function loadGameState() {
  try {
    const userDataPath = getUserDataPath();
    const savePath = path.join(userDataPath, 'saves', 'pharmacy_save.json');
    
    // Check if save file exists
    if (fs.existsSync(savePath)) {
      const saveData = fs.readFileSync(savePath, 'utf8');
      gameState = JSON.parse(saveData);
      console.log('Game loaded successfully');
      return gameState;
    } else {
      console.log('No save file found, starting new game');
      return null;
    }
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
}

// Save game settings
function saveSettings(settings) {
  try {
    const userDataPath = getUserDataPath();
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log('Settings saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// Load game settings
function loadSettings() {
  try {
    const userDataPath = getUserDataPath();
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    if (fs.existsSync(settingsPath)) {
      const settingsData = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(settingsData);
    } else {
      // Return default settings
      return {
        volume: 50,
        musicEnabled: true,
        soundEnabled: true,
        simulationSpeed: 1.0
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
}

// Helper to get user data path
function getUserDataPath() {
  const { app } = require('electron');
  return app.getPath('userData');
}

module.exports = {
  initGameIntegration,
  saveGameState,
  loadGameState,
  saveSettings,
  loadSettings
};