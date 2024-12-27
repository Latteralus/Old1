// /js/taskAssignment.js

window.taskAssignment = (function() {

    /**
     * Assigns a task to an employee, updating the task and employee objects.
     */
    function assignTaskToEmployee(taskId, employeeId) {
        const task = window.taskManager.tasks.find(t => t.id === taskId);
        const employee = window.employees.getEmployeeById(employeeId);

        if (!task) {
            console.error("Task not found:", taskId);
            return;
        }

        if (!employee) {
            console.error("Employee not found:", employeeId);
            return;
        }

        if (task.assignedTo) {
            console.warn("Task already assigned to:", task.assignedTo);
            return;
        }

        if (employee.currentTaskId) {
            console.warn("Employee already has a task:", employee.currentTaskId);
            return;
        }

        task.assignedTo = employeeId;
        task.status = 'inProgress';
        employee.currentTaskId = taskId;

        // Trigger UI update
        window.updateUI('operations'); // Assuming task assignment is relevant to the operations page
    }

    /**
     * Unassigns an employee from a task.
     */
    function unassignTask(taskId) {
        const task = window.taskManager.tasks.find(t => t.id === taskId);

        if (!task) {
            console.error("Task not found:", taskId);
            return;
        }

        if (!task.assignedTo) {
            console.warn("Task is not assigned to anyone.");
            return;
        }

        const employee = window.employees.getEmployeeById(task.assignedTo);
        if (employee) {
            employee.currentTaskId = null;
        }

        task.assignedTo = null;
        task.status = 'pending'; // Or 'unassigned' if you have such a status

        // Trigger UI update
        window.updateUI('operations');
    }

    /**
     * Automatically assigns tasks to available employees based on role, priority, and skill.
     */
    function autoAssignTasks() {
        const unassignedTasks = window.taskManager.getUnassignedTasks();
    
        // Prioritize tasks 
        unassignedTasks.sort((a, b) => {
            // Prioritize consultations first
            if (a.type === 'consultation' && b.type !== 'consultation') return -1;
            if (b.type === 'consultation' && a.type !== 'consultation') return 1;
    
            // Then prioritize customer interactions
            if (a.type === 'customerInteraction' && b.type !== 'customerInteraction') return -1;
            if (b.type === 'customerInteraction' && a.type !== 'customerInteraction') return 1;
    
            // Then prioritize fillPrescriptions
            if (a.type === 'fillPrescription' && b.type !== 'fillPrescription') return -1;
            if (b.type === 'fillPrescription' && a.type !== 'fillPrescription') return 1;
    
            // For other tasks, maintain the original order (FIFO based on task ID)
            return 0;
        });
    
        unassignedTasks.forEach(task => {
            const availableEmployee = findAvailableEmployeeForTask(task);
            if (availableEmployee) {
                assignTaskToEmployee(task.id, availableEmployee.id);
            }
        });
    }

    /**
     * Finds an available employee for a given task.
     */
    function findAvailableEmployeeForTask(task) {
        const eligibleEmployees = window.employeesData.filter(employee => {
            if (employee.currentTaskId) return false; // Employee is busy

            // Check roles for each task type
            if (task.type === 'fillPrescription' || task.type === 'customerInteraction') {
                return employee.role === 'Pharmacist' || employee.role === 'Lab Technician';
            } else if (task.type === 'consultation') {
                return employee.role === 'Pharmacist';
            } else if (task.type === 'production') {
                return employee.role === 'Lab Technician';
            }

            return false;
        });

        if (eligibleEmployees.length === 0) return null;

        // Select employee with highest relevant skill
        if (task.type === 'fillPrescription') {
            return eligibleEmployees.reduce((best, current) => {
                return current.skills.dispensing > best.skills.dispensing ? current : best;
            }, eligibleEmployees[0]);
        } else if (task.type === 'customerInteraction') {
            return eligibleEmployees.reduce((best, current) => {
                return current.skills.customerService > best.skills.customerService ? current : best;
            }, eligibleEmployees[0]);
        } else if (task.type === 'consultation') {
            return eligibleEmployees.reduce((best, current) => {
                return current.skills.customerService > best.skills.customerService ? current : best;
            }, eligibleEmployees[0]);
        } else if (task.type === 'production') {
            return eligibleEmployees.reduce((best, current) => {
                return current.skills.compounding > best.skills.compounding ? current : best;
            }, eligibleEmployees[0]);
        }

        // Default: return the first eligible employee
        return eligibleEmployees[0];
    }

    // Expose the functions through the window object
    return {
        assignTaskToEmployee,
        unassignTask,
        autoAssignTasks
    };

})();