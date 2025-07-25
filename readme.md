# Rudderstack E2E Automation Framework

A comprehensive end-to-end automation framework for **Rudderstack** built with modern tools and best practices. This framework combines Playwright's robust browser automation, CucumberJS's behavior-driven development approach, and TypeScript's type safety to deliver maintainable and scalable test automation.

## 🛠️ Tech Stack

- **Playwright** - Cross-browser automation with powerful testing capabilities
- **CucumberJS** - BDD framework for writing human-readable test scenarios
- **TypeScript** - Type-safe JavaScript for enhanced code quality and maintainability
- **GitHub Actions** - Automated CI/CD pipeline integration
- **Cucumber HTML & JUnit Reporters** - Comprehensive test reporting and visualization

## 📁 Project Structure

```
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
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
RUDDERSTACK_EMAIL=your@email.com
RUDDERSTACK_PASSWORD=yourPassword
RUDDERSTACK_URL=https://app.rudderstack.com
```

**Important:** Never commit `.env` files to version control. For CI environments, use GitHub Secrets to manage sensitive variables securely.

### 3. Running Tests

**Sequential execution:**

```bash
npm test
```

**Parallel execution (4 workers):**

```bash
npm run test:parallel
```

### 4. View Test Reports

Open the comprehensive HTML report:

```bash
npm run open-report
```

Reports are generated at `reports/cucumber-report.html` with detailed test results and visualizations.

## 🧪 Test Architecture

### BDD Approach

- **Feature Files**: Human-readable scenarios in `src/feature/*.feature` describe application behavior in plain language
- **Step Definitions**: TypeScript implementations in `src/steps/*.steps.ts` map feature steps to executable code
- **Page Objects**: Encapsulated UI logic in `src/pages/` following POM design pattern for reusability

### Best Practices

- Use descriptive step definitions for both positive and negative test scenarios
- Implement dedicated assertions for UI element states (e.g., disabled buttons, error messages)
- Leverage API utilities for backend validations and data setup

## 🤖 Continuous Integration

### GitHub Actions Integration

- Automated test execution on every push and pull request
- Daily scheduled runs for continuous monitoring
- Artifact uploads for HTML and JUnit reports
- Seamless integration with GitHub's CI/CD ecosystem

### Setting Up Secrets

1. Navigate to your repository's **Settings** → **Secrets and variables** → **Actions**
2. Add required secrets:
   - `RUDDERSTACK_EMAIL`
   - `RUDDERSTACK_PASSWORD`
   - `RUDDERSTACK_URL`

## 📊 Reporting & Analysis

### Available Reports

- **HTML Report**: Interactive dashboard at `reports/cucumber-report.html`
- **JUnit XML**: Machine-readable format at `reports/cucumber-report.xml`
- **CI Logs**: Detailed execution logs in GitHub Actions workflow runs

### Debugging Features

- Screenshot capture on test failures
- Detailed error logs and stack traces
- Browser console output capture
- Network request/response logging

## ⚠️ Important Notes

### Known Limitations

- **Webhook Endpoints**: RequestCatcher URLs may expire after 24 hours. Monitor for "0 delivered events" and refresh endpoints as needed
- **Browser Mode**: Tests run in headless mode by default. Modify `src/support/hooks.ts` for headed mode during local debugging

### Troubleshooting

- Ensure all environment variables are properly configured
- Verify webhook endpoints are active and accessible
- Check browser compatibility for specific test scenarios
- Review CI logs for detailed error information

## 🙏 Acknowledgments

Built with these powerful open-source technologies:

- [Playwright](https://playwright.dev/) - Modern web testing framework
- [CucumberJS](https://github.com/cucumber/cucumber-js) - BDD testing framework
- [Rudderstack](https://rudderstack.com/) - Customer data platform

## 📝 License

This project is available under the MIT License. See LICENSE file for details.

---

**Ready to automate?** Follow the Quick Start guide above and begin writing your first test scenarios!
