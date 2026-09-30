import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotal } from '../src/cart.js'

// This test fails until you implement cartTotal. That is the point:
// run `npm test` first and see it red.
test('the example from the slides', () => {
  const items = [
    { name: 'Áo thun', price: 180000, qty: 2 },
    { name: 'Sổ tay', price: 45000, qty: 1 },
  ]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 467400)
})

const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
// VAT 0 so the threshold tests check shipping and nothing else.
const noVat = { vatRate: 0, freeShipFrom: 500000, shipFee: 30000 }
const item = (price, qty) => ({ name: 'Sản phẩm', price, qty })

test('the result is of type number', () => {
  assert.equal(typeof cartTotal([item(180000, 2), item(45000, 1)], options), 'number')
})

test('empty cart returns 0', () => {
  assert.equal(cartTotal([], options), 0)
})

test('empty cart returns 0 even when options is undefined', () => {
  assert.equal(cartTotal([], undefined), 0)
})

test('subtotal exactly at freeShipFrom ships free', () => {
  assert.equal(cartTotal([item(500000, 1)], noVat), 500000)
})

test('subtotal one đồng below freeShipFrom is charged shipping', () => {
  assert.equal(cartTotal([item(499999, 1)], noVat), 529999)
})

test('subtotal above freeShipFrom ships free', () => {
  assert.equal(cartTotal([item(500001, 1)], noVat), 500001)
})

test('a total with a fractional part is rounded to the whole đồng', () => {
  // 12345 + 987.6 VAT + 30000 shipping = 43332.6
  assert.equal(cartTotal([item(12345, 1)], options), 43333)
})

test('an item with price 0 is accepted', () => {
  assert.equal(cartTotal([item(0, 1)], options), 30000)
})

test('price -1 throws RangeError', () => {
  assert.throws(() => cartTotal([item(-1, 1)], options), RangeError)
})

test('a negative price in the second item throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, 1), item(-1, 1)], options), RangeError)
})

test('price NaN throws RangeError', () => {
  assert.throws(() => cartTotal([item(NaN, 1)], options), RangeError)
})

test('price "abc" throws RangeError', () => {
  assert.throws(() => cartTotal([item('abc', 1)], options), RangeError)
})

test('qty 0 throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, 0)], options), RangeError)
})

test('qty -1 throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, -1)], options), RangeError)
})

test('qty 1.5 throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, 1.5)], options), RangeError)
})

test('qty NaN throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, NaN)], options), RangeError)
})

test('qty Infinity throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, Infinity)], options), RangeError)
})

test('qty "2" throws RangeError', () => {
  assert.throws(() => cartTotal([item(1000, '2')], options), RangeError)
})

test('missing qty throws RangeError', () => {
  assert.throws(() => cartTotal([{ name: 'Sản phẩm', price: 1000 }], options), RangeError)
})
