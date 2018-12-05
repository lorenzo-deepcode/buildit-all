import { Given, When, Then} from 'cucumber'
import { By } from 'selenium-webdriver'

Given('I book a room', async function() {
  await this.getWithLogin('/book')

  await this.driver.sleep(1000)

  await this.fillBookingForm('My Bookable To Be Deleted', 'NYC', 1)
  await this.selectBookable('Black Room')
  await this.submitBookingForm()
})

When('I am now editing details through the My Bookings page', async function() {
  await this.getWithLogin('/bookings')

  // TODO: Curse these element transitions!
  await this.driver.sleep(1000)

  await this.findElementById('next').click()
  await this.waitUntilElementByPartialLinkText('My Bookable To Be Deleted').click()
})

When('I click the Cancel Booking button', async function() {
  await this.driver.sleep(1000)
  await this.waitUntilElementByCss('button').click()
})

Then('It is cancelled', async function() {
  await this.waitUntilElementTextContains(By.tagName('body'), 'Success! Your booking was successfully cancelled.')
})
