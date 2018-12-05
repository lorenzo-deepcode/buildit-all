import { doesRangeOverlap } from './does-range-overlap'

const listOfRanges = [
  {
    start: new Date('January 1, 1999, 13:00:00'),
    end: new Date('January 1, 1999, 14:00:00'),
  },
  {
    start: new Date('January 1, 1999, 15:00:00'),
    end: new Date('January 1, 1999, 16:00:00'),
  },
  {
    start: new Date('January 1, 1999, 18:00:00'),
    end: new Date('January 1, 1999, 19:00:00'),
  },
]

test('Detects overlapping when range partially overlaps', () => {
  const range = {
    start: new Date('January 1, 1999, 12:30:00'),
    end: new Date('January 1, 1999, 13:30:00'),
  }
  const result = doesRangeOverlap(range, listOfRanges)
  expect(result).toBe(true)
})

test('Detects no overlapping when range is falls within a gap of bookings', () => {
  const range = {
    start: new Date('January 1, 1999, 14:15:00'),
    end: new Date('January 1, 1999, 14:45:00'),
  }
  const result = doesRangeOverlap(range, listOfRanges)
  expect(result).toBe(false)
})

test('Detects overlapping when range entirely overlaps', () => {
  const range = {
    start: new Date('January 1, 1999, 15:15:00'),
    end: new Date('January 1, 1999, 15:45:00'),
  }
  const result = doesRangeOverlap(range, listOfRanges)
  expect(result).toBe(true)
})

test('Detects no overlapping when range abuts the end of existing booking', () => {
  const range = {
    start: new Date('January 1, 1999, 16:00:00'),
    end: new Date('January 1, 1999, 16:30:00'),
  }
  const result = doesRangeOverlap(range, listOfRanges)
  expect(result).toBe(false)
})

test('Detects no overlapping when range abuts the start of existing booking', () => {
  const range = {
    start: new Date('January 1, 1999, 16:30:00'),
    end: new Date('January 1, 1999, 17:00:00'),
  }
  const result = doesRangeOverlap(range, listOfRanges)
  expect(result).toBe(false)
})
