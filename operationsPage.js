// /js/pages/operationsPage.js

window.renderOperationsPage = function(mainContent) {
  // Clear existing content
  mainContent.innerHTML = '';

  // -------------------------------------------------------------------------
  // 1) Add a structured layout with well-defined card sections 
  //    and a consistent style for grouping employees, tasks, and customers.
  // -------------------------------------------------------------------------

  // Create a top-level container
  const container = document.createElement('div');
  container.className = 'operations-page-container'; 
  // (Optional) If desired, style this class in style.css

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

  // -------------------------------------------------------------------------
  // 2) Real-time data summaries: e.g., Active tasks, Idle employees.
  // -------------------------------------------------------------------------

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

  // Other summary cards could be added similarly

  // -------------------------------------------------------------------------
  // Main content sections: "Employees & Tasks" and "Customers"
  // -------------------------------------------------------------------------
  const mainGrid = document.createElement('div');
  mainGrid.style.display = 'grid';
  mainGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  mainGrid.style.gap = '1.5rem';
  container.appendChild(mainGrid);

  // Left column: Employees & Tasks
  const leftCol = document.createElement('div');
  mainGrid.appendChild(leftCol);

  // Right column: Optional customers list
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
  customersSection.appendChild(customersList);

  mainContent.appendChild(container);

  // -------------------------------------------------------------------------
  // 3) Render logic
  // -------------------------------------------------------------------------

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
        const t = window.taskManager.tasks.find(tt => tt.id === emp.currentTaskId);
        if (t) {
          // Distinguish by task type (Item #4: color or icon)
          const iconSpan = document.createElement('span');
          iconSpan.style.display = 'inline-block';
          iconSpan.style.width = '8px';
          iconSpan.style.height = '8px';
          iconSpan.style.marginRight = '4px';
          // Example: color-coded background
          if (t.type === 'production') {
            iconSpan.style.backgroundColor = '#ff9800'; // orange for production
          } else if (t.type === 'fillPrescription') {
            iconSpan.style.backgroundColor = '#4caf50'; // green for prescriptions
          } else {
            iconSpan.style.backgroundColor = '#2196f3'; // default
          }

          taskInfo.appendChild(iconSpan);

          taskInfo.textContent += `Current Task: [${t.type}] ${t.productName}`;
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
    // tasksSection was created with a tasksTitle, so we just fill after that
    // Clear out any existing items
    const oldEntries = tasksSection.querySelectorAll('.task-entry');
    oldEntries.forEach(n => n.remove());

    const activeTasks = window.taskManager.tasks.filter(t => t.status !== 'completed');
    const activeCount = activeTasks.length;

    // Update the summary for active tasks
    const activeTasksEl = document.getElementById('activeTasksCount');
    if (activeTasksEl) {
      activeTasksEl.textContent = activeCount.toString();
    }

    if (activeCount === 0) {
      // Show a small note
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

      // Title row with color icon
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
      } else {
        colorIcon.style.backgroundColor = '#2196f3';
      }
      titleRow.appendChild(colorIcon);

      const titleText = document.createElement('strong');
      titleText.textContent = `Task #${task.id}`;
      titleRow.appendChild(titleText);

      taskDiv.appendChild(titleRow);

      // Type and product
      const detailLine = document.createElement('p');
      detailLine.textContent = `Type: ${task.type}, Product: ${task.productName || ''}, Status: ${task.status}`;
      taskDiv.appendChild(detailLine);

      // If assigned
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
    customersList.innerHTML = '';
    if (!window.customers || !window.customers.activeCustomers) {
      customersList.textContent = 'No customers system found.';
      return;
    }

    if (window.customers.activeCustomers.length === 0) {
      customersList.textContent = 'No customers currently present.';
      return;
    }

    window.customers.activeCustomers.forEach(cust => {
      const custDiv = document.createElement('div');
      custDiv.style.border = '1px solid #ddd';
      custDiv.style.borderRadius = '4px';
      custDiv.style.padding = '0.5rem';
      custDiv.style.marginBottom = '0.5rem';
      custDiv.style.backgroundColor = '#f0f0f0';

      custDiv.textContent = `Customer ID: ${cust.id}, Status: ${cust.status}`;
      customersList.appendChild(custDiv);
    });
  }

  // -------------------------------------------------------------------------
  // Real-time (or frequent) refresh cycle
  // -------------------------------------------------------------------------
  function refreshUI() {
    renderEmployees();
    renderTasks();
    renderCustomers();
  }

  // Initial render
  refreshUI();

  // If you have a system that updates the UI automatically,
  // you can tie this in with timeEvents.js or do a setInterval:
  const refreshInterval = setInterval(() => {
    // Optional: if page is no longer active, clearInterval
    refreshUI();
  }, 2000);

  // If your router supports cleanup, do:
  // mainContent.cleanup = () => clearInterval(refreshInterval);
};
