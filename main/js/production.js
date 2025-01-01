window.production = (function() {

  /**
   * drugRecipes now include both:
   * - productionTime: Bulk manufacturing time (minutes)
   * - fillTime: how long it takes to fill an individual prescription (minutes)
   */
  const drugRecipes = {
    'pd001': {
      name: 'PainRelief Plus',
      recipe: [
        { materialId: 'mat001', qty: 1 }, // Acetaminophen Base
        { materialId: 'mat006', qty: 1 }  // Microcrystalline Cellulose
      ],
      productionTime: 5, // minutes for bulk production (1 unit)
      fillTime: 2,       // minutes to fill 1 prescription
      requiredEquipment: ['eq001'] // e.g. Capsule Machine
    },
    'pd002': {
      name: 'CoughStop',
      recipe: [
        { materialId: 'mat019', qty: 1 }, // Guaifenesin
        { materialId: 'mat006', qty: 1 }
      ],
      productionTime: 4,
      fillTime: 1,
      requiredEquipment: ['eq003'] // e.g. Mixer
    },
    'pd003': {
      name: 'AllergyFix',
      recipe: [
        { materialId: 'mat020', qty: 1 }, // Loratadine
        { materialId: 'mat006', qty: 1 }
      ],
      productionTime: 4,
      fillTime: 2,
      requiredEquipment: ['eq001']
    }
    // ... expand for more products as needed
  };

  /**
   * createProductionTask(productId):
   * Creates a 'production' task to manufacture 1 unit of productId from scratch.
   * Subtracts the required materials from materialsData. 
   */
  function createProductionTask(productId) {
    const recipeInfo = drugRecipes[productId];
    if (!recipeInfo) {
      console.warn(`No recipe found for productId ${productId}`);
      return null;
    }

    // Check materials availability
    for (let item of recipeInfo.recipe) {
      const mat = window.materialsData.find(m => m.id === item.materialId);
      if (!mat || mat.inventory < item.qty) {
        console.warn(`Not enough material: ${item.materialId} to produce ${productId}`);
        return null;
      }
    }
    // Deduct materials
    for (let item of recipeInfo.recipe) {
      const mat = window.materialsData.find(m => m.id === item.materialId);
      mat.inventory -= item.qty;
    }

    // Create a new production task object
    const task = {
      id: `prod-${Date.now()}`,
      type: 'production',
      productId,
      productName: recipeInfo.name,
      totalTime: recipeInfo.productionTime,
      progress: 0,
      assignedTo: null,
      requiredEquipment: recipeInfo.requiredEquipment,
      roleNeeded: determineRoleNeeded('production', productId), // E.g. "Lab Technician" or "Tech"
      status: 'pending'
    };

    // Add to taskManager if available
    if (window.taskManager) {
      window.taskManager.addTask(task);
    } else {
      console.log('Production task created. (No taskManager available.)', task);
    }
    return task;
  }

  /**
   * createFillPrescriptionTask(productId, quantity, customerId?):
   * Creates a 'fillPrescription' task for a given product and quantity (default 1).
   * If there's enough in inventory, no production needed. Otherwise, optionally auto-create production tasks.
   */
  function createFillPrescriptionTask(productId, quantity = 1, customerId = null) {
    const recipeInfo = drugRecipes[productId];
    if (!recipeInfo) {
      console.warn(`No recipe found for productId ${productId}`);
      return null;
    }

    // Check if there's enough inventory to fill
    const productObj = window.productsData.find(p => p.id === productId);
    if (!productObj) {
      console.warn(`Product ${productId} not found in productsData.`);
      return null;
    }

    // If not enough inventory, auto-create production tasks for the shortfall (optional logic).
    if (productObj.inventory < quantity) {
      const needed = quantity - productObj.inventory;
      console.log(`Not enough inventory. Need ${needed} more. Creating production tasks...`);
      // Example: create 'needed' production tasks one by one:
      for (let i = 0; i < needed; i++) {
        createProductionTask(productId);
      }
      // For simplicity, the prescription fill can be queued after production is done,
      // or the player might wait. For now, we proceed with the fill task anyway,
      // understanding that inventory will eventually come from completed production tasks.
    }

    // Create the fillPrescription task
    const fillTask = {
      id: `fill-${Date.now()}`,
      type: 'fillPrescription',
      productId,
      productName: recipeInfo.name,
      totalTime: recipeInfo.fillTime * quantity,
      progress: 0,
      assignedTo: null,
      requiredEquipment: [], // Usually none or minimal for a fill operation (or eq001 if needed).
      roleNeeded: determineRoleNeeded('fillPrescription', productId),
      status: 'pending',
      quantityNeeded: quantity,
      customerId: customerId // If you want to tie this to a specific customer's record
    };

    // Add fill task to manager
    if (window.taskManager) {
      window.taskManager.addTask(fillTask);
    } else {
      console.log('FillPrescription task created. (No taskManager available.)', fillTask);
    }
    return fillTask;
  }

  /**
   * Helper function: determines which role is needed for the given task type.
   * For example, "production" might need a "Lab Technician",
   * "fillPrescription" might need a "Tech" or "Pharmacist" (depending on realism).
   */
  function determineRoleNeeded(taskType, productId) {
    // Basic example logic:
    if (taskType === 'production') {
      // e.g., Lab Technician or Tech
      return 'Lab Technician';
    } else if (taskType === 'fillPrescription') {
      // Maybe a 'Tech' handles normal fills. 
      // Pharmacist might handle final verification if you want more depth.
      return 'Tech';
    }
    return 'Tech'; // fallback
  }

  return {
    drugRecipes,
    createProductionTask,
    createFillPrescriptionTask
  };

})();
