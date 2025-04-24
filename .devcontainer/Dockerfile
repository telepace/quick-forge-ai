FROM mcr.microsoft.com/vscode/devcontainers/python:3.10

# Create app directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY backend/pyproject.toml backend/uv.lock backend/alembic.ini /app/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install hatchling && \
    # use hatch to install dev and main dependencies
    pip install .[all] \
    pytest mypy ruff

# Copy source code
COPY backend /app/backend

# Install uv for reloading
RUN pip install uvicorn[standard]

# Set environment
ENV PYTHONPATH=/app BACKEND_CORS_ORIGINS="*"

# Default command
CMD [ "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000" ] 