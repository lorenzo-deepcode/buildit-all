Feature: Cancelling a resource
  Scenario: Cancelling a room
    Given I book a room
    And I am now editing details through the My Bookings page
    When I click the Cancel Booking button
    Then It is cancelled
