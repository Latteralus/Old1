window.customers = {
  activeCustomers: [],

  spawnCustomersForHour(hour) {
    const count = window.brandReputation.calcCustomers(hour);
    for (let i = 0; i < count; i++) {
      this.activeCustomers.push({
        id: `cust-${Date.now()}-${i}`,
        status: 'waiting',
        arrivedAt: Date.now(),
        // add more fields if needed
      });
    }
  },

  completeCustomer(custId) {
    // Mark them as done or remove from activeCustomers
    this.activeCustomers = this.activeCustomers.filter(c => c.id !== custId);
  }
};
