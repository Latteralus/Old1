// /js/timeEvents.js

window.timeEvents = (function() {

  function minuteCheck(gameState) {
    // Existing calls
    window.taskManager.updateTasks(1, window.employeesData);
    window.taskManager.autoAssignTasks(window.employeesData);

    if (gameState.currentDate.getMinutes() === 0) {
      const hour = gameState.currentDate.getHours();
      hourlyCheck(gameState, hour);
    }
  }

  function hourlyCheck(gameState, hour) {
    spawnCustomersForHour(hour);  // existing logic
    autoOrderCheck();             // new function to check all materials
  }

  function endOfDay(gameState) {
    window.finances.applyDailyCosts();
    window.showDailySummaryModal(() => {
      skipToNextDay(gameState);
    });
  }

  function skipToNextDay(gameState) {
    const day = gameState.currentDate.getDate();
    gameState.currentDate.setDate(day + 1);
    gameState.currentDate.setHours(7, 0, 0, 0);
    gameState.dayIndex++;
    gameState.isDayActive = true;

    window.financesData.dailyIncome = 0;
    window.financesData.pendingOrders = 0;
    window.financesData.completedOrders = 0;
  }

  // Example spawn logic (unchanged or truncated)
  function spawnCustomersForHour(hour) {
    let count = window.brandReputation.calcCustomers(hour);
    count += Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      window.customers.spawnRandomCustomer();
    }
  }

  // -------------------------------------------------------------------------
  // The new auto-order function
  // -------------------------------------------------------------------------
  function autoOrderCheck() {
    window.materialsData.forEach(mat => {
      // If auto-order is set
      if (typeof mat.autoOrderThreshold === 'number' && typeof mat.autoOrderAmount === 'number') {
        if (mat.inventory < mat.autoOrderThreshold) {
          // Attempt to order mat.autoOrderAmount
          const cost = mat.cost * mat.autoOrderAmount;
          if (window.financesData.cash >= cost) {
            // Subtract cost
            window.financesData.cash -= cost;
            // Add to inventory
            mat.inventory += mat.autoOrderAmount;
            // Optionally add a log or alert
            console.log(
              `[Auto-Order] Purchased ${mat.autoOrderAmount} of "${mat.name}" for $${cost.toFixed(2)}. Cash left: $${window.financesData.cash.toFixed(2)}.`
            );
            // Optionally update dailyIncome or track these costs
            window.financesData.dailyIncome -= cost;
          } else {
            console.log(`[Auto-Order] Not enough cash to auto-order "${mat.name}".`);
          }
        }
      }
    });
  }

  return {
    minuteCheck,
    endOfDay
  };
})();
