/**
 * Tests if two date ranges overlap in any way
 * @param  {{start: Date, end: Date}} range1
 * @param  {{start: Date, end: Date}} range2
 * @return {boolean} True if range1 or range2 overlap in any way
 */
export const areDateRangesOverlapping = (range1, range2) => (
  range1.start < range2.end && range2.start < range1.end
)
