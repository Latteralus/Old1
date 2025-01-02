// /src/services/employees.js

const API_BASE_URL = 'http://localhost:3001/api'; // Replace with your server's address

window.employees = {
    // Function to fetch employee data from the server
    async fetchEmployees() {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const employees = await response.json();
            return employees;
        } catch (error) {
            console.error(error);
            return []; // Return an empty array on error
        }
    },

    // Get an employee by ID
    async getEmployeeById(employeeId) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch employee with ID: ${employeeId}`);
            }
            const employee = await response.json();
            return employee;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // Get an employee's full name
    getEmployeeFullName(employee) {
        return `${employee.firstName} ${employee.lastName}`;
    },

    // Calculate employee efficiency (based on skills and morale)
    calculateEmployeeEfficiency(employee) {
        let skillSum = 0;
        let skillCount = 0;
        for (const skill in employee.skills) {
            skillSum += employee.skills[skill];
            skillCount++;
        }
        const avgSkill = skillSum / skillCount;
        // We'll treat avgSkill ~ 0..100 as the general skill level
        return avgSkill; // Return 0..100 range if typical
    },

    /**
     * Calculates task completion time with:
     *   - Double time at 0 skill
     *   - Half time at 100 skill
     *   - Morale: +/- 5 min (0 morale => +5, 100 morale => -5)
     */
    async calculateTaskCompletionTime(baseTime, employeeId, taskType) {
        const employee = await this.getEmployeeById(employeeId);
        if (!employee) return baseTime; // Return default if employee is not found

        const skillFactor = this.calculateEmployeeEfficiency(employee);
        // skillFactor ~ 0..100 typically

        // 1) Convert skillFactor => linear scale from 2.0 (worst) down to 0.5 (best)
        //    If skillFactor=0 => time multiplier=2
        //    If skillFactor=100 => time multiplier=0.5
        const skillPercent = Math.min(skillFactor, 100) / 100; // clamp at 100
        const skillMultiplier = 2 - 1.5 * skillPercent;
        // e.g. skillPercent=0 => 2 - 0 => 2
        //      skillPercent=1 => 2 - 1.5 => 0.5

        let adjustedTime = baseTime * skillMultiplier;

        // 2) Apply task-specific skill
        //    (You might choose to further reduce or increase adjustedTime based on specific relevant skill)
        if (taskType === "compounding") {
            // Slight additional reduction if compounding is high
            const compSkill = employee.skills.compounding; // ~0..100
            const compPercent = Math.min(compSkill, 100) / 100;
            // e.g. up to 25% reduction if compSkill=100
            adjustedTime *= (1 - (0.25 * compPercent));
        }
        else if (taskType === "dispensing") {
            const disp = employee.skills.dispensing;
            const cust = employee.skills.customerService;
            const dispPercent = Math.min(disp + cust, 200) / 200;
            // e.g. if disp+cust=200 => 1 => up to 25% reduction
            adjustedTime *= (1 - (0.25 * dispPercent));
        }
        // ... similarly handle other task types if desired

        // 3) Adjust for morale: range from +5 (worst morale=0) to -5 (best morale=100)
        const morale = employee.morale; // 0..100
        const moraleDelta = 5 - (morale / 100) * 10;
        // e.g. morale=0 => +5, morale=100 => -5
        adjustedTime += moraleDelta;

        // 4) Ensure we never go below 1 minute
        if (adjustedTime < 1) adjustedTime = 1;

        // Round to a whole number if you like:
        adjustedTime = Math.round(adjustedTime);

        return adjustedTime;
    },

    // Update employee morale
    async updateEmployeeMorale(employeeId, moraleChange) {
        const employee = await this.getEmployeeById(employeeId);
        if (employee) {
            employee.morale = Math.max(0, Math.min(100, employee.morale + moraleChange));

            // Update mood icon
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
            // Update employee data in the database
            await this.updateEmployee(employee);
        }
    },

    // Promote an employee
    async promoteEmployee(employeeId, newSalary, newRole = null) {
        const employee = await this.getEmployeeById(employeeId);
        if (employee) {
            employee.salary = newSalary;
            if (newRole) {
                employee.role = newRole;
            }
            // Increase morale a bit
            await this.updateEmployeeMorale(employeeId, 10);

            // Update employee data in the database
            await this.updateEmployee(employee);
        }
    },

    // Update employee mood on task completion
    async updateEmployeeMoodOnTaskCompletion(employeeId, taskType) {
        const employee = await this.getEmployeeById(employeeId);
        if (employee) {
            if (taskType === 'fillPrescription') {
                await this.updateEmployeeMorale(employeeId, 5);
            } else if (taskType === 'customerInteraction') {
                await this.updateEmployeeMorale(employeeId, 3);
            } else if (taskType === 'consultation') {
                await this.updateEmployeeMorale(employeeId, 2);
            } else if (taskType === 'production') {
                await this.updateEmployeeMorale(employeeId, 5);
            }
        }
    },

    // Placeholder for generating employee candidates
    async displayEmployeeCandidates(candidates) {
        // This function will likely involve rendering the candidates to the UI
        // where the player can choose to hire one of them.
        // For now, we just log the candidates.
        console.log("Generated candidates:", candidates);

        // In a real implementation, you would update the UI here to show the candidates.
        // This might involve setting a state in a React component and rendering a list of candidates.
        // Example:
        // this.setState({ employeeCandidates: candidates });
        // And then rendering the candidates in a dedicated part of your UI.
    },

    // Hire an employee
    async hireEmployee(role, skillLevel) {
        // This needs to be updated to communicate with your backend
        console.error('hireEmployee method not fully implemented for database interaction');
        return;
    },

    // Add an employee to the database
    async hireSelectedEmployee(employeeData) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                throw new Error('Failed to hire employee');
            }

            const newEmployee = await response.json();

            // Update the UI to reflect the new employee
            window.updateUI("employees");

            alert(`Successfully hired ${newEmployee.firstName} ${newEmployee.lastName} as a ${newEmployee.role}.`);
        } catch (error) {
            console.error(error);
            alert('Failed to hire employee.');
        }
    },

    // Fire an employee
    async fireEmployee(employeeId) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to fire employee');
            }

            // Update the UI to reflect the fired employee
            window.updateUI("employees");

            console.log(`Employee with ID ${employeeId} has been fired.`);
        } catch (error) {
            console.error(error);
            console.error(`Failed to fire employee with ID: ${employeeId}`);
        }
    },

    // Update employee skills
    async updateEmployeeSkills(employeeId, newSkills) {
        const employee = await this.getEmployeeById(employeeId);
        if (!employee) {
            console.error('Employee not found!');
            return;
        }
        for (const skill in newSkills) {
            if (employee.skills.hasOwnProperty(skill)) {
                employee.skills[skill] = newSkills[skill];
            }
        }

        // Update employee data in the database
        await this.updateEmployee(employee);

        console.log('Employee skills updated:', employee.firstName, employee.lastName, employee.skills);
    },

    // Generic update for employee data
    async updateEmployee(employeeData) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee data');
            }

            console.log(`Employee data updated for: ${employeeData.firstName} ${employeeData.lastName}`);
            window.updateUI("employees"); // Assuming you have a function to refresh the employee list
        } catch (error) {
            console.error(error);
        }
    }
};