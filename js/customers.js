// /js/customers.js

window.customers = {
    activeCustomers: [],

    customerTypes: {
        "Normal": {
            patience: 120
        },
        "Impatient": {
            patience: 60
        },
        "Patient": {
            patience: 240
        }
    },

    generateCustomer: function(hour) {
        // Determine customer type
        const customerType = this.getRandomCustomerType();

        // Assign insurance
        const insurance = this.getRandomInsurance();

        const newCustomer = {
            id: `cust-${Date.now()}`,
            type: customerType,
            status: 'waitingForCheckIn',  // Changed from 'awaitingInteraction'
            arrivedAt: window.gameState.currentDate.getTime(),
            insurance: insurance,
            prescriptionId: null,
            patience: this.customerTypes[customerType].patience,
            timer: null,
            firstName: window.getRandomFirstName(),
            lastName: window.getRandomLastName(),
            mood: 8
        };

        this.activeCustomers.push(newCustomer);

        // Generate and assign a prescription (but we won't do a fill task here)
        const prescriptionId = window.prescriptions.generatePrescription(newCustomer.id);
        this.assignPrescription(newCustomer.id, prescriptionId);

        // Start the customer's patience timer
        this.startCustomerTimer(newCustomer.id);

        // Create a "customerInteraction" task (Cashier) to check in
        const checkInTask = {
            id: `checkin-${newCustomer.id}`,
            type: 'customerInteraction',
            customerId: newCustomer.id,
            totalTime: 3, // e.g. 3 minutes to check in
            progress: 0,
            roleNeeded: 'Cashier', // Only Cashiers handle check in
            status: 'pending',
            assignedTo: null
        };
        window.taskManager.addTask(checkInTask);

        // Trigger UI updates
        window.ui.updateCustomers();
        window.ui.updateOperations();
    },

    // Assign a prescription to the customer
    assignPrescription: function(customerId, prescriptionId) {
        const customer = this.activeCustomers.find(c => c.id === customerId);
        if (customer) {
            customer.prescriptionId = prescriptionId;
        }
    },

    updateCustomerStatus: function (customerId, newStatus) {
        const customer = this.activeCustomers.find(c => c.id === customerId);
        if (customer) {
            customer.status = newStatus;

            // If they've moved to waitingForConsultation, create that task
            if (newStatus === 'waitingForConsultation') {
                window.prescriptions.createConsultationTask(customerId);
            }

            // Update UI
            window.ui.updateCustomers();
            window.ui.updateOperations();
        }
    },

    updateCustomerMood: function(customerId, moodChange) {
        const customer = this.activeCustomers.find(c => c.id === customerId);
        if (customer) {
            customer.mood = Math.max(1, Math.min(10, customer.mood + moodChange));
        }
    },

    customerLeaves: function (customerId) {
        const customerIndex = this.activeCustomers.findIndex(c => c.id === customerId);
        if (customerIndex > -1) {
            const customer = this.activeCustomers[customerIndex];

            // Clear the customer's timer
            clearInterval(customer.timer);

            // Remove from active list
            this.activeCustomers.splice(customerIndex, 1);

            // UI update
            window.ui.updateCustomers();
            window.ui.updateOperations();

            console.log(`Customer ${customerId} left.`);
        }
    },

    startCustomerTimer: function(customerId) {
        const customer = this.activeCustomers.find(c => c.id === customerId);
        if (customer) {
            customer.timer = setInterval(() => {
                customer.patience--;
                if (customer.patience <= 0) {
                    this.customerLeaves(customerId);
                }
            }, 60 * 1000);
        }
    },

    getRandomCustomerType: function() {
        const types = Object.keys(this.customerTypes);
        const randomIndex = Math.floor(Math.random() * types.length);
        return types[randomIndex];
    },

    getRandomInsurance: function() {
        const plans = window.insuranceData;
        const randomIndex = Math.floor(Math.random() * plans.length);
        return plans[randomIndex];
    },

    getCustomerById: function (customerId) {
        return this.activeCustomers.find(c => c.id === customerId);
    }
};
