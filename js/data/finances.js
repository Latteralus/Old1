// /js/data/finances.js

window.financesData = {
  cash: 10000,
  dailyIncome: 0,
  pendingInsuranceIncome: 0, // Track pending insurance payouts separately
  pendingOrders: 0,
  completedOrders: 0,
  overhead: 500 // e.g., daily overhead (rent, utilities)
};

window.finances = {
  applyDailyCosts: function() {
      // 1) Sum employee daily wages
      let totalWages = 0;
      window.employeesData.forEach(emp => {
          // Assume monthly salary is spread over 30 days
          const dailyPay = emp.salary / 30;
          totalWages += dailyPay;
      });

      // 2) Overhead
      const overheadCost = window.financesData.overhead;

      // 3) Subtract from cash
      const totalCost = totalWages + overheadCost;
      window.financesData.cash -= totalCost;

      // 4) Summarize in dailyIncome if desired (or separate)
      // dailyIncome might represent just sales minus costs
      window.financesData.dailyIncome -= totalCost;

      // 5) Process insurance claims at the end of the day
      this.processInsuranceClaims();

      // 6) Update UI
      window.updateUI("finances");
  },

  // Call this whenever an order is completed
  completePrescription: function(customerId, prescriptionId) {
      const customer = window.customers.activeCustomers.find(c => c.id === customerId);
      const prescription = window.prescriptions.getPrescription(prescriptionId);

      if (!customer) {
          console.error(`Customer not found for ID: ${customerId}`);
          return;
      }

      if (!prescription) {
          console.error(`Prescription not found for ID: ${prescriptionId}`);
          return;
      }

      const product = window.productsData.find(p => p.id === prescription.productId);

      if (!product) {
          console.error(`Product not found for ID: ${prescription.productId}`);
          return;
      }
      
      const price = product.price * prescription.dosage;
      const copayPercentage = customer.insurance.copayPercentage;
      const copay = price * (copayPercentage / 100);

      // Deduct copay from customer
      window.financesData.cash += copay;
      window.financesData.dailyIncome += copay;

      // Add insurance claim
      window.insuranceClaims.addClaim(customerId, prescriptionId, price, copay);

      // Update pending insurance income
      window.financesData.pendingInsuranceIncome += (price - copay);

      // Update prescription status to completed
      window.prescriptions.updatePrescriptionStatus(prescriptionId, 'completed');

      window.financesData.completedOrders++;

      console.log(`Order completed for customer ${customerId}. Copay: ${copay}, Price: ${price}`);

      // Update UI
      window.updateUI("finances");
  },

  // Process insurance claims and update finances
  processInsuranceClaims: function() {
      window.insuranceClaims.processAllClaims();

      // Update pendingInsuranceIncome (all claims have been processed)
      window.financesData.pendingInsuranceIncome = 0;

      // Update UI
      window.updateUI("finances");
  },

  // Example function to add income (e.g., from a cash sale without insurance)
  addIncome: function(amount) {
      window.financesData.cash += amount;
      window.financesData.dailyIncome += amount;

      // Update UI
      window.updateUI("finances");
  }
};