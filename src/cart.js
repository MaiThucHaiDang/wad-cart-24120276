export function cartTotal(items, options) {
  if (items.length === 0) return 0

  for (const { price, qty } of items) {
    if (!(typeof price === 'number' && price >= 0)) {
      throw new RangeError(`price must be a number >= 0, got ${price}`)
    }
    if (!(Number.isInteger(qty) && qty > 0)) {
      throw new RangeError(`qty must be a positive integer, got ${qty}`)
    }
  }

  const subtotal = items.reduce((sum, { price, qty }) => sum + price * qty, 0)
  const vat = subtotal * options.vatRate
  const shipping = subtotal >= options.freeShipFrom ? 0 : options.shipFee
  return Math.round(subtotal + vat + shipping)
}
