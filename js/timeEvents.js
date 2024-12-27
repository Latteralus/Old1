// /js/timeEvents.js

window.timeEvents = {
  endOfDay: function(gameState) {
      // Run any logic that happens at end of day
      // e.g. increment day counter, reset daily stats
      gameState.dayIndex++;

      // Run start of day logic
      this.startOfDay(gameState);
  },

  startOfDay: function(gameState) {
      // Begin the day
      gameState.isDayActive = true;

      // Add any start-of-day logic (e.g. restock, etc)
  },

  minuteCheck: function(gameState) {
      // Run any logic that should be checked each in-game minute
      window.taskManager.updateTasks(1);
      window.taskAssignment.autoAssignTasks();

      if (gameState.currentDate.getMinutes() === 0) {
          const hour = gameState.currentDate.getHours();
          this.hourlyCheck(gameState, hour);
      }
  },

  hourlyCheck: function(gameState, hour) {
      this.spawnCustomersForHour(hour);  // existing logic
      this.autoOrderCheck();              // new function to check all materials
  },

  endOfDay: function(gameState) {
      window.finances.applyDailyCosts();
      window.showDailySummaryModal(() => {
          this.skipToNextDay(gameState);
      });
  },

  skipToNextDay: function(gameState) {
      const day = gameState.currentDate.getDate();
      gameState.currentDate.setDate(day + 1);
      gameState.currentDate.setHours(7, 0, 0, 0);
      gameState.dayIndex++;
      gameState.isDayActive = true;

      window.financesData.dailyIncome = 0;
      window.financesData.pendingOrders = 0;
      window.financesData.completedOrders = 0;

      window.updateUI("finances"); // Update the UI to reflect changes
      window.updateUI("time"); // Update the UI to reflect changes
  },

  // Example spawn logic (unchanged or truncated)
  spawnCustomersForHour: function(hour) {
      let count = window.brandReputation.calcCustomers(hour);
      count += Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
          window.customers.generateCustomer();
      }
  },

  // The new auto-order function
  autoOrderCheck: function() {
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

                      window.updateUI("finances"); // Update the UI to reflect changes
                  } else {
                      console.log(`[Auto-Order] Not enough cash to auto-order "${mat.name}".`);
                  }
              }
          }
      });
  }
};