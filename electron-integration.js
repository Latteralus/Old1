// js/electron-integration.js

// Initialize electron integration
(function() {
    // Check if we're running in Electron
    const isElectron = window.gameAPI !== undefined;
    
    if (!isElectron) {
      console.log('Not running in Electron environment');
      return;
    }
    
    console.log('Initializing Electron integration for The Pharmacy Sim');
    
    // Override window.fs with Electron's fs
    if (!window.fs) {
      window.fs = {};
    }
    
    // Keep the original window.fs.readFile if it exists, otherwise use the Electron version
    const originalReadFile = window.fs.readFile;
    window.fs.readFile = async function(filepath, options) {
      try {
        if (originalReadFile) {
          return await originalReadFile(filepath, options);
        } else {
          return await window.gameAPI.readFile(filepath, options);
        }
      } catch (error) {
        console.error(`Error reading file ${filepath}:`, error);
        throw error;
      }
    };
    
    // Initialize save/load functionality
    initSaveLoadSystem();
    
    // Listen for update events from Electron
    window.electronAPI.onUpdateAvailable((info) => {
      console.log('Update available:', info);
      // Show update notification to user
      if (window.dialog && window.dialog.showMessageBox) {
        window.dialog.showMessageBox({
          type: 'info',
          title: 'Update Available',
          message: `A new version (${info.version}) is available. Downloading now...`
        });
      }
    });
    
    window.electronAPI.onUpdateDownloaded(() => {
      console.log('Update downloaded');
      // Prompt user to restart and install
      if (window.dialog && window.dialog.showMessageBox) {
        window.dialog.showMessageBox({
          type: 'info',
          title: 'Update Ready',
          message: 'The update has been downloaded. Restart the application to apply the update.',
          buttons: ['Restart Now', 'Later'],
        }).then((result) => {
          if (result.response === 0) {
            window.electronAPI.quitAndInstall();
          }
        });
      }
    });
    
    // Initialize save/load system
    function initSaveLoadSystem() {
      // Add save game function
      window.saveGame = async function() {
        try {
          // Get the current game state
          const gameData = {
            gameState: window.gameState,
            financesData: window.financesData,
            employeesData: window.employeesData,
            productsData: window.productsData,
            materialsData: window.materialsData,
            equipmentData: window.equipmentData,
            brandReputation: window.brandReputation,
            timestamp: Date.now()
          };
          
          const result = await window.gameAPI.saveGame(gameData);
          
          if (result.success) {
            console.log('Game saved successfully');
            
            // Show notification to user
            if (window.notifications) {
              window.notifications.add('Game saved successfully', 'success');
            }
          }
        } catch (error) {
          console.error('Error saving game:', error);
          
          // Show error to user
          if (window.notifications) {
            window.notifications.add('Error saving game', 'error');
          }
        }
      };
      
      // Add load game function
      window.loadGame = async function() {
        try {
          const gameData = await window.gameAPI.loadGame();
          
          if (gameData) {
            // Restore game state
            window.gameState = gameData.gameState;
            window.financesData = gameData.financesData;
            window.employeesData = gameData.employeesData;
            window.productsData = gameData.productsData;
            window.materialsData = gameData.materialsData;
            window.equipmentData = gameData.equipmentData;
            window.brandReputation = gameData.brandReputation;
            
            console.log('Game loaded successfully');
            
            // Update UI
            window.updateUI('finances');
            window.updateUI('operations');
            window.updateUI('time');
            
            // Show notification to user
            if (window.notifications) {
              window.notifications.add('Game loaded successfully', 'success');
            }
            
            // Restart game systems
            if (window.timeEvents && window.timeEvents.startOfDay) {
              window.timeEvents.startOfDay(window.gameState);
            }
          } else {
            console.log('No saved game found');
            
            // Show notification to user
            if (window.notifications) {
              window.notifications.add('No saved game found', 'info');
            }
          }
        } catch (error) {
          console.error('Error loading game:', error);
          
          // Show error to user
          if (window.notifications) {
            window.notifications.add('Error loading game', 'error');
          }
        }
      };
      
      // Add auto-save feature
      let autoSaveInterval = null;
      
      function startAutoSave(interval = 5) {
        // Clear existing interval if any
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
        }
        
        // Start new auto-save interval (in minutes)
        autoSaveInterval = setInterval(window.saveGame, interval * 60 * 1000);
        console.log(`Auto-save enabled (every ${interval} minutes)`);
      }
      
      function stopAutoSave() {
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
          autoSaveInterval = null;
          console.log('Auto-save disabled');
        }
      }
      
      // Expose auto-save controls
      window.autoSave = {
        start: startAutoSave,
        stop: stopAutoSave
      };
      
      // Start auto-save by default
      startAutoSave();
      
      // Add keyboard shortcuts
      document.addEventListener('keydown', (event) => {
        // Ctrl+S for save
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault();
          window.saveGame();
        }
        
        // Ctrl+L for load
        if (event.ctrlKey && event.key === 'l') {
          event.preventDefault();
          window.loadGame();
        }
      });
    }
  })();