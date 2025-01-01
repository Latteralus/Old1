// /js/production.js

window.production = (function() {

  // Function to check if a product can be compounded based on material availability
  function canCompound(product) {
      if (!product) return false;

      for (let ingredient of product.ingredients) {
          const material = window.materialsData.find(m => m.id === ingredient.id);
          if (!material || material.inventory < ingredient.quantity) {
              console.log(`[production.js] Not enough ${material.name} to compound ${product.name}`);
              return false;
          }
      }
      return true;
  }

  // Function to create a compound task for a product
  function createCompoundTask(product, quantity) {
      const compoundTask = {
          id: `compound-${product.id}-${Date.now()}`,
          type: 'compound',
          productId: product.id,
          productName: product.name,
          totalTime: product.productionTime,
          progress: 0,
          roleNeeded: 'Lab Technician',
          status: 'pending',
          assignedTo: null,
          quantityToMake: quantity // How many to compound
      };

      window.taskManager.addTask(compoundTask);
      console.log(`[production.js] Created compound task for ${quantity} ${product.name} (Task ID: ${compoundTask.id})`);
  }

  // Function to check inventory and create compound tasks if needed
  function checkAndCreateCompoundTasks() {
      console.log("[production.js] Checking inventory for compounding tasks...");
      window.productsData.forEach(product => {
          // Skip if there's already a pending or in-progress compound task for this product
          const existingCompoundTask = window.taskManager.tasks.find(
              t => t.type === 'compound' && t.productId === product.id && t.status !== 'completed'
          );
          if (existingCompoundTask) {
              console.log(`[production.js] Existing compound task found for ${product.name}, skipping.`);
              return;
          }

          // Check if inventory is below the threshold
          if (product.inventory < product.maxInventory) {
              const quantityToMake = product.maxInventory - product.inventory;
              if (canCompound(product)) {
                  createCompoundTask(product, quantityToMake);
              } else {
                  console.warn(`[production.js] Cannot create compound task for ${product.name} due to insufficient materials.`);
              }
          }
      });
  }

  // Function to handle task completion (called by taskManager when a task is finalized)
  function handleTaskCompletion(task) {
      if (task.type === 'compound') {
          const product = window.productsData.find(p => p.id === task.productId);
          if (product) {
              // Deduct materials used in compounding
              product.ingredients.forEach(ingredient => {
                  const material = window.materialsData.find(m => m.id === ingredient.id);
                  if (material) {
                      material.inventory -= ingredient.quantity * task.quantityToMake;
                  }
              });

              // Increase product inventory
              product.inventory += task.quantityToMake;
              console.log(`[production.js] Compounding completed for ${task.quantityToMake} units of ${product.name}. Inventory updated.`);
              window.updateUI('inventory');
          }
      } else if (task.type === 'fillPrescription') {
          const product = window.productsData.find(p => p.id === task.productId);
          if (product) {
              // Decrease product inventory as it's used to fill prescriptions
              product.inventory -= task.quantityNeeded;
              console.log(`[production.js] ${task.quantityNeeded} units of ${product.name} used to fill prescription. Inventory updated.`);
              window.updateUI('inventory');
          }
      }
  }

  // Initialize the production module
  function init() {
      // Perform an initial check and creation of compound tasks when the game starts
      checkAndCreateCompoundTasks();

      // Set an interval to periodically check and create compound tasks
      setInterval(checkAndCreateCompoundTasks, 60000); // Check every minute, for example
  }

  return {
      canCompound,
      createCompoundTask, // Expose this if you need to manually create compound tasks
      checkAndCreateCompoundTasks, // Expose this if you want to manually trigger inventory checks
      handleTaskCompletion,
      init
  };

})();