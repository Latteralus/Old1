// /js/data/finances.js (expanded with overhead logic)

window.financesData = {
  cash: 10000,
  dailyIncome: 0,
  pendingOrders: 0,
  completedOrders: 0,
  overhead: 500 // e.g., daily overhead (rent, utilities)
};

window.finances = {
  applyDailyCosts() {
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
  }
};
