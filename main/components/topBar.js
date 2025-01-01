// /components/topBar.js

window.renderTopBar = function renderTopBar() {
    const topBar = document.createElement('header');
    topBar.className = 'top-bar';
  
    const topBarContent = document.createElement('div');
    topBarContent.className = 'top-bar-content';
  
    // Left side
    const leftSection = document.createElement('div');
    leftSection.className = 'top-bar-left';
  
    const titleElem = document.createElement('h1');
    titleElem.className = 'game-title';
    titleElem.textContent = 'PharmaSim';
  
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'financial-summary';
  
    const currentCash = document.createElement('span');
    currentCash.id = 'currentCash';
    currentCash.className = 'summary-item';
    // Use financesData to get the value
    currentCash.textContent = `Cash: $${window.financesData.cash.toFixed(2)}`;
  
    const dailyIncome = document.createElement('span');
    dailyIncome.id = 'dailyIncome';
    dailyIncome.className = 'summary-item';
    // Use financesData to get the value
    dailyIncome.textContent = `Income (Today): $${window.financesData.dailyIncome.toFixed(2)}`;
  
    const pendingInsurance = document.createElement('span');
    pendingInsurance.id = 'pendingInsurance';
    pendingInsurance.className = 'summary-item';
    // Use financesData to get the value
    pendingInsurance.textContent = `Pending Insurance: $${window.financesData.pendingInsuranceIncome.toFixed(2)}`;
  
    const ordersPending = document.createElement('span');
    ordersPending.id = 'ordersPending';
    ordersPending.className = 'summary-item';
    // Use financesData to get the value
    ordersPending.textContent = `Pending Orders: ${window.financesData.pendingOrders}`;
  
    const ordersCompleted = document.createElement('span');
    ordersCompleted.id = 'ordersCompleted';
    ordersCompleted.className = 'summary-item';
    // Use financesData to get the value
    ordersCompleted.textContent = `Completed Orders: ${window.financesData.completedOrders}`;
  
    summaryContainer.appendChild(currentCash);
    summaryContainer.appendChild(dailyIncome);
    summaryContainer.appendChild(pendingInsurance);
    summaryContainer.appendChild(ordersPending);
    summaryContainer.appendChild(ordersCompleted);
  
    leftSection.appendChild(titleElem);
    leftSection.appendChild(summaryContainer);
  
    // Right side
    const rightSection = document.createElement('div');
    rightSection.className = 'top-bar-right';
  
    const gameTime = document.createElement('span');
    gameTime.id = 'gameTime';
    gameTime.className = 'game-time';
    // Use the correct function name: window.ui.formatDateTime()
    gameTime.textContent = window.ui.formatDateTime(window.gameState.currentDate);
  
    rightSection.appendChild(gameTime);
  
    topBarContent.appendChild(leftSection);
    topBarContent.appendChild(rightSection);
  
    topBar.appendChild(topBarContent);
  
    return topBar;
  };