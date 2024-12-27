// js/customers.js
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
          status: 'awaitingInteraction', // Initial status
          arrivedAt: Date.now(),
          insurance: insurance,
          prescriptionId: null,
          patience: this.customerTypes[customerType].patience,
          timer: null,
          firstName: window.getRandomFirstName(),
          lastName: window.getRandomLastName()
          // ... other fields as needed
      };
  
      this.activeCustomers.push(newCustomer);
  
      // Generate and assign a prescription
      const prescriptionId = window.prescriptions.generatePrescription(newCustomer.id);
      this.assignPrescription(newCustomer.id, prescriptionId);
  
      // Start the customer's patience timer
      this.startCustomerTimer(newCustomer.id);
  
      // Trigger UI update to display the new customer
      window.updateUI('customers');
      window.updateUI('operations');
  },

  // Function to spawn customers based on the hour and brand/reputation
  spawnCustomersForHour(hour) {
      const count = window.brandReputation.calcCustomers(hour);
      for (let i = 0; i < count; i++) {
          this.generateCustomer(hour);
      }
  },

  // Function to assign a prescription to a customer
  assignPrescription(customerId, prescriptionId) {
      const customer = this.activeCustomers.find(c => c.id === customerId);
      if (customer) {
          customer.prescriptionId = prescriptionId;
      }
  },

  // Function to update customer status
  updateCustomerStatus: function (customerId, newStatus) {
      const customer = this.activeCustomers.find(c => c.id === customerId);
      if (customer) {
          customer.status = newStatus;

          // If the new status is 'awaitingConsultation', create a consultation task
          if (newStatus === 'awaitingConsultation') {
              window.prescriptions.createConsultationTask(customerId);
          }

          // Trigger UI update
          window.updateUI('customers');
          window.updateUI('operations');
      }
  },

  customerLeaves: function (customerId) {
      const customerIndex = this.activeCustomers.findIndex(c => c.id === customerId);
      if (customerIndex > -1) {
          const customer = this.activeCustomers[customerIndex];
  
          // Clear the customer's timer
          clearInterval(customer.timer);
  
          // Remove the customer from the active list
          this.activeCustomers.splice(customerIndex, 1);
  
          // Trigger UI update
          window.updateUI('customers');
          window.updateUI('operations');
  
          console.log(`Customer ${customerId} left.`);
      }
  },

  // Function to start a customer's patience timer
  startCustomerTimer: function(customerId) {
      const customer = this.activeCustomers.find(c => c.id === customerId);
      if (customer) {
          customer.timer = setInterval(() => {
              customer.patience--;
              if (customer.patience <= 0) {
                  this.customerLeaves(customerId);
              }
          }, 60 * 1000); // Check every in-game minute (60 * 1000 milliseconds)
      }
  },

  // Helper function to randomly select a customer type
  getRandomCustomerType: function() {
      const types = Object.keys(this.customerTypes);
      const randomIndex = Math.floor(Math.random() * types.length);
      return types[randomIndex];
  },

  // Helper function to randomly assign an insurance plan
  getRandomInsurance: function() {
      const plans = window.insuranceData;
      const randomIndex = Math.floor(Math.random() * plans.length);
      return plans[randomIndex];
  },

  // ... other functions as needed (e.g., for counseling interactions)
};