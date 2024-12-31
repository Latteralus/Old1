// /js/taskManager.js

window.taskManager = (function() {
    const tasks = [];

    function addTask(task) {
        tasks.push(task);
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
                    // check materials
                    const canStillFill = window.taskAssignment.canFillPrescription(task.prescriptionId);
                    if (!canStillFill) {
                        console.warn("Insufficient materials mid-task; unassigning employee.");
                        window.taskAssignment.unassignTask(task.id);
                        return;
                    }
                }
                task.progress += minutes;
                if (task.progress >= task.totalTime) {
                    task.status = 'completed';
                    finalizeTask(task);

                    // unassign employee
                    if (task.assignedTo) {
                        window.taskAssignment.unassignTask(task.id);
                    }
                }
            }
        });

        // auto-assign
        window.taskAssignment.autoAssignTasks();
    }

    function finalizeTask(task) {
        if (task.type === 'production' && task.productId) {
            const prod = window.productsData.find(p => p.id === task.productId);
            if (prod) {
                prod.inventory += 1;
            }
        }
        else if (task.type === 'fillPrescription') {
            const prod = window.productsData.find(p => p.id === task.productId);
            if (prod) {
                prod.inventory = Math.max(prod.inventory - (task.quantityNeeded || 1), 0);
            }
            if (task.customerId) {
                window.prescriptions.prescriptionFilled(task.prescriptionId, task.customerId);
            }
        }
        else if (task.type === 'customerInteraction') {
            if (task.customerId) {
                const customer = window.customers.getCustomerById(task.customerId);
                if (customer) {
                    // Check-in finished -> 'waitingForConsultation'
                    if (customer.status === 'waitingForCheckIn') {
                        window.customers.updateCustomerStatus(task.customerId, 'waitingForConsultation');
                    }
                    // Checkout -> completed
                    else if (customer.status === 'readyForCheckout') {
                        window.finances.completePrescription(task.customerId, customer.prescriptionId);
                        window.customers.updateCustomerStatus(task.customerId, 'completed');
                        window.customers.customerLeaves(task.customerId);
                    }
                }
            }
        }
        else if (task.type === 'consultation') {
            if (task.customerId) {
                // After consult, go 'waitingForFill'
                window.customers.updateCustomerStatus(task.customerId, 'waitingForFill');
            }
        }

        // conditionally update operations
        if (window.currentPage === 'operations') {
            window.updateUI('operations');
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
