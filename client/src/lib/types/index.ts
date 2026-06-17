// runtime helpers for types module
// `index.d.ts` contains the TypeScript-only type declarations while
// this file provides a small runtime export required by Vite/bundler.
export const ReferenceTypes = {
  Product: "Product",
  Comment: "Comment",
  Review: "Review",
  Order: "Order",
} as const;

export type ReferenceTypes = typeof ReferenceTypes[keyof typeof ReferenceTypes];

export default ReferenceTypes;
