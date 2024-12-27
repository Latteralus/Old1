// ui.js

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
  const excisedYear = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `[${mm}/${dd}/${excisedYear}] [${hours}:${minutes}]`;
}

function updateGameTime(dateObj) {
  const timeEl = document.getElementById('gameTime');
  if (timeEl) {
      timeEl.textContent = formatDateTime(dateObj);
  }
}

// Updated window.updateUI function
window.updateUI = function (page = "") {
  if (page === "finances") {
      // Update cash display
      const cashEl = document.getElementById('currentCash');
      if (cashEl) {
          cashEl.textContent = `Cash: $${window.financesData.cash.toFixed(2)}`;
      }

      // Update daily income display
      const dailyIncomeEl = document.getElementById('dailyIncome');
      if (dailyIncomeEl) {
          dailyIncomeEl.textContent = `Daily Income: $${window.financesData.dailyIncome.toFixed(2)}`;
      }

      // Update pending insurance income display
      const pendingInsuranceEl = document.getElementById('pendingInsurance');
      if (pendingInsuranceEl) {
          pendingInsuranceEl.textContent = `Pending Insurance: $${window.financesData.pendingInsuranceIncome.toFixed(2)}`;
      }

      //update completed orders display
      const completedOrdersEl = document.getElementById('ordersCompleted');
      if (completedOrdersEl) {
          completedOrdersEl.textContent = `Completed Orders: ${window.financesData.completedOrders}`;
      }

      //update pending orders display
      const pendingOrdersEl = document.getElementById('ordersPending');
      if (pendingOrdersEl) {
          pendingOrdersEl.textContent = `Pending Orders: ${window.financesData.pendingOrders}`;
      }
  }

  if (page === "customers") {
      updateCustomerList(window.customers.activeCustomers);
  }

  if (page === "prescriptions") {
      updatePrescriptions(window.prescriptions.activePrescriptions);
  }

  if (page === "time") {
      window.updateGameTime(window.gameState.currentDate);
  }

  if (page === "operations") {
      window.renderOperationsPage(document.querySelector('.main-content'));
  }

};

// Simple "router" to show pages:
window.showPage = function (pageName) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) {
      console.error('Main content element not found!');
      return;
  }

  // Clear the current content
  mainContent.innerHTML = '';

  // Render the appropriate page content based on pageName
  switch (pageName) {
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
      case 'equipment':
          window.renderEquipmentPage(mainContent);
          break;
      default:
          mainContent.innerHTML = '<h2>Page not found</h2>';
  }
};

// Functions to update customer and prescription lists in the UI
function updateCustomerList(customers) {
  const customersList = document.querySelector('.customers-list');
  if (!customersList) return;

  customersList.innerHTML = ''; // Clear existing list

  if (customers.length === 0) {
      const noCustomersMessage = document.createElement('p');
      noCustomersMessage.textContent = 'No customers currently.';
      customersList.appendChild(noCustomersMessage);
      return;
  }

  customers.forEach(customer => {
      const customerItem = document.createElement('div');
      customerItem.className = 'customer-item';

      const customerName = document.createElement('span');
      customerName.textContent = `Name: ${customer.firstName} ${customer.lastName}`;
      customerItem.appendChild(customerName);

      const customerStatus = document.createElement('span');
      customerStatus.textContent = `Status: ${customer.status}`;
      customerItem.appendChild(customerStatus);

      // Add more customer details if needed

      customersList.appendChild(customerItem);
  });
}

function updatePrescriptions(prescriptions) {
  const prescriptionsList = document.querySelector('.prescriptions-list');
  if (!prescriptionsList) return;

  prescriptionsList.innerHTML = ''; // Clear existing list

  if (prescriptions.length === 0) {
      const noPrescriptionsMessage = document.createElement('p');
      noPrescriptionsMessage.textContent = 'No active prescriptions.';
      prescriptionsList.appendChild(noPrescriptionsMessage);
      return;
  }

  prescriptions.forEach(prescription => {
      const prescriptionItem = document.createElement('div');
      prescriptionItem.className = 'prescription-item';

      // Prescription Details
      const prescriptionId = document.createElement('p');
      prescriptionId.textContent = `ID: ${prescription.id}`;
      prescriptionItem.appendChild(prescriptionId);

      const productName = document.createElement('p');
      productName.textContent = `Product: ${prescription.productName}`;
      prescriptionItem.appendChild(productName);

      const dosage = document.createElement('p');
      dosage.textContent = `Dosage: ${prescription.dosage}`;
      prescriptionItem.appendChild(dosage);

      const frequency = document.createElement('p');
      frequency.textContent = `Frequency: ${prescription.frequency}`;
      prescriptionItem.appendChild(frequency);

      const status = document.createElement('p');
      status.textContent = `Status: ${prescription.status}`;
      prescriptionItem.appendChild(status);

      const doctorName = document.createElement('p');
      doctorName.textContent = `Doctor: ${prescription.doctorName}`;
      prescriptionItem.appendChild(doctorName);

      // Add more prescription details if needed

      prescriptionsList.appendChild(prescriptionItem);
  });
}

// Attach to window
window.updateFinancialSummary = updateFinancialSummary;
window.updateGameTime = updateGameTime;
window.formatDateTime = formatDateTime;