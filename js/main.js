(function() {
  // Game state: 1 second = 1 minute in-game
  // Day runs from 7:00 to 22:00 (10 PM).
  // That’s 15 hours = 900 in-game minutes => 900 real seconds = 15 real minutes per day.

  const gameState = {
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

  // Start on "Operations" by default, or whichever page:
  window.showPage('operations');

  // TICK: Each real second -> advance 1 in-game minute
  setInterval(() => {
    if (!gameState.isDayActive) return; // paused after 10 PM

    gameState.currentDate.setMinutes(gameState.currentDate.getMinutes() + 1);

    // Check if we hit 22:00
    if (gameState.currentDate.getHours() >= 22) {
      gameState.isDayActive = false;
      // End-of-day logic
      window.timeEvents.endOfDay(gameState);
      return;
    }

    // Otherwise run minute-based logic
    window.timeEvents.minuteCheck(gameState);

    // Update top bar time
    window.updateGameTime(gameState.currentDate);

  }, 1000);

})();
