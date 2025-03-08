// /js/timeEvents.js - FIXED VERSION
window.timeEvents = {

    // ---------------------------------------------------------
    // Called at 22:00 in main.js, or whenever a day ends
    // ---------------------------------------------------------
    endOfDay: function(gameState) {
        console.log("[timeEvents] End of day triggered");

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
        console.log("[timeEvents] Starting new day");

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

        // Auto-assign any pending tasks
        window.taskAssignment.autoAssignTasks();

        // Update the UI to reflect the new day
        window.ui.updateTime();
        window.updateUI("finances");

        // Kick off auto-production checks
        window.production.checkAndCreateCompoundTasks();
    },

    // ---------------------------------------------------------
    // Called each in-game minute from main.js
    // ---------------------------------------------------------
    minuteCheck: function(gameState) {
        // Update tasks progress (1 minute)
        try {
            window.taskManager.updateTasks(1);
        } catch (error) {
            console.error("[timeEvents] Error in updateTasks:", error);
        }

        // If it's exactly XX:00, run hourly check
        if (gameState.currentDate.getMinutes() === 0) {
            const hour = gameState.currentDate.getHours();
            this.hourlyCheck(gameState, hour);
        }

        // Every 5 minutes, try to auto-assign tasks and check inventory
        if (gameState.currentDate.getMinutes() % 5 === 0) {
            try {
                window.taskAssignment.autoAssignTasks();
                window.production.checkAndCreateCompoundTasks();
            } catch (error) {
                console.error("[timeEvents] Error in 5-minute tasks:", error);
            }
        }

        // Update the UI if we're on operations page
        if (window.currentPage === 'operations' && gameState.currentDate.getMinutes() % 2 === 0) {
            try {
                const operationsContent = document.querySelector('.operations-page-container');
                if (operationsContent) {
                    // Instead of re-rendering the whole page, update specific elements
                    const employeesList = document.getElementById('employeesList');
                    const tasksList = document.getElementById('tasksList');
                    
                    if (typeof window.renderEmployees === 'function' && employeesList) {
                        window.renderEmployees();
                    }
                    
                    if (typeof window.renderTasks === 'function' && tasksList) {
                        window.renderTasks();
                    }
                }
            } catch (error) {
                console.error("[timeEvents] Error updating operations UI:", error);
            }
        }
    },

    // ---------------------------------------------------------
    // Called each in-game hour (from minuteCheck if minutes=0)
    // ---------------------------------------------------------
    hourlyCheck: function(gameState, hour) {
        console.log(`[timeEvents] Hourly check for hour ${hour}`);
        
        // Generate new customers based on the hour
        this.spawnCustomersForHour(hour);
        
        // Check for auto-ordering materials
        this.autoOrderCheck();
        
        // Every 3 hours, do inventory check and create production tasks
        if (hour % 3 === 0) {
            window.production.checkAndCreateCompoundTasks();
        }
    },

    // ---------------------------------------------------------
    // Basic spawn logic for new customers each hour
    // ---------------------------------------------------------
    spawnCustomersForHour: function(hour) {
        let count = window.brandReputation.calcCustomers(hour);
        // Add a small random variation
        count += Math.floor(Math.random() * 2);

        console.log(`[timeEvents] Spawning ${count} customers for hour ${hour}`);

        for (let i = 0; i < count; i++) {
            window.customers.generateCustomer();
        }
    },

    // ---------------------------------------------------------
    // Start the day
    // ---------------------------------------------------------
    startOfDay: function(gameState) {
        console.log("[timeEvents] Starting day");
        gameState.isDayActive = true;
        
        // Auto-assign tasks at the start of the day
        window.taskAssignment.autoAssignTasks();
        
        // Check inventory and create production tasks
        window.production.checkAndCreateCompoundTasks();
    },

    // ---------------------------------------------------------
    // Check if we need to auto-order materials
    // ---------------------------------------------------------
    autoOrderCheck: function() {
        console.log("[timeEvents] Running auto-order check");
        
        let totalOrderCost = 0;
        let ordersPlaced = 0;
        
        window.materialsData.forEach(mat => {
            // If auto-order is configured
            if (typeof mat.autoOrderThreshold === 'number' && 
                typeof mat.autoOrderAmount === 'number' && 
                mat.autoOrderThreshold > 0 && 
                mat.autoOrderAmount > 0) {
                
                if (mat.inventory < mat.autoOrderThreshold) {
                    const cost = window.calculateMaterialCost(mat.id, mat.autoOrderAmount);
                    
                    if (window.financesData.cash >= cost) {
                        // Subtract cost & add to inventory
                        window.financesData.cash -= cost;
                        mat.inventory += mat.autoOrderAmount;
                        totalOrderCost += cost;
                        ordersPlaced++;
                        
                        // Add a transaction record
                        window.finances.addTransaction({
                            date: new Date(window.gameState.currentDate),
                            type: 'expense',
                            category: 'auto-order',
                            amount: cost,
                            description: `Auto-ordered ${mat.autoOrderAmount} units of ${mat.name}`
                        });
                        
                        console.log(`[autoOrderCheck] Auto-ordered ${mat.autoOrderAmount} units of ${mat.name} for $${cost.toFixed(2)}`);
                    } else {
                        console.warn(`[autoOrderCheck] Not enough cash to auto-order ${mat.name}. Needed: $${cost.toFixed(2)}, Available: $${window.financesData.cash.toFixed(2)}`);
                    }
                }
            }
        });
        
        if (ordersPlaced > 0) {
            // Update UI to reflect changes
            window.financesData.dailyIncome -= totalOrderCost;
            window.updateUI("finances");
            
            if (window.currentPage === 'inventory' || window.currentPage === 'marketplace') {
                window.showPage(window.currentPage); // Refresh the current inventory-related page
            }
        }
    }
};