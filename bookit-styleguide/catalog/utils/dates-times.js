import IntervalTree, { Node } from 'node-interval-tree'

import {
  toDate,
  format,
  parse,
  startOfDay,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  addDays,
  eachDayOfInterval,
  addHours,
  addWeeks,
  differenceInSeconds,
} from 'date-fns/esm'

export const formatTime = datetime => format(datetime, 'h:mm A')
export const formatDate = (date, pattern = 'YYYY-MM-DD') => format(date, pattern)
export const parseDate = (date, pattern = 'YYYY-MM-DD', base = new Date) => parse(date, pattern, base)

export const normalizeDateWithBase = (date, base) => parseDate(formatDate(date, 'HH:mm:ss'), 'HH:mm:ss', base)

export const getSecondOfDay = date => differenceInSeconds(date, startOfDay(date))
export const getIntervalInSeconds = (low, high) => [ getSecondOfDay(low), getSecondOfDay(high) ]
export const getWholeDayInterval = () => [ 0, 86399 ]

export const compareDates = (dateA, dateB) => {
  if (isBefore(dateA, dateB)) {
    return -1
  }
  if (isAfter(dateA, dateB)) {
    return 1
  }
  return 0
}

export const getWeekStartAndEnd = (date = new Date) => {
  const weekStart = toDate(date)
  const weekEnd = addDays(date, 6)
  return [ weekStart, weekEnd ]
}

export const getWeekDaysRange = (date = new Date) => {
  const [ start, end ] = getWeekStartAndEnd(date)
  return eachDayOfInterval({ start, end }).map(day => formatDate(day))
}

export const getPreviousAndNextWeekDates = (date = new Date) => {
  const previous = addWeeks(date, -1)
  const next = addWeeks(date, 1)
  return [ formatDate(previous), formatDate(next) ]
}

export const formatWeek = (date = new Date) => {
  const [ weekStart, weekEnd ] = getWeekStartAndEnd(date)
  let weekStartPattern = 'MMM D'
  let weekEndPattern = 'D YYYY'
  if (!isSameMonth(weekStart, weekEnd)) {
    weekEndPattern = 'MMM D YYYY'
  }
  if (!isSameYear(weekStart, weekEnd)) {
    weekStartPattern = 'MMM D YYYY'
  }
  const formatWeekStart = format(weekStart, weekStartPattern)
  const formatWeekEnd = format(weekEnd, weekEndPattern)
  return `${formatWeekStart} - ${formatWeekEnd}`
}

export const isToday = date => isSameDay(new Date, date)

// "Monkeypatch" node-interval-tree to allow for exclusive overlap testing
// rather than the baked-in default of inclusive overlaps
/* istanbul ignore next */
Node.prototype._getOverlappingRecords = function (currentNode, low, high) {
  if (currentNode.key < high && low < currentNode.getNodeHigh()) {
    // Nodes are overlapping, check if individual records in the node are overlapping
    var tempResults = []
    for (var i = 0; i < currentNode.records.length; i++) {
      if (currentNode.records[i].high > low) {
        tempResults.push(currentNode.records[i])
      }
    }
    return tempResults
  }
  return []
}

/* istanbul ignore next */
IntervalTree.prototype.search = function (low, high) {
  return this.tree.search(...getIntervalInSeconds(low, high)).map(function (v) { return v.data })
}

export const createIntervalTree = (intervals) => {
  const tree = new IntervalTree
  intervals.forEach(([ start, end, data ]) => tree.insert(...getIntervalInSeconds(start, end), data))
  return tree
}

// "Re-export" functions from `date-fns` to reduce overall import statements
export { addHours, isBefore, isAfter, isSameDay, addDays }
