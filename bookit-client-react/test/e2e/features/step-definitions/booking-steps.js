import { Given, When, Then } from 'cucumber'
import { By } from 'selenium-webdriver'

import { expect } from 'chai'

Given('I am on the bookit website form', async function() {
  await this.getWithLogin('/book')
})

When('I fill in the form', async function() {
  await this.fillBookingForm('My Bookable', 'NYC')
})

When('I select a room', async function() {
  await this.selectBookable('Red Room')
})

When('I create my booking', async function() {
  await this.submitBookingForm()
})

When('I change my location', async function() {
  await this.fillBookingForm('My Bookable', 'LON')
})

Then('My selected room clears', async function() {
  await this.waitUntilElementById('pick-a-room')
})

Then('The list of rooms is updated', async function() {
  await this.viewBookables()
  await this.waitUntilElementByXpath(`//h2[contains(text(),"Greenwich")]`)
})

Then('I cannot select the same room', async function() {
  await this.viewBookables()
  expect(await this.isBookableBooked('Red Room')).to.be.true
})

Then('It\'s booked', async function() {
  await this.waitUntilElementTextContains(By.tagName('body'), 'Success! Your booking was successfully created.')
})

Then('It fails', async function() {
  await this.waitUntilElementTextContains(By.tagName('h1'), 'Bookable is not available')
})
