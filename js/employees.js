// Holds data for all employees, with expanded stats.

window.employeesData = [
    {
      id: 'emp001',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Pharmacist',
      salary: 40000,
      experienceLevel: 3,   // 1=novice, 5=expert
      morale: 80,           // 0=worst morale, 100=best morale
      productivity: 75,     // e.g., influences how many orders they handle
    },
    {
      id: 'emp002',
      firstName: 'Alice',
      lastName: 'Wong',
      role: 'Lab Technician',
      salary: 35000,
      experienceLevel: 2,
      morale: 90,
      productivity: 85,
    },
    {
      id: 'emp003',
      firstName: 'Carlos',
      lastName: 'Garcia',
      role: 'Sales Rep',
      salary: 38000,
      experienceLevel: 4,
      morale: 60,
      productivity: 70,
    },
    // ... more employees as desired
  ];
  
  // Example helper functions
  window.getEmployeeFullName = function (employee) {
    return `${employee.firstName} ${employee.lastName}`;
  };
  
  window.calculateEmployeeEfficiency = function (employee) {
    // A simple example formula
    return (employee.experienceLevel * 10) + employee.productivity + (employee.morale / 2);
  };
  