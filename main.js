// /js/main.js

window.gameState = {
  currentDate: new Date(2024, 0, 1, 7, 0), // Start date: 01/01/2024 07:00
  timeMultiplier: 12, // 12x real-time
};

window.financesData = {
  cash: 50000.0, // Starting cash
  incomeToday: 0.0, // Income for today
};

window.orderData = {
  pending: 0,
  completed: 0,
};

window.formatDateTime = function (date) {
  const options = { month: "2-digit", day: "2-digit", year: "numeric" };
  const time = date.toTimeString().split(" ")[0].slice(0, 5); // HH:MM format
  return `[${date.toLocaleDateString("en-US", options)}] [${time}]`;
};

// Game Loop
window.startGameLoop = function () {
  setInterval(() => {
    // Update game time
    window.gameState.currentDate = new Date(
      window.gameState.currentDate.getTime() + 1000 * window.gameState.timeMultiplier
    );

    // Update the displayed time
    const gameTimeEl = document.getElementById("gameTime");
    if (gameTimeEl) {
      gameTimeEl.textContent = window.formatDateTime(window.gameState.currentDate);
    }

    // Update financials
    const cashBalanceEl = document.getElementById("cashBalance");
    if (cashBalanceEl) {
      cashBalanceEl.textContent = `$${window.financesData.cash.toFixed(2)}`;
    }

    const incomeEl = document.getElementById("incomeToday");
    if (incomeEl) {
      incomeEl.textContent = `Income (Today): $${window.financesData.incomeToday.toFixed(2)}`;
    }

    // Update order counts
    const pendingOrdersEl = document.getElementById("pendingOrders");
    if (pendingOrdersEl) {
      pendingOrdersEl.textContent = `Pending Orders: ${window.orderData.pending}`;
    }

    const completedOrdersEl = document.getElementById("completedOrders");
    if (completedOrdersEl) {
      completedOrdersEl.textContent = `Completed Orders: ${window.orderData.completed}`;
    }

    // End of Day Check
    if (window.gameState.currentDate.getHours() === 22 && window.gameState.currentDate.getMinutes() === 0) {
      window.endOfDaySummary();
    }
  }, 1000);
};

// End of Day Summary
window.endOfDaySummary = function () {
  clearInterval(window.gameLoop); // Pause the game loop

  // Show end-of-day summary (popup/modal)
  alert(`End of Day Summary:\nIncome Today: $${window.financesData.incomeToday.toFixed(
    2
  )}\nPending Orders: ${window.orderData.pending}\nCompleted Orders: ${window.orderData.completed}`);

  // Reset daily values
  window.financesData.incomeToday = 0;

  // Reset the time for the next day
  window.gameState.currentDate.setDate(window.gameState.currentDate.getDate() + 1);
  window.gameState.currentDate.setHours(7, 0, 0);

  // Resume the game loop
  window.startGameLoop();
};

// Initialize the game loop
document.addEventListener("DOMContentLoaded", () => {
  window.startGameLoop();
});
