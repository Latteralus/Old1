// /thepharmacy/js/pages/employeesPage.js

function renderEmployeesPage(mainContent) {
  mainContent.innerHTML = '';

  // Main container for the Employees page
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  // Page Title
  const title = document.createElement('h2');
  title.textContent = 'Employee Management';
  container.appendChild(title);

  // Page Description
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Hire, manage, and view your employees here.';
  container.appendChild(subtitle);

  // --- Filter / Search Bar ---
  const filterRow = document.createElement('div');
  filterRow.style.display = 'flex';
  filterRow.style.alignItems = 'center';
  filterRow.style.gap = '1rem';

  const filterLabel = document.createElement('label');
  filterLabel.textContent = 'Search:';
  filterLabel.style.fontWeight = 'bold';

  const filterInput = document.createElement('input');
  filterInput.type = 'text';
  filterInput.placeholder = 'Filter by name or role...';
  filterInput.style.flex = '1';

  filterLabel.appendChild(filterInput);
  filterRow.appendChild(filterLabel);
  container.appendChild(filterRow);

  // --- Employee Cards Container ---
  const employeesGrid = document.createElement('div');
  employeesGrid.style.display = 'grid';
  employeesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
  employeesGrid.style.gap = '1rem';
  container.appendChild(employeesGrid);

  const employeeCards = []; // Array to store employee card elements for later updates

  // --- Functions for Employee Management ---

  // Render Employee Cards
  function renderEmployees() {
      employeesGrid.innerHTML = ''; // Clear existing cards
      employeeCards.length = 0; // Reset array

      const filterText = filterInput.value.toLowerCase().trim();

      window.employeesData.forEach(employee => {
          // Apply filtering based on name or role
          if (filterText && !(`${employee.firstName} ${employee.lastName}`.toLowerCase().includes(filterText)) && !(employee.role.toLowerCase().includes(filterText))) {
              return; // Skip this employee if they don't match the filter
          }

          // Create the card element
          const card = document.createElement('div');
          card.style.border = '1px solid #ccc';
          card.style.borderRadius = '4px';
          card.style.padding = '1rem';
          card.style.backgroundColor = '#fff';
          card.style.display = 'flex';
          card.style.flexDirection = 'column';
          card.style.gap = '0.5rem';

          // Employee Name
          const nameHeading = document.createElement('h3');
          nameHeading.textContent = `${employee.firstName} ${employee.lastName}`;
          card.appendChild(nameHeading);

          // Role
          const roleText = document.createElement('p');
          roleText.textContent = `Role: ${employee.role}`;
          card.appendChild(roleText);

          // Salary
          const salaryText = document.createElement('p');
          salaryText.textContent = `Salary: $${employee.salary.toFixed(2)}`;
          card.appendChild(salaryText);

          // Skills
          const skillsList = document.createElement('ul');
          for (const skill in employee.skills) {
              const skillItem = document.createElement('li');
              skillItem.textContent = `${skill}: ${employee.skills[skill]}`;
              skillsList.appendChild(skillItem);
          }
          card.appendChild(skillsList);

          // Morale
          const moraleText = document.createElement('p');
          moraleText.textContent = `Morale: ${employee.morale} (${employee.mood})`;
          card.appendChild(moraleText);

          // Add more employee details here as needed...

          // Append the card to the grid
          employeesGrid.appendChild(card);

          // Store the card in the array for later reference
          employeeCards.push({
              rootDiv: card,
              employeeObj: employee
          });
      });
  }

  // --- Event Listeners ---

  // Filter Input
  filterInput.addEventListener('input', () => {
      renderEmployees(); // Re-render employees when the filter changes
  });

  // --- Initial Rendering ---

  mainContent.appendChild(container);
  renderEmployees(); // Render the employee cards initially
}

// Export the function to make it accessible to other modules
window.renderEmployeesPage = renderEmployeesPage;