import { Given, When, Then } from 'cucumber'
import { By } from 'selenium-webdriver'

Given('I am on the login page in testing', async function() {
  await this.getAnonymously('/login')
})

When('I click the login button', async function() {
  const element = await this.waitUntilElementIsVisible(By.id('login'))
  await element.click()
})

Then('I am on the landing page', async function() {
  await this.getWithLogin('/home')
  await this.findElementById('landing')
})
