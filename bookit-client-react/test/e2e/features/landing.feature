Feature: Landing Page
  Scenario: Clicking the Book A Room Button
    Given I am on the landing page of Bookit
    When I click the Book a Room button
    Then I am on the booking form

  Scenario: Clicking the View Your Bookings Button
    Given I am on the landing page of Bookit
    When I click the View Your Bookings button
    Then I am on the view bookings page
