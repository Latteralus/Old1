// /js/data/employees.js

window.employeesData = [
    {
        id: 'emp001',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Pharmacist',
        salary: 85000,
        skills: {
            compounding: 70,
            dispensing: 85,
            customerService: 75,
            inventoryManagement: 60,
            sales: 50,
        },
        morale: 80,        // 0=worst morale, 100=best morale
        mood: "😀",        // Mood icon, updated dynamically
        hireDate: "2023-01-15", // Date the employee was hired
        currentTaskId: null    // ID of the task currently assigned to the employee
    },
    {
        id: 'emp002',
        firstName: 'Alice',
        lastName: 'Wong',
        role: 'Lab Technician',
        salary: 60000,
        skills: {
            compounding: 80,
            dispensing: 50,
            customerService: 40,
            inventoryManagement: 85,
            sales: 30,
        },
        morale: 90,
        mood: "😀",
        hireDate: "2023-05-20",
        currentTaskId: null
    },
    {
        id: 'emp003',
        firstName: 'Carlos',
        lastName: 'Garcia',
        role: 'Sales Rep',
        salary: 70000,
        skills: {
            compounding: 20,
            dispensing: 30,
            customerService: 80,
            inventoryManagement: 50,
            sales: 90,
        },
        morale: 60,
        mood: "💤",
        hireDate: "2023-08-10",
        currentTaskId: null
    }
    // ... more employees
];

window.employees = {
    // Helper Functions:

    // Get an employee by ID
    getEmployeeById: function (employeeId) {
        return window.employeesData.find(employee => employee.id === employeeId);
    },

    // Get an employee's full name
    getEmployeeFullName: function (employee) {
        return `${employee.firstName} ${employee.lastName}`;
    },

    // Calculate employee efficiency (based on skills and morale)
    calculateEmployeeEfficiency: function (employee) {
        let skillFactor = 0;
        for (const skill in employee.skills) {
            skillFactor += employee.skills[skill];
        }
        skillFactor /= Object.keys(employee.skills).length; // Average skill level

        return skillFactor + (employee.morale / 2);
    },

    // Update employee morale (call this function after events that affect morale)
    updateEmployeeMorale: function (employeeId, moraleChange) {
        const employee = this.getEmployeeById(employeeId);
        if (employee) {
            employee.morale = Math.max(0, Math.min(100, employee.morale + moraleChange));

            // Update mood icon based on morale
            if (employee.morale >= 90) {
                employee.mood = "😀";
            } else if (employee.morale >= 70) {
                employee.mood = "😐";
            } else if (employee.morale >= 50) {
                employee.mood = "💤";
            } else if (employee.morale >= 20) {
                employee.mood = "☹️";
            } else {
                employee.mood = "😡";
            }
        }
    },

    // Promote an employee (increase their salary and potentially update their role)
    promoteEmployee: function (employeeId, newSalary, newRole = null) {
        const employee = this.getEmployeeById(employeeId);
        if (employee) {
            employee.salary = newSalary;
            if (newRole) {
                employee.role = newRole;
            }
            // Optionally increase skills or make other changes based on promotion
            this.updateEmployeeMorale(employeeId, 10); // Promotion usually boosts morale
        }
    },

    // Calculate task completion time based on employee, task type, and relevant skills
    calculateTaskCompletionTime: function (baseTime, employeeId, taskType) {
        const employee = this.getEmployeeById(employeeId);
        const efficiency = this.calculateEmployeeEfficiency(employee);

        // Base adjustment: Reduce time based on overall efficiency
        let adjustedTime = baseTime * (1 - (efficiency / 200)); // Up to 50% reduction for 100 efficiency

        // Task-specific adjustments based on relevant skills:
        if (taskType === "compounding") {
            adjustedTime *= (1 - (employee.skills.compounding / 150)); // Up to 66% reduction for 100 compounding skill
        } else if (taskType === "dispensing") {
            adjustedTime *= (1 - ((employee.skills.dispensing + employee.skills.customerService) / 300)); // Up to 66% reduction for 100 in both skills
        } else if (taskType === "customerService") {
            adjustedTime *= (1 - (employee.skills.customerService / 150)); // Up to 66% reduction for 100 customer service skill
        } else if (taskType === "inventoryManagement") {
            adjustedTime *= (1 - (employee.skills.inventoryManagement / 150)); // Up to 66% reduction for 100 inventory management skill
        } else if (taskType === "sales") {
            adjustedTime *= (1 - ((employee.skills.sales + employee.skills.customerService) / 300)); // Up to 66% reduction for 100 in both skills
        }

        return adjustedTime;
    },

    // Update employee mood based on task completion
    updateEmployeeMoodOnTaskCompletion: function (employeeId, taskType) {
        const employee = this.getEmployeeById(employeeId);
        if (employee) {
            if (taskType === 'fillPrescription') {
                // Successfully filled prescription
                this.updateEmployeeMorale(employeeId, 5); // Increase morale by 5
            } else if (taskType === 'customerInteraction') {
                // Successfully interacted with customer
                this.updateEmployeeMorale(employeeId, 3); // Increase morale by 1
            } else if (taskType === 'consultation') {
                // Successfully completed a consultation
                this.updateEmployeeMorale(employeeId, 2); // Increase morale by 2
            } else if (taskType === 'production') {
                // Successfully completed a production
                this.updateEmployeeMorale(employeeId, 5);
            }
        }
    }
};