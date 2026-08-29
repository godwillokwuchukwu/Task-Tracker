// src/utils/productUtils.test.js
import { describe, it, expect } from "vitest";
import {
  getDisplayProducts,
  calculateInventoryValue,
  findProductById,
} from "./productUtils";

const products = [
  { id: 1, name: "Oak Desk Lamp", price: 48, category: "Lighting", inStock: true },
  { id: 2, name: "Wool Throw Blanket", price: 89, category: "Textiles", inStock: false },
  { id: 3, name: "Brass Bookend Pair", price: 24, category: "Decor", inStock: true },
];

describe("getDisplayProducts", () => {
  it("keeps only in-stock products", () => {
    const result = getDisplayProducts(products);
    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it("formats price as currency and drops raw fields like inStock", () => {
    const [first] = getDisplayProducts(products);
    expect(first).toEqual({
      id: 1,
      name: "Oak Desk Lamp",
      price: "$48.00",
      category: "Lighting",
    });
  });
});

describe("calculateInventoryValue", () => {
  it("sums price for in-stock products only", () => {
    expect(calculateInventoryValue(products)).toBe(72);
  });

  it("returns 0 when nothing is in stock", () => {
    const allOut = products.map((p) => ({ ...p, inStock: false }));
    expect(calculateInventoryValue(allOut)).toBe(0);
  });
});

describe("findProductById", () => {
  it("finds an existing product, in or out of stock", () => {
    expect(findProductById(products, 2)?.name).toBe("Wool Throw Blanket");
  });

  it("returns undefined for a missing id", () => {
    expect(findProductById(products, 999)).toBeUndefined();
  });
});
