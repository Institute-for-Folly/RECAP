# Contributing to RECAP

Thanks for your interest in contributing to RECAP! This guide will help you get started.

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit code changes
- 🎨 Design improvements
- ✅ Add tests

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/RECAP.git
   cd RECAP
   ```
3. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

Follow the [QUICKSTART.md](QUICKSTART.md) guide to set up your local environment.

## Making Changes

### Smart Contract Changes

1. Edit files in `/contracts`
2. Run tests: `npm test`
3. Ensure all tests pass
4. Document any new functions

### Frontend Changes

1. Edit files in `/frontend`
2. Run dev server: `npm run frontend:dev`
3. Test your changes manually
4. Ensure TypeScript compiles: `npm run frontend:build`

### Documentation Changes

1. Edit relevant `.md` files
2. Ensure formatting is correct
3. Check links work

## Code Style

- **JavaScript/TypeScript**: Follow existing code style
- **Solidity**: Use standard Solidity conventions
- **React**: Use functional components and hooks
- **Comments**: Add comments for complex logic

## Commit Messages

Use clear, descriptive commit messages:

```
✅ Good:
- "Add streak tracking to dashboard"
- "Fix wallet connection bug on mobile"
- "Update deployment documentation"

❌ Bad:
- "fix"
- "updates"
- "changes"
```

## Pull Request Process

1. **Ensure your PR:**
   - Has a clear title and description
   - Links to any related issues
   - Includes tests (if applicable)
   - Updates documentation (if needed)
   - Has no merge conflicts

2. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Other (specify)

   ## Testing
   How to test these changes

   ## Screenshots (if applicable)
   Add screenshots here
   ```

3. **Submit your PR**
4. **Respond to feedback**
5. **Wait for review and merge**

## Feature Requests

Have an idea? Check [COOL_ADDONS.md](COOL_ADDONS.md) for inspiration!

To request a feature:
1. Open an issue
2. Use the "Feature Request" template
3. Describe the feature
4. Explain why it's useful
5. Discuss implementation ideas

## Bug Reports

Found a bug?
1. Check if it's already reported
2. Open a new issue
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if helpful)
   - Environment details

## Questions?

- Open a GitHub Discussion
- Ask in issues (if relevant)
- Check existing documentation

## Code of Conduct

Be respectful and constructive:
- Be welcoming to newcomers
- Respect different viewpoints
- Accept constructive criticism
- Focus on what's best for the project

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in commits

Thank you for contributing to RECAP! 🎉
