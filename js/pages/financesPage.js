// /js/pages/financesPage.js

window.renderFinancesPage = function(mainContent) {
  mainContent.innerHTML = ''; 

  const container = document.createElement('div');
  container.className = 'finances-page-container';

  const title = document.createElement('h2');
  title.textContent = 'Financial Summary';
  container.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Overview of your pharmacy\'s financial status.';
  container.appendChild(subtitle);

  const financesData = window.financesData;

  // Cash Balance
  const cashBalanceDiv = document.createElement('div');
  cashBalanceDiv.className = 'finance-item';
  cashBalanceDiv.innerHTML = `<strong>Cash Balance:</strong> $${financesData.cash.toFixed(2)}`;
  container.appendChild(cashBalanceDiv);

  // Daily Income
  const dailyIncomeDiv = document.createElement('div');
  dailyIncomeDiv.className = 'finance-item';
  dailyIncomeDiv.innerHTML = `<strong>Daily Income:</strong> $${financesData.dailyIncome.toFixed(2)}`;
  container.appendChild(dailyIncomeDiv);

  // Pending Insurance Income
  const pendingInsuranceDiv = document.createElement('div');
  pendingInsuranceDiv.className = 'finance-item';
  pendingInsuranceDiv.innerHTML = `<strong>Pending Insurance Income:</strong> $${financesData.pendingInsuranceIncome.toFixed(2)}`;
  container.appendChild(pendingInsuranceDiv);

  // Completed Orders
  const completedOrdersDiv = document.createElement('div');
  completedOrdersDiv.className = 'finance-item';
  completedOrdersDiv.innerHTML = `<strong>Completed Orders:</strong> ${financesData.completedOrders}`;
  container.appendChild(completedOrdersDiv);

  // Overhead Costs
  const overheadCostsDiv = document.createElement('div');
  overheadCostsDiv.className = 'finance-item';
  overheadCostsDiv.innerHTML = `<strong>Overhead Costs:</strong> $${financesData.overhead.toFixed(2)}`;
  container.appendChild(overheadCostsDiv);

  // You can add more financial details here as needed

  mainContent.appendChild(container);

  // Optional: Add styling in a separate CSS file or within a <style> tag
  const style = document.createElement('style');
  style.textContent = `
      .finances-page-container {
          padding: 20px;
          font-family: Arial, sans-serif;
      }
      .finance-item {
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
      }
  `;
  mainContent.appendChild(style);
};