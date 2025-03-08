// taskManager.js

window.taskManager = (function() {
    const tasks = [];

    function addTask(task) {
        // Add an ID if it doesn't have one
        if (!task.id) {
            task.id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        
        // Make sure progress is initialized
        if (task.progress === undefined) {
            task.progress = 0;
        }
        
        // Set initial status if not specified
        if (!task.status) {
            task.status = 'pending';
        }
        
        // Store task creation time for age-based prioritization
        task.createdAt = Date.now();
        
        // Add the task to the array
        tasks.push(task);
        console.log(`[taskManager.js] Task added: ${task.type} - ${task.id}`);
        
        // Log additional customer-related information
        if (task.customerId) {
            const customer = window.customers.getCustomerById(task.customerId);
            if (customer) {
                console.log(`[taskManager.js] Task ${task.id} is for customer ${customer.firstName} ${customer.lastName} (status: ${customer.status})`);
            }
        }
        
        // Auto-assign tasks when a new one is added
        setTimeout(() => window.taskAssignment.autoAssignTasks(), 100);
    }

    function getTaskById(taskId) {
        return tasks.find(t => t.id === taskId);
    }

    function getUnassignedTasks() {
        return tasks.filter(t => t.assignedTo === null && t.status === 'pending');
    }

    function getTasksForEmployee(empId) {
        return tasks.filter(t => t.assignedTo === empId && t.status !== 'completed');
    }

    function getTasksForCustomer(customerId) {
        return tasks.filter(t => t.customerId === customerId && t.status !== 'completed');
    }

    function updateTasks(minutes) {
        console.log(`[taskManager.js] Updating tasks for ${minutes} minute(s). Current tasks: ${tasks.length}`);
        
        // Create a copy of the array to iterate through as the original may be modified
        const tasksCopy = [...tasks];
        
        // Process each task in the array
        tasksCopy.forEach(task => {
            // Only process tasks that are in progress and have an assigned employee
            if (task.status === 'inProgress' && task.assignedTo) {
                // Verify the assigned employee still has this task
                const employee = window.employees.getEmployeeById(task.assignedTo);
                if (employee && employee.currentTaskId === task.id) {
                    // For prescription tasks, check product inventory
                    if (task.type === 'fillPrescription') {
                        if (!window.taskAssignment.canFillPrescription(task.prescriptionId)) {
                            console.warn(`[taskManager.js] Insufficient ${task.productName} in inventory for fillPrescription task; unassigning employee.`);
                            window.taskAssignment.unassignTask(task.id);
                            return;
                        }
                    } 
                    // For compound tasks, check material availability
                    else if (task.type === 'compound') {
                        const product = window.productsData.find(p => p.id === task.productId);
                        if (!window.production.canCompound(product)) {
                            console.warn(`[taskManager.js] Insufficient materials to compound ${product.name}; unassigning employee.`);
                            window.taskAssignment.unassignTask(task.id);
                            return;
                        }
                    }
                    
                    // Add progress for the elapsed time
                    task.progress += minutes;
                    console.log(`[taskManager.js] Task ${task.id} (${task.type}) progress: ${task.progress}/${task.totalTime}`);
                    
                    // Check if the task is now complete
                    if (task.progress >= task.totalTime) {
                        console.log(`[taskManager.js] Task ${task.id} (${task.type}) is now complete!`);
                        task.status = 'completed';
                        finalizeTask(task);
                    }
                } else {
                    // Task is in-progress but employee doesn't have it assigned
                    console.warn(`[taskManager.js] Task ${task.id} is assigned to employee ${task.assignedTo} but employee doesn't have this task. Unassigning.`);
                    window.taskAssignment.unassignTask(task.id);
                }
            } 
            // Check for tasks with "pending-dependent" status that might need to be activated
            else if (task.status === 'pending-dependent' && task.dependencyTaskId) {
                const dependency = tasks.find(t => t.id === task.dependencyTaskId);
                if (!dependency || dependency.status === 'completed') {
                    console.log(`[taskManager.js] Dependency task ${task.dependencyTaskId} is complete. Activating task ${task.id}.`);
                    task.status = 'pending'; // Change to regular pending so it can be assigned
                    setTimeout(() => window.taskAssignment.autoAssignTasks(), 100);
                }
            }
        });
    }

    function finalizeTask(task) {
        console.log(`[finalizeTask] Finalizing task: ${task.id} (${task.type}), assignedTo: ${task.assignedTo}`);

        // Find the employee assigned to this task
        let employee = null;
        if (task.assignedTo) {
            employee = window.employees.getEmployeeById(task.assignedTo);
            if (employee) {
                // Update employee morale and mood based on task completion
                window.employees.updateEmployeeMoodOnTaskCompletion(employee.id, task.type);
                
                // Free the employee by clearing their currentTaskId
                employee.currentTaskId = null;
                console.log(`[finalizeTask] Employee ${employee.firstName} ${employee.lastName} is now free.`);
            }
            
            // Clear task assignment
            task.assignedTo = null;
        }

        // Handle production-related task completion (inventory updates)
        window.production.handleTaskCompletion(task);

        // Handle specific task type completions
        if (task.type === 'fillPrescription') {
            if (task.customerId) {
                window.prescriptions.prescriptionFilled(task.prescriptionId, task.customerId);
                console.log(`[finalizeTask] Prescription ${task.prescriptionId} filled for customer ${task.customerId}`);
            }
        } 
        else if (task.type === 'customerInteraction') {
            if (task.customerId) {
                const customer = window.customers.getCustomerById(task.customerId);
                if (customer) {
                    console.log(`[finalizeTask] customerInteraction - Customer status before: ${customer.status}`);
                    
                    if (customer.status === 'waitingForCheckIn') {
                        window.customers.updateCustomerStatus(task.customerId, 'waitingForConsultation');
                        console.log(`[finalizeTask] Customer ${task.customerId} checked in, now waiting for consultation`);
                    } 
                    else if (customer.status === 'readyForCheckout') {
                        // Process payment
                        window.finances.completePrescription(task.customerId, customer.prescriptionId);
                        
                        // Mark customer as complete and have them leave
                        window.customers.updateCustomerStatus(task.customerId, 'completed');
                        window.customers.customerLeaves(task.customerId);
                        
                        console.log(`[finalizeTask] Customer ${task.customerId} checked out and has left`);
                    }
                    else {
                        console.warn(`[finalizeTask] Customer interaction completed but customer status is unexpected: ${customer.status}`);
                    }
                } else {
                    console.warn(`[finalizeTask] Customer ${task.customerId} not found for completed interaction`);
                }
            }
        } 
        else if (task.type === 'consultation') {
            if (task.customerId) {
                window.customers.updateCustomerStatus(task.customerId, 'waitingForFill');
                console.log(`[finalizeTask] Consultation completed, customer ${task.customerId} now waiting for prescription fill`);
            }
        } 
        else if (task.type === 'compound') {
            // If this was a compound task with dependents, activate them
            const dependentTasks = tasks.filter(t => 
                t.dependencyTaskId === task.id && 
                t.status === 'pending-dependent');
                
            if (dependentTasks.length > 0) {
                console.log(`[finalizeTask] Found ${dependentTasks.length} dependent tasks to activate.`);
                dependentTasks.forEach(depTask => {
                    depTask.status = 'pending'; // Make them available for assignment
                    console.log(`[finalizeTask] Dependent task ${depTask.id} activated`);
                });
            }
        }

        // Remove the completed task from the tasks array
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            console.log(`[finalizeTask] Task ${task.id} removed from task list.`);
        }

        // Trigger auto-assignment of tasks
        setTimeout(() => window.taskAssignment.autoAssignTasks(), 100);
        
        // Update UI if needed
        if (window.currentPage === 'operations') {
            setTimeout(() => window.ui.updateCustomers(), 150);
            setTimeout(() => window.ui.updatePrescriptions(), 150);
        }
    }

    function debugTaskStatus() {
        console.log("=== TASK SYSTEM DEBUG ===");
        console.log(`Total tasks: ${tasks.length}`);
        
        // Count tasks by type and status
        const taskCounts = {};
        tasks.forEach(task => {
            const key = `${task.type}_${task.status}`;
            taskCounts[key] = (taskCounts[key] || 0) + 1;
        });
        
        console.log("Task counts by type and status:", taskCounts);
        
        // Check for any customer with no active tasks
        const customersWithNoTasks = window.customers.activeCustomers.filter(customer => {
            const customerTasks = tasks.filter(t => 
                t.customerId === customer.id && 
                t.status !== 'completed');
            return customerTasks.length === 0;
        });
        
        if (customersWithNoTasks.length > 0) {
            console.warn(`${customersWithNoTasks.length} customers have no active tasks!`);
            customersWithNoTasks.forEach(c => {
                console.warn(`Customer ${c.id} (${c.firstName} ${c.lastName}) - Status: ${c.status}`);
            });
        }
        
        // Check for idle employees
        const idleEmployees = window.employeesData.filter(emp => !emp.currentTaskId);
        console.log(`${idleEmployees.length}/${window.employeesData.length} employees are idle`);
        
        console.log("========================");
    }

    // Run debug check periodically
    setInterval(debugTaskStatus, 60000); // Every minute

    return {
        tasks,
        addTask,
        getTaskById,
        getUnassignedTasks,
        getTasksForEmployee,
        getTasksForCustomer,
        updateTasks,
        debugTaskStatus
    };
})();