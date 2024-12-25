// /js/topbar.js

window.renderTopbar = function () {
  const topbar = document.createElement("header");
  topbar.className = "topbar";

  // Game Time Display
  const gameTimeEl = document.createElement("span");
  gameTimeEl.id = "gameTime";
  gameTimeEl.textContent = window.formatDateTime(window.gameState.currentDate);
  topbar.appendChild(gameTimeEl);

  // Cash Balance Display
  const cashBalanceEl = document.createElement("span");
  cashBalanceEl.id = "cashBalance";
  cashBalanceEl.textContent = `$${window.financesData.cash.toFixed(2)}`;
  topbar.appendChild(cashBalanceEl);

  // Income Display
  const incomeEl = document.createElement("span");
  incomeEl.id = "incomeToday";
  incomeEl.textContent = `Income (Today): $${window.financesData.incomeToday.toFixed(
    2
  )}`;
  topbar.appendChild(incomeEl);

  // Pending Orders Display
  const pendingOrdersEl = document.createElement("span");
  pendingOrdersEl.id = "pendingOrders";
  pendingOrdersEl.textContent = `Pending Orders: ${window.orderData.pending}`;
  topbar.appendChild(pendingOrdersEl);

  // Completed Orders Display
  const completedOrdersEl = document.createElement("span");
  completedOrdersEl.id = "completedOrders";
  completedOrdersEl.textContent = `Completed Orders: ${window.orderData.completed}`;
  topbar.appendChild(completedOrdersEl);

  // Append to the body
  document.body.prepend(topbar);
};

// Ensure this function runs after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.renderTopbar();
});
