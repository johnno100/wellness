# Git Workflow

This document outlines our Git branching and workflow strategy for the Wellness App. Following these guidelines ensures a consistent approach to version control across the team and helps maintain code quality.

## Branching Strategy

We follow a modified [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) workflow that provides a structured approach to managing our repository.

### Main Branches

- **`main`**: The production branch containing the code currently deployed to production.
- **`develop`**: The integration branch where features are combined prior to release.

### Supporting Branches

- **`feature/*`**: Feature branches for new functionality
- **`bugfix/*`**: Bug fix branches for addressing issues
- **`release/*`**: Release branches for preparing deployments
- **`hotfix/*`**: Hotfix branches for critical production fixes

## Branch Naming Convention

Branch names should be descriptive and follow our naming pattern:

```
<type>/<issue-number>-<short-description>
```

Examples:
- `feature/123-add-sleep-tracking`
- `bugfix/456-fix-authentication-token-refresh`
- `release/v1.2.0`
- `hotfix/789-critical-security-fix`

## Workflow Process

### Feature Development

1. **Create a Feature Branch**

   Create a feature branch from `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/123-add-sleep-tracking
   ```

2. **Develop the Feature**

   Work on your feature, committing changes with meaningful commit messages following our [conventional commits](https://www.conventionalcommits.org/) format:

   ```bash
   git add .
   git commit -m "feat(sleep): add sleep quality score calculation"
   ```

3. **Keep Branch Updated**

   Regularly update your feature branch with changes from `develop`:

   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. **Push Your Branch**

   Push your feature branch to the remote repository:

   ```bash
   git push origin feature/123-add-sleep-tracking
   ```

5. **Create Pull Request**

   Create a pull request from your feature branch to `develop`. Include:
   - Description of changes
   - Reference to related issue (#123)
   - Testing completed
   - Screenshots/videos for UI changes

6. **Code Review and Merge**

   After code review and approval, merge your feature into `develop`:
   - Ensure CI checks pass
   - Address review comments
   - Squash commits if necessary
   - Merge using the PR interface

### Bug Fix Process

1. **Create a Bugfix Branch**

   Create a bugfix branch from `develop` (or `main` for critical production issues):

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b bugfix/456-fix-authentication-token-refresh
   ```

2. **Fix the Bug**

   Implement the bug fix with appropriate tests to prevent regression:

   ```bash
   git add .
   git commit -m "fix(auth): resolve token refresh loop issue"
   ```

3. **Follow Feature Process**

   Follow the same process as feature development for updating, pushing, creating a PR, and merging.

### Release Process

1. **Create a Release Branch**

   When ready to prepare a release, branch from `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   ```

2. **Prepare Release**

   - Update version numbers
   - Generate release notes
   - Fix any minor bugs specific to the release

   ```bash
   git add .
   git commit -m "chore(release): bump version to 1.2.0"
   ```

3. **Finish Release**

   - Create a PR from `release/v1.2.0` to `main`
   - After approval, merge to `main`
   - Create a PR from `release/v1.2.0` to `develop` to include any release-specific changes
   - Tag the release on `main`:

   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin v1.2.0
   ```

### Hotfix Process

1. **Create a Hotfix Branch**

   For critical production issues, branch directly from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/789-critical-security-fix
   ```

2. **Implement Hotfix**

   Fix the issue with appropriate tests:

   ```bash
   git add .
   git commit -m "fix(security): resolve API authentication vulnerability"
   ```

3. **Complete Hotfix**

   - Create a PR from `hotfix/789-critical-security-fix` to `main`
   - After approval, merge to `main`
   - Create a PR from `hotfix/789-critical-security-fix` to `develop` to include the fix in future releases
   - Tag the hotfix on `main`:

   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.2.1 -m "Hotfix v1.2.1"
   git push origin v1.2.1
   ```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Scopes

Scopes provide additional contextual information. Common scopes include:

- `auth`: Authentication related changes
- `api`: API related changes
- `ui`: User interface changes
- `health`: Health domain specific changes
  - `mental`
  - `sleep`
  - `nutrition`
  - `fitness`
- `data`: Data model or database related changes
- `config`: Configuration changes

### Examples

```
feat(sleep): add sleep quality score visualization

- Add new component to display sleep quality over time
- Implement color coding based on score values
- Connect to Redux store for data access

Closes #123
```

```
fix(auth): resolve token refresh loop issue

When a token refresh failed due to network issues, the app could enter
an infinite refresh loop. This fix adds exponential backoff and better
error handling.

Fixes #456
```

## Pull Request Guidelines

### Creating a Pull Request

- Create a PR to merge your branch into the appropriate target branch
- Use the provided PR template
- Link to relevant issues with "Closes #123" or "Relates to #123"
- Add appropriate reviewers

### PR Title and Description

PR titles should follow the same conventional commit format:

```
feat(sleep): add sleep quality score visualization
```

The description should include:

1. **Summary**: Brief description of changes
2. **Details**: More comprehensive explanation if needed
3. **Testing**: How the changes were tested
4. **Screenshots/Videos**: For UI changes
5. **Checklist**: Completion of required items

### Review Process

1. **Automated Checks**:
   - CI build must pass
   - Code coverage thresholds must be met
   - Linting must pass
   - Type checking must pass

2. **Code Review**:
   - At least one approval required
   - Address all comments
   - Maintainer approval for significant changes

3. **Merge Strategies**:
   - Feature branches: Squash and merge
   - Release branches: Merge commit
   - Hotfix branches: Merge commit

## Tagging and Releases

We follow [Semantic Versioning](https://semver.org/) for our releases:

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible API changes
- **MINOR**: Backward-compatible functionality additions
- **PATCH**: Backward-compatible bug fixes

### Creating Tags

After merging a release or hotfix branch to `main`, create a tag:

```bash
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

### Release Notes

GitHub Releases should be created for each tag, including:

1. Summary of changes
2. Notable features and fixes
3. Breaking changes (if any)
4. Contributors
5. Upgrade instructions (if necessary)

## Handling Large Features

For large features that take multiple days or weeks to complete, use feature flags:

1. Create a feature branch as usual
2. Implement the feature behind a feature flag
3. Merge the feature to `develop` even if incomplete
4. Continue development on new feature branches
5. When complete, enable the feature flag

This approach allows for:
- Regular integration with `develop`
- Team collaboration on large features
- Easy enabling/disabling of features
- A/B testing possibilities

## Git Hooks

We use Git hooks to enforce quality standards:

### Pre-commit Hooks

- Lint staged files
- Run format checks
- Verify commit message format

### Pre-push Hooks

- Run unit tests
- Check for security vulnerabilities
- Verify TypeScript compilation

## Troubleshooting Common Git Issues

### Resolving Merge Conflicts

1. Fetch latest changes:

   ```bash
   git fetch origin
   ```

2. Rebase your branch:

   ```bash
   git rebase origin/develop
   ```

3. Resolve conflicts in your editor, then:

   ```bash
   git add <resolved-files>
   git rebase --continue
   ```

4. Force-push your branch (only if it's your personal branch):

   ```bash
   git push origin feature/123-add-sleep-tracking --force-with-lease
   ```

### Undoing Local Commits

To undo the last commit but keep changes:

```bash
git reset --soft HEAD~1
```

To completely discard the last commit and changes:

```bash
git reset --hard HEAD~1
```

### Moving Commits to Another Branch

If you committed to the wrong branch:

```bash
# Note the commit hash you want to move
git log

# Create a new branch with those changes
git checkout -b feature/correct-branch

# Go back to the original branch
git checkout previous-branch

# Reset the original branch to remove the commits
git reset --hard HEAD~n  # where n is the number of commits to remove

# Push the new branch
git push origin feature/correct-branch
```

## Best Practices

1. **Commit Early and Often**
   - Make small, focused commits
   - Each commit should represent a single logical change

2. **Write Meaningful Commit Messages**
   - Follow the conventional commits format
   - Explain "why" not just "what"

3. **Keep Branches Short-lived**
   - Aim to merge feature branches within a few days
   - Regularly rebase long-running branches

4. **Avoid Direct Commits to `main` and `develop`**
   - Always use feature/bugfix branches
   - Enforce through branch protection rules

5. **Use Issues for Tracking**
   - Create an issue before starting work
   - Reference issues in commits and PRs

6. **Clean Up Branches**
   - Delete branches after merging
   - Regularly clean up stale branches

## Git Configuration

### Recommended Settings

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set rebase as default pull strategy
git config --global pull.rebase true

# Enable helpful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Enable helpful UI enhancements
git config --global color.ui auto
```

### Git Ignore

Ensure your repository includes appropriate `.gitignore` files:

- Global rules in the root `.gitignore`
- Directory-specific rules in nested `.gitignore` files

## Continuous Integration Integration

Our Git workflow integrates with CI/CD:

1. **Feature Branch Builds**
   - Run on every push to feature branches
   - Run unit and integration tests
   - Check code quality and coverage

2. **Develop Branch Builds**
   - Run additional integration tests
   - Deploy to development environment
   - Run E2E tests

3. **Release Branch Builds**
   - Run full test suite
   - Deploy to staging environment
   - Run performance tests

4. **Main Branch Builds**
   - Run full test suite
   - Deploy to production
   - Run smoke tests

## Training and Support

- New team members will receive Git workflow training
- The DevOps team provides support for complex Git issues
- Regular Git workshops for advanced techniques

---

By following this Git workflow, we ensure a consistent, efficient, and organized approach to version control that supports our development process and maintains high code quality.
