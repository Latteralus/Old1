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

  const usernameDisplay = document.createElement('span');
  usernameDisplay.id = 'usernameDisplay';
  usernameDisplay.className = 'summary-item';
  usernameDisplay.textContent = window.username || 'Loading username...';

  leftSection.appendChild(titleElem);
  leftSection.appendChild(usernameDisplay);

  // Right side
  const rightSection = document.createElement('div');
  rightSection.className = 'top-bar-right';

  const financialSummary = document.createElement('div');
  financialSummary.className = 'financial-summary';

  const currentCash = document.createElement('span');
  currentCash.id = 'currentCash';
  currentCash.className = 'summary-item';
  currentCash.textContent = `Cash: $${window.financesData.cash.toFixed(2)}`;

  const dailyIncome = document.createElement('span');
  dailyIncome.id = 'dailyIncome';
  dailyIncome.className = 'summary-item';
  dailyIncome.textContent = `Income (Today): $${window.financesData.dailyIncome.toFixed(2)}`;

  const pendingInsurance = document.createElement('span');
  pendingInsurance.id = 'pendingInsurance';
  pendingInsurance.className = 'summary-item';
  pendingInsurance.textContent = `Pending Insurance: $${window.financesData.pendingInsuranceIncome.toFixed(2)}`;

  financialSummary.appendChild(currentCash);
  financialSummary.appendChild(dailyIncome);
  financialSummary.appendChild(pendingInsurance);

  const gameTime = document.createElement('span');
  gameTime.id = 'gameTime';
  gameTime.className = 'game-time';
  gameTime.textContent = window.ui.formatDateTime(window.gameState.currentDate);

  rightSection.appendChild(financialSummary);
  rightSection.appendChild(gameTime);

  topBarContent.appendChild(leftSection);
  topBarContent.appendChild(rightSection);

  topBar.appendChild(topBarContent);

  return topBar;
};
