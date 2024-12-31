// /js/prescriptions.js

window.prescriptions = {
    activePrescriptions: [],

    generatePrescription: function(customerId) {
        const customer = window.customers.getCustomerById(customerId);
        if (!customer) {
            console.error('No customer found for generatePrescription:', customerId);
            return null;
        }

        // Pick an available product
        const unlockedProducts = window.research.getUnlockedProducts();
        // Filter for equipment, etc. (omitted for brevity)
        // Suppose we pick one randomly:
        // e.g.:
        const productId = unlockedProducts[Math.floor(Math.random() * unlockedProducts.length)];
        const product = window.productsData.find(p => p.id === productId);
        if (!product) {
            console.error('No product found for generatePrescription:', productId);
            return null;
        }

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

        // Auto-assign tasks
        window.taskAssignment.autoAssignTasks();

        return newPrescription.id;
    },

    updatePrescriptionStatus: function(prescriptionId, newStatus) {
        const prescription = this.activePrescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.status = newStatus;
            window.ui.updatePrescriptions();
        }
    },

    // When fillPrescription completes
    prescriptionFilled: function (prescriptionId, customerId) {
        this.updatePrescriptionStatus(prescriptionId, 'filled');

        const customer = window.customers.getCustomerById(customerId);
        if (!customer) {
            console.warn(`Customer not found during prescriptionFilled: ${customerId}`);
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

        // Auto-assign
        window.taskAssignment.autoAssignTasks();
    },

    // Creates a consultation task for Pharmacist after check-in
    createConsultationTask: function (customerId) {
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

        // auto-assign
        window.taskAssignment.autoAssignTasks();
    },

    getPrescription: function(prescriptionId) {
        return this.activePrescriptions.find(p => p.id === prescriptionId);
    }
};
