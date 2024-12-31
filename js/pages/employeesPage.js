// /js/pages/employeesPage.js

function renderEmployeesPage(mainContent) {
    mainContent.innerHTML = '';

    // Main container for the Employees page
    const container = document.createElement('div');
    container.className = 'employees-page-container';

    // Page Title
    const title = document.createElement('h2');
    title.textContent = 'Employee Management';
    container.appendChild(title);

    // Page Description
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Hire, manage, and view your employees here.';
    container.appendChild(subtitle);

    // Tabs Container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    container.appendChild(tabsContainer);

    // Tab Buttons
    const employeesTabButton = document.createElement('button');
    employeesTabButton.className = 'tab-button active';
    employeesTabButton.textContent = 'Employees';
    tabsContainer.appendChild(employeesTabButton);

    const hireTabButton = document.createElement('button');
    hireTabButton.className = 'tab-button';
    hireTabButton.textContent = 'Hire';
    tabsContainer.appendChild(hireTabButton);

    const fireTabButton = document.createElement('button');
    fireTabButton.className = 'tab-button';
    fireTabButton.textContent = 'Fire';
    tabsContainer.appendChild(fireTabButton);

    const negotiateTabButton = document.createElement('button');
    negotiateTabButton.className = 'tab-button';
    negotiateTabButton.textContent = 'Negotiations';
    tabsContainer.appendChild(negotiateTabButton);

    // Tab Content Containers
    const employeesTabContent = document.createElement('div');
    employeesTabContent.className = 'tab-content employees-content';
    container.appendChild(employeesTabContent);

    const hireTabContent = document.createElement('div');
    hireTabContent.className = 'tab-content hire-content';
    hireTabContent.style.display = 'none';
    container.appendChild(hireTabContent);

    const fireTabContent = document.createElement('div');
    fireTabContent.className = 'tab-content fire-content';
    fireTabContent.style.display = 'none';
    container.appendChild(fireTabContent);

    const negotiateTabContent = document.createElement('div');
    negotiateTabContent.className = 'tab-content negotiate-content';
    negotiateTabContent.style.display = 'none';
    container.appendChild(negotiateTabContent);

    // --- Filter / Search Bar (for Employees Tab) ---
    const filterRow = document.createElement('div');
    filterRow.className = 'filter-row';

    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Search:';
    filterLabel.className = 'filter-label';

    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Filter by name or role...';
    filterInput.className = 'filter-input';

    filterLabel.appendChild(filterInput);
    filterRow.appendChild(filterLabel);
    employeesTabContent.appendChild(filterRow); // Add filter to the Employees tab

    // --- Employee Cards Container (for Employees Tab) ---
    const employeesGrid = document.createElement('div');
    employeesGrid.className = 'employees-grid';
    employeesTabContent.appendChild(employeesGrid);

    const employeeCards = []; // Array to store employee card elements for later updates

    // --- Functions for Employee Management ---

    // Render Employee Cards (for Employees Tab)
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
            card.className = 'employee-card';

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

            // Skills (with hover-over)
            const skillsList = document.createElement('ul');
            skillsList.className = 'skills-list';
            const skillsTitle = document.createElement('p');
            skillsTitle.textContent = 'Skills:';
            skillsTitle.className = 'skills-title';
            card.appendChild(skillsTitle);

            for (const skill in employee.skills) {
                const skillItem = document.createElement('li');
                skillItem.className = 'skill-item';
                skillItem.textContent = `${skill}: ${employee.skills[skill]}`;
                skillsList.appendChild(skillItem);
            }
            skillsList.style.display = 'none';
            skillsTitle.addEventListener('mouseover', () => {
                skillsList.style.display = 'block';
            });
            skillsTitle.addEventListener('mouseout', () => {
                skillsList.style.display = 'none';
            });

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

// --- Hire Tab Content ---

// Create a container for role selection
const roleSelectionContainer = document.createElement('div');
roleSelectionContainer.className = 'role-selection';

const roleSelectLabel = document.createElement('label');
roleSelectLabel.textContent = 'Select Role:';
roleSelectLabel.className = 'role-select-label';
roleSelectionContainer.appendChild(roleSelectLabel);

const roleSelect = document.createElement('select');
roleSelect.className = 'role-select';
const roles = ['Pharmacist', 'Lab Technician', 'Sales Rep'];
roles.forEach(role => {
    const option = document.createElement('option');
    option.value = role;
    option.text = role;
    roleSelect.appendChild(option);
});
roleSelectionContainer.appendChild(roleSelect);
hireTabContent.appendChild(roleSelectionContainer);

// Create a container for skill level selection
const skillLevelContainer = document.createElement('div');
skillLevelContainer.className = 'skill-level-selection';

const skillLevelLabel = document.createElement('label');
skillLevelLabel.textContent = 'Select Skill Level:';
skillLevelLabel.className = 'skill-level-label';
skillLevelContainer.appendChild(skillLevelLabel);

const skillLevelSelect = document.createElement('select');
skillLevelSelect.className = 'skill-level-select';
const skillLevels = ['Novice', 'Intermediate', 'Skilled'];
skillLevels.forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.text = level;
    skillLevelSelect.appendChild(option);
});
skillLevelContainer.appendChild(skillLevelSelect);
hireTabContent.appendChild(skillLevelContainer);

