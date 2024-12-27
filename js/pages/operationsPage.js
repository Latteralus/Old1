// /js/pages/operationsPage.js

window.renderOperationsPage = function (mainContent) {
  // Clear existing content
  mainContent.innerHTML = '';

  // Create a top-level container
  const container = document.createElement('div');
  container.className = 'operations-page-container';

  // Add a header
  const header = document.createElement('h2');
  header.textContent = 'Operations (Live Environment)';
  container.appendChild(header);

  // Add a short subtitle or info
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Real-time status of employees, tasks, and customers.';
  container.appendChild(subtitle);

  // Create a top row that will hold summary statistics
  const summaryRow = document.createElement('div');
  summaryRow.style.display = 'flex';
  summaryRow.style.gap = '1rem';
  summaryRow.style.marginBottom = '1rem';
  container.appendChild(summaryRow);

  // Card for "Active Task Count"
  const activeTasksCard = document.createElement('div');
  activeTasksCard.style.flex = '1';
  activeTasksCard.style.border = '1px solid #ccc';
  activeTasksCard.style.borderRadius = '4px';
  activeTasksCard.style.padding = '1rem';
  activeTasksCard.style.backgroundColor = '#fff';
  activeTasksCard.innerHTML = '<h4>Active Tasks</h4><p id="activeTasksCount">0</p>';
  summaryRow.appendChild(activeTasksCard);

  // Card for "Idle Employees"
  const idleEmployeesCard = document.createElement('div');
  idleEmployeesCard.style.flex = '1';
  idleEmployeesCard.style.border = '1px solid #ccc';
  idleEmployeesCard.style.borderRadius = '4px';
  idleEmployeesCard.style.padding = '1rem';
  idleEmployeesCard.style.backgroundColor = '#fff';
  idleEmployeesCard.innerHTML = '<h4>Idle Employees</h4><p id="idleEmployeesCount">0</p>';
  summaryRow.appendChild(idleEmployeesCard);

  // Main content sections: "Employees & Tasks" and "Customers"
  const mainGrid = document.createElement('div');
  mainGrid.style.display = 'grid';
  mainGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  mainGrid.style.gap = '1.5rem';
  container.appendChild(mainGrid);

  // Left column: Employees & Tasks
  const leftCol = document.createElement('div');
  mainGrid.appendChild(leftCol);

  // Right column: Customers list
  const rightCol = document.createElement('div');
  mainGrid.appendChild(rightCol);

  // Employee & Task container
  const employeesSection = document.createElement('div');
  employeesSection.style.border = '1px solid #ccc';
  employeesSection.style.borderRadius = '4px';
  employeesSection.style.padding = '1rem';
  employeesSection.style.backgroundColor = '#fff';
  leftCol.appendChild(employeesSection);

  const employeesTitle = document.createElement('h3');
  employeesTitle.textContent = 'Employees & Tasks';
  employeesSection.appendChild(employeesTitle);

  // A container for the list of employees
  const employeesList = document.createElement('div');
  employeesSection.appendChild(employeesList);

  // Next, a container for "All Active Tasks"
  const tasksSection = document.createElement('div');
  tasksSection.style.marginTop = '1rem';
  employeesSection.appendChild(tasksSection);

  const tasksTitle = document.createElement('h3');
  tasksTitle.textContent = 'All Active Tasks';
  tasksSection.appendChild(tasksTitle);

  // Customer container
  const customersSection = document.createElement('div');
  customersSection.style.border = '1px solid #ccc';
  customersSection.style.borderRadius = '4px';
  customersSection.style.padding = '1rem';
  customersSection.style.backgroundColor = '#fff';
  rightCol.appendChild(customersSection);

  const customersTitle = document.createElement('h3');
  customersTitle.textContent = 'Customers in the Pharmacy';
  customersSection.appendChild(customersTitle);

  const customersList = document.createElement('div');
  customersList.id = 'customersList';
  customersSection.appendChild(customersList);

  // Prescriptions container
  const prescriptionsSection = document.createElement('div');
  prescriptionsSection.style.border = '1px solid #ccc';
  prescriptionsSection.style.borderRadius = '4px';
  prescriptionsSection.style.padding = '1rem';
  prescriptionsSection.style.backgroundColor = '#fff';
  rightCol.appendChild(prescriptionsSection);

  const prescriptionsTitle = document.createElement('h3');
  prescriptionsTitle.textContent = 'Active Prescriptions';
  prescriptionsSection.appendChild(prescriptionsTitle);

  const prescriptionsList = document.createElement('div');
  prescriptionsList.id = 'prescriptionsList';
  prescriptionsSection.appendChild(prescriptionsList);

  mainContent.appendChild(container);

  // Render employees with card style
  function renderEmployees() {
      employeesList.innerHTML = '';
      let idleCount = 0;

      window.employeesData.forEach(emp => {
          const empCard = document.createElement('div');
          empCard.style.border = '1px solid #ddd';
          empCard.style.borderRadius = '4px';
          empCard.style.padding = '0.5rem';
          empCard.style.marginBottom = '0.5rem';
          empCard.style.backgroundColor = '#f9f9f9';

          const empHeader = document.createElement('strong');
          empHeader.textContent = `${emp.firstName} ${emp.lastName} (${emp.role})`;
          empCard.appendChild(empHeader);

          const taskInfo = document.createElement('p');
          if (emp.currentTaskId) {
              const task = window.taskManager.tasks.find(t => t.id === emp.currentTaskId);
              if (task) {
                  taskInfo.textContent = `Current Task: ${task.type} (ID: ${task.id})`;
              } else {
                  taskInfo.textContent = 'Current Task: (Task not found)';
              }
          } else {
              taskInfo.textContent = 'Current Task: None (Idle)';
              idleCount++;
          }
          empCard.appendChild(taskInfo);

          employeesList.appendChild(empCard);
      });

      // Update the "Idle Employees" summary
      const idleEl = document.getElementById('idleEmployeesCount');
      if (idleEl) {
          idleEl.textContent = idleCount.toString();
      }
  }

  // Render all active tasks
  function renderTasks() {
      tasksSection.innerHTML = ''; // Clear existing tasks

      const activeTasks = window.taskManager.tasks.filter(t => t.status !== 'completed');
      const activeCount = activeTasks.length;

      // Update the summary for active tasks
      const activeTasksEl = document.getElementById('activeTasksCount');
      if (activeTasksEl) {
          activeTasksEl.textContent = activeCount.toString();
      }

      if (activeCount === 0) {
          const none = document.createElement('p');
          none.className = 'task-entry';
          none.textContent = 'No active tasks at the moment.';
          tasksSection.appendChild(none);
          return;
      }

      activeTasks.forEach(task => {
          const taskDiv = document.createElement('div');
          taskDiv.className = 'task-entry';
          taskDiv.style.border = '1px solid #ddd';
          taskDiv.style.borderRadius = '4px';
          taskDiv.style.padding = '0.5rem';
          taskDiv.style.marginBottom = '0.5rem';
          taskDiv.style.backgroundColor = '#fafafa';

          const titleRow = document.createElement('div');
          titleRow.style.display = 'flex';
          titleRow.style.alignItems = 'center';
          titleRow.style.marginBottom = '0.25rem';

          const colorIcon = document.createElement('span');
          colorIcon.style.display = 'inline-block';
          colorIcon.style.width = '10px';
          colorIcon.style.height = '10px';
          colorIcon.style.borderRadius = '50%';
          colorIcon.style.marginRight = '8px';

          if (task.type === 'production') {
              colorIcon.style.backgroundColor = '#ff9800';
          } else if (task.type === 'fillPrescription') {
              colorIcon.style.backgroundColor = '#4caf50';
          } else if (task.type === 'customerInteraction') {
              colorIcon.style.backgroundColor = '#2196f3';
          } else if (task.type === 'consultation') {
              colorIcon.style.backgroundColor = '#9C27B0';
          } else {
              colorIcon.style.backgroundColor = '#607D8B'; // Default color
          }
          titleRow.appendChild(colorIcon);

          const titleText = document.createElement('strong');
          // Display prescription ID for fillPrescription tasks
          if (task.type === 'fillPrescription') {
              titleText.textContent = `Task: ${task.type} (Prescription ID: ${task.prescriptionId})`;
          } else {
              titleText.textContent = `Task: ${task.type} (ID: ${task.id})`;
          }
          titleRow.appendChild(titleText);

          taskDiv.appendChild(titleRow);

          const detailLine = document.createElement('p');
          detailLine.textContent = `Product: ${task.productName || ''}, Status: ${task.status}`;
          taskDiv.appendChild(detailLine);

          // Assigned employee
          if (task.assignedTo) {
              const assignedEmp = window.employeesData.find(e => e.id === task.assignedTo);
              if (assignedEmp) {
                  const assignedLine = document.createElement('p');
                  assignedLine.textContent = `Assigned to: ${assignedEmp.firstName} ${assignedEmp.lastName} (${assignedEmp.role})`;
                  taskDiv.appendChild(assignedLine);
              }
          } else {
              const unassignedLine = document.createElement('p');
              unassignedLine.textContent = 'Assigned to: (none)';
              taskDiv.appendChild(unassignedLine);
          }

          tasksSection.appendChild(taskDiv);
      });
  }

  // Render customers
  function renderCustomers() {
      window.updateCustomerList(window.customers.activeCustomers);
  }

  // Render prescriptions
  function renderPrescriptions() {
      window.updatePrescriptions(window.prescriptions.activePrescriptions);
  }

  // Call this function to refresh the UI components
  function refreshUI() {
      renderEmployees();
      renderTasks();
      renderCustomers();
      renderPrescriptions();
  }

  // Initial render
  refreshUI();

  // Set interval for periodic refresh
  const refreshInterval = setInterval(refreshUI, 2000);

  // Optional: Add cleanup function in case the page is unloaded
  // mainContent.cleanup = () => clearInterval(refreshInterval);
};