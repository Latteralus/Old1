// /js/ui.js

window.ui = {
    updateCustomers: function() {
        const customersList = document.getElementById('customersList');
        if (!customersList) {
            console.warn("The 'customersList' element was not found in the DOM.");
            return;
        }

        customersList.innerHTML = ''; // Clear existing list

        const customers = window.customers.activeCustomers;

        if (customers.length === 0) {
            const noCustomersMessage = document.createElement('p');
            noCustomersMessage.textContent = 'No customers currently.';
            customersList.appendChild(noCustomersMessage);
            return;
        }

        customers.forEach(customer => {
            const customerItem = document.createElement('div');
            customerItem.className = 'customer-item';
            customerItem.style.border = '1px solid #ddd';
            customerItem.style.borderRadius = '4px';
            customerItem.style.padding = '0.5rem';
            customerItem.style.marginBottom = '0.5rem';
            customerItem.style.backgroundColor = '#f9f9f9';

            const customerName = document.createElement('strong');
            customerName.textContent = `${customer.firstName} ${customer.lastName}`;
            customerItem.appendChild(customerName);

            // Make customer status more prominent
            const customerStatus = document.createElement('p');
            customerStatus.style.marginTop = '0.25rem';
            customerStatus.style.fontSize = '1.1em';
            customerStatus.textContent = `Status: ${customer.status}`;
            if (customer.status === 'awaitingConsultation') {
                customerStatus.style.color = 'orange';
            } else if (customer.status === 'readyForCheckout') {
                customerStatus.style.color = 'blue';
            } else if (customer.status === 'completed') {
                customerStatus.style.color = 'green';
            }
            customerItem.appendChild(customerStatus);

            // Display arrival time
            const arrivalTime = document.createElement('p');
            arrivalTime.textContent = `Arrived at: ${window.ui.formatDateTime(new Date(customer.arrivedAt))}`;
            arrivalTime.style.fontSize = '0.9em';
            arrivalTime.style.color = 'grey';
            customerItem.appendChild(arrivalTime);

            // You might want to display prescription info here or provide a link/button to view prescription details

            customersList.appendChild(customerItem);
        });
    },

    updatePrescriptions: function() {
        const prescriptionsList = document.getElementById('prescriptionsList');
        if (!prescriptionsList) {
            console.warn("The 'prescriptionsList' element was not found in the DOM.");
            return;
        }

        prescriptionsList.innerHTML = ''; // Clear existing list

        const prescriptions = window.prescriptions.activePrescriptions;

        if (prescriptions.length === 0) {
            const noPrescriptionsMessage = document.createElement('p');
            noPrescriptionsMessage.textContent = 'No active prescriptions.';
            prescriptionsList.appendChild(noPrescriptionsMessage);
            return;
        }

        prescriptions.forEach(prescription => {
            const prescriptionItem = document.createElement('div');
            prescriptionItem.className = 'prescription-item';
            prescriptionItem.style.border = '1px solid #ddd';
            prescriptionItem.style.borderRadius = '4px';
            prescriptionItem.style.padding = '0.5rem';
            prescriptionItem.style.marginBottom = '0.5rem';
            prescriptionItem.style.backgroundColor = '#f9f9f9';

            // Prescription Details
            const prescriptionId = document.createElement('strong');
            prescriptionId.textContent = `ID: ${prescription.id}`;
            prescriptionItem.appendChild(prescriptionId);

            const productName = document.createElement('p');
            productName.textContent = `Product: ${prescription.productName}`;
            prescriptionItem.appendChild(productName);

            const status = document.createElement('p');
            status.textContent = `Status: ${prescription.status}`;
            if (prescription.status === 'pending') {
                status.style.color = 'orange';
            } else if (prescription.status === 'filled') {
                status.style.color = 'blue';
            }
            prescriptionItem.appendChild(status);

            // Initially hide detailed information
            const detailsDiv = document.createElement('div');
            detailsDiv.style.display = 'none';

            const dosage = document.createElement('p');
            dosage.textContent = `Dosage: ${prescription.dosage}`;
            detailsDiv.appendChild(dosage);

            const frequency = document.createElement('p');
            frequency.textContent = `Frequency: ${prescription.frequency}`;
            detailsDiv.appendChild(frequency);

            const doctorName = document.createElement('p');
            doctorName.textContent = `Doctor: ${prescription.doctorName}`;
            detailsDiv.appendChild(doctorName);

            prescriptionItem.appendChild(detailsDiv);

            // Add a button to toggle details
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Show Details';
            toggleButton.style.marginTop = '0.5rem';
            toggleButton.addEventListener('click', () => {
                detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
                toggleButton.textContent = detailsDiv.style.display === 'none' ? 'Show Details' : 'Hide Details';
            });
            prescriptionItem.appendChild(toggleButton);

            prescriptionsList.appendChild(prescriptionItem);
        });
    },

    updateFinances: function() {
        // Update cash display
        const cashEl = document.getElementById('currentCash');
        if (cashEl) {
            cashEl.textContent = `Cash: $${window.financesData.cash.toFixed(2)}`;
        }

        // Update daily income display
        const dailyIncomeEl = document.getElementById('dailyIncome');
        if (dailyIncomeEl) {
            dailyIncomeEl.textContent = `Daily Income: $${window.financesData.dailyIncome.toFixed(2)}`;
        }

        // Update pending insurance income display
        const pendingInsuranceEl = document.getElementById('pendingInsurance');
        if (pendingInsuranceEl) {
            pendingInsuranceEl.textContent = `Pending Insurance: $${window.financesData.pendingInsuranceIncome.toFixed(2)}`;
        }

        // Update completed orders display
        const completedOrdersEl = document.getElementById('ordersCompleted');
        if (completedOrdersEl) {
            completedOrdersEl.textContent = `Completed Orders: ${window.financesData.completedOrders}`;
        }

        // Update pending orders display
        const pendingOrdersEl = document.getElementById('ordersPending');
        if (pendingOrdersEl) {
            pendingOrdersEl.textContent = `Pending Orders: ${window.financesData.pendingOrders}`;
        }
    },

    updateTime: function() {
        const timeEl = document.getElementById('gameTime');
        if (timeEl) {
            timeEl.textContent = window.ui.formatDateTime(window.gameState.currentDate);
        }
    },

    // --- Updated to prevent forced navigation ---
    updateOperations: function() {
        // Only re-render if we're already on the Operations page
        if (window.currentPage === 'operations') {
            window.renderOperationsPage(document.querySelector('.main-content'));
        }
    },

    // --- Helper functions for formatting ---
    formatDate: function(dateObj) {
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const yyyy = dateObj.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    },

    formatTime: function(dateObj) {
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    formatDateTime: function(dateObj) {
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const excisedYear = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        return `[${mm}/${dd}/${excisedYear}] [${hours}:${minutes}]`;
    }
};

// Updated window.updateUI function
window.updateUI = function (page = "") {
    if (page === "finances") {
        window.ui.updateFinances();
    }

    if (page === "customers") {
        window.ui.updateCustomers();
    }

    if (page === "prescriptions") {
        window.ui.updatePrescriptions();
    }

    if (page === "time") {
        window.ui.updateTime();
    }

    if (page === "operations") {
        window.renderOperationsPage(document.querySelector('.main-content'));
    }

    if (page === "employees") {
        window.renderEmployeesPage(document.querySelector('.main-content'));
    }
};

// Simple "router" to show pages:
window.showPage = function (pageName) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('Main content element not found!');
        return;
    }

    // Clear the current content
    mainContent.innerHTML = '';

    // Update the sidebar's active item:
    window.updateActiveNavItem(pageName);

    // Render the appropriate page content based on pageName
    switch (pageName) {
        case 'dashboard':
            window.renderDashboardPage(mainContent);
            break;
        case 'orders':
            window.renderOrdersPage(mainContent);
            break;
        case 'inventory':
            window.renderInventoryPage(mainContent);
            break;
        case 'finances':
            window.renderFinancesPage(mainContent);
            break;
        case 'employees':
            window.renderEmployeesPage(mainContent);
            break;
        case 'marketplace':
            window.renderMarketplacePage(mainContent);
            break;
        case 'customers':
            window.renderCustomersPage(mainContent);
            break;
        case 'marketing':
            window.renderMarketingPage(mainContent);
            break;
        case 'research':
            window.renderResearchPage(mainContent);
            break;
        case 'statistics':
            window.renderStatisticsPage(mainContent);
            break;
        case 'operations':
            window.renderOperationsPage(mainContent);
            break;
        case 'equipment':
            window.renderEquipmentPage(mainContent);
            break;
        default:
            mainContent.innerHTML = '<h2>Page not found</h2>';
    }
};
