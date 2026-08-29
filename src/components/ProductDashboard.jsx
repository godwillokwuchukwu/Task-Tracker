// src/components/ProductDashboard.jsx
import React, { useState } from "react";
import {
  getDisplayProducts,
  calculateInventoryValue,
  findProductById,
} from "../utils/productUtils";
import "./ProductDashboard.css";

const ProductDashboard = ({ products }) => {
  const displayProducts = getDisplayProducts(products);
  const totalValue = calculateInventoryValue(products);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const selectedProduct = selectedProductId
    ? findProductById(products, selectedProductId)
    : null;

  return (
    <div className="product-dashboard">
      <header className="dashboard-header">
        <div className="header-eyebrow">Inventory</div>
        <h1>Product Dashboard</h1>
        <p className="header-sub">
          What's in stock, what it's worth, one click from its detail.
        </p>
      </header>

      <section className="summary-row">
        <div className="summary-card">
          <span className="summary-value">{displayProducts.length}</span>
          <span className="summary-label">in-stock products</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">${totalValue.toFixed(2)}</span>
          <span className="summary-label">total in-stock value</span>
        </div>
      </section>

      <section className="product-list">
        <h2>In-Stock Products</h2>
        {displayProducts.length === 0 ? (
          <div className="empty-state">Nothing in stock right now.</div>
        ) : (
          <ul>
            {displayProducts.map((product) => (
              <li
                key={product.id}
                className={
                  "product-row" +
                  (selectedProductId === product.id ? " product-row--selected" : "")
                }
                onClick={() => setSelectedProductId(product.id)}
              >
                <span className="product-id">#{String(product.id).padStart(3, "0")}</span>
                <span className="product-name">{product.name}</span>
                <span className="product-category">{product.category}</span>
                <span className="product-price">{product.price}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedProduct && (
        <aside className="product-detail" aria-live="polite">
          <button
            className="product-detail-close"
            onClick={() => setSelectedProductId(null)}
            aria-label="Close product detail"
          >
            ×
          </button>
          <div className="header-eyebrow">Product #{selectedProduct.id}</div>
          <h2>{selectedProduct.name}</h2>
          <dl>
            <dt>Category</dt>
            <dd>{selectedProduct.category}</dd>
            <dt>Price</dt>
            <dd>${selectedProduct.price.toFixed(2)}</dd>
            <dt>Status</dt>
            <dd>{selectedProduct.inStock ? "In Stock" : "Out of Stock"}</dd>
          </dl>
        </aside>
      )}
    </div>
  );
};

export default ProductDashboard;
