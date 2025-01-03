import React, { useState, useEffect } from "react";

const InventoryPage = () => {
  const [filterText, setFilterText] = useState("");
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  // Fetch data on component mount
  useEffect(() => {
    // Simulate fetching products and materials from the window object
    setProducts(window.productsData || []);
    setMaterials(window.materialsData || []);
  }, []);

  const handleSetAllPrices = () => {
    window.finances.setToSuggestedPrices();
    setProducts([...window.productsData]); // Update products after price changes
  };

  const handleApplyMarkup = (markupPercentage) => {
    if (!isNaN(markupPercentage)) {
      window.finances.applyMarkupToAllProducts(markupPercentage);
      setProducts([...window.productsData]); // Update products after markup
    } else {
      alert("Invalid markup percentage entered.");
    }
  };

  const handleSetMaxInventory = (maxInventory) => {
    if (!isNaN(maxInventory)) {
      window.productsData.forEach((product) => {
        product.maxInventory = maxInventory;
      });
      setProducts([...window.productsData]); // Update products after max inventory changes
    } else {
      alert("Invalid max inventory entered.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="inventory-page-container">
      <h2>Inventory Management</h2>
      <p>View and manage your product and material inventory.</p>

      {/* Settings Section */}
      <div className="settings-section">
        <label>Set All Products:</label>
        <button onClick={handleSetAllPrices}>Set to Suggested Price</button>

        <input
          type="number"
          placeholder="Markup %"
          min="0"
          defaultValue="25"
          onChange={(e) => handleApplyMarkup(parseFloat(e.target.value))}
        />

        <label style={{ marginLeft: "15px" }}>Set Max Inventory for All:</label>
        <input
          type="number"
          placeholder="Max Inventory"
          min="0"
          defaultValue="25"
          onBlur={(e) => handleSetMaxInventory(parseInt(e.target.value))}
        />
      </div>

      {/* Filter/Search Bar */}
      <div className="filter-row">
        <label>
          Search:
          <input
            type="text"
            placeholder="Filter by name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </label>
      </div>

      {/* Tabs */}
      <div className="tabs-row">
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Finished Products
        </button>
        <button
          className={`tab-button ${activeTab === "materials" ? "active" : ""}`}
          onClick={() => setActiveTab("materials")}
        >
          Raw Materials
        </button>
      </div>

      {/* Content Grids */}
      {activeTab === "products" && (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="title-row">
                <span>{product.name}</span>
              </div>
              <p>Cost to Produce: ${window.calculateProductCost(product.id).toFixed(2)}</p>
              <p>Suggested Price: ${(window.calculateProductCost(product.id) * window.globalMarkup).toFixed(2)}</p>
              <p>Current Price: ${product.price.toFixed(2)}</p>

              <div className="new-price-row">
                <label>New Price:</label>
                <input
                  type="number"
                  defaultValue={product.price.toFixed(2)}
                  min="0"
                  step="0.01"
                  onBlur={(e) =>
                    window.finances.updateProductPrice(product.id, parseFloat(e.target.value))
                  }
                />
              </div>

              <p>In Stock: {product.inventory}</p>
              <p>Can Make: {window.helpers.calculatePotentialProduction(product.id)}</p>

              <div className="quick-order-row">
                <strong>Quick Compound:</strong>
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="quick-order-input"
                />
                <button
                  onClick={() =>
                    window.production.createCompoundTask(product, parseInt(1))
                  }
                >
                  Compound
                </button>
              </div>

              <div className="max-inv-row">
                <label>Max Inventory:</label>
                <input
                  type="number"
                  defaultValue={product.maxInventory || "0"}
                  min="0"
                  step="1"
                  onBlur={(e) => (product.maxInventory = parseInt(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "materials" && (
        <div className="materials-grid">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="material-card">
              <div className="title-row">
                <span>{material.name}</span>
                <span>${material.cost.toFixed(2)}</span>
              </div>
              <p>Inventory: {material.inventory}</p>
              <p>
                Auto-Order Threshold: {material.autoOrderThreshold}, Amount:{" "}
                {material.autoOrderAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
