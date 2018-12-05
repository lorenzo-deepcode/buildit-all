Feature: Bookables List Feature
  Scenario: Clicking the Room Input Button
    Given I am on the Bookit form
    When I click the room input button
    Then I see a list of rooms and their availability