// Create a button to generate candidates
const generateCandidatesButton = document.createElement('button');
generateCandidatesButton.className = 'generate-candidates-button';
generateCandidatesButton.textContent = 'Generate Candidates';
generateCandidatesButton.onclick = () => {
    const role = roleSelect.value;
    const skillLevel = skillLevelSelect.value;
    window.employees.hireEmployee(role, skillLevel);
};
hireTabContent.appendChild(generateCandidatesButton);

// Add a container for displaying generated candidates
const candidatesContainer = document.createElement('div');
candidatesContainer.className = 'candidates-container';
hireTabContent.appendChild(candidatesContainer);

// Function to display employee candidates
window.displayEmployeeCandidates = function(candidates) {
    candidatesContainer.innerHTML = ''; // Clear previous candidates

    candidates.forEach(candidate => {
        const candidateCard = document.createElement('div');
        candidateCard.className = 'candidate-card';

        // Candidate Name
        const nameHeading = document.createElement('h4');
        nameHeading.textContent = `${candidate.firstName} ${candidate.lastName}`;
        candidateCard.appendChild(nameHeading);

        // Role
        const roleText = document.createElement('p');
        roleText.textContent = `Role: ${candidate.role}`;
        candidateCard.appendChild(roleText);

        // Salary
        const salaryText = document.createElement('p');
        salaryText.textContent = `Salary: $${candidate.salary.toFixed(2)}`;
        candidateCard.appendChild(salaryText);

        // Skills
        const skillsList = document.createElement('ul');
        for (const skill in candidate.skills) {
            const skillItem = document.createElement('li');
            skillItem.textContent = `${skill}: ${candidate.skills[skill]}`;
            skillsList.appendChild(skillItem);
        }
        candidateCard.appendChild(skillsList);

        // Hire button
        const hireButton = document.createElement('button');
        hireButton.className = 'hire-button';
        hireButton.textContent = 'Hire';
        hireButton.onclick = () => {
            window.employees.hireSelectedEmployee(candidate);
            candidatesContainer.removeChild(candidateCard); // Remove the card after hiring
        };
        candidateCard.appendChild(hireButton);

        candidatesContainer.appendChild(candidateCard);
    });
};

    // --- Event Listeners ---

    // Filter Input
    filterInput.addEventListener('input', () => {
        renderEmployees(); // Re-render employees when the filter changes
    });

    // Tab Buttons
    employeesTabButton.addEventListener('click', () => {
        employeesTabButton.classList.add('active');
        hireTabButton.classList.remove('active');
        fireTabButton.classList.remove('active');
        negotiateTabButton.classList.remove('active');
        employeesTabContent.style.display = 'block';
        hireTabContent.style.display = 'none';
        fireTabContent.style.display = 'none';
        negotiateTabContent.style.display = 'none';
        renderEmployees(); // Re-render employees when the tab is shown
    });

    hireTabButton.addEventListener('click', () => {
        hireTabButton.classList.add('active');
        employeesTabButton.classList.remove('active');
        fireTabButton.classList.remove('active');
        negotiateTabButton.classList.remove('active');
        hireTabContent.style.display = 'block';
        employeesTabContent.style.display = 'none';
        fireTabContent.style.display = 'none';
        negotiateTabContent.style.display = 'none';
        // Additional logic for the hire tab can be added here
    });

    fireTabButton.addEventListener('click', () => {
        fireTabButton.classList.add('active');
        employeesTabButton.classList.remove('active');
        hireTabButton.classList.remove('active');
        negotiateTabButton.classList.remove('active');
        fireTabContent.style.display = 'block';
        employeesTabContent.style.display = 'none';
        hireTabContent.style.display = 'none';
        negotiateTabContent.style.display = 'none';
        // Additional logic for the fire tab can be added here
    });

    negotiateTabButton.addEventListener('click', () => {
        negotiateTabButton.classList.add('active');
        employeesTabButton.classList.remove('active');
        hireTabButton.classList.remove('active');
        fireTabButton.classList.remove('active');
        negotiateTabContent.style.display = 'block';
        employeesTabContent.style.display = 'none';
        hireTabContent.style.display = 'none';
        fireTabContent.style.display = 'none';
        // Additional logic for the negotiations tab can be added here
    });

    // --- Initial Rendering ---

    mainContent.appendChild(container);
    renderEmployees(); // Render the employee cards initially
}

// Export the function to make it accessible to other modules
window.renderEmployeesPage = renderEmployeesPage;