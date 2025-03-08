// /js/main.js - Optimized with advanced game loop

// Set the desired starting date and time (year, month (0-indexed), day, hour, minute)
const startDate = new Date(2000, 0, 1, 7, 0);

// Game configuration
const GAME_CONFIG = {
    SIMULATION_SPEED: 1.0, // Default game speed multiplier
    GAME_MINUTE_IN_MS: 1000, // 1 second real time = 1 minute game time
    FIXED_TIMESTEP: 1000 / 60, // 60 fps for logic updates
    MAX_UPDATES_PER_FRAME: 10, // Prevent spiral of death if browser freezes temporarily
    END_DAY_HOUR: 22 // 10 PM is end of day
};

// Initial game state
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
    }
};

// Performance monitoring
const PERFORMANCE = {
    frames: 0,
    lastFpsUpdateTime: 0,
    fps: 0
};

// Initialize the game
function initGame() {
    console.log("Initializing game systems");
    
    // Initialize production and core game systems
    window.production.init();
    
    // Initialize UI components
    initUI();
    
    // Set suggested prices for products
    window.finances.setToSuggestedPrices();
    
    // Start the game (set isDayActive to true)
    window.gameState.isDayActive = true;
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
    
    // Log initialization complete
    console.log("Game initialization complete");
}

// Initialize UI components
function initUI() {
    console.log("Initializing UI components");
    
    // Render the top bar and append it to the root element
    const topBar = window.renderTopBar();
    document.getElementById('root').appendChild(topBar);

    // Render the sidebar and append it to the root element
    const sidebar = window.renderSidebar();
    document.getElementById('root').appendChild(sidebar);

    // Set the default active menu item
    window.updateActiveNavItem('operations');
    
    // Show operations page by default
    window.showPage('operations');
}

