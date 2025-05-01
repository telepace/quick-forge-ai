#!/usr/bin/env bash

# Backend pre-start initialization
# This script prepares the backend environment before starting the application

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🚀 Preparing backend for startup..."

# Enter backend directory
cd "$BACKEND_DIR"

# Wait for the database to be ready
echo "⏳ Waiting for database to be ready..."
python app/backend_pre_start.py || {
  echo "❌ Database initialization failed"
  exit 1
}

# Run database migrations
echo "🔄 Running database migrations..."
alembic upgrade head || {
  echo "❌ Database migration failed"
  exit 1
}

# Initialize database with initial data
echo "🌱 Creating initial data..."
python app/initial_data.py || {
  echo "❌ Failed to create initial data"
  exit 1
}

echo "✅ Backend preparation completed successfully"
