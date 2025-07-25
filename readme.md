# Rudderstack E2E Automation Framework

This project is an end-to-end automation framework for **Rudderstack** using [Playwright](https://playwright.dev/), [CucumberJS](https://github.com/cucumber/cucumber-js), and TypeScript.

It demonstrates industry-standard, maintainable, and readable test automation with Page Object Model (POM) design, API validations, and GitHub Actions CI integration.

---

## 🛠️ Tech Stack

- **Playwright**: For robust browser automation.
- **CucumberJS**: For BDD-style feature files and clear step definitions.
- **TypeScript**: For enhanced type safety, scalability, and maintainability.
- **GitHub Actions**: For continuous integration and delivery (CI/CD).
- **Cucumber HTML & JUnit Reporters**: For comprehensive and easily viewable test reporting.

---

## 📁 Project Structure

Markdown

# Rudderstack E2E Automation Framework

This project is an end-to-end automation framework for **Rudderstack** using [Playwright](https://playwright.dev/), [CucumberJS](https://github.com/cucumber/cucumber-js), and TypeScript.

It demonstrates industry-standard, maintainable, and readable test automation with Page Object Model (POM) design, API validations, and GitHub Actions CI integration.

---

## 🛠️ Tech Stack

- **Playwright**: For robust browser automation.
- **CucumberJS**: For BDD-style feature files and clear step definitions.
- **TypeScript**: For enhanced type safety, scalability, and maintainability.
- **GitHub Actions**: For continuous integration and delivery (CI/CD).
- **Cucumber HTML & JUnit Reporters**: For comprehensive and easily viewable test reporting.

---

## 📁 Project Structure

rudderstack-e2e/
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions CI workflow
├── src/
│ ├── feature/
│ │ └── _.feature # Cucumber feature files (BDD scenarios)
│ ├── steps/
│ │ └── _.steps.ts # Step definitions for feature files
│ ├── pages/
│ │ └── \*.ts # Page Object Model (POM) classes
│ └── support/
│ └── hooks.ts # Playwright hooks and global setup
├── utils/
│ └── api.ts # Utilities for API interactions/validations
├── reports/
│ ├── cucumber-report.html # HTML test report
│ └── cucumber-report.xml # JUnit XML test report
├── .env # Environment variables (local)
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── README.md # This README file

---

## 🚀 Quick Start

Follow these steps to get the framework up and running on your local machine.

### 1. **Install Dependencies**

Navigate to the project root and install all required Node.js packages:

````sh
npm install
2. Configure Environment Variables

Create a .env file at the root of the project for your local test runs. This file will store sensitive information like credentials and application URLs.

Code snippet
RUDDERSTACK_EMAIL=your@email.com
RUDDERSTACK_PASSWORD=yourPassword
RUDDERSTACK_URL=[https://app.rudderstack.com](https://app.rudderstack.com)
Important:

Do not commit .env to source control. This file is for local use only.

For CI runs (e.g., on GitHub Actions), these environment variables are securely set via GitHub Secrets.

3. Run Tests Locally

Execute your tests using the following npm scripts:

Sequential Run (one browser):

Bash
npm test
Parallel Execution (4 workers by default):

Bash
npm run test:parallel
4. View HTML Report

After a test run completes, you can open a detailed HTML report in your browser:

Bash
npm run open-report
The comprehensive results will be available at reports/cucumber-report.html.

🧪 Writing & Structuring Tests
The framework promotes a clean and organized approach to test creation:

Feature files: Write human-readable BDD (Behavior-Driven Development) scenarios in src/feature/*.feature. These describe the desired behavior of the application in plain language.

Step definitions: Map the steps defined in your feature files to executable TypeScript code in src/steps/*.steps.ts.

Page Objects: Encapsulate UI logic, selectors, and interactions in src/pages/ using the Page Object Model (POM) design pattern. This enhances reusability and maintainability.

Tip:

For negative test cases (e.g., asserting a disabled login button after invalid input), create dedicated steps to specifically assert the expected state of the UI elements.

Markdown
# Rudderstack E2E Automation Framework

This project is an end-to-end automation framework for **Rudderstack** using [Playwright](https://playwright.dev/), [CucumberJS](https://github.com/cucumber/cucumber-js), and TypeScript.

It demonstrates industry-standard, maintainable, and readable test automation with Page Object Model (POM) design, API validations, and GitHub Actions CI integration.

---

## 🛠️ Tech Stack

* **Playwright**: For robust browser automation.
* **CucumberJS**: For BDD-style feature files and clear step definitions.
* **TypeScript**: For enhanced type safety, scalability, and maintainability.
* **GitHub Actions**: For continuous integration and delivery (CI/CD).
* **Cucumber HTML & JUnit Reporters**: For comprehensive and easily viewable test reporting.

---

## 📁 Project Structure

rudderstack-e2e/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow
├── src/
│   ├── feature/
│   │   └── *.feature          # Cucumber feature files (BDD scenarios)
│   ├── steps/
│   │   └── *.steps.ts         # Step definitions for feature files
│   ├── pages/
│   │   └── *.ts               # Page Object Model (POM) classes
│   └── support/
│       └── hooks.ts           # Playwright hooks and global setup
├── utils/
│   └── api.ts                 # Utilities for API interactions/validations
├── reports/
│   ├── cucumber-report.html   # HTML test report
│   └── cucumber-report.xml    # JUnit XML test report
├── .env                       # Environment variables (local)
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This README file


---

## 🚀 Quick Start

Follow these steps to get the framework up and running on your local machine.

### 1. **Install Dependencies**

Navigate to the project root and install all required Node.js packages:

```sh
npm install
2. Configure Environment Variables

Create a .env file at the root of the project for your local test runs. This file will store sensitive information like credentials and application URLs.

Code snippet
RUDDERSTACK_EMAIL=your@email.com
RUDDERSTACK_PASSWORD=yourPassword
RUDDERSTACK_URL=[https://app.rudderstack.com](https://app.rudderstack.com)
Important:

Do not commit .env to source control. This file is for local use only.

For CI runs (e.g., on GitHub Actions), these environment variables are securely set via GitHub Secrets.

3. Run Tests Locally

Execute your tests using the following npm scripts:

Sequential Run (one browser):

Bash
npm test
Parallel Execution (4 workers by default):

Bash
npm run test:parallel
4. View HTML Report

After a test run completes, you can open a detailed HTML report in your browser:

Bash
npm run open-report
The comprehensive results will be available at reports/cucumber-report.html.

🧪 Writing & Structuring Tests
The framework promotes a clean and organized approach to test creation:

Feature files: Write human-readable BDD (Behavior-Driven Development) scenarios in src/feature/*.feature. These describe the desired behavior of the application in plain language.

Step definitions: Map the steps defined in your feature files to executable TypeScript code in src/steps/*.steps.ts.

Page Objects: Encapsulate UI logic, selectors, and interactions in src/pages/ using the Page Object Model (POM) design pattern. This enhances reusability and maintainability.

Tip:

For negative test cases (e.g., asserting a disabled login button after invalid input), create dedicated steps to specifically assert the expected state of the UI elements.

🤖 GitHub Actions: Continuous Integration
The E2E test suite is integrated with GitHub Actions for continuous integration.

Tests are configured to run automatically on every push to the repository, every pull_request, and daily via a scheduled workflow.

HTML and JUnit reports are uploaded as build artifacts, allowing easy review of test results directly from GitHub.

To add secrets for CI runs (like RUDDERSTACK_EMAIL, RUDDERSTACK_PASSWORD, RUDDERSTACK_URL):

Go to your GitHub repository.

Navigate to Settings > Secrets and variables > Actions.

Click New repository secret and add your required secrets.

🔍 Reporting & Debugging
HTML reports: Found at reports/cucumber-report.html, providing a detailed and interactive overview of test results.

JUnit XML: Located at reports/cucumber-report.xml, suitable for integration with other CI/CD dashboards.

All test execution logs are also visible directly within the GitHub Actions CI output.

⚠️ Known Caveats
Webhook Endpoints: Webhook endpoints used in tests (e.g., RequestCatcher URLs) may expire after 24 hours. If you observe "0 delivered events" in your test results, please ensure your webhook endpoint is active and update it as needed in your test setup or environment variables.

Headless Browsers: By default, headless browsers are used in CI environments for faster execution. For local debugging, you can modify the Playwright launch options in your src/support/hooks.ts file to run tests in a headed (visible) browser mode.

🙏 Credits
This framework leverages the power of the following open-source projects:

Playwright

CucumberJS

Rudderstack
````
