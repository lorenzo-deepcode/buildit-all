import { Given, When, Then } from 'cucumber'
import { By } from 'selenium-webdriver'

import { fail } from 'assert'

Given('I create a booking for next week', async function() {
  await this.getWithLogin('/book')

  await this.fillBookingForm('My Bookable for Next Week', 'NYC', 1)
  await this.selectBookable('Red Room')
  await this.submitBookingForm()
})

When('I view my bookings', async function() {
  await this.getWithLogin('/home')

  await this.findElementByLinkText('View Your Bookings').click()
})

When('I view my bookings as another user', async function () {
  await this.getWithAnotherUsersLogin('/home')

  await this.findElementByLinkText('View Your Bookings').click()
})

When('I navigate to next week', async function () {
  // TODO eliminate these blind waits (need to wait for animation to stop)
  await this.driver.sleep(1000)
  const element = await this.waitUntilElementIsVisible(By.id('next'))
  await element.click()
})

Then('I see my created booking', async function() {
  await this.waitUntilElementTextContains(By.id('booking-my-bookable-for-next-week'), 'My Bookable for Next Week')
})

Then('The location of the booking is listed', async function() {
  await this.waitUntilElementTextContains(By.xpath('//p[@id="booking-my-bookable-for-next-week"]/following-sibling::h3'), '(NYC)')
})

Then('I don\'t see the created booking', async function() {
  try {
    await this.waitUntilElementTextContains(By.id('booking-my-bookable-for-next-week'), 'My Bookable for Next Week', 3000)
  } catch (error) {
    return
  }
  fail("The created booking", "No created booking", "Found the created booking")
})

Then('the booking is cancelled', async function() {
  await this.waitUntilElementById('booking-my-bookable-for-next-week').click()
  await this.driver.sleep(1000)
  await this.waitUntilElementByCss('button').click()
  await this.driver.sleep(1000)
  await this.waitUntilElementTextContains(By.tagName('body'), 'Success! Your booking was successfully cancelled.')
})
