// /js/prescriptions.js
window.prescriptions = {
    activePrescriptions: [],

    generatePrescription: function(customerId) {
        // Get the customer
        const customer = window.customers.activeCustomers.find(c => c.id === customerId);

        // Determine available products based on research level
        const unlockedProducts = window.research.getUnlockedProducts();
        
        // Filter out products that the pharmacy does not have the equipment for
        const availableProducts = unlockedProducts.filter(productId => {
            const product = window.productsData.find(p => p.id === productId);
            return product.equipmentNeeded.every(eqId => {
                const equipment = window.equipmentData.find(e => e.id === eqId);
                return equipment && equipment.owned > 0;
            });
        });

        // Randomly select a product from the available products
        const randomIndex = Math.floor(Math.random() * availableProducts.length);
        const productId = availableProducts[randomIndex];
        const product = window.productsData.find(p => p.id === productId);

        // Generate a random dosage and frequency
        const dosage = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const frequencies = ["once daily", "twice daily", "three times daily", "every 4 hours", "every 6 hours", "every 8 hours", "as needed"];

        const newPrescription = {
            id: `pres-${Date.now()}`,
            customerId: customerId,
            productId: productId,
            productName: product.name,
            dosage: `${dosage} ${product.dosageForm}`,
            frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
            status: 'pending',
            doctorName: window.generateDoctorName(), // Use the function from names.js
            refillsAllowed: 0, // Placeholder for future implementation
            assignedEmployeeId: null, // Initially not assigned
            // ... other fields as needed
        };

        this.activePrescriptions.push(newPrescription);

        // Create a corresponding task for filling the prescription
        const fillTask = {
            id: `fill-${Date.now()}`,
            type: 'fillPrescription',
            prescriptionId: newPrescription.id,
            productId: newPrescription.productId,
            productName: product.name,
            totalTime: window.employees.calculateTaskCompletionTime(product.productionTime, window.employeesData.find(emp => emp.role === 'Lab Technician').id, 'compounding'), // Calculate time based on best technician
            progress: 0,
            roleNeeded: 'Lab Technician', // Default to technician
            status: 'pending',
            assignedTo: null,
            requiredEquipment: product.equipmentNeeded, // Add this line
            quantityNeeded: dosage,
            customerId: customerId
        };

        // Check if a pharmacist is available for a quicker fill time
        const pharmacistAvailable = window.employeesData.some(emp => emp.role === 'Pharmacist' && !emp.currentTaskId);
        if (pharmacistAvailable) {
            fillTask.roleNeeded = 'Pharmacist';
            fillTask.totalTime = window.employees.calculateTaskCompletionTime(product.productionTime, window.employeesData.find(emp => emp.role === 'Pharmacist').id, 'dispensing'); // Calculate time based on best pharmacist
        }

        window.taskManager.addTask(fillTask);

        // Create a customer interaction task for taking the prescription
        const customerInteractionTask = {
            id: `cust-${Date.now()}`,
            type: 'customerInteraction',
            customerId: customerId,
            totalTime: 5, // Example: 5 minutes for initial interaction
            progress: 0,
            roleNeeded: 'Pharmacist', // Or 'Lab Technician', based on your preference
            status: 'pending',
            assignedTo: null,
            // prescriptionId: newPrescription.id // NOT NEEDED
        };

        window.taskManager.addTask(customerInteractionTask);

        // Try to assign an employee to the task automatically
        window.taskAssignment.autoAssignTasks();

        // Update customer status to indicate they need a consultation
        window.customers.updateCustomerStatus(customerId, 'awaitingConsultation');

        return newPrescription.id; // Return the ID to link it to the customer
    },

    // Function to update prescription status
    updatePrescriptionStatus: function(prescriptionId, newStatus) {
        const prescription = this.activePrescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.status = newStatus;

            // Trigger UI update
            window.updateUI('operations'); // or 'prescriptions' if you have a dedicated page
        }
    },

    // Function to get a prescription by ID
    getPrescription: function(prescriptionId) {
        return this.activePrescriptions.find(p => p.id === prescriptionId);
    },

    // Called when a prescription is filled (task completed)
    prescriptionFilled: function (prescriptionId, customerId) {
        // Update prescription status
        this.updatePrescriptionStatus(prescriptionId, 'filled');

        // Update customer status
        window.customers.updateCustomerStatus(customerId, 'readyForCheckout');

        // Create a customer interaction task for checkout
        const checkoutTask = {
            id: `checkout-${Date.now()}`,
            type: 'customerInteraction',
            customerId: customerId,
            totalTime: 5, // Example: 5 minutes for checkout
            progress: 0,
            roleNeeded: 'Pharmacist', // Or 'Lab Technician'
            status: 'pending',
            assignedTo: null,
            // prescriptionId: prescriptionId // Not needed
        };
        window.taskManager.addTask(checkoutTask);

        // Auto-assign the checkout task
        window.taskAssignment.autoAssignTasks();
    },

    // Called when a customer needs a consultation (after check-in)
    createConsultationTask: function (customerId) {
        const consultationTask = {
            id: `consult-${Date.now()}`,
            type: 'consultation',
            customerId: customerId,
            totalTime: 10, // Example: 10 minutes for consultation
            progress: 0,
            roleNeeded: 'Pharmacist',
            status: 'pending',
            assignedTo: null,
        };
        window.taskManager.addTask(consultationTask);

        // Auto-assign the consultation task
        window.taskAssignment.autoAssignTasks();
    },
};