// js/data/insuranceClaims.js
window.insuranceClaims = {
    pendingClaims: [], // Array to store pending claims

    // Function to add a new claim
    addClaim(customerId, prescriptionId, totalAmount, copayAmount) {
        const insurancePlan = window.customers.activeCustomers.find(c => c.id === customerId).insurance;
        const claim = {
            customerId: customerId,
            prescriptionId: prescriptionId,
            insurance: insurancePlan,
            totalAmount: totalAmount,
            copayAmount: copayAmount,
            amountDue: totalAmount - copayAmount,
            paid: false // Flag to indicate if the claim has been paid
        };
        this.pendingClaims.push(claim);
    },

    // Function to process claims for a specific insurance company
    processClaims(insuranceName) {
        const claimsToProcess = this.pendingClaims.filter(claim => claim.insurance.planName === insuranceName && !claim.paid);

        let totalPayout = 0;
        claimsToProcess.forEach(claim => {
            totalPayout += claim.amountDue;
            claim.paid = true; // Mark claim as paid
        });

        // Update finances
        window.financesData.cash += totalPayout;
        window.financesData.dailyIncome += totalPayout; // Or track in a separate insuranceIncome property

        // Log or display the payout (for debugging/UI)
        console.log(`Processed claims for ${insuranceName}. Total payout: ${totalPayout}`);
    },

    // Function to process all claims at the end of the day
    processAllClaims() {
        const uniqueInsurances = new Set(this.pendingClaims.filter(claim => !claim.paid).map(claim => claim.insurance.planName));
        uniqueInsurances.forEach(insuranceName => {
            this.processClaims(insuranceName);
        });
    },

    // Function to remove a claim (e.g., if a prescription is canceled)
    removeClaim(prescriptionId) {
        this.pendingClaims = this.pendingClaims.filter(claim => claim.prescriptionId !== prescriptionId);
    }
};