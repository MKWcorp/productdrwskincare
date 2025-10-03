# Contributing to DR.W Skincare Product Display System

Thank you for your interest in contributing to DR.W Skincare Product Display System! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/productdrwskincare.git
   cd productdrwskincare
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and other configs
   ```
5. **Run development server**
   ```bash
   npm run dev
   ```

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Use GitHub Issues to report bugs
- Include detailed reproduction steps
- Provide browser/OS information
- Include error messages and screenshots

### ✨ Feature Requests
- Submit feature requests via GitHub Issues
- Explain the use case and benefit
- Provide mockups or examples if applicable

### 💻 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- Test coverage improvements

### 📝 Documentation
- API documentation improvements
- Code comments and JSDoc
- README and wiki updates
- Usage examples

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Local Development

1. **Database Setup**
   ```bash
   # Create database
   createdb drw_skincare_dev
   
   # Run migrations
   npx prisma migrate dev
   
   # Generate client
   npx prisma generate
   ```

2. **Environment Variables**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/drw_skincare_dev"
   NEXT_PUBLIC_SITE_NAME="DR.W Skincare Dev"
   NEXT_PUBLIC_WHATSAPP_NUMBER="6285852555571"
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm run test
   npm run test:watch
   ```

5. **Linting and Formatting**
   ```bash
   npm run lint
   npm run lint:fix
   npm run format
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow ESLint configuration
- **Prettier**: Use Prettier for formatting
- **File Naming**: Use kebab-case for files and folders
- **Component Names**: Use PascalCase for React components

### Component Guidelines

1. **Generic Components**: All new components should be generic and configurable
   ```tsx
   // ✅ Good - Configurable
   interface Props {
     config: SiteConfig
     onProductClick: (product: Product) => void
   }
   
   // ❌ Bad - Hardcoded
   const siteName = "DR.W Skincare"
   ```

2. **TypeScript**: Always provide proper type definitions
   ```tsx
   interface ComponentProps {
     products: DatabaseProduct[]
     loading?: boolean
     onProductClick?: (product: DatabaseProduct) => void
   }
   ```

3. **Error Handling**: Implement proper error boundaries
   ```tsx
   const [error, setError] = useState<string | null>(null)
   
   if (error) {
     return <ErrorMessage message={error} />
   }
   ```

### API Guidelines

1. **Consistent Response Format**
   ```json
   {
     "success": true,
     "data": [...],
     "message?": "Optional message",
     "pagination?": {...}
   }
   ```

2. **Error Handling**
   ```json
   {
     "success": false,
     "message": "Error description",
     "error": "ERROR_CODE"
   }
   ```

3. **Validation**: Always validate input parameters
4. **Rate Limiting**: Respect rate limits
5. **Documentation**: Update API docs for changes

### Database Guidelines

1. **Migrations**: Always create migrations for schema changes
2. **Indexes**: Add appropriate indexes for queries
3. **Relations**: Use Prisma relations properly
4. **Naming**: Use snake_case for database fields

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run test
   npm run build
   ```

2. **Run linting**
   ```bash
   npm run lint:fix
   ```

3. **Update documentation** if needed

4. **Add tests** for new features

### PR Template

Use this template for your pull request:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or marked as such)
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing for UI changes
4. **Documentation**: Ensure docs are updated

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test ProductCard.test.tsx

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

1. **Unit Tests**: Test individual components and functions
   ```tsx
   import { render, screen } from '@testing-library/react'
   import { ProductCard } from './ProductCard'
   
   test('renders product name', () => {
     render(<ProductCard product={mockProduct} />)
     expect(screen.getByText('Product Name')).toBeInTheDocument()
   })
   ```

2. **Integration Tests**: Test component interactions
3. **API Tests**: Test API endpoints
4. **E2E Tests**: Test complete user flows

### Test Coverage

- Maintain minimum 80% test coverage
- Focus on critical business logic
- Test error scenarios
- Test edge cases

## 🐛 Bug Report Template

When reporting bugs, please include:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 95]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem
```

## ✨ Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this feature address?

**Proposed Solution**
How would you like it to work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Screenshots, mockups, examples
```

## 🏷️ Commit Guidelines

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
git commit -m "feat(components): add GenericProductCard component"
git commit -m "fix(api): resolve pagination issue in products endpoint"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(hooks): extract common API logic to custom hook"
```

## 🔄 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Update version** in package.json
2. **Update CHANGELOG.md**
3. **Create release tag**
4. **Build and test**
5. **Deploy to production**
6. **Publish NPM package** (if applicable)

## 👥 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code contributions and reviews

## 📚 Resources

### Documentation
- [README.md](README.md) - Project overview
- [API.md](docs/API.md) - API documentation
- [CHANGELOG.md](CHANGELOG.md) - Version history

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎉 Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md mentions
- README.md contributors section

## 📞 Getting Help

If you need help:

1. **Check existing issues** for similar problems
2. **Read the documentation** thoroughly
3. **Ask in GitHub Discussions** for general questions
4. **Create an issue** for specific problems

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DR.W Skincare Product Display System! 🚀