// /js/taskAssignment.js

window.taskAssignment = (function() {

    /**
     * Assigns a task to an employee, updating both the task and employee objects.
     */
    function assignTaskToEmployee(taskId, employeeId) {
        const task = window.taskManager.tasks.find(t => t.id === taskId);
        const employee = window.employees.getEmployeeById(employeeId);

        if (!task) {
            console.error("Task not found:", taskId);
            return false;
        }
        if (!employee) {
            console.error("Employee not found:", employeeId);
            return false;
        }
        if (task.assignedTo) {
            console.warn(`Task ${task.id} already assigned to ${task.assignedTo}.`);
            return false;
        }
        if (employee.currentTaskId) {
            console.warn(`Employee ${employee.id} already has a task ${employee.currentTaskId}.`);
            return false;
        }

        task.assignedTo = employeeId;
        task.status = 'inProgress';
        employee.currentTaskId = taskId;

        console.log(`[assignTaskToEmployee] Assigned task ${taskId} (${task.type}) to ${employeeId} (${employee.firstName} ${employee.lastName})`);
        window.renderOperationsPage(document.querySelector('.main-content'));
        return true;
    }

    /**
     * Unassigns an employee from a task, returning the task to 'pending' status.
     */
    function unassignTask(taskId) {
        const task = window.taskManager.tasks.find(t => t.id === taskId);
        if (!task) {
            console.error("Task not found:", taskId);
            return;
        }
        if (!task.assignedTo) {
            console.warn(`Task ${task.id} is not assigned to anyone.`);
            return;
        }

        const employee = window.employees.getEmployeeById(task.assignedTo);
        if (employee) {
            employee.currentTaskId = null;
        }
        task.assignedTo = null;
        task.status = 'pending';

        console.log(`[unassignTask] Unassigned task ${task.id}, returning to pending.`);
        window.renderOperationsPage(document.querySelector('.main-content'));
    }

    /**
     * Sorts tasks by priority:
     * 1) fillPrescription
     * 2) consultation
     * 3) customerInteraction
     * 4) compound (NEW)
     * 5) production
     * 6) everything else
     */
    function sortTasksByPriority(unassignedTasks) {
        return unassignedTasks.sort((a, b) => {
            // Highest priority: fillPrescription
            if (a.type === 'fillPrescription' && b.type !== 'fillPrescription') return -1;
            if (b.type === 'fillPrescription' && a.type !== 'fillPrescription') return 1;

            // Then: consultation
            if (a.type === 'consultation' && b.type !== 'consultation') return -1;
            if (b.type === 'consultation' && a.type !== 'consultation') return 1;

            // Then: customerInteraction
            if (a.type === 'customerInteraction' && b.type !== 'customerInteraction') return -1;
            if (b.type === 'customerInteraction' && a.type !== 'customerInteraction') return 1;

            // Then: compound (NEW)
            if (a.type === 'compound' && b.type !== 'compound') return -1;
            if (b.type === 'compound' && a.type !== 'compound') return 1;

            // Then: production
            if (a.type === 'production' && b.type !== 'production') return -1;
            if (b.type === 'production' && a.type !== 'production') return 1;

            // fallback: keep original order
            return 0;
        });
    }

    /**
     * Main logic to automatically assign tasks to free employees.
     */
    function autoAssignTasks() {
        console.log("[autoAssignTasks] Running auto-assignment logic");
        let madeAssignment = true;

        while (madeAssignment) {
            madeAssignment = false;
            const unassignedTasks = window.taskManager.getUnassignedTasks()
            .filter(task => {
                // Add filtering logic for compound tasks based on material availability
                if (task.type === 'compound') {
                    const product = window.productsData.find(p => p.id === task.productId);
                    return window.production.canCompound(product);
                }
                return true;
            });
            if (unassignedTasks.length === 0) {
                console.log("[autoAssignTasks] No unassigned tasks left.");
                break;
            }

            const prioritizedTasks = sortTasksByPriority(unassignedTasks);

            for (let task of prioritizedTasks) {
                console.log(`[autoAssignTasks] Checking task ${task.id} (${task.type})`);

                // For fillPrescription, check inventory
                if (task.type === 'fillPrescription' && !canFillPrescription(task.prescriptionId)) {
                    console.warn(`[autoAssignTasks] Skipping fillPrescription for ${task.id}, not enough product in inventory.`);
                    continue;
                }

                const availableEmployee = findAvailableEmployeeForTask(task);
                if (availableEmployee) {
                    const assigned = assignTaskToEmployee(task.id, availableEmployee.id);
                    if (assigned) {
                        console.log(`[autoAssignTasks] Assigned ${task.id} to ${availableEmployee.id}.`);
                        madeAssignment = true;
                    }
                } else {
                    console.log(`[autoAssignTasks] No available employee for task ${task.id} (${task.type})`);
                }
            }
        }
    }

    /**
     * Checks if we have enough product INVENTORY to fill a prescription.
     */
    function canFillPrescription(prescriptionId) {
        const prescription = window.prescriptions.getPrescription(prescriptionId);
        if (!prescription) {
            console.error(`Prescription ${prescriptionId} not found in canFillPrescription.`);
            return false;
        }
        const product = window.productsData.find(p => p.id === prescription.productId);
        if (!product) {
            console.error(`Product ${prescription.productId} not found in canFillPrescription.`);
            return false;
        }

        // Check if there's enough product inventory
        return product.inventory >= prescription.dosage;
    }

    /**
     * Selects an appropriate employee for a given task based on roles and skills.
     */
    function findAvailableEmployeeForTask(task) {
        const eligibleEmployees = window.employeesData.filter(emp => {
            if (emp.currentTaskId) return false; // Employee is already assigned to a task

            // Define roles eligible for each task type
            const eligibleRoles = {
                'customerInteraction': ['Cashier'],
                'consultation': ['Pharmacist'],
                'fillPrescription': ['Lab Technician'],
                'compound': ['Lab Technician'],
                'production': ['Lab Technician']
            };

            // Check if the employee's role is eligible for the task type
            return eligibleRoles[task.type]?.includes(emp.role) || false;
        });

        console.log(`[findAvailableEmployeeForTask] Eligible employees for task ${task.id} (${task.type}):`, eligibleEmployees);

        if (eligibleEmployees.length === 0) {
            console.log(`[findAvailableEmployeeForTask] No eligible employees for task ${task.id} (${task.type}).`);
            return null;
        }

        // Choose the employee with the highest relevant skill
        const skillPriorities = {
            'fillPrescription': 'dispensing',
            'consultation': 'customerService',
            'customerInteraction': 'customerService',
            'compound': 'compounding',
            'production': 'compounding'
        };

        const relevantSkill = skillPriorities[task.type];
        if (relevantSkill) {
            return eligibleEmployees.reduce((best, cur) =>
                cur.skills[relevantSkill] > best.skills[relevantSkill] ? cur : best,
                eligibleEmployees[0]
            );
        }

        // Fallback: return the first eligible employee if no specific skill is prioritized
        return eligibleEmployees[0];
    }

    // Expose the functions through the window object
    return {
        assignTaskToEmployee,
        unassignTask,
        autoAssignTasks,
        canFillPrescription
    };

})();