import { defineSupportCode, setWorldConstructor } from 'cucumber'

import { By, Builder, until, Key } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

import faker from 'faker'

import jwt from 'jsonwebtoken'

import format from 'date-fns/format'
import addMinutes from 'date-fns/addMinutes'
import addDays from 'date-fns/addDays'
import addWeeks from 'date-fns/addWeeks'

function makeValidToken() {
  return JSON.stringify(
    jwt.sign({ aud: '9a8b8181-afb1-48f8-a839-a895d39f9db0', iss: 'https://login.microsoftonline.com/37fcf0e4-ceb8-4866-8e26-293bab1e26a8/v2.0', aio: 'ATQAy/8GAAAA4Ey9vwUkm0TMhuGOwn151l2DCb0M4NvjHDRH363e7xD4XTNy7okSK9qn1ZGHUnLF', at_hash: 'svovWptiyUbwaZj1_5_S8A', name: 'Bruce Springsteen', nonce: 'dbfbca8f-d17d-4bf8-b5c2-aaf9e64eda0e', oid: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30', preferred_username: 'bruce@builditcontoso.onmicrosoft.com', sub: 'Z4ByPKGrq9pnxOnPGdZQW0b9kJoqcQGTGMjv1ZDcUKU', tid: '37fcf0e4-ceb8-4866-8e26-293bab1e26a8', uti: '6CBxGOOZ80CLh0EWrJUwAA', ver: '2.0', exp: Math.floor(Date.now() / 1000) + (60 * 60) }, 'secretsecretsecretsecretsecretsecret')
  )
}

function makeAnotherUsersValidToken() {
  return JSON.stringify(
    jwt.sign({ aud: '9a8b8181-afb1-48f8-a839-a895d39f9db0', iss: 'https://login.microsoftonline.com/37fcf0e4-ceb8-4866-8e26-293bab1e26a8/v2.0', aio: 'ATQAy/8GAAAA4Ey9vwUkm0TMhuGOwn151l2DCb0M4NvjHDRH363e7xD4XTNy7okSK9qn1ZGHUnLF', at_hash: 'svovWptiyUbwaZj1_5_S8A', name: 'Barbara Striesand', nonce: 'dbfbca8f-d17d-4bf8-b5c2-aaf9e64eda0e', oid: '64f7ea6f-0639-4ff8-aa25-8d2c8e0cf235', preferred_username: 'babs@builditcontoso.onmicrosoft.com', sub: 'UKUcDZ1vjMGTGQcqoJk9b0WQZdGPn0xnp9qrGKPyB4Z', tid: '37fcf0e4-ceb8-4866-8e26-293bab1e26a8', uti: '6CBxGOOZ80CLh0EWrJUwAA', ver: '2.0', exp: Math.floor(Date.now() / 1000) + (60 * 60) }, 'secretsecretsecretsecretsecretsecret')
  )
}

function makeStartEnd(start, weeks = 0) {
  const pattern = 'HH:mm'
  start = addWeeks(start, weeks)
  return [ format(start, pattern), format(addMinutes(start, 1), pattern) ]
}

class _JWhutWorld {
  constructor({ attach, parameters }) {
    this.attach = attach
    this.parameters = parameters

    this.LOCALURL = process.env.ENDPOINT_URI || 'http://localhost:3001'

    // This is annoyingly critical for testing conflicting availability. Gah.
    this._start = faker.date.between(new Date, addDays(new Date, 6))

    const options = new chrome.Options()
    options.addArguments('no-sandbox')

    this.driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  }

  async getWithLogin(url) {
    // this.driver.manage().window().setSize(412, 732)
    await this.driver.get(this.LOCALURL)
    await this.driver.executeScript(`localStorage.setItem('_bookit|authn', '${makeValidToken()}')`)
    await this.driver.get(`${this.LOCALURL}${url}`)
  }

  async getWithAnotherUsersLogin(url) {
    // this.driver.manage().window().setSize(412, 732)
    await this.driver.get(this.LOCALURL)
    await this.driver.executeScript(`localStorage.setItem('_bookit|authn', '${makeAnotherUsersValidToken()}')`)
    await this.driver.get(`${this.LOCALURL}${url}`)
  }

  async getAnonymously(url) {
    await this.driver.get(`${this.LOCALURL}${url}`)
  }

  async waitUntilElement(selector, timeout) {
    const condition = until.elementLocated(selector)
    const element = await this.driver.wait(condition, timeout)
    return element
  }

  async waitUntilElementTextContains(selector, text, timeout) {
    const element = await this.waitUntilElement(selector, timeout)
    return this.driver.wait(until.elementTextContains(element, text), timeout)
  }

  async waitUntilElementIsVisible(selector, timeout) {
    const element = await this.waitUntilElement(selector, timeout)
    return this.driver.wait(until.elementIsVisible(element), timeout)
  }

  async fillBookingForm(subject, location, weeks = 0) {
    const [ start, end ] = makeStartEnd(this._start, weeks)
    const bookingDate = addWeeks(this._start, weeks)

    const form = await this.waitUntilElementByCss('form')

    const $location = await form.findElement(By.name('locationId'))
    const $subject = await form.findElement(By.name('subject'))
    const $date = await form.findElement(By.name('date'))
    const $start = await form.findElement(By.name('start'))
    const $end = await form.findElement(By.name('end'))

    await $location.sendKeys(location)
    await $subject.sendKeys(subject)

    const captionDate = format(bookingDate, 'MMMM YYYY')
    const dayDate = format(bookingDate, 'ddd MMM DD YYYY')

    await $date.click()

    let $dayPickerCaption

    $dayPickerCaption = await this.waitUntilElementByCss('.DayPicker-Caption > div')
    const captionText = await $dayPickerCaption.getText()

    // Booking dates are randomly picked between today and today + 1 week
    // If these tests are run towards the end of the current month, there is
    // a chance that the booking date will be in the next month, and in that
    // case we'll just click the day picker Next navigation to ensure we can
    // pick the correct date to book against.
    if (captionText !== captionDate) {
      const $dayPickerNavButtonNext = await this.waitUntilElementByCss('.DayPicker-NavButton--next')
      await $dayPickerNavButtonNext.click()
      $dayPickerCaption = await this.waitUntilElementByCss('.DayPicker-Caption > div')
    }

    const $dayPickerDayToSelect = await this.waitUntilElementByCss(`[aria-label="${dayDate}"]`)
    await $dayPickerDayToSelect.click()

    await this.driver.wait(until.stalenessOf($dayPickerCaption), 2000, 'DayPicker overlay should definitely be removed from the DOM before 2 seconds')

    await $start.click()
    const $timepickerStart = await this.waitUntilElementByCss('.rc-time-picker-panel-input')
    await $timepickerStart.clear()
    await $timepickerStart.sendKeys(start)
    await $timepickerStart.sendKeys(Key.ESCAPE)

    await $end.click()
    const $timepickerEnd = await this.waitUntilElementByCss('.rc-time-picker-panel-input')
    await $timepickerEnd.clear()
    await $timepickerEnd.sendKeys(end)
    await $timepickerEnd.sendKeys(Key.ESCAPE)
  }

  async viewBookables() {
    await this.findElementByLinkText('Pick A Room').click()
    // Grumble grumble... Why not opposite of `until.stalenessOf`?
    await this.driver.sleep(1000)  // Delay next action because of animating transitions and selenium is dumb
  }

  // If a room (bookable) is not available for the given start and end, then
  // the bookables list will render a bookable-list-item with an H2 with the
  // name of the bookable and an adjacent P tag with a reason why the bookable
  // cannot be selected.
  // Bookables that _are_ available do not include the P tag in the
  // bookable-list-item
  async isBookableBooked(name) {
    try {
      await this.waitUntilElementByXpath(`//h2[contains(text(),"${name}")]/../p`, 2000)
      return true
    } catch (error) {
      return false
    }
  }

  async selectBookable(name) {
    await this.viewBookables()
    const bookablesList = await this.waitUntilElementByXpath('//*[starts-with(@class,"list-bookables-list")]')
    await this.waitUntilElementByXpath(`//h2[contains(text(),"${name}")]`).click()
    await this.driver.wait(until.stalenessOf(bookablesList), 2000, 'bookables list should have been removed from DOM before 2 seconds')
  }

  async submitBookingForm() {
    const form = await this.waitUntilElementByCss('form')
    await form.findElement(By.css('button')).click()
  }
}

const JWhutWorld = (...args) => {
  const makeByLocator = (prefix, wrapFn) => (byType, locator) => {
    const [ first, ...rest ] = byType.replace(prefix, '')
    const byFn = By[[ first.toLowerCase(), ...rest ].join('')](locator)
    return wrapFn ? wrapFn(byFn) : byFn
  }

  const findElementByLocator = makeByLocator('findElementBy')
  const waitUntilElementByLocator = makeByLocator('waitUntilElementBy', until.elementLocated)

  const world = new _JWhutWorld(...args)

  const handler = {
    get(target, propKey, receiver) {  // eslint-disable-line
      // If the property exists on the target, just call it
      if (propKey in target.__proto__) {
        return (...args) => Reflect.apply(target[propKey], target, args)
      }

      // Wrap a couple of element locator functions
      // `By.<selectorType>` - note that we do not mark the function
      // as `async` - if we did, then we would not be able to chain
      // calls like `findElementById('someId').click()`
      if (propKey.startsWith('waitUntilElementBy')) {
        return (locator, timeout = 15000) => Reflect.apply(target.driver.wait, target.driver, [ waitUntilElementByLocator(propKey, locator), timeout ])
      }

      if (propKey.startsWith('findElementBy')) {
        return locator => Reflect.apply(target.driver.findElement, target.driver, [ findElementByLocator(propKey, locator) ])
      }

      // Prevent infinite recursion by calling get reflectively on the
      // target for any properties that aren't on its prototype
      return Reflect.get(target, propKey, receiver)
    },
  }
  const proxy = new Proxy(world, handler)

  // Bind specific classmethods to the proxy so we can make use of
  // the meta-methods defined within the proxy' handler
  world.fillBookingForm = world.fillBookingForm.bind(proxy)
  world.selectBookable = world.selectBookable.bind(proxy)
  world.submitBookingForm = world.submitBookingForm.bind(proxy)
  world.viewBookables = world.viewBookables.bind(proxy)
  world.isBookableBooked = world.isBookableBooked.bind(proxy)

  return proxy
}

defineSupportCode(function({ setDefaultTimeout }) {
  setDefaultTimeout(15 * 1000)
})

setWorldConstructor(JWhutWorld)
