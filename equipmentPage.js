// /js/pages/equipmentPage.js

window.renderEquipmentPage = function(mainContent) {
    // Clear existing content
    mainContent.innerHTML = '';
  
    // Container
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';
  
    // Title
    const title = document.createElement('h2');
    title.textContent = 'Equipment';
    container.appendChild(title);
  
    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Purchase and manage your equipment here.';
    container.appendChild(subtitle);
  
    // -------------------------------------------------------------------------
    // 1) Filter / Search bar
    // -------------------------------------------------------------------------
    const filterRow = document.createElement('div');
    filterRow.style.display = 'flex';
    filterRow.style.alignItems = 'center';
    filterRow.style.gap = '1rem';
  
    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Search: ';
    filterLabel.style.fontWeight = 'bold';
  
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Type to filter equipment...';
    filterInput.style.flex = '1';
  
    filterLabel.appendChild(filterInput);
    filterRow.appendChild(filterLabel);
  
    container.appendChild(filterRow);
  
    // -------------------------------------------------------------------------
    // 2) Equipment grid container (cards)
    // -------------------------------------------------------------------------
    const equipmentGrid = document.createElement('div');
    equipmentGrid.style.display = 'grid';
    equipmentGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    equipmentGrid.style.gap = '1rem';
  
    container.appendChild(equipmentGrid);
  
    // We'll store references to dynamically updated elements:
    const equipmentCards = []; // array of { rootDiv, buyQtyInput, autoThreshInput, autoAmtInput, eqObj }
  
    // -------------------------------------------------------------------------
    // 3) Bottom row for bulk purchase summary
    // -------------------------------------------------------------------------
    const summaryRow = document.createElement('div');
    summaryRow.style.display = 'flex';
    summaryRow.style.justifyContent = 'space-between';
    summaryRow.style.alignItems = 'center';
    summaryRow.style.marginTop = '1rem';
  
    // Left side: total cost
    const totalCostLabel = document.createElement('strong');
    totalCostLabel.textContent = 'Total Purchase: $';
  
    const totalCostValue = document.createElement('span');
    totalCostValue.textContent = '0.00';
  
    const purchaseButton = document.createElement('button');
    purchaseButton.textContent = 'Confirm Purchase';
    purchaseButton.style.padding = '0.5rem 1rem';
    purchaseButton.style.fontWeight = 'bold';
  
    const purchaseRowLeft = document.createElement('div');
    purchaseRowLeft.appendChild(totalCostLabel);
    purchaseRowLeft.appendChild(totalCostValue);
  
    summaryRow.appendChild(purchaseRowLeft);
    summaryRow.appendChild(purchaseButton);
  
    container.appendChild(summaryRow);
  
    // -------------------------------------------------------------------------
    // Render function: builds each card for equipment
    // -------------------------------------------------------------------------
    function renderEquipment() {
      equipmentGrid.innerHTML = '';
      equipmentCards.length = 0; // clear references
  
      const filterText = filterInput.value.toLowerCase().trim();
  
      window.equipmentData.forEach(eq => {
        // If filter is set, skip items that don't match
        if (filterText && !eq.name.toLowerCase().includes(filterText)) {
          return;
        }
  
        // Card container
        const card = document.createElement('div');
        card.style.border = '1px solid #ccc';
        card.style.borderRadius = '4px';
        card.style.padding = '1rem';
        card.style.backgroundColor = '#fff';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '0.5rem';
  
        // Title row: item name + cost
        const titleRow = document.createElement('div');
        titleRow.style.display = 'flex';
        titleRow.style.justifyContent = 'space-between';
        titleRow.style.fontWeight = 'bold';
  
        const nameSpan = document.createElement('span');
        nameSpan.textContent = eq.name;
  
        const costSpan = document.createElement('span');
        costSpan.textContent = `$${eq.cost.toFixed(2)}`;
  
        titleRow.appendChild(nameSpan);
        titleRow.appendChild(costSpan);
  
        card.appendChild(titleRow);
  
        // Owned, capacity, durability row
        const infoRow = document.createElement('div');
        infoRow.style.display = 'flex';
        infoRow.style.flexDirection = 'column';
  
        const ownedLine = document.createElement('p');
        ownedLine.textContent = `Owned: ${eq.owned}`;
        infoRow.appendChild(ownedLine);
  
        // capacity
        const capacityLine = document.createElement('p');
        capacityLine.textContent = `Capacity: ${eq.capacity}`;
        infoRow.appendChild(capacityLine);
  
        // durability
        const durabilityLine = document.createElement('p');
        durabilityLine.textContent = `Durability: ${eq.durability}%`;
        infoRow.appendChild(durabilityLine);
  
        card.appendChild(infoRow);
  
        // row to set buy quantity
        const buyRow = document.createElement('div');
        buyRow.style.display = 'flex';
        buyRow.style.alignItems = 'center';
        buyRow.style.gap = '0.5rem';
  
        const buyQtyLabel = document.createElement('span');
        buyQtyLabel.textContent = 'Buy Qty: ';
  
        const buyQtyInput = document.createElement('input');
        buyQtyInput.type = 'number';
        buyQtyInput.value = '0';
        buyQtyInput.style.width = '60px';
  
        buyRow.appendChild(buyQtyLabel);
        buyRow.appendChild(buyQtyInput);
  
        card.appendChild(buyRow);
  
        // row to set auto-purchase threshold & amount
        const autoRow = document.createElement('div');
        autoRow.style.display = 'flex';
        autoRow.style.flexDirection = 'column';
        autoRow.style.gap = '0.25rem';
  
        const autoTitle = document.createElement('strong');
        autoTitle.textContent = 'Auto-Purchase Settings';
        autoRow.appendChild(autoTitle);
  
        const autoThreshWrapper = document.createElement('div');
        autoThreshWrapper.style.display = 'flex';
        autoThreshWrapper.style.gap = '0.5rem';
        autoThreshWrapper.style.alignItems = 'center';
  
        const autoThreshLabel = document.createElement('span');
        autoThreshLabel.textContent = 'Threshold:';
  
        const autoThreshInput = document.createElement('input');
        autoThreshInput.type = 'number';
        autoThreshInput.value = eq.autoPurchaseThreshold || 0;
        autoThreshInput.style.width = '60px';
  
        autoThreshWrapper.appendChild(autoThreshLabel);
        autoThreshWrapper.appendChild(autoThreshInput);
  
        const autoAmtWrapper = document.createElement('div');
        autoAmtWrapper.style.display = 'flex';
        autoAmtWrapper.style.gap = '0.5rem';
        autoAmtWrapper.style.alignItems = 'center';
  
        const autoAmtLabel = document.createElement('span');
        autoAmtLabel.textContent = 'Amount:';
  
        const autoAmtInput = document.createElement('input');
        autoAmtInput.type = 'number';
        autoAmtInput.value = eq.autoPurchaseAmount || 0;
        autoAmtInput.style.width = '60px';
  
        autoAmtWrapper.appendChild(autoAmtLabel);
        autoAmtWrapper.appendChild(autoAmtInput);
  
        autoRow.appendChild(autoThreshWrapper);
        autoRow.appendChild(autoAmtWrapper);
  
        card.appendChild(autoRow);
  
        equipmentGrid.appendChild(card);
  
        // track references
        equipmentCards.push({
          rootDiv: card,
          buyQtyInput,
          autoThreshInput,
          autoAmtInput,
          eqObj: eq
        });
      });
    }
  
    // -------------------------------------------------------------------------
    // calculate total cost of all selected equipment
    // -------------------------------------------------------------------------
    function calculateTotalCost() {
      let sum = 0;
      equipmentCards.forEach(entry => {
        const qty = parseInt(entry.buyQtyInput.value, 10) || 0;
        if (qty > 0) {
          sum += qty * entry.eqObj.cost;
        }
      });
      return sum;
    }
  
    // -------------------------------------------------------------------------
    // confirm purchase logic
    // -------------------------------------------------------------------------
    function confirmPurchase() {
      const totalCost = calculateTotalCost();
      if (window.financesData.cash < totalCost) {
        alert('Not enough cash to buy this equipment!');
        return;
      }
      // subtract cost
      window.financesData.cash -= totalCost;
  
      // increment eq.owned
      equipmentCards.forEach(entry => {
        const qty = parseInt(entry.buyQtyInput.value, 10) || 0;
        if (qty > 0) {
          entry.eqObj.owned += qty;
          entry.buyQtyInput.value = '0';
        }
        // also update auto-threshold & amount
        const newThresh = parseInt(entry.autoThreshInput.value, 10) || 0;
        const newAmt = parseInt(entry.autoAmtInput.value, 10) || 0;
        entry.eqObj.autoPurchaseThreshold = newThresh;
        entry.eqObj.autoPurchaseAmount = newAmt;
      });
  
      // re-render finances
      window.updateFinancialSummary(window.financesData);
      // re-render the page
      renderEquipment();
      updateTotalCostDisplay();
  
      alert(`Purchase successful! Spent $${totalCost.toFixed(2)}.\nCash left: $${window.financesData.cash.toFixed(2)}`);
    }
  
    // -------------------------------------------------------------------------
    // update total cost display
    // -------------------------------------------------------------------------
    function updateTotalCostDisplay() {
      const sum = calculateTotalCost();
      totalCostValue.textContent = sum.toFixed(2);
    }
  
    // watch changes on each card’s buyQty, auto-threshold, auto-amount
    function watchEquipmentChanges() {
      equipmentCards.forEach(entry => {
        entry.buyQtyInput.addEventListener('input', () => {
          updateTotalCostDisplay();
        });
        // For auto-purchase fields, we do not affect total cost directly,
        // but we might want to store them whenever changed. Let's do so on confirm.
        entry.autoThreshInput.addEventListener('input', () => {
          // No cost change, do nothing besides store on confirm
        });
        entry.autoAmtInput.addEventListener('input', () => {
          // No cost change, do nothing besides store on confirm
        });
      });
    }
  
    // filter input => re-render
    filterInput.addEventListener('input', () => {
      renderEquipment();
      watchEquipmentChanges();
      updateTotalCostDisplay();
    });
  
    purchaseButton.addEventListener('click', confirmPurchase);
  
    // initial
    mainContent.appendChild(container);
  
    renderEquipment();
    watchEquipmentChanges();
    updateTotalCostDisplay();
  };
  