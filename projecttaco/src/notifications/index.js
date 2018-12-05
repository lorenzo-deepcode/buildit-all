import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey,
  region: aws.region,
});

/**
 * Notifier - push notification sender.
 * import Notifier from 'notifications'
 */
class Notifier {
  /**
   * @access private
   */
  constructor() {
    /**
     * @access private
     */
    this.sns = new AWS.SNS();
  }

  /**
   * @access private
   */
  publishHandler(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data);
    }
  }

  /**
   * Sends a push notification that an order has been placed to a specific phone number
   *
   * @param {string} number - the phone number to be notified.
   *
   * @example
   * import Notifier from 'notifications';
   * Notifier.sendOrderPlacedNotification('+12125551212')
   */
  sendOrderPlacedNotification(number) {
    var publishParams = {
      Message: 'Your order has been placed',
      PhoneNumber: number,
    };
    this.sns.publish(publishParams, this.publishHandler);
  }

  /**
   * Sends a push notification that an order is ready to a specific phone number
   *
   * @param {string} number - the phone number to be notified.
   *
   * @example
   * import Notifier from 'notifications';
   * Notifier.sendOrderReadyNotification('+12125551212')
   */
  sendOrderReadyNotification(number) {
    var publishParams = {
      Message: 'Your order is ready to be picked up!',
      PhoneNumber: number,
    };
    this.sns.publish(publishParams, this.publishHandler);
  }
}

/**
 * @ignore
 */
const notifier = new Notifier();
/**
 * @ignore
 */
export default notifier;
