Feature: Rudderstack E2E Automation
  # Test 1: Wait and measure event delivery time

  Scenario: Send Event and Measure Webhook Delivery Time
    Given I log in to RudderStack
    And I read and store the data plane URL
    And I read and store the write key from the HTTP source
    And I send an event using the HTTP API
    Then I go to the Webhook destination's Events tab
    Then I wait for and measure the delivery time for the event
  # Test 2: API negative case

  Scenario: API returns error for invalid write key
    Given I log in to RudderStack
    And I read and store the data plane URL
    And I use an invalid write key
    And I go to the Webhook destination's Events tab
    When I send an event using the HTTP API
