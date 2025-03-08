// gameInitializer.js - Handles the initialization of a new game or loading a saved game

window.initializeNewGame = function(gameOptions) {
    console.log("[gameInitializer] Starting new game initialization with options:", gameOptions);
    
    try {
        // Set the desired starting date and time (year, month (0-indexed), day, hour, minute)
        const startDate = new Date(2023, 0, 1, 7, 0); // January 1st, 2023, 7:00 AM
        
        // 1. Initialize game state
        window.gameState = {
            currentDate: new Date(startDate.getTime()),
            dayIndex: 0, // Start at day 0
            isDayActive: false, // Initially set to false
            isPaused: false, // Whether game simulation is paused
            simulationAccumulator: 0, // Accumulator for simulation time
            lastFrameTime: 0, // Last frame timestamp for delta calculation
            lastSimulationTime: 0, // Last time the simulation state was updated
            renderInfo: {
                fps: 0,
                frameCount: 0,
                lastFpsUpdate: 0
            },
            // Game customization options from the new game form
            pharmacyName: gameOptions.pharmacyName || "Your Pharmacy",
            difficulty: gameOptions.difficulty || "normal",
            location: gameOptions.location || "suburban",
            dateCreated: new Date()
        };
        
        console.log("[gameInitializer] Game state initialized");
        
        // 2. Initialize finances based on difficulty and starting capital
        let startingCash = 100000; // Default (medium)
        
        if (gameOptions.startingCapital === "low") {
            startingCash = 50000;
        } else if (gameOptions.startingCapital === "high") {
            startingCash = 200000;
        }
        
        // Apply difficulty modifier to starting cash
        if (gameOptions.difficulty === "hard") {
            startingCash *= 0.7; // 30% less starting cash on hard
        } else if (gameOptions.difficulty === "easy") {
            startingCash *= 1.3; // 30% more starting cash on easy
        }
        
        window.financesData = {
            cash: startingCash,
            dailyIncome: 0,
            pendingInsuranceIncome: 0,
            pendingOrders: 0,
            completedOrders: 0,
            overhead: 500, // Base daily overhead (rent, utilities)
            transactions: [], // Transaction history
            revenue: {
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                lastMonth: 0,
                total: 0
            },
            expenses: {
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                lastMonth: 0,
                total: 0
            },
            profit: {
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                lastMonth: 0,
                total: 0
            },
            insuranceReimbursements: {
                pending: 0,
                received: 0,
                rejected: 0
            },
            expenseCategories: {
                wages: 0,
                materials: 0,
                overhead: 0,
                equipment: 0,
                research: 0,
                other: 0
            },
            revenueCategories: {
                prescriptions: 0,
                copays: 0,
                insurance: 0,
                other: 0
            },
            targetDailyRevenue: 1000, // Default target
            targetMonthlyRevenue: 30000 // Default target
        };
        
        console.log("[gameInitializer] Finances initialized with $" + startingCash.toFixed(2));
        
        // 3. Modify difficulty-based settings
        if (gameOptions.difficulty === "easy") {
            window.brandReputation.reputationScore = 15; // Higher starting reputation
            window.brandReputation.brandScore = 15;
            window.financesData.overhead = 400; // Lower overhead costs
        } else if (gameOptions.difficulty === "hard") {
            window.brandReputation.reputationScore = 5; // Lower starting reputation
            window.brandReputation.brandScore = 5;
            window.financesData.overhead = 650; // Higher overhead costs
        }
        
        // 4. Location-based adjustments
        if (gameOptions.location === "urban") {
            // Urban centers have more customers but higher costs
            window.financesData.overhead *= 1.3; // 30% higher rent in urban areas
            // More frequent customers will be handled in brandReputation
        } else if (gameOptions.location === "rural") {
            // Rural areas have fewer customers but lower costs
            window.financesData.overhead *= 0.7; // 30% lower rent in rural areas
            // Fewer customers will be handled in brandReputation
        }
        
        // 5. Make sure game element modules are properly initialized
        ensureGameSystemsInitialized();
        
        console.log("[gameInitializer] Game initialization complete");
        return true;
    } catch (error) {
        console.error("[gameInitializer] Error initializing game:", error);
        return false;
    }
};

window.loadSavedGame = async function() {
    console.log("[gameInitializer] Loading saved game");
    
    try {
        // Load the game data using the Electron gameAPI
        if (window.gameAPI && window.gameAPI.loadGame) {
            const gameData = await window.gameAPI.loadGame();
            
            if (gameData) {
                // Restore the game state from the saved data
                window.gameState = gameData.gameState;
                window.financesData = gameData.financesData;
                window.employeesData = gameData.employeesData;
                window.productsData = gameData.productsData;
                window.materialsData = gameData.materialsData;
                window.equipmentData = gameData.equipmentData;
                window.brandReputation = gameData.brandReputation;
                
                console.log("[gameInitializer] Game data loaded successfully");
                
                // Ensure game systems are initialized
                ensureGameSystemsInitialized();
                
                return true;
            } else {
                console.error("[gameInitializer] No saved game data found");
                return false;
            }
        } else {
            console.error("[gameInitializer] gameAPI not available for loading");
            return false;
        }
    } catch (error) {
        console.error("[gameInitializer] Error loading saved game:", error);
        return false;
    }
};

