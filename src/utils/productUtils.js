// src/utils/productUtils.js

/**
 * Formats a product array for display in the UI.
 * - Filters in-stock items
 * - Maps to display-ready objects with formatted price
 * @param {Array} products - Raw product data from API
 * @returns {Array} Display-ready products
 */
export const getDisplayProducts = (products) => {
  return products
    .filter((product) => product.inStock) // Keep only in-stock
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: `$${product.price.toFixed(2)}`, // Format as currency
      category: product.category,
    }));
};

/**
 * Calculates total inventory value of in-stock products.
 * @param {Array} products - Raw product data
 * @returns {number} Total value
 */
export const calculateInventoryValue = (products) => {
  return products
    .filter((product) => product.inStock)
    .reduce((total, product) => total + product.price, 0);
};

/**
 * Finds a product by ID.
 * @param {Array} products - Raw product data
 * @param {number} productId - ID to search for
 * @returns {Object|undefined} Matching product or undefined
 */
export const findProductById = (products, productId) => {
  return products.find((product) => product.id === productId);
};
