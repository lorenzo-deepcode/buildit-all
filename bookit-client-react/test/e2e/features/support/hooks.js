import { defineSupportCode, Status } from 'cucumber'
import { promise, logging } from 'selenium-webdriver'

promise.USE_PROMISE_MANAGER = false

logging.installConsoleHandler()
logging.getLogger('promise.ControlFlow').setLevel(logging.Level.ALL)

const url = process.env.ENDPOINT_URI || 'http://localhost:3001'

defineSupportCode(function({ Before, After }) {
  Before(async function() {
    await this.driver.manage().window().setSize(412, 732)
  })

  After(async function(testCase) {
    try {
      if(testCase.result.status === Status.FAILED) {
        if (testCase.result.status === Status.FAILED) {
          const screenshot = await this.driver.takeScreenshot()
          this.attach(screenshot, 'image/png')
        }
      }
    } finally {
      await this.driver.quit()
    }
  })
})

export { url }
