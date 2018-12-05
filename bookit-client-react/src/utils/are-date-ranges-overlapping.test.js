import { areDateRangesOverlapping } from './are-date-ranges-overlapping'

test('Detects overlapping at end of range2', () => {
  const range1 = { start: new Date('January 1, 1999, 01:00:00'), end: new Date('January 1, 1999, 02:00:00')}
  const range2 = { start: new Date('January 1, 1999, 01:30:00'), end: new Date('January 1, 1999, 02:30:00')}
  const result = areDateRangesOverlapping(range1, range2)
  expect(result).toBe(true)
})
test('Detects overlapping at beginning of range2', () => {
  const range1 = { start: new Date('January 1, 1999, 01:00:00'), end: new Date('January 1, 1999, 02:00:00')}
  const range2 = { start: new Date('January 1, 1999, 00:30:00'), end: new Date('January 1, 1999, 01:30:00')}
  const result = areDateRangesOverlapping(range1, range2)
  expect(result).toBe(true)
})
test('Detects overlapping when range1 is within range2', () => {
  const range1 = { start: new Date('January 1, 1999, 02:00:00'), end: new Date('January 1, 1999, 03:00:00')}
  const range2 = { start: new Date('January 1, 1999, 01:00:00'), end: new Date('January 1, 1999, 04:00:00')}
  const result = areDateRangesOverlapping(range1, range2)
  expect(result).toBe(true)
})
test('Detects no overlap when range1 ends before range 2 begins', () => {
  const range1 = { start: new Date('January 1, 1999, 01:00:00'), end: new Date('January 1, 1999, 02:00:00')}
  const range2 = { start: new Date('January 1, 1999, 03:00:00'), end: new Date('January 1, 1999, 04:00:00')}
  const result = areDateRangesOverlapping(range1, range2)
  expect(result).toBe(false)
})
test('Does not detect overlapping when ranges abut', () => {
  const range1 = { start: new Date('January 1, 1999, 01:00:00'), end: new Date('January 1, 1999, 02:00:00')}
  const range2 = { start: new Date('January 1, 1999, 02:00:00'), end: new Date('January 1, 1999, 03:00:00')}
  const result = areDateRangesOverlapping(range1, range2)
  expect(result).toBe(false)
})
