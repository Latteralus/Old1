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
            // console.warn(`Task ${task.id} already assigned to ${task.assignedTo}.`);
            return false;
        }
        if (employee.currentTaskId) {
            // console.warn(`Employee ${employee.id} already has a task ${employee.currentTaskId}.`);
            return false;
        }

        task.assignedTo = employeeId;
        task.status = 'inProgress';
        employee.currentTaskId = taskId;

        // console.log(`[assignTaskToEmployee] Assigned task ${taskId} (${task.type}) to ${employeeId}.`);
        window.ui.updateOperations();
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
            // console.warn(`Task ${task.id} is not assigned to anyone.`);
            return;
        }

        const employee = window.employees.getEmployeeById(task.assignedTo);
        if (employee) {
            employee.currentTaskId = null;
        }
        task.assignedTo = null;
        task.status = 'pending';

        // console.log(`[unassignTask] Unassigned task ${task.id}, returning to pending.`);
        window.ui.updateOperations();
    }

    /**
     * Sorts tasks by priority:
     * 1) consultation
     * 2) customerInteraction
     * 3) fillPrescription (only if enough materials)
     * 4) production
     * 5) everything else
     */
    function sortTasksByPriority(unassignedTasks) {
        return unassignedTasks.sort((a, b) => {
            // consultation first
            if (a.type === 'consultation' && b.type !== 'consultation') return -1;
            if (b.type === 'consultation' && a.type !== 'consultation') return 1;

            // then customerInteraction
            if (a.type === 'customerInteraction' && b.type !== 'customerInteraction') return -1;
            if (b.type === 'customerInteraction' && a.type !== 'customerInteraction') return 1;

            // then fillPrescription
            if (a.type === 'fillPrescription' && b.type !== 'fillPrescription') return -1;
            if (b.type === 'fillPrescription' && a.type !== 'fillPrescription') return 1;

            // then production
            if (a.type === 'production' && b.type !== 'production') return -1;
            if (b.type === 'production' && a.type !== 'production') return 1;

            // fallback: keep original order or compare IDs
            return 0;
        });
    }

    /**
     * Main logic to automatically assign tasks to free employees until no more assignments can be made.
     */
    function autoAssignTasks() {
        let madeAssignment = true;

        // We'll keep looping until we can't assign any more tasks in this pass
        while (madeAssignment) {
            madeAssignment = false;

            // get all tasks that are pending & unassigned
            const unassignedTasks = window.taskManager.getUnassignedTasks();
            if (unassignedTasks.length === 0) {
                // console.log("[autoAssignTasks] No unassigned tasks left.");
                break;
            }

            // sort them by priority
            const prioritizedTasks = sortTasksByPriority(unassignedTasks);

            // Attempt assignment
            for (let i = 0; i < prioritizedTasks.length; i++) {
                const task = prioritizedTasks[i];

                // skip fillPrescription if not enough materials
                if (task.type === 'fillPrescription' && !canFillPrescription(task.prescriptionId)) {
                    // console.warn(`[autoAssignTasks] Skipping fillPrescription for ${task.id}, not enough materials.`);
                    continue;
                }

                // find an available employee for the task
                const availableEmployee = findAvailableEmployeeForTask(task);
                if (availableEmployee) {
                    // attempt assignment
                    const assigned = assignTaskToEmployee(task.id, availableEmployee.id);
                    if (assigned) {
                        // console.log(`[autoAssignTasks] Assigned ${task.id} to ${availableEmployee.id}.`);
                        madeAssignment = true;
                    }
                }
            }
        }
    }

    /**
     * Checks if we have enough material to fill a prescription.
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
        // compare potentialProduction to the dosage
        return window.helpers.calculatePotentialProduction(product.id) >= prescription.dosage;
    }

    /**
     * Selects an appropriate employee for a given task based on roles and relevant skills.
     */
    function findAvailableEmployeeForTask(task) {
        // Filter employees who are free (no currentTaskId)
        const eligibleEmployees = window.employeesData.filter(emp => {
            if (emp.currentTaskId) return false; // busy

            if (task.type === 'customerInteraction') {
                return emp.role === 'Cashier';
            } else if (task.type === 'consultation') {
                return emp.role === 'Pharmacist';
            } else if (task.type === 'fillPrescription') {
                return emp.role === 'Lab Technician';
            } else if (task.type === 'production') {
                return emp.role === 'Lab Technician';
            }
            // else no role qualifies
            return false;
        });

        if (eligibleEmployees.length === 0) {
            // console.log(`[findAvailableEmployeeForTask] No eligible employees for task ${task.id} (${task.type}).`);
            return null;
        }

        // Choose the employee with the highest relevant skill
        if (task.type === 'fillPrescription') {
            // prioritize dispensing skill
            return eligibleEmployees.reduce((best, cur) =>
                cur.skills.dispensing > best.skills.dispensing ? cur : best
            , eligibleEmployees[0]);
        } else if (task.type === 'consultation') {
            // prioritize customerService
            return eligibleEmployees.reduce((best, cur) =>
                cur.skills.customerService > best.skills.customerService ? cur : best
            , eligibleEmployees[0]);
        } else if (task.type === 'customerInteraction') {
            // also prioritize customerService
            return eligibleEmployees.reduce((best, cur) =>
                cur.skills.customerService > best.skills.customerService ? cur : best
            , eligibleEmployees[0]);
        } else if (task.type === 'production') {
            // prioritize compounding
            return eligibleEmployees.reduce((best, cur) =>
                cur.skills.compounding > best.skills.compounding ? cur : best
            , eligibleEmployees[0]);
        }

        // fallback
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
