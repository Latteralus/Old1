// /js/taskManager.js

/**
 * The taskManager object holds all functions and data required for
 * creating, assigning, and updating tasks in PharmaSim.
 *
 * A task object typically looks like:
 * {
 *   id: string,                // e.g. "prod-1692174839" or "fill-1692175432"
 *   type: 'production' | 'fillPrescription' | ...,
 *   productId: string | null,  // e.g. 'pd001'
 *   productName: string,       // e.g. 'PainRelief Plus'
 *   totalTime: number,         // in-game minutes required
 *   progress: number,          // how many in-game minutes elapsed
 *   roleNeeded: string,        // 'Tech', 'Pharmacist', 'Lab Technician', etc.
 *   status: 'pending' | 'inProgress' | 'completed',
 *   assignedTo: string | null, // e.g. 'emp002'
 *   requiredEquipment?: string[],     // e.g. ['eq001']
 *   quantityNeeded?: number,          // for fillPrescription tasks
 *   customerId?: string | null        // if referencing a specific customer
 * }
 */

window.taskManager = (function() {
    /**
     * tasks: an array storing all active tasks. Completed tasks can remain here
     * with status 'completed' or be purged if desired.
     */
    const tasks = [];
  
    /**
     * addTask(task):
     * Adds a new task to the internal tasks array.
     */
    function addTask(task) {
      tasks.push(task);
    }
  
    /**
     * getUnassignedTasks():
     * Returns tasks that have status 'pending' and no assigned employee.
     */
    function getUnassignedTasks() {
      return tasks.filter(t => t.assignedTo === null && t.status === 'pending');
    }
  
    /**
     * getTasksForEmployee(empId):
     * Returns all tasks assigned to a specific employee (not completed).
     */
    function getTasksForEmployee(empId) {
      return tasks.filter(t => t.assignedTo === empId && t.status !== 'completed');
    }
  
    /**
     * autoAssignTasks(employeesData):
     * 1. Finds all unassigned tasks (pending).
     * 2. For each unassigned task, tries to find an employee with the matching roleNeeded who is idle (currentTaskId === null).
     * 3. Assigns the task and updates the employee's currentTaskId.
     */
    function autoAssignTasks(employeesData) {
      const unassigned = getUnassignedTasks();
  
      unassigned.forEach(task => {
        // Find an idle employee whose role matches the task
        const candidate = employeesData.find(emp => {
          return emp.role === task.roleNeeded && !emp.currentTaskId;
        });
  
        if (candidate) {
          assignTaskToEmployee(task, candidate);
        }
      });
    }
  
    /**
     * assignTaskToEmployee(task, employee):
     * Links the specified task to the employee, marking the task as 'inProgress' and
     * setting employee.currentTaskId to the task's ID.
     */
    function assignTaskToEmployee(task, employee) {
      task.assignedTo = employee.id;
      task.status = 'inProgress';
      employee.currentTaskId = task.id;
    }
  
    /**
     * updateTasks(minutes, employeesData):
     * Called each in-game minute (or any interval). Increments progress for inProgress tasks.
     * If a task finishes (progress >= totalTime), finalize it and free the employee.
     */
    function updateTasks(minutes, employeesData) {
      tasks.forEach(task => {
        if (task.status === 'inProgress') {
          task.progress += minutes;
          if (task.progress >= task.totalTime) {
            // Mark as completed
            task.status = 'completed';
  
            // If assigned, free the employee
            if (task.assignedTo) {
              const emp = employeesData.find(e => e.id === task.assignedTo);
              if (emp) {
                emp.currentTaskId = null;
              }
            }
  
            // Finalize the task (adjust inventory, finances, etc.)
            finalizeTask(task);
          }
        }
      });
    }
  
    /**
     * finalizeTask(task):
     * Invoked when a task completes, performing any post-completion logic:
     * - For 'production' tasks, increment product inventory by 1.
     * - For 'fillPrescription' tasks, decrement product inventory by task.quantityNeeded (default 1),
     *   and add revenue to financesData.
     * - Additional logic (e.g., reputation changes) can be inserted here.
     */
    function finalizeTask(task) {
      if (task.type === 'production' && task.productId) {
        // Increase inventory
        const prod = window.productsData.find(p => p.id === task.productId);
        if (prod) {
          prod.inventory += 1;
        }
      } else if (task.type === 'fillPrescription' && task.productId) {
        // Deduct inventory and add revenue
        const prod = window.productsData.find(p => p.id === task.productId);
        if (prod) {
          const qty = task.quantityNeeded || 1;
          // Deduct from inventory
          prod.inventory = Math.max(prod.inventory - qty, 0);
  
          // Add revenue to financesData
          const saleAmount = prod.suggestedPrice * qty;
          window.financesData.cash += saleAmount;
          window.financesData.dailyIncome += saleAmount;
  
          // Optional: brandReputation.gainReputation(...) if fulfilled quickly
        }
        // If referencing a specific customer, mark them as served, etc.
      }
      // Future expansions: additional task types or logic as needed
    }
  
    /**
     * Publicly exposed methods and data
     */
    return {
      tasks,
      addTask,
      getUnassignedTasks,
      getTasksForEmployee,
      autoAssignTasks,
      updateTasks
    };
  })();
  