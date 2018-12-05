/* global jasmine */

const util = require('util')
const chai = require('chai')
const chaiEnzyme = require('chai-enzyme')

// Jest + React 16 hate each other, so let's polyfill in some happiness
require('./raf-polyfill')

const configure = require('enzyme').configure
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })

// Add enzyme-aware assertions to Chai
chai.use(chaiEnzyme())

// Make sure chai and jasmine ".not" play nice together
const originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get

Object.defineProperty(chai.Assertion.prototype, 'not', {
  get() {
    Object.assign(this, this.assignedNot)
    return originalNot.apply(this)
  },
  set(newNot) {
    this.assignedNot = newNot
    return newNot
  },
})

// Combine both jest and chai matchers on expect
const originalExpect = global.expect

global.expect = (actual) => {
  const originalMatchers = originalExpect(actual)
  const chaiMatchers = chai.expect(actual)
  const combinedMatchers = Object.assign(chaiMatchers, originalMatchers)
  return combinedMatchers
}

// The following console-related munging is required to allow us to easily
// test PropType validity on React components
// For example:
//
//    expect(() => (<Button type="lemons" />)).to.throw()
//
// (where button PropTypes expects oneOf 'submit' or 'button')

// keep a reference to the original console methods
const consoleWarn = console.warn
const consoleError = console.error

const elevateLogToError = (...args) => {
  throw new Error(util.format.apply(this, args).replace(/^Error: (?:Warning: )?/, ''))
}

jasmine.getEnv().beforeEach(() => {
  // make calls to console.warn and console.error throw an error
  console.warn = elevateLogToError
  console.error = elevateLogToError
})

jasmine.getEnv().afterEach(() => {
  // return console.warn and console.error to default behaviour
  console.warn = consoleWarn
  console.error = consoleError
})
