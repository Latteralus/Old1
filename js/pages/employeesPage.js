window.renderEmployeesPage = function(mainContent) {
    mainContent.innerHTML = '';
  
    const header = document.createElement('h2');
    header.textContent = 'Employees';
  
    const empContainer = document.createElement('div');
  
    // List current employees
    window.employeesData.forEach(emp => {
      const div = document.createElement('div');
      div.textContent = `${emp.id} - ${emp.firstName} ${emp.lastName} [${emp.role}]`;
      empContainer.appendChild(div);
    });
  
    // Hiring section
    const hireSection = document.createElement('div');
    hireSection.innerHTML = '<h3>Hire New Employees</h3><p>Placeholder for listing potential hires.</p>';
  
    mainContent.appendChild(header);
    mainContent.appendChild(empContainer);
    mainContent.appendChild(hireSection);
  };
  