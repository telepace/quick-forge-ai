# QuickForge AI

<div align="center">
  
![QuickForge AI](https://img.shields.io/badge/QuickForge-AI-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

</div>

<p align="center">
    <a href="./README.md"><b>English</b></a> •
    <a href="./README_zh-CN.md"><b>中文</b></a>
</p>

A production-ready fullstack template combining FastAPI (Python) and TypeScript for rapid AI prototype development. Designed for freelancers and AI entrepreneurs who need to quickly build and deploy professional applications with modern development practices.

## 🚀 Features

- **FastAPI Backend**: High-performance Python API with automatic OpenAPI documentation
- **TypeScript Frontend**: Type-safe frontend with modern React setup
- **AI-Ready**: Pre-configured integrations for common AI services and tooling
- **Developer Experience**: Optimized for use with Cursor and other AI-powered development tools
- **Production Quality**: Complete with testing frameworks, CI/CD pipelines, and deployment options
- **Docker Integration**: Containerized development and deployment workflows
- **Authentication System**: JWT authentication with secure password hashing
- **Email Integration**: Password recovery and notification system
- **Dark Mode Support**: Modern UI with light/dark theme switching
- **Database Migrations**: Automatic schema management with Alembic

## 📋 Tech Stack

### Backend
- FastAPI for high-performance API endpoints
- SQLModel for SQL database interactions (ORM)
- Pydantic for data validation
- PostgreSQL as the SQL database
- Alembic for database migrations
- Pytest for testing
- Poetry for dependency management

### Frontend
- TypeScript for type safety
- React with hooks for UI components
- Chakra UI for responsive, accessible components
- Vite for fast builds
- Automatically generated API client
- Jest and React Testing Library for testing
- Playwright for End-to-End testing
- pnpm for package management

### DevOps & Tools
- GitHub Actions for CI/CD
- Docker and Docker Compose
- Pre-commit hooks for code quality
- ESLint and Prettier for code formatting
- Cursor-optimized project structure
- Swagger UI for API documentation
- Traefik as reverse proxy / load balancer

## 🛠️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker and Docker Compose (optional but recommended)
- Git

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/telepace/quick-forge-ai.git
cd quick-forge-ai

# Setup using the automatic script
./setup.sh

# Or manually:

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install poetry
poetry install

# Frontend setup
cd ../frontend
pnpm install

# Start development servers
docker-compose up  # Starts everything
```

### Configuration

Create a `.env` file in the root directory based on the provided `.env.example`. Important values to update:

```bash
# Generate secure secret keys with:
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Required security settings
SECRET_KEY=your-generated-secret-key
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=your-secure-password
POSTGRES_PASSWORD=your-db-password

# Optional email settings
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=info@example.com
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
pytest

# Run frontend tests
cd frontend
pnpm test

# Run end-to-end tests
cd e2e
pnpm test
```

## 📦 Project Structure

```
quick-forge-ai/
├── .github/                # GitHub workflows and templates
├── backend/                # FastAPI application
│   ├── app/                # API code
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── db/             # Database models and config
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend tests
│   ├── alembic/            # Database migrations
│   ├── poetry.lock         # Locked dependencies
│   └── pyproject.toml      # Python project config
├── frontend/               # TypeScript React application
│   ├── src/                # Application code
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service integrations
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── tests/              # Frontend tests
│   ├── package.json        # npm package config
│   └── vite.config.ts      # Vite configuration
├── e2e/                    # End-to-end tests with Playwright
├── docker/                 # Docker configuration
│   ├── backend/            # Backend Dockerfile
│   └── frontend/           # Frontend Dockerfile
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── docker-compose.yml      # Docker Compose configuration
├── docker-compose.prod.yml # Production Docker Compose
└── README.md               # This file
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

The deployment includes:
- Automatic HTTPS certificate management via Traefik
- Production-optimized Docker images
- Database backup configuration

See the [deployment documentation](./docs/deployment.md) for detailed instructions on deploying to various platforms.

## 🔄 Development Workflow

### Using with Cursor

This template is optimized for use with Cursor:

1. Open the project in Cursor
2. Use AI code completion to navigate and modify code
3. Leverage custom Cursor commands in the `.cursor/` directory
4. Enjoy enhanced productivity with AI-powered development

### AI Integration Development

QuickForge AI makes it simple to integrate various AI services:

- Pre-configured connectors for popular AI APIs
- Example implementations for common AI patterns
- Structured components for AI-powered features
- Helper utilities for handling AI-specific data flows

### Development Best Practices

- Use feature branches for new features
- Write tests for all new code
- Run the pre-commit hooks before committing
- Follow the contribution guidelines

## 📚 Documentation

- [Backend API documentation](http://localhost:8000/docs) - Available when the backend is running
- [Frontend component documentation](http://localhost:3000/docs) - Available when the frontend is running
- [Project architecture](./docs/architecture.md)
- [Development guides](./docs/development.md)

## 📱 UI Preview

### Dashboard Login
![Login Screen](./docs/img/login.png)

### Main Dashboard
![Dashboard](./docs/img/dashboard.png)

### Dark Mode Support
![Dark Mode](./docs/img/dark-mode.png)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 🔄 Updating from Template

If you want to get updates from the template in the future:

```bash
# Add the template as a remote
git remote add template https://github.com/telepace/quick-forge-ai.git

# Pull changes (without auto-merge)
git pull --no-commit template main

# Review changes and commit
git merge --continue
```

## 🙏 Acknowledgments

- FastAPI team for the amazing framework
- TypeScript team for type safety
- All open-source contributors whose work makes this possible

---

Built with ❤️ for AI entrepreneurs and freelancers. Happy coding!