// The main game loop using requestAnimationFrame
function gameLoop(timestamp) {
    // First frame won't have a previous timestamp
    if (!window.gameState.lastFrameTime) {
        window.gameState.lastFrameTime = timestamp;
        window.gameState.lastSimulationTime = timestamp;
        window.gameState.renderInfo.lastFpsUpdate = timestamp;
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Calculate delta time (time since last frame)
    const deltaTime = timestamp - window.gameState.lastFrameTime;
    window.gameState.lastFrameTime = timestamp;
    
    // Update FPS counter
    PERFORMANCE.frames++;
    if (timestamp - PERFORMANCE.lastFpsUpdateTime > 1000) {
        PERFORMANCE.fps = PERFORMANCE.frames;
        PERFORMANCE.frames = 0;
        PERFORMANCE.lastFpsUpdateTime = timestamp;
        
        // Optional: display FPS for debugging
        // console.log(`FPS: ${PERFORMANCE.fps}`);
    }
    
    // Only run simulation if game is active and not paused
    if (window.gameState.isDayActive && !window.gameState.isPaused) {
        // Run the simulation updates with fixed timestep for stability
        updateSimulation(timestamp);
    }
    
    // Always render the latest state, regardless of simulation updates
    renderUI();
    
    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Update game simulation with fixed timestep
function updateSimulation(timestamp) {
    // Calculate time since last simulation update
    const simulationDelta = timestamp - window.gameState.lastSimulationTime;
    window.gameState.simulationAccumulator += simulationDelta;
    window.gameState.lastSimulationTime = timestamp;
    
    // Limit updates to prevent spiral of death
    let updates = 0;
    
    // While we have accumulated enough time to process a fixed step
    while (window.gameState.simulationAccumulator >= GAME_CONFIG.FIXED_TIMESTEP && updates < GAME_CONFIG.MAX_UPDATES_PER_FRAME) {
        // Calculate the game time to advance (in milliseconds)
        const gameTimeDelta = (GAME_CONFIG.FIXED_TIMESTEP * GAME_CONFIG.SIMULATION_SPEED) / GAME_CONFIG.GAME_MINUTE_IN_MS * 60 * 1000;
        
        // Update the game time
        updateGameTime(gameTimeDelta);
        
        // Decrement the accumulator
        window.gameState.simulationAccumulator -= GAME_CONFIG.FIXED_TIMESTEP;
        updates++;
    }
}

// Update the game time
function updateGameTime(msElapsed) {
    // Advance the game time
    window.gameState.currentDate.setTime(window.gameState.currentDate.getTime() + msElapsed);
    
    // Check for end of day (22:00 is 10 PM)
    const currentHour = window.gameState.currentDate.getHours();
    const currentMinute = window.gameState.currentDate.getMinutes();
    
    if (currentHour === GAME_CONFIG.END_DAY_HOUR && currentMinute === 0) {
        // Trigger end of day only once
        if (window.gameState.isDayActive) {
            console.log("End of day reached");
            window.gameState.isDayActive = false; // Stop advancing time
            window.timeEvents.endOfDay(window.gameState);
        }
    } else {
        // Run minute checks at the appropriate frequency
        const minuteDelta = Math.floor(msElapsed / (60 * 1000)); // Convert ms to minutes
        
        if (minuteDelta > 0) {
            for (let i = 0; i < minuteDelta; i++) {
                window.timeEvents.minuteCheck(window.gameState);
            }
        }
    }
}

// Render the UI based on current game state
function renderUI() {
    // This function is called every frame and should update visual elements only
    // Don't modify game state here - only visualize current state
    
    // Update the time display
    window.ui.updateTime();
    
    // Update any dynamic UI elements that should animate smoothly
    // These should be minimal and focus on visual changes only
    
    // Update any progress bars
    if (window.updateTaskProgressBars) {
        window.updateTaskProgressBars();
    }
    
    // Update any countdown timers
    if (window.updateCountdownTimers) {
        window.updateCountdownTimers();
    }
}

// Add game speed controls
window.setGameSpeed = function(speedMultiplier) {
    GAME_CONFIG.SIMULATION_SPEED = speedMultiplier;
    console.log(`Game speed set to ${speedMultiplier}x`);
};

// Pause/resume game simulation
window.toggleGamePause = function() {
    window.gameState.isPaused = !window.gameState.isPaused;
    console.log(`Game ${window.gameState.isPaused ? 'paused' : 'resumed'}`);
    
    // Reset accumulators when resuming to prevent sudden jumps
    if (!window.gameState.isPaused) {
        window.gameState.lastFrameTime = performance.now();
        window.gameState.lastSimulationTime = performance.now();
        window.gameState.simulationAccumulator = 0;
    }
};

// Add this to your main.js file to implement the missing navigation system

// Define the showPage function (this is the missing function)
window.showPage = function(pageName) {
    console.log(`Navigating to page: ${pageName}`);
    
    // Update the active navigation item in the sidebar
    window.updateActiveNavItem(pageName);
    
    // Get the main content container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        return;
    }
    
    // Clear existing content
    mainContent.innerHTML = '';
    
    // Store current page name for reference
    window.currentPage = pageName;
    
    // Call the appropriate page renderer based on the page name
    const rendererName = `render${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page`;
    
    if (typeof window[rendererName] === 'function') {
        try {
            // Call the page renderer
            window[rendererName](mainContent);
            console.log(`Rendered page: ${pageName}`);
            
            // Dispatch custom event that page has changed (for components that need to react)
            const event = new CustomEvent('pageChanged', { 
                detail: { page: pageName } 
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error(`Error rendering page ${pageName}:`, error);
            mainContent.innerHTML = `<div class="error-message">
                <h3>Error Loading Page</h3>
                <p>There was an error loading the ${pageName} page.</p>
                <pre>${error.message}</pre>
            </div>`;
        }
    } else {
        console.error(`Page renderer not found: ${rendererName}`);
        mainContent.innerHTML = `<div class="error-message">
            <h3>Page Not Found</h3>
            <p>The requested page "${pageName}" does not exist or is still under development.</p>
        </div>`;
    }
};

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initGame);