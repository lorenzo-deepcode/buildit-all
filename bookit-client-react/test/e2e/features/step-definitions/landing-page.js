import { Given, When, Then } from 'cucumber'
import { By } from 'selenium-webdriver'

Given('I am on the landing page of Bookit', async function() {
  await this.getWithLogin('/home')
})

When('I click the Book a Room button', async function() {
  await this.findElementByLinkText('Book A Room').click()
})

When('I click the View Your Bookings button', async function() {
  await this.findElementByLinkText('View Your Bookings').click()
})

Then('I am on the booking form', async function() {
  await this.findElementByTagName('form')
})

Then('I am on the view bookings page', async function() {
  await this.waitUntilElementTextContains(By.tagName('h2'), 'My Bookings')
})
