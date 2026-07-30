export const HST_RATE = 0.13;

export function roundCurrency(amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
}

export function calculateCheckoutAmounts(cartItems) {
  const subtotal = roundCurrency(
    cartItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
      0
    )
  );
  const hst = roundCurrency(subtotal * HST_RATE);
  const total = roundCurrency(subtotal + hst);

  return { subtotal, hst, total };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number(amount));
}
