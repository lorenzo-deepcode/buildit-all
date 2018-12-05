Feature: Booking a resource
  Scenario: Booking a room
    Given I am on the bookit website form
    And I fill in the form
    And I select a room
    When I create my booking
    Then It's booked

  Scenario: Booking a room that is already booked
    Given I am on the bookit website form
    And I fill in the form
    And I select a room
    And I create my booking
    Given I am on the bookit website form
    When I fill in the form
    Then I cannot select the same room

  Scenario: Changing your location
    Given I am on the bookit website form
    And I fill in the form
    And I select a room
    When I change my location
    Then My selected room clears
    And The list of rooms is updated
