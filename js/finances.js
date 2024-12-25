// Basic finances data for the game

window.financesData = {
    cash: 10000,         // starting cash
    dailyIncome: 0,
    pendingOrders: 0,
    completedOrders: 0,
    // Additional fields as needed (totalExpenses, netProfit, etc.)
  };
  
  // Optional helper functions
  window.addCash = function (amount) {
    window.financesData.cash += amount;
  };
  
  window.spendCash = function (amount) {
    window.financesData.cash -= amount;
  };
  