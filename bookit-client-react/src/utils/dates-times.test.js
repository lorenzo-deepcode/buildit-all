import * as DT from './dates-times'


describe('dates-times', () => {
  describe('#formatTime(datetime)', () => {
    it('formats a string representation of a datetime to a time', () => {
      expect(DT.formatTime('2017-12-19T13:45')).to.equal('1:45 PM')
    })

    it('formats a Date datetime to a time', () => {
      expect(DT.formatTime(new Date('2017-12-19T13:45'))).to.equal('1:45 PM')
    })
  })

  describe('#formatDate(date, pattern = \'YYYY-MM-DD\')', () => {
    it('formats a string representation of a date', () => {
      expect(DT.formatDate('2017-12-19T13:45')).to.equal('2017-12-19')
    })

    it('formats a Date datetime to a time', () => {
      expect(DT.formatDate(new Date('2017-12-19T13:45'))).to.equal('2017-12-19')
    })
  })

  describe('#parseDate(date, pattern = \'YYYY-MM-DD\', base = new Date)', () => {
    it('parses a string representation of a date using the default pattern and base', () => {
      const parsed = DT.parseDate('2018-01-04')
      expect(parsed.getFullYear()).to.equal(2018)
      expect(parsed.getMonth()).to.equal(0)  // Yeah. JS Date months are zero-indexed
      expect(parsed.getDate()).to.equal(4)
    })

    it('parses a time and uses the default base parameter to backfill the resulting Date', () => {
      const date = new Date
      const parsed = DT.parseDate('13:37', 'HH:mm')

      expect(parsed.getHours()).to.equal(13)
      expect(parsed.getMinutes()).to.equal(37)

      // Now test that the backfilled day, month and year are as expected
      expect(parsed.getFullYear()).to.equal(date.getFullYear())
      expect(parsed.getMonth()).to.equal(parsed.getMonth())
      expect(parsed.getDate()).to.equal(parsed.getDate())
    })

    it('parses a time and uses the provided base parameter to backfill the resulting Date', () => {
      const halloween2015 = new Date(2015, 9, 31)
      const parsed = DT.parseDate('23:59', 'HH:mm', halloween2015)

      expect(parsed.getHours()).to.equal(23)
      expect(parsed.getMinutes()).to.equal(59)

      // Now test that the backfilled day, month and year are as expected
      expect(parsed.getFullYear()).to.equal(halloween2015.getFullYear())
      expect(parsed.getMonth()).to.equal(halloween2015.getMonth())
      expect(parsed.getDate()).to.equal(halloween2015.getDate())
    })

    it('parses a time string using 24-hour time despite the pattern expecting a single digit for hour', () => {
      const parsed = DT.parseDate('15:59', 'H:mm')

      expect(parsed.getHours()).to.equal(15)
      expect(parsed.getMinutes()).to.equal(59)
    })
  })

  describe('#getSecondOfDay(date)', () => {
    it('returns seconds since the beginning of the day from a date', () => {
      expect(DT.getSecondOfDay('2017-12-19T01:00')).to.equal(3600)
    })
  })

  describe('#getIntervalInSeconds(low, high)', () => {
    it('returns a two-element array of seconds since the beginning of the day', () => {
      expect(DT.getIntervalInSeconds('2017-12-19T01:00', '2017-12-19T02:00')).to.deep.equal([ 3600, 7200 ])
    })
  })

  describe('#getWholeDayInterval()', () => {
    it('returns a static two-element array of seconds since the beginning of the day', () => {
      expect(DT.getWholeDayInterval()).to.deep.equal([ 0, 86399 ])
    })
  })

  describe('#compareDates(dateA, dateB)', () => {
    it('returns -1 if dateA is before dateB', () => {
      expect(DT.compareDates('2017-12-19T01:00', '2017-12-19T02:00')).to.equal(-1)
    })
    it('returns 1 if dateA is after dateB', () => {
      expect(DT.compareDates('2017-12-19T02:00', '2017-12-19T01:00')).to.equal(1)
    })
    it('returns 0 if dateA is the same as dateB', () => {
      expect(DT.compareDates('2017-12-19T01:00', '2017-12-19T01:00')).to.equal(0)
    })
  })

  describe('#getWeekStartAndEnd(date = new Date)', () => {
    it('returns an interval of seven days from current date when no parameter is provided', () => {
      expect(DT.getWeekStartAndEnd()).to.have.lengthOf(2)
    })
    it('returns an interval of seven days from `date`', () => {
      const [ start, end ] = DT.getWeekStartAndEnd('2017-12-19T01:00')

      expect(start.toString()).to.deep.equal(new Date('2017-12-19T01:00').toString())
      expect(end.toString()).to.deep.equal(new Date('2017-12-25T01:00').toString())
    })
  })

  describe('#getWeekDaysRange(date = new Date)', () => {
    it('should return an object including the range of week days plus the next and previous week dates', () => {
      const range = DT.getWeekDaysRange()
      expect(range).to.have.lengthOf(7)
    })
  })

  describe('#getPreviousAndNextWeekDates(date = new Date)', () => {
    it('should return an array of the start days of the next and previous weeks from the current date', () => {
      expect(DT.getPreviousAndNextWeekDates()).to.have.lengthOf(2)
    })
    it('should return an array of the start days of the next and previous weeks from a given date', () => {
      const theDate = new Date(2017, 10, 16)
      const previousWeekStart = '2017-11-09'
      const nextWeekStart = '2017-11-23'

      const [ previous, next ] = DT.getPreviousAndNextWeekDates(theDate)

      expect(previous).to.equal(previousWeekStart)
      expect(next).to.equal(nextWeekStart)
    })
  })

  describe('#formatWeek(date = new Date)', () => {
    it('should return a formatted week when no date is passed as a parameter', () => {
      const expected = DT.formatWeek(new Date)
      const actual = DT.formatWeek()
      expect(actual).to.equal(expected)
    })
    it('should return the month on both start and end when the week overlaps two months', () => {
      const theDate = new Date(2017, 9, 30)
      const expected = 'Oct 30 - Nov 5 2017'

      const actual = DT.formatWeek(theDate)
      expect(actual).to.equal(expected)
    })

    it('should return the year on both start and end when the week overlaps the year', () => {
      const theDate = new Date(2015, 11, 28)
      const expected = 'Dec 28 2015 - Jan 3 2016'
      const actual = DT.formatWeek(theDate)
      expect(actual).to.equal(expected)
    })

    it('should return the month on just the start and year on just the end when there is no overlap for the week', () => {
      const theDate = new Date(2017, 10, 16)
      const expected = 'Nov 16 - 22 2017'

      const actual = DT.formatWeek(theDate)
      expect(actual).to.equal(expected)
    })
  })

  describe('#createIntervalTree(intervals)', () => {
    it('returns an interval tree when given intervals', () => {
      const intervals = [
        [ '2017-12-19T01:00', '2017-12-19:T02:00', { foo: 'bar' } ],
        [ '2017-12-19T03:00', '2017-12-19:T04:00', { foo: 'baz' } ],
        [ '2017-12-19T05:00', '2017-12-19:T06:00', { foo: 'bif' } ],
      ]

      const tree = DT.createIntervalTree(intervals)
      expect(tree).to.exist

    })
  })
})
