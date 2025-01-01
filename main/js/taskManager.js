// /js/taskManager.js

window.taskManager = (function() {
    const tasks = [];

    function addTask(task) {
        tasks.push(task);
        console.log(`[taskManager.js] Task added: ${task.type} - ${task.id}`);
    }

    function getUnassignedTasks() {
        return tasks.filter(t => t.assignedTo === null && t.status === 'pending');
    }

    function getTasksForEmployee(empId) {
        return tasks.filter(t => t.assignedTo === empId && t.status !== 'completed');
    }

    function updateTasks(minutes) {
        tasks.forEach(task => {
            if (task.status === 'inProgress') {
                if (task.type === 'fillPrescription') {
                    // For fillPrescription, check product inventory
                    if (!window.taskAssignment.canFillPrescription(task.prescriptionId)) {
                        console.warn(`[taskManager.js] Insufficient ${task.productName} in inventory for fillPrescription task; unassigning employee.`);
                        window.taskAssignment.unassignTask(task.id);
                        return;
                    }
                } else if (task.type === 'compound') {
                    // For compound, check if there are enough materials
                    const product = window.productsData.find(p => p.id === task.productId);
                    if (!window.production.canCompound(product)) {
                        console.warn(`[taskManager.js] Insufficient materials to compound ${product.name}; unassigning employee.`);
                        window.taskAssignment.unassignTask(task.id);
                        return;
                    }
                    console.log(`[taskManager.js] Updating compound task ${task.id}, progress: ${task.progress}, totalTime: ${task.totalTime}`);
                }
                task.progress += minutes;
                if (task.progress >= task.totalTime) {
                    task.status = 'completed';
                    finalizeTask(task);
                }
            }
        });

        // Auto-assign removed from here since it's now handled in other places (timeEvents.js and after unassignment)
    }

    function finalizeTask(task) {
        console.log(`[finalizeTask] Finalizing task: ${task.id} (${task.type})`);

        // Unassign employee from task before anything else
        if (task.assignedTo) {
            console.log(`[finalizeTask] Unassigning employee from task: ${task.id}`);
            window.taskAssignment.unassignTask(task.id);
        }

        // Call production.handleTaskCompletion to update inventory
        window.production.handleTaskCompletion(task);

        if (task.type === 'fillPrescription') {
            if (task.customerId) {
                window.prescriptions.prescriptionFilled(task.prescriptionId, task.customerId);
            }
        } else if (task.type === 'customerInteraction') {
            if (task.customerId) {
                const customer = window.customers.getCustomerById(task.customerId);
                if (customer) {
                    if (customer.status === 'waitingForCheckIn') {
                        window.customers.updateCustomerStatus(task.customerId, 'waitingForConsultation');
                    } else if (customer.status === 'readyForCheckout') {
                        window.finances.completePrescription(task.customerId, customer.prescriptionId);
                        window.customers.updateCustomerStatus(task.customerId, 'completed');
                        window.customers.customerLeaves(task.customerId);
                    }
                }
            }
        } else if (task.type === 'consultation') {
            if (task.customerId) {
                window.customers.updateCustomerStatus(task.customerId, 'waitingForFill');
            }
        }

        // Remove the completed task from the tasks array
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            console.log(`[finalizeTask] Task ${task.id} removed from task list.`);
        }
    }

    return {
        tasks,
        addTask,
        getUnassignedTasks,
        getTasksForEmployee,
        updateTasks
    };
})();