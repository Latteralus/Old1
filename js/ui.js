function updateFinancialSummary(financeObj) {
  if (!financeObj) return;
  const cashEl = document.getElementById('currentCash');
  const incomeEl = document.getElementById('dailyIncome');
  const pendingEl = document.getElementById('ordersPending');
  const completedEl = document.getElementById('ordersCompleted');

  if (cashEl) {
    cashEl.textContent = `Cash: $${financeObj.cash.toFixed(2)}`;
  }
  if (incomeEl) {
    incomeEl.textContent = `Income (Today): $${financeObj.dailyIncome.toFixed(2)}`;
  }
  if (pendingEl) {
    pendingEl.textContent = `Pending Orders: ${financeObj.pendingOrders}`;
  }
  if (completedEl) {
    completedEl.textContent = `Completed Orders: ${financeObj.completedOrders}`;
  }
}

/** Format date/time as [MM/DD/YYYY] [HH:MM] */
function formatDateTime(dateObj) {
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `[${mm}/${dd}/${yyyy}] [${hours}:${minutes}]`;
}

function updateGameTime(dateObj) {
  const timeEl = document.getElementById('gameTime');
  if (timeEl) {
    timeEl.textContent = formatDateTime(dateObj);
  }
}

// Simple "router" to show pages:
window.showPage = function(pageName) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;

  switch(pageName) {
    case 'dashboard':
      window.renderDashboardPage(mainContent);
      break;
    case 'orders':
      window.renderOrdersPage(mainContent);
      break;
    case 'inventory':
      window.renderInventoryPage(mainContent);
      break;
    case 'finances':
      window.renderFinancesPage(mainContent);
      break;
    case 'employees':
      window.renderEmployeesPage(mainContent);
      break;
    case 'marketplace':
      window.renderMarketplacePage(mainContent);
      break;
    case 'customers':
      window.renderCustomersPage(mainContent);
      break;
    case 'marketing':
      window.renderMarketingPage(mainContent);
      break;
    case 'research':
      window.renderResearchPage(mainContent);
      break;
    case 'statistics':
      window.renderStatisticsPage(mainContent);
      break;
    case 'operations':
      window.renderOperationsPage(mainContent);
      break;
    default:
      mainContent.innerHTML = '<h2>Page not found</h2>';
  }
};

// Attach to window
window.updateFinancialSummary = updateFinancialSummary;
window.updateGameTime = updateGameTime;
window.formatDateTime = formatDateTime;
