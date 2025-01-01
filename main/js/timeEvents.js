// /js/timeEvents.js
window.timeEvents = {

        // ---------------------------------------------------------
        // Called at 22:00 in main.js, or whenever a day ends
        // ---------------------------------------------------------
        endOfDay: function(gameState) {
    
            // End-of-day finance operations
            window.finances.applyDailyCosts();
    
            // Show the daily summary, then wait for the user to start next day
            window.showDailySummaryModal(() => {
                this.skipToNextDay(gameState);
            });
        },
    
        // ---------------------------------------------------------
        // Starts the next day at 07:00
        // ---------------------------------------------------------
        skipToNextDay: function(gameState) {
    
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
    
            // Update the UI to reflect the new day
            window.updateUI("finances");
            window.updateUI("time");
        },
    
        // ---------------------------------------------------------
        // Called each in-game minute from main.js
        // ---------------------------------------------------------
        minuteCheck: function(gameState) {
    
            // Update tasks
            window.taskManager.updateTasks(1);
    
            // Auto-assign tasks
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
            this.spawnCustomersForHour(hour);
            this.autoOrderCheck();
        },
    
        // ---------------------------------------------------------
        // Basic spawn logic for new customers each hour
        // ---------------------------------------------------------
        spawnCustomersForHour: function(hour) {
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
            gameState.isDayActive = true;
            // Add any start-of-day logic (restocking, daily reminders, etc)
        },
    
        // ---------------------------------------------------------
        // Check if we need to auto-order materials
        // ---------------------------------------------------------
        autoOrderCheck: function() {
            window.materialsData.forEach(mat => {
                // If auto-order is configured
                if (typeof mat.autoOrderThreshold === 'number' && typeof mat.autoOrderAmount === 'number') {
                    if (mat.inventory < mat.autoOrderThreshold) {
                        const cost = window.calculateMaterialCost(mat.id, mat.autoOrderAmount);
                        if (window.financesData.cash >= cost) {
                            // Subtract cost & add to inventory
                            window.financesData.cash -= cost;
                            mat.inventory += mat.autoOrderAmount;
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