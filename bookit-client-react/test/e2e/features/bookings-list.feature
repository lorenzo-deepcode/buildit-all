Feature: Bookings List Feature
  Scenario: Clicking the week forward button
    Given I create a booking for next week
    When I view my bookings
    And I navigate to next week
    Then I see my created booking
    And The location of the booking is listed
    And the booking is cancelled

  Scenario: View bookings as another user
    Given I create a booking for next week
    When I view my bookings as another user
    And I navigate to next week
    Then I don't see the created booking
    When I view my bookings
    And I navigate to next week
    And the booking is cancelled
