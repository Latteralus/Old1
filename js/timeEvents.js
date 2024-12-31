// /js/timeEvents.js
window.timeEvents = {

    // ---------------------------------------------------------
    // Called at 22:00 in main.js, or whenever a day ends
    // ---------------------------------------------------------
    endOfDay: function(gameState) {
        console.log("[timeEvents] endOfDay triggered. Current dayIndex:", gameState.dayIndex);

        // End-of-day finance operations
        window.finances.applyDailyCosts();

        // Show the daily summary, then wait for the user to start next day
        window.showDailySummaryModal(() => {
            console.log("[timeEvents] Daily summary closed. Skipping to next day...");
            this.skipToNextDay(gameState);
        });
    },

    // ---------------------------------------------------------
    // Starts the next day at 07:00
    // ---------------------------------------------------------
    skipToNextDay: function(gameState) {
        console.log("[timeEvents] skipToNextDay() called. DayIndex was:", gameState.dayIndex);

        // Move to next day
        const day = gameState.currentDate.getDate();
        gameState.currentDate.setDate(day + 1);
        gameState.currentDate.setHours(7, 0, 0, 0);
        gameState.dayIndex++;
        gameState.isDayActive = true;

        // Reset some daily counters
        window.financesData.dailyIncome = 0;
        window.financesData.pendingOrders = 0;
        window.financesData.completedOrders = 0;

        console.log("[timeEvents] Next day started. DayIndex is now:", gameState.dayIndex, 
                    "Current time:", gameState.currentDate.toString());

        // Update the UI to reflect the new day
        window.updateUI("finances");
        window.updateUI("time");
    },

    // ---------------------------------------------------------
    // Called each in-game minute from main.js
    // ---------------------------------------------------------
    minuteCheck: function(gameState) {
        console.log("[timeEvents] minuteCheck called at:", 
                    gameState.currentDate.getHours() + ":" + gameState.currentDate.getMinutes(),
                    "Day active?", gameState.isDayActive);

        // Update tasks
        console.log("[timeEvents] Updating tasks (taskManager.updateTasks)...");
        window.taskManager.updateTasks(1);

        // Auto-assign tasks
        console.log("[timeEvents] Auto-assigning tasks...");
        window.taskAssignment.autoAssignTasks();

        // If it's exactly XX:00, run hourly check
        if (gameState.currentDate.getMinutes() === 0) {
            const hour = gameState.currentDate.getHours();
            this.hourlyCheck(gameState, hour);
        }
    },

    // ---------------------------------------------------------
    // Called each in-game hour (from minuteCheck if minutes=0)
    // ---------------------------------------------------------
    hourlyCheck: function(gameState, hour) {
        console.log("[timeEvents] hourlyCheck at hour:", hour);
        this.spawnCustomersForHour(hour);
        this.autoOrderCheck();
    },

    // ---------------------------------------------------------
    // Basic spawn logic for new customers each hour
    // ---------------------------------------------------------
    spawnCustomersForHour: function(hour) {
        console.log("[timeEvents] Spawning customers for hour:", hour);
        let count = window.brandReputation.calcCustomers(hour);
        // Add a small random variation
        count += Math.floor(Math.random() * 2);

        for (let i = 0; i < count; i++) {
            // If you want to pass the hour to generateCustomer, do so:
            // window.customers.generateCustomer(hour);
            // or just call it with no arg
            window.customers.generateCustomer();
        }
    },

    // ---------------------------------------------------------
    // Start the day
    // ---------------------------------------------------------
    startOfDay: function(gameState) {
        console.log("[timeEvents] startOfDay called. Setting isDayActive = true.");
        gameState.isDayActive = true;
        // Add any start-of-day logic (restocking, daily reminders, etc)
    },

    // ---------------------------------------------------------
    // Check if we need to auto-order materials
    // ---------------------------------------------------------
    autoOrderCheck: function() {
        console.log("[timeEvents] autoOrderCheck called.");
        window.materialsData.forEach(mat => {
            // If auto-order is configured
            if (typeof mat.autoOrderThreshold === 'number' && typeof mat.autoOrderAmount === 'number') {
                if (mat.inventory < mat.autoOrderThreshold) {
                    const cost = window.calculateMaterialCost(mat.id, mat.autoOrderAmount);
                    if (window.financesData.cash >= cost) {
                        // Subtract cost & add to inventory
                        window.financesData.cash -= cost;
                        mat.inventory += mat.autoOrderAmount;
                        console.log(`[Auto-Order] Purchased ${mat.autoOrderAmount} of "${mat.name}" for $${cost.toFixed(2)}. Remaining cash: $${window.financesData.cash.toFixed(2)}`);
                        // Deduct from dailyIncome
                        window.financesData.dailyIncome -= cost;
                        window.updateUI("finances");
                    } else {
                        console.warn(`[Auto-Order] Not enough cash to auto-order "${mat.name}".`);
                    }
                }
            }
        });
    }
};
