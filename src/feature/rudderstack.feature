Feature: Rudderstack E2E Automation

  Scenario: Send Event and Check Webhook Delivery
    Given I log in to RudderStack
    And I read and store the data plane URL
    And I read and store the write key from the HTTP source
    Then I go to the Webhook destination's Events tab
    And I send an event using the HTTP API
    Then I go to the Webhook destination's Events tab
    And I report the count of delivered and failed events
