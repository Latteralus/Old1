// /js/taskManager.js

/**
 * The taskManager object holds all functions and data required for
 * creating, assigning, and updating tasks in PharmaSim.
 *
 * A task object typically looks like:
 * {
 *   id: string,                      // e.g. "prod-1692174839" or "fill-1692175432"
 *   type: 'production' | 'fillPrescription' | 'customerInteraction' | 'consultation', // Added new task types
 *   productId: string | null,      // e.g. 'pd001'
 *   productName: string,            // e.g. 'PainRelief Plus'
 *   totalTime: number,              // in-game minutes required
 *   progress: number,              // how many in-game minutes elapsed
 *   roleNeeded: string,             // 'Tech', 'Pharmacist', 'Lab Technician', etc.
 *   status: 'pending' | 'inProgress' | 'completed',
 *   assignedTo: string | null,      // e.g. 'emp002'
 *   requiredEquipment?: string[],   // e.g. ['eq001']
 *   quantityNeeded?: number,        // for fillPrescription tasks
 *   customerId?: string | null      // if referencing a specific customer
 * }
 */

window.taskManager = (function() {
  /**
   * tasks: an array storing all tasks. 
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
   * updateTasks(minutes, employeesData):
   * Called each in-game minute (or any interval). Increments progress for inProgress tasks.
   * If a task finishes (progress >= totalTime), finalize it and free the employee.
   */
  function updateTasks(minutes) {
      tasks.forEach(task => {
          if (task.status === 'inProgress') {
              task.progress += minutes;
              if (task.progress >= task.totalTime) {
                  // Mark as completed
                  task.status = 'completed';

                  // Finalize the task (adjust inventory, finances, etc.)
                  finalizeTask(task);

                  // If assigned, unassign the employee
                  if (task.assignedTo) {
                      window.taskAssignment.unassignTask(task.id);
                  }
              }
          }
      });

      // Trigger auto-assignment of tasks after updating
      window.taskAssignment.autoAssignTasks();
  }

  /**
   * finalizeTask(task):
   * Invoked when a task completes, performing any post-completion logic:
   * - For 'production' tasks, increment product inventory by 1.
   * - For 'fillPrescription' tasks, decrement product inventory, update customer status.
   * - For 'customerInteraction' tasks, trigger appropriate next steps based on customer status.
   * - For 'consultation' tasks, update customer status.
   */
  function finalizeTask(task) {
      if (task.type === 'production' && task.productId) {
          // Increase inventory for the produced product
          const prod = window.productsData.find(p => p.id === task.productId);
          if (prod) {
              prod.inventory += 1;
          }
      } else if (task.type === 'fillPrescription' && task.productId) {
          // Deduct inventory
          const prod = window.productsData.find(p => p.id === task.productId);
          if (prod) {
              const qty = task.quantityNeeded || 1;
              prod.inventory = Math.max(prod.inventory - qty, 0);
          }
          // Update customer status to ready for checkout
          if (task.customerId) {
              window.customers.updateCustomerStatus(task.customerId, 'readyForCheckout');
              // Trigger creation of customer interaction task for checkout
              window.prescriptions.prescriptionFilled(task.prescriptionId, task.customerId); 
          }
      } else if (task.type === 'customerInteraction') {
          if (task.customerId) {
              const customer = window.customers.activeCustomers.find(c => c.id === task.customerId);
              if (customer) {
                  if (customer.status === 'awaitingInteraction') {
                      // Assuming the customer has received the prescription
                      window.customers.updateCustomerStatus(task.customerId, 'awaitingConsultation');
                  } else if (customer.status === 'readyForCheckout') {
                      // Customer is checking out
                      window.finances.completePrescription(task.customerId, customer.prescriptionId);
                      window.customers.updateCustomerStatus(task.customerId, 'completed');
                      // Trigger customer removal
                      window.customers.customerLeaves(task.customerId);
                  }
              }
          }
      } else if (task.type === 'consultation') {
          // Assuming consultation completion just changes the customer status
          if (task.customerId) {
              window.customers.updateCustomerStatus(task.customerId, 'prescriptionFilled');
          }
      }

      // Update UI
      window.updateUI('operations');
  }

  /**
   * Publicly exposed methods and data
   */
  return {
      tasks,
      addTask,
      getUnassignedTasks,
      getTasksForEmployee,
      updateTasks
  };
})();