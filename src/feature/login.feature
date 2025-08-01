Feature: RudderStack Login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters email "env:RUDDERSTACK_EMAIL"
    And the user enters password "env:RUDDERSTACK_PASSWORD"
    And the user submits the login form
    Then the user should land on the Connections page

  Scenario: Login fails with invalid password
    Given the user is on the login page
    When the user enters email "env:RUDDERSTACK_EMAIL"
    And the user enters password "wrongpassword"
    And the user submits the login form
    Then the error message "Wrong email or password." should be displayed
  # Scenario: Login fails with empty email
  #   Given the user is on the login page
  #   When the user enters email ""
  #   And the user enters password "env:RUDDERSTACK_PASSWORD"
  #   Then the login button should be disabled
  #   And the error message "Email is required" should be displayed
  # Scenario: Login fails with empty password
  #   Given the user is on the login page
  #   When the user enters email "env:RUDDERSTACK_EMAIL"
  #   And the user enters password ""
  #   And the user submits the login form
  #   Then the error message "Password is required" should be displayed