// This function ensures all game systems are properly initialized
function ensureGameSystemsInitialized() {
    console.log("[gameInitializer] Ensuring game systems are initialized");
    
    // Make sure UI is initialized
    if (window.ui && window.ui.init) {
        window.ui.init();
        console.log("[gameInitializer] UI system initialized");
    } else {
        console.warn("[gameInitializer] UI system not available for initialization");
    }
    
    // Set suggested prices for products
    if (window.finances && window.finances.setToSuggestedPrices) {
        window.finances.setToSuggestedPrices();
        console.log("[gameInitializer] Product prices initialized");
    }
    
    // Initialize insurance claims system
    if (window.insuranceClaims && window.insuranceClaims.init) {
        window.insuranceClaims.init();
        console.log("[gameInitializer] Insurance claims system initialized");
    }
    
    // Initialize production system
    if (window.production && window.production.init) {
        window.production.init();
        console.log("[gameInitializer] Production system initialized");
    }
    
    // Auto-assign tasks if any are pending
    if (window.taskAssignment && window.taskAssignment.autoAssignTasks) {
        window.taskAssignment.autoAssignTasks();
        console.log("[gameInitializer] Initial task assignment completed");
    }
}

// Detect game startup mode and initialize accordingly
window.addEventListener('DOMContentLoaded', function() {
    console.log("[gameInitializer] DOM loaded, checking startup mode");
    
    // Parse URL parameters to determine if we're starting a new game or loading
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'new') {
        console.log("[gameInitializer] Starting in 'new game' mode");
        
        // Try to get the game options that were saved when starting a new game
        if (window.gameAPI && window.gameAPI.getNewGameOptions) {
            window.gameAPI.getNewGameOptions()
                .then(options => {
                    if (options) {
                        console.log("[gameInitializer] Got new game options:", options);
                        if (window.initializeNewGame(options)) {
                            startGame();
                        } else {
                            showErrorScreen("Failed to initialize new game");
                        }
                    } else {
                        console.error("[gameInitializer] No game options found");
                        showErrorScreen("No game options found for new game");
                    }
                })
                .catch(error => {
                    console.error("[gameInitializer] Error getting new game options:", error);
                    showErrorScreen("Error starting new game: " + error.message);
                });
        } else {
            // Fallback if gameAPI is not available
            console.log("[gameInitializer] gameAPI not available, using default options");
            const defaultOptions = {
                pharmacyName: "Your Pharmacy",
                difficulty: "normal",
                startingCapital: "medium",
                location: "suburban"
            };
            if (window.initializeNewGame(defaultOptions)) {
                startGame();
            } else {
                showErrorScreen("Failed to initialize new game with default options");
            }
        }
    } else if (mode === 'load') {
        console.log("[gameInitializer] Starting in 'load game' mode");
        
        // Load saved game
        window.loadSavedGame()
            .then(success => {
                if (success) {
                    startGame();
                } else {
                    showErrorScreen("Failed to load saved game");
                }
            })
            .catch(error => {
                console.error("[gameInitializer] Error loading saved game:", error);
                showErrorScreen("Error loading saved game: " + error.message);
            });
    } else {
        console.warn("[gameInitializer] No mode specified, defaulting to new game");
        // Default to new game with default options
        const defaultOptions = {
            pharmacyName: "Your Pharmacy",
            difficulty: "normal",
            startingCapital: "medium",
            location: "suburban"
        };
        if (window.initializeNewGame(defaultOptions)) {
            startGame();
        } else {
            showErrorScreen("Failed to initialize game (no mode specified)");
        }
    }
});

// Start the game simulation
function startGame() {
    console.log("[gameInitializer] Starting game simulation");
    
    try {
        // Initialize the UI components
        if (window.renderTopBar && window.renderSidebar) {
            const topBar = window.renderTopBar();
            document.getElementById('root').appendChild(topBar);
            
            const sidebar = window.renderSidebar();
            document.getElementById('root').appendChild(sidebar);
            
            console.log("[gameInitializer] Top bar and sidebar rendered");
        }
        
        // Show the default page (operations)
        if (window.showPage) {
            window.showPage('operations');
            window.updateActiveNavItem('operations');
            console.log("[gameInitializer] Default page (operations) displayed");
        }
        
        // Start the day
        window.gameState.isDayActive = true;
        
        // Start the game loop
        if (typeof requestAnimationFrame === 'function' && window.gameLoop) {
            requestAnimationFrame(window.gameLoop);
            console.log("[gameInitializer] Game loop started");
        } else {
            console.error("[gameInitializer] Game loop function not found");
        }
        
        console.log("[gameInitializer] Game started successfully");
    } catch (error) {
        console.error("[gameInitializer] Error starting game:", error);
        showErrorScreen("Error starting game: " + error.message);
    }
}

// Show an error screen when initialization fails
function showErrorScreen(message) {
    console.error("[gameInitializer] Showing error screen:", message);
    
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `
            <div style="padding: 20px; color: white; text-align: center; background-color: #1a237e; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h2>Error Starting Game</h2>
                <p>${message}</p>
                <p>Please check the console for more details or try restarting the application.</p>
                <button style="margin-top: 20px; padding: 10px 20px; background-color: #ffffff; color: #1a237e; border: none; border-radius: 4px; cursor: pointer;" onclick="window.location.href='index.html'">Return to Main Menu</button>
            </div>
        `;
    }
}