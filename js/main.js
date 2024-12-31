// /js/main.js
(function() {
    // Game state: 1 second = 1 minute in-game
    // Day runs from 7:00 to 22:00 (10 PM).
    // That’s 15 hours = 900 in-game minutes => 900 real seconds = 15 real minutes per day.

    // Make gameState global by attaching it to window
    window.gameState = {
        currentDate: new Date(2000, 0, 1, 7, 0), // Jan 1, 2000 at 07:00
        isDayActive: true,
        dayIndex: 0 // number of days since start
    };

    // Insert top bar & sidebar
    const root = document.getElementById('root');
    const topBar = window.renderTopBar();
    const sidebar = window.renderSidebar();
    root.appendChild(topBar);
    root.appendChild(sidebar);

    // Create main-content
    const mainContent = document.createElement('main');
    mainContent.className = 'main-content';
    root.appendChild(mainContent);

    // Start on "Operations" by default
    window.showPage('operations');

    // Set initial prices to suggested prices when the game starts
    window.finances.setToSuggestedPrices();

    // Set the default active page in the sidebar
    window.updateActiveNavItem('operations');

    // -----------------------------------------------------------
    // Each real second -> advance 1 in-game minute
    // -----------------------------------------------------------
    setInterval(() => {
        // If day is inactive (past 22:00 or paused), skip
        if (!window.gameState.isDayActive) {
            console.log("[main.js] Day is inactive; skipping minute increment.");
            return;
        }

        // Advance game time by 1 minute
        window.gameState.currentDate.setMinutes(window.gameState.currentDate.getMinutes() + 1);
        console.log("[main.js] Time advanced to:", window.gameState.currentDate.toString());

        // Check if we hit or passed 22:00
        if (window.gameState.currentDate.getHours() >= 22) {
            window.gameState.isDayActive = false;
            console.log("[main.js] It's 22:00 or later; day is paused.");
            // End-of-day logic
            window.timeEvents.endOfDay(window.gameState);
            return;
        }

        // Otherwise run minute-based logic
        window.timeEvents.minuteCheck(window.gameState);

        // Update top bar time & finances display
        window.updateUI("time");
        window.updateUI("finances");

    }, 1000);

})();
