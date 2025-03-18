# Contributing to Wellness App

Thank you for your interest in contributing to the Wellness App! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Workflow](#development-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation Guidelines](#documentation-guidelines)
9. [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@wellness-app.com](mailto:conduct@wellness-app.com).

We are committed to providing a welcoming and inspiring community for all. We expect all participants to be respectful, inclusive, and considerate in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js 18+
- Docker and Docker Compose
- Git
- Familiarity with React Native and Express.js

### Setting Up the Development Environment

1. **Fork the Repository**

   Start by forking the repository to your GitHub account.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/wellness-app.git
   cd wellness-app
   ```

3. **Add the Upstream Remote**

   ```bash
   git remote add upstream https://github.com/original-org/wellness-app.git
   ```

4. **Install Dependencies**

   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Mobile dependencies
   cd ../mobile
   npm install
   ```

5. **Set Up Environment Variables**

   Copy the example environment files and update them with your local configuration:

   ```bash
   # Backend
   cd backend
   cp .env.example .env

   # Mobile
   cd ../mobile
   cp .env.example .env
   ```

6. **Start Development Environment**

   ```bash
   # Start backend and database
   docker-compose up -d

   # Start mobile app
   cd mobile
   npm run start
   ```

7. **Verify Setup**

   - Backend API should be running at http://localhost:3000
   - Mobile app should be running through the React Native development server

## How to Contribute

### Types of Contributions

There are many ways to contribute to the Wellness App:

1. **Code Contributions**
   - Implementing new features
   - Fixing bugs
   - Improving performance
   - Refactoring code

2. **Documentation**
   - Improving or adding documentation
   - Creating tutorials or how-to guides
   - Adding code comments

3. **Testing**
   - Writing unit, integration, or E2E tests
   - Manual testing and providing feedback
   - Improving test coverage

4. **Design**
   - UI/UX improvements
   - Visual design assets
   - Accessibility enhancements

5. **Bug Reports and Feature Requests**
   - Submitting well-documented bug reports
   - Suggesting new features or improvements

### Finding Issues to Work On

- Check the [Issues](https://github.com/organization/wellness-app/issues) tab for open issues
- Look for issues tagged with `good-first-issue` or `help-wanted`
- Join the community chat to discuss potential contributions

## Development Workflow

We follow a Git workflow based on feature branches and pull requests:

1. **Create a Branch**

   ```bash
   # Ensure you're on the latest develop branch
   git checkout develop
   git pull upstream develop

   # Create a feature branch
   git checkout -b feature/123-descriptive-name
   ```

2. **Make Your Changes**

   - Follow the coding standards
   - Write tests for your changes
   - Keep your changes focused on a single issue

3. **Commit Your Changes**

   We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

4. **Keep Your Branch Updated**

   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

5. **Push Your Changes**

   ```bash
   git push origin feature/123-descriptive-name
   ```

6. **Submit a Pull Request**

   Create a pull request from your branch to the `develop` branch of the upstream repository.

## Pull Request Process

1. **Fill Out the PR Template**

   When creating a PR, fill out all sections of the template:
   - Description of changes
   - Related issue
   - Type of change
   - Checklist of completed items

2. **Code Review**

   - All PRs require at least one review from a maintainer
   - Address all review comments
   - Maintainers may request changes or suggest improvements

3. **CI/CD Checks**

   All PRs must pass the automated checks:
   - Build verification
   - Linting
   - Unit and integration tests
   - Code coverage thresholds

4. **Approval and Merge**

   Once your PR is approved and all checks pass, a maintainer will merge it into the `develop` branch.

## Coding Standards

We maintain high coding standards to ensure code quality and consistency. Please review our [Coding Standards](docs/development/coding-standards.md) document for detailed guidelines on:

- Code formatting
- Naming conventions
- File organization
- Comments and documentation
- JavaScript/TypeScript practices
- React/React Native best practices
- Backend development standards

## Testing Guidelines

Testing is a critical part of our development process. Please follow our [Testing Strategy](docs/testing/testing-strategy.md) and [Test Implementation Guide](docs/testing/test-implementation-guide.md).

Key testing requirements:

- Write unit tests for all new functionality
- Maintain or improve code coverage
- Test edge cases and error scenarios
- Write integration tests for API endpoints
- Include E2E tests for critical user flows

## Documentation Guidelines

Good documentation is essential. When contributing, please:

1. **Code Documentation**
   - Add JSDoc comments to functions and classes
   - Document complex logic and decisions
   - Update existing documentation if your changes affect it

2. **README Updates**
   - Update README files if your changes affect setup or usage

3. **API Documentation**
   - Document new API endpoints
   - Update existing API documentation if your changes affect it

4. **User Documentation**
   - Contribute to user guides if applicable
   - Add screenshots or videos for UI changes

## Community

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **Slack Channel**: For real-time communication with the team
- **Community Forum**: For longer discussions and support
- **Monthly Contributors Meeting**: For roadmap discussion and community updates

### Recognition

We value and recognize all contributions. Contributors are acknowledged in several ways:

- Listed in our [CONTRIBUTORS.md](CONTRIBUTORS.md) file
- Mentioned in release notes for significant contributions
- Featured in our community spotlight

### Becoming a Maintainer

Regular contributors who demonstrate expertise and commitment may be invited to become maintainers. Maintainers have additional responsibilities and privileges, including:

- Reviewing and merging PRs
- Triaging issues
- Participating in roadmap planning
- Representing the project in community events

## Additional Resources

- [Project Architecture](docs/architecture/system-architecture.md)
- [API Documentation](docs/api/api-documentation.md)
- [Data Model](docs/architecture/data-model.md)
- [Git Workflow](docs/development/git-workflow.md)

---

Thank you for contributing to the Wellness App! Your efforts help create a better tool for improving people's wellbeing.
