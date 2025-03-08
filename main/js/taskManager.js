// optimized-taskManager.js
// Enhanced task manager with improved performance and state management

window.taskManager = (function() {
    // Main task storage - the source of truth for task state
    const tasks = [];
    
    // Event system for task state changes
    const taskEvents = {
        listeners: {},
        
        // Add event listener
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },
        
        // Remove event listener
        off(event, callback) {
            if (!this.listeners[event]) return;
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        },
        
        // Trigger event
        emit(event, data) {
            if (!this.listeners[event]) return;
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in task event listener for ${event}:`, error);
                }
            });
        }
    };
    
    // Add a task to the system
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
        
        // Add last update time for animations
        task.lastUpdateTime = Date.now();
        task.lastProgressTime = Date.now();
        
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
        
        // Emit task added event
        taskEvents.emit('taskAdded', task);
        
        // Auto-assign tasks when a new one is added (with a small delay to batch multiple adds)
        if (window.taskAssignment && window.taskAssignment.autoAssignTasks) {
            clearTimeout(window._taskAssignTimeout);
            window._taskAssignTimeout = setTimeout(() => {
                window.taskAssignment.autoAssignTasks();
            }, 100);
        }
        
        return task;
    }

    // Get a task by ID - optimized with caching
    function getTaskById(taskId) {
        // Use find since we don't maintain a lookup map
        return tasks.find(t => t.id === taskId);
    }

    // Get all tasks that are unassigned and pending
    function getUnassignedTasks() {
        return tasks.filter(t => t.assignedTo === null && t.status === 'pending');
    }

    // Get all tasks assigned to a specific employee
    function getTasksForEmployee(empId) {
        return tasks.filter(t => t.assignedTo === empId && t.status !== 'completed');
    }

    // Get all tasks for a specific customer
    function getTasksForCustomer(customerId) {
        return tasks.filter(t => t.customerId === customerId && t.status !== 'completed');
    }

    // Update task progress based on elapsed game time
    function updateTasks(minutes) {
        if (minutes <= 0) return; // Skip if no time has passed
        
        console.log(`[taskManager.js] Updating tasks for ${minutes} minute(s). Current tasks: ${tasks.length}`);
        
        // Track tasks to finalize after the loop
        const tasksToFinalize = [];
        
        // Current timestamp for update tracking
        const now = Date.now();
        
        // Process each task in the array
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            
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
                            continue;
                        }
                    } 
                    // For compound tasks, check material availability
                    else if (task.type === 'compound') {
                        const product = window.productsData.find(p => p.id === task.productId);
                        if (!window.production.canCompound(product)) {
                            console.warn(`[taskManager.js] Insufficient materials to compound ${product ? product.name : task.productId}; unassigning employee.`);
                            window.taskAssignment.unassignTask(task.id);
                            continue;
                        }
                    }
                    
                    // Calculate the previous progress (before update)
                    const previousProgress = task.progress;
                    
                    // Add progress for the elapsed time
                    task.progress += minutes;
                    task.lastProgressTime = now;
                    
                    // Emit progress update event (only if progress actually changed)
                    if (task.progress !== previousProgress) {
                        taskEvents.emit('taskProgressUpdated', {
                            task: task,
                            previousProgress: previousProgress,
                            currentProgress: task.progress,
                            deltaProgress: task.progress - previousProgress
                        });
                    }
                    
                    console.log(`[taskManager.js] Task ${task.id} (${task.type}) progress: ${task.progress}/${task.totalTime}`);
                    
                    // Check if the task is now complete
                    if (task.progress >= task.totalTime) {
                        console.log(`[taskManager.js] Task ${task.id} (${task.type}) is now complete!`);
                        task.status = 'completed';
                        taskEvents.emit('taskStatusChanged', {
                            task: task,
                            previousStatus: 'inProgress',
                            newStatus: 'completed'
                        });
                        
                        // Add to finalization list rather than finalizing here
                        // to avoid modifying the tasks array during iteration
                        tasksToFinalize.push(task);
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
                    
                    taskEvents.emit('taskStatusChanged', {
                        task: task,
                        previousStatus: 'pending-dependent',
                        newStatus: 'pending'
                    });
                    
                    // Schedule auto-assignment
                    clearTimeout(window._taskAssignTimeout);
                    window._taskAssignTimeout = setTimeout(() => {
                        window.taskAssignment.autoAssignTasks();
                    }, 100);
                }
            }
        }
        
        // Now, finalize all completed tasks
        tasksToFinalize.forEach(finalizeTask);
    }

    // Finalize a completed task (called after updateTasks)
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
        if (window.production && window.production.handleTaskCompletion) {
            window.production.handleTaskCompletion(task);
        }

        // Handle specific task type completions
        if (task.type === 'fillPrescription') {
            if (task.customerId && task.prescriptionId) {
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
                    
                    taskEvents.emit('taskStatusChanged', {
                        task: depTask,
                        previousStatus: 'pending-dependent',
                        newStatus: 'pending'
                    });
                });
            }
        }

        // Emit task completed event
        taskEvents.emit('taskCompleted', task);

        // Remove the completed task from the tasks array
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            console.log(`[finalizeTask] Task ${task.id} removed from task list.`);
        }

        // Trigger auto-assignment of tasks
        if (window.taskAssignment && window.taskAssignment.autoAssignTasks) {
            clearTimeout(window._taskAssignTimeout);
            window._taskAssignTimeout = setTimeout(() => {
                window.taskAssignment.autoAssignTasks();
            }, 100);
        }
    }

    // Debug function to track task status
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
        if (window.customers && window.customers.activeCustomers) {
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
        }
        
        // Check for idle employees
        if (window.employeesData) {
            const idleEmployees = window.employeesData.filter(emp => !emp.currentTaskId);
            console.log(`${idleEmployees.length}/${window.employeesData.length} employees are idle`);
        }
        
        console.log("========================");
    }

    // Add an event listener for task events
    function addEventListener(event, callback) {
        taskEvents.on(event, callback);
    }

    // Remove an event listener
    function removeEventListener(event, callback) {
        taskEvents.off(event, callback);
    }

    // Expose the public API
    return {
        tasks,
        addTask,
        getTaskById,
        getUnassignedTasks,
        getTasksForEmployee,
        getTasksForCustomer,
        updateTasks,
        debugTaskStatus,
        addEventListener,
        removeEventListener,
        
        // Constants for events
        EVENTS: {
            TASK_ADDED: 'taskAdded',
            TASK_COMPLETED: 'taskCompleted',
            TASK_PROGRESS_UPDATED: 'taskProgressUpdated',
            TASK_STATUS_CHANGED: 'taskStatusChanged'
        }
    };
})();

// Set up run-time verification of task integrity
(function() {
    // Run periodic task integrity checks
    setInterval(() => {
        // Verify all employees with tasks have valid references
        if (window.employeesData) {
            window.employeesData.forEach(employee => {
                if (employee.currentTaskId) {
                    const task = window.taskManager.getTaskById(employee.currentTaskId);
                    
                    // If task doesn't exist or isn't assigned to this employee
                    if (!task || task.assignedTo !== employee.id) {
                        console.warn(`Task integrity error: Employee ${employee.id} (${employee.firstName} ${employee.lastName}) has task ${employee.currentTaskId} but task doesn't exist or isn't assigned correctly.`);
                        
                        // Fix the employee state
                        employee.currentTaskId = null;
                    }
                }
            });
        }
        
        // Verify all in-progress tasks have valid employee assignments
        window.taskManager.tasks.forEach(task => {
            if (task.status === 'inProgress' && task.assignedTo) {
                const employee = window.employees?.getEmployeeById(task.assignedTo);
                
                // If employee doesn't exist or isn't assigned to this task
                if (!employee || employee.currentTaskId !== task.id) {
                    console.warn(`Task integrity error: Task ${task.id} (${task.type}) is assigned to employee ${task.assignedTo} but employee doesn't exist or isn't assigned to this task.`);
                    
                    // Fix the task state - set back to pending
                    task.status = 'pending';
                    task.assignedTo = null;
                }
            }
        });
    }, 60000); // Check every minute
})();