import { areDateRangesOverlapping } from './are-date-ranges-overlapping'

export const doesRangeOverlap = (newRange, listOfRanges) => {
  let result = false
  listOfRanges.forEach((range) => {
    if (areDateRangesOverlapping(newRange, range)) {
      result = true
    }
  })
  return result 
}
