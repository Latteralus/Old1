// /js/data/finances.js

// Global markup for suggested prices (default 25%)
window.globalMarkup = 1.25;

window.financesData = {
    cash: 10000,
    dailyIncome: 0,
    pendingInsuranceIncome: 0, // Track pending insurance payouts separately
    pendingOrders: 0,
    completedOrders: 0,
    overhead: 500, // e.g., daily overhead (rent, utilities)
    transactions: [] // Add a transactions array
};

window.finances = {
    applyDailyCosts: function() {
        // 1) Sum employee daily wages
        let totalWages = 0;
        window.employeesData.forEach(emp => {
            const dailyPay = emp.salary / 30;
            totalWages += dailyPay;

            // Add wage transaction
            window.finances.addTransaction({
                date: new Date(window.gameState.currentDate),
                type: 'expense',
                category: 'wages',
                amount: dailyPay,
                description: `Wage for ${emp.firstName} ${emp.lastName} (${emp.role})`,
            });
        });

        // 2) Overhead
        const overheadCost = window.financesData.overhead;

        // Add overhead transaction
        window.finances.addTransaction({
            date: new Date(window.gameState.currentDate),
            type: 'expense',
            category: 'overhead',
            amount: overheadCost,
            description: 'Daily overhead costs',
        });

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

        // Add copay transaction
        window.finances.addTransaction({
            date: new Date(window.gameState.currentDate),
            type: 'income',
            category: 'copay',
            amount: copay,
            description: `Copay for ${prescription.productName} (Prescription ID: ${prescription.id})`,
            customerId: customerId
        });

        // Add insurance claim
        window.insuranceClaims.addClaim(customerId, prescriptionId, price, copay);

        // Update pending insurance income
        window.financesData.pendingInsuranceIncome += (price - copay);

        // Add insurance income transaction (pending)
        window.finances.addTransaction({
            date: new Date(window.gameState.currentDate),
            type: 'income',
            category: 'insurance',
            amount: price - copay,
            description: `Pending insurance claim for ${prescription.productName} (Prescription ID: ${prescription.id})`,
            customerId: customerId
        });

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
        //when claims are processed, they change pending to completed, and are added to the financesData.transactions array

        // Update pendingInsuranceIncome (all claims have been processed)
        window.financesData.pendingInsuranceIncome = 0;

        // Update UI
        window.updateUI("finances");
    },

    // Example function to add income (e.g., from a cash sale without insurance)
    addIncome: function(amount) {
        window.financesData.cash += amount;
        window.financesData.dailyIncome += amount;

        // Add income transaction
        window.finances.addTransaction({
            date: new Date(window.gameState.currentDate),
            type: 'income',
            category: 'other',
            amount: amount,
            description: 'Other income'
        });

        // Update UI
        window.updateUI("finances");
    },

    // Add a new transaction to the transactions array
    addTransaction: function(transaction) {
        window.financesData.transactions.push(transaction);
    },

    // Update a product's price (manually or by the user)
    updateProductPrice: function(productId, newPrice) {
        const product = window.productsData.find(p => p.id === productId);
        if (!product) {
            console.error(`Product not found: ${productId}`);
            return;
        }

        product.price = newPrice;
        console.log(`Price for ${product.name} updated to $${newPrice.toFixed(2)}`);

        // Optionally re-render finances or inventory UI
        window.updateUI("finances");
    },

    // Set all product prices to their suggested price
    setToSuggestedPrices: function() {
        window.productsData.forEach(product => {
            const cost = window.calculateProductCost(product.id);
            const suggestedPrice = cost * window.globalMarkup;
            product.price = suggestedPrice;
        });
        console.log("All product prices set to suggested prices.");
        window.updateUI("inventory");
    },

    // Apply a markup to all product prices
    applyMarkupToAllProducts: function(markupPercentage) {
        const markupFactor = 1 + (markupPercentage / 100);

        window.productsData.forEach(product => {
            const cost = window.calculateProductCost(product.id);
            const newPrice = cost * markupFactor;
            product.price = newPrice;
        });

        console.log(`Applied ${markupPercentage.toFixed(2)}% markup to all product prices.`);
        window.updateUI("inventory");
    },

    // --- Chart Data Functions ---

    // Get chart data for daily sales (hourly breakdown for the current day)
    getDailySalesChartData: function() {
        const today = new Date(window.gameState.currentDate);
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const hourlySales = {};

        // Initialize hourly sales to 0
        for (let i = 0; i < 24; i++) {
            hourlySales[i] = 0;
        }

        // Aggregate sales by hour
        window.financesData.transactions
            .filter(t => t.type === 'income' && t.category === 'copay' && t.date >= startOfDay && t.date <= endOfDay)
            .forEach(t => {
                const hour = t.date.getHours();
                hourlySales[hour] += t.amount;
            });

        return {
            labels: Object.keys(hourlySales).map(hour => `${hour}:00`),
            datasets: [{
                label: 'Hourly Sales',
                data: Object.values(hourlySales),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };
    },

    // Get chart data for monthly sales (daily breakdown for the current month)
    getMonthlySalesChartData: function() {
        const today = new Date(window.gameState.currentDate);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        const dailySales = {};

        // Initialize daily sales to 0 for each day of the month
        const daysInMonth = endOfMonth.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            dailySales[i] = 0;
        }

        // Aggregate sales by day
        window.financesData.transactions
            .filter(t => t.type === 'income' && t.category === 'copay' && t.date >= startOfMonth && t.date <= endOfMonth)
            .forEach(t => {
                const day = t.date.getDate();
                dailySales[day] += t.amount;
            });

        return {
            labels: Object.keys(dailySales).map(day => `Day ${day}`),
            datasets: [{
                label: 'Daily Sales',
                data: Object.values(dailySales),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    },

    // Get total sales for a specific date
    getDailySales: function(date) {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        return window.financesData.transactions
            .filter(t => t.type === 'income' && t.date >= startOfDay && t.date <= endOfDay)
            .reduce((total, t) => total + t.amount, 0);
    },

    // Get total profit/loss for a specific date
    getDailyProfitLoss: function(date) {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const income = window.financesData.transactions
            .filter(t => t.type === 'income' && t.date >= startOfDay && t.date <= endOfDay)
            .reduce((total, t) => total + t.amount, 0);

        const expenses = window.financesData.transactions
            .filter(t => t.type === 'expense' && t.date >= startOfDay && t.date <= endOfDay)
            .reduce((total, t) => total + t.amount, 0);

        return income - expenses;
    }
};