# Contributing to Career Nest

Thank you for your interest in contributing to Career Nest! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/career_nest.git
   cd career_nest
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/anupnayak25/career_nest.git
   ```

4. **Keep Your Fork Updated**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

## 💻 Development Setup

### Prerequisites

- Node.js v18+
- Python 3.8+
- MySQL 8.0+
- Flutter SDK (for mobile development)
- Git

### Initial Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   mysql -u root -p carrer_nest < carrer_nest.sql
   npm run server
   ```

2. **AI Server Setup**
   ```bash
   cd ai_server
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Website Setup**
   ```bash
   cd website
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Flutter App Setup**
   ```bash
   cd app
   flutter pub get
   flutter run
   ```

## 🔧 How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes** - Fix issues reported in GitHub Issues
2. **Features** - Implement new features from the roadmap
3. **Documentation** - Improve or add documentation
4. **Tests** - Add or improve test coverage
5. **Performance** - Optimize code performance
6. **UI/UX** - Improve user interface and experience

### Contribution Workflow

1. **Check Existing Issues**
   - Look for existing issues or create a new one
   - Comment on the issue to claim it

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Backend
   cd backend
   npm run server  # Manual testing
   
   # Website
   cd website
   npm run lint
   npm run build
   
   # AI Server
   cd ai_server
   python app.py  # Manual testing
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub and create a Pull Request
   - Fill in the PR template
   - Link related issues

## 📝 Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Remove console.log and debugging code before committing

### JavaScript/Node.js (Backend & Website)

```javascript
// Use camelCase for variables and functions
const userName = "John Doe";
function getUserData() { }

// Use PascalCase for classes and components
class UserService { }
function UserProfile() { }

// Use const by default, let when reassignment is needed
const API_URL = "http://localhost:5000";
let counter = 0;

// Use async/await over callbacks
async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Use template literals
const message = `Hello, ${userName}!`;

// Use arrow functions for callbacks
array.map(item => item.id);
```

### Python (AI Server)

```python
# Follow PEP 8 style guide
# Use snake_case for variables and functions
user_name = "John Doe"
def get_user_data():
    pass

# Use PascalCase for classes
class UserService:
    pass

# Use type hints
def transcribe_video(video_url: str) -> str:
    pass

# Use docstrings
def evaluate_answer(expected: str, student: str) -> float:
    """
    Evaluate student answer against expected answer.
    
    Args:
        expected: The expected answer text
        student: The student's answer text
    
    Returns:
        Similarity score between 0 and 100
    """
    pass
```

### Dart/Flutter (Mobile App)

```dart
// Use camelCase for variables and functions
String userName = "John Doe";
void getUserData() {}

// Use PascalCase for classes
class UserService {}
class HomePage extends StatelessWidget {}

// Use final or const when possible
final String apiUrl = "http://localhost:5000";
const int maxRetries = 3;

// Use named parameters
Widget buildButton({
  required String text,
  required VoidCallback onPressed,
}) {
  return ElevatedButton(
    onPressed: onPressed,
    child: Text(text),
  );
}
```

## 📤 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
feat(auth): add password reset functionality

fix(api): resolve CORS issue for video upload

docs(readme): update installation instructions

refactor(backend): simplify database connection logic

perf(ai-server): optimize video transcription speed

test(quiz): add unit tests for quiz submission
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added to complex code
- [ ] Documentation updated (if applicable)
- [ ] No console.log or debug code
- [ ] Tests pass locally
- [ ] No merge conflicts with main branch

### PR Title Format

Use the same format as commit messages:

```
feat(component): brief description
fix(module): issue description
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Fixes #123

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

### Review Process

1. At least one maintainer must review the PR
2. All comments must be resolved
3. All CI checks must pass
4. PR will be merged by a maintainer

## 🧪 Testing Guidelines

### Backend Testing

```javascript
// Test API endpoints manually
// Example: Testing login endpoint
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'test@example.com',
  password: 'password123'
});
console.log(response.data);
```

### Website Testing

```bash
# Run linter
npm run lint

# Build for production (catches build errors)
npm run build

# Manual testing in browser
npm run dev
```

### AI Server Testing

```bash
# Run the server
python app.py

# Test endpoints with curl or Postman
curl -X POST http://localhost:7860/transcribe \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "http://example.com/video.mp4"}'
```

## 📚 Documentation

### What to Document

- New features and their usage
- API endpoint changes
- Configuration changes
- Breaking changes
- Setup/installation steps
- Complex algorithms or business logic

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date with code changes

### Where to Add Documentation

- `README.md` - Main project overview
- `backend/README.md` - Backend-specific docs
- `website/README.md` - Website-specific docs
- `ai_server/README.md` - AI server-specific docs
- Code comments - Complex logic explanation
- API documentation - Endpoint details

## 🐛 Issue Reporting

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if it's already fixed in the latest version
- Gather relevant information (logs, screenshots, etc.)

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96]
- Node version: [e.g., 18.0.0]
- Other relevant versions

## Screenshots
If applicable

## Additional Context
Any other information
```

## 🏷️ Labels

We use labels to categorize issues and PRs:

- `bug` - Something isn't working
- `feature` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `enhancement` - Improvement to existing feature
- `question` - Further information requested
- `wontfix` - Will not be worked on

## 🌟 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- Contributors page (if created)

## 📞 Getting Help

- **GitHub Discussions** - For questions and discussions
- **GitHub Issues** - For bug reports and feature requests
- **Email** - Contact maintainers directly for sensitive issues

## 📄 License

By contributing to Career Nest, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Career Nest! 🎉
