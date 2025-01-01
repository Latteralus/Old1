// /js/prescriptions.js

window.prescriptions = {
    activePrescriptions: [],

    generatePrescription: function(customerId) {
        console.log(`[prescriptions.js] Generating prescription for customer: ${customerId}`);

        const customer = window.customers.getCustomerById(customerId);
        if (!customer) {
            console.error(`[prescriptions.js] No customer found for generatePrescription: ${customerId}`);
            return null;
        }

        // Pick an available product
        const unlockedProducts = window.research.getUnlockedProducts();
        const productId = unlockedProducts[Math.floor(Math.random() * unlockedProducts.length)];
        const product = window.productsData.find(p => p.id === productId);
        if (!product) {
            console.error(`[prescriptions.js] No product found for generatePrescription: ${productId}`);
            return null;
        }

        console.log(`[prescriptions.js] Selected product: ${product.name} (${productId})`);

        const newPrescription = {
            id: `pres-${Date.now()}`,
            customerId: customerId,
            productId: productId,
            productName: product.name,
            dosage: `2 ${product.dosageForm}`, // example
            frequency: 'twice daily',
            status: 'pending',
            doctorName: window.generateDoctorName(),
            refillsAllowed: 0,
            assignedEmployeeId: null
        };
        this.activePrescriptions.push(newPrescription);

        console.log(`[prescriptions.js] Created prescription: ${newPrescription.id} for customer: ${customerId}`);

        // Create a fillPrescription task (not assigned yet)
        const fillTask = {
            id: `fill-${Date.now()}`,
            type: 'fillPrescription',
            prescriptionId: newPrescription.id,
            productId: newPrescription.productId,
            productName: product.name,
            totalTime: 10, // Example base time
            progress: 0,
            roleNeeded: 'Lab Technician', // Only Lab Tech
            status: 'pending',
            assignedTo: null,
            requiredEquipment: product.equipmentNeeded,
            quantityNeeded: 1,
            customerId: customerId
        };
        window.taskManager.addTask(fillTask);

        console.log(`[prescriptions.js] Created fillPrescription task: ${fillTask.id}`);

        // Auto-assign tasks
        window.taskAssignment.autoAssignTasks();

        return newPrescription.id;
    },

    updatePrescriptionStatus: function(prescriptionId, newStatus) {
        console.log(`[prescriptions.js] Updating prescription status: ${prescriptionId} to ${newStatus}`);

        const prescription = this.activePrescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.status = newStatus;
            window.ui.updatePrescriptions();
        } else {
            console.error(`[prescriptions.js] Prescription not found: ${prescriptionId}`);
        }
    },

    // When fillPrescription completes
    prescriptionFilled: function (prescriptionId, customerId) {
        console.log(`[prescriptions.js] Prescription filled: ${prescriptionId} for customer: ${customerId}`);

        this.updatePrescriptionStatus(prescriptionId, 'filled');

        const customer = window.customers.getCustomerById(customerId);
        if (!customer) {
            console.warn(`[prescriptions.js] Customer not found during prescriptionFilled: ${customerId}`);
            return;
        }

        // Mark them ready for checkout
        window.customers.updateCustomerStatus(customerId, 'readyForCheckout');

        // Create a checkout interaction for the Cashier
        const checkoutTask = {
            id: `checkout-${customerId}`,
            type: 'customerInteraction',
            customerId: customerId,
            totalTime: 3, // example
            progress: 0,
            roleNeeded: 'Cashier',
            status: 'pending',
            assignedTo: null
        };
        window.taskManager.addTask(checkoutTask);

        console.log(`[prescriptions.js] Created checkout task: ${checkoutTask.id}`);

        // Auto-assign
        window.taskAssignment.autoAssignTasks();
    },

    // Creates a consultation task for Pharmacist after check-in
    createConsultationTask: function (customerId) {
        console.log(`[prescriptions.js] Creating consultation task for customer: ${customerId}`);

        const consultationTask = {
            id: `consult-${customerId}`,
            type: 'consultation',
            customerId: customerId,
            totalTime: 5, // e.g. 5 minutes
            progress: 0,
            roleNeeded: 'Pharmacist',
            status: 'pending',
            assignedTo: null
        };
        window.taskManager.addTask(consultationTask);

        console.log(`[prescriptions.js] Created consultation task: ${consultationTask.id}`);

        // auto-assign
        window.taskAssignment.autoAssignTasks();
    },

    getPrescription: function(prescriptionId) {
        return this.activePrescriptions.find(p => p.id === prescriptionId);
    }
};