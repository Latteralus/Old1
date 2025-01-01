// /js/pages/financesPage.js

window.renderFinancesPage = function(mainContent) {
    mainContent.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'finances-page-container';

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Financial Summary';
    container.appendChild(title);

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    const tabHeaders = ['Overview', 'Daily Report', 'Monthly Report', 'Transactions'];
    const tabContents = [];

    tabHeaders.forEach(headerText => {
        const tabHeader = document.createElement('button');
        tabHeader.className = 'tab';
        tabHeader.textContent = headerText;
        tabs.appendChild(tabHeader);

        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.style.display = 'none';
        container.appendChild(tabContent);
        tabContents.push(tabContent);

        tabHeader.addEventListener('click', () => {
            // Deactivate all tabs and hide content
            const allTabs = document.querySelectorAll('.tab');
            allTabs.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            // Activate clicked tab and show content
            tabHeader.classList.add('active');
            tabContent.style.display = 'block';
        });
    });

    // Default to Overview tab
    tabs.children[0].classList.add('active');
    tabContents[0].style.display = 'block';

    // --- Overview Tab Content ---
    const overviewContent = tabContents[0];
    const overviewGrid = document.createElement('div');
    overviewGrid.className = 'overview-grid';

    // Cash Balance
    const cashBalanceDiv = document.createElement('div');
    cashBalanceDiv.className = 'finance-item';
    cashBalanceDiv.innerHTML = `<strong>Cash Balance:</strong> $${window.financesData.cash.toFixed(2)}`;
    overviewGrid.appendChild(cashBalanceDiv);

    // Today's Sales
    const todaysSalesDiv = document.createElement('div');
    todaysSalesDiv.className = 'finance-item';
    todaysSalesDiv.innerHTML = `<strong>Today's Sales:</strong> $${window.finances.getDailySales(new Date(window.gameState.currentDate)).toFixed(2)}`;
    overviewGrid.appendChild(todaysSalesDiv);

    // Today's Profit/Loss
    const todaysProfitLossDiv = document.createElement('div');
    todaysProfitLossDiv.className = 'finance-item';
    todaysProfitLossDiv.innerHTML = `<strong>Today's Profit/Loss:</strong> $${window.finances.getDailyProfitLoss(new Date(window.gameState.currentDate)).toFixed(2)}`;
    overviewGrid.appendChild(todaysProfitLossDiv);

    // Pending Insurance Income
    const pendingInsuranceDiv = document.createElement('div');
    pendingInsuranceDiv.className = 'finance-item';
    pendingInsuranceDiv.innerHTML = `<strong>Pending Insurance Income:</strong> $${window.financesData.pendingInsuranceIncome.toFixed(2)}`;
    overviewGrid.appendChild(pendingInsuranceDiv);

    // Add the grid to the overview tab
    overviewContent.appendChild(overviewGrid);

    // --- Daily Report Tab Content ---
    const dailyReportContent = tabContents[1];
    const dailySalesChartCanvas = document.createElement('canvas');
    dailySalesChartCanvas.id = 'dailySalesChart';
    dailyReportContent.appendChild(dailySalesChartCanvas);

    // --- Monthly Report Tab Content ---
    const monthlyReportContent = tabContents[2];
    const monthlySalesChartCanvas = document.createElement('canvas');
    monthlySalesChartCanvas.id = 'monthlySalesChart';
    monthlyReportContent.appendChild(monthlySalesChartCanvas);

    // --- Transactions Tab Content ---
    const transactionsContent = tabContents[3];
    const transactionsTable = document.createElement('table');
    transactionsTable.className = 'transactions-table';
    const tableHeader = transactionsTable.createTHead();
    const headerRow = tableHeader.insertRow();
    const headerLabels = ['Date', 'Time', 'Type', 'Category', 'Description', 'Amount', 'Customer ID', 'Prescription ID'];
    headerLabels.forEach(label => {
        const th = document.createElement('th');
        th.textContent = label;
        headerRow.appendChild(th);
    });
    const tableBody = transactionsTable.createTBody();
    transactionsContent.appendChild(transactionsTable);

    // Function to populate transactions table
    function populateTransactionsTable() {
        tableBody.innerHTML = ''; // Clear existing rows
        window.financesData.transactions.forEach(transaction => {
            const row = tableBody.insertRow();
            const cells = [
                window.ui.formatDate(transaction.date),
                window.ui.formatTime(transaction.date),
                transaction.type,
                transaction.category,
                transaction.description,
                transaction.amount.toFixed(2),
                transaction.customerId || '',
                transaction.prescriptionId || ''
            ];
            cells.forEach(cellData => {
                const cell = row.insertCell();
                cell.textContent = cellData;
            });
        });
    }

    // Call the function to initially populate the table
    populateTransactionsTable();

    container.appendChild(tabs);
    mainContent.appendChild(container);

    // --- Chart.js Charts ---
    // Daily Sales Chart
    const dailySalesChartData = window.finances.getDailySalesChartData();
    const dailySalesCtx = dailySalesChartCanvas.getContext('2d');
    new Chart(dailySalesCtx, {
        type: 'line',
        data: dailySalesChartData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Hourly Sales for Today'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly Sales Chart
    const monthlySalesChartData = window.finances.getMonthlySalesChartData();
    const monthlySalesCtx = monthlySalesChartCanvas.getContext('2d');
    new Chart(monthlySalesCtx, {
        type: 'bar',
        data: monthlySalesChartData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Sales for This Month'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // --- Styling ---
    const style = document.createElement('style');
    style.textContent = `
        .finances-page-container {
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .tabs {
            display: flex;
            margin-bottom: 20px;
        }
        .tab {
            padding: 10px 20px;
            border: 1px solid #ccc;
            border-bottom: none;
            background-color: #f0f0f0;
            cursor: pointer;
        }
        .tab.active {
            background-color: #fff;
            border-bottom: 1px solid #fff;
        }
        .tab-content {
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
        }
        .transactions-table {
            width: 100%;
            border-collapse: collapse;
        }
        .transactions-table th, .transactions-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .finance-item {
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
    `;
    mainContent.appendChild(style);
};