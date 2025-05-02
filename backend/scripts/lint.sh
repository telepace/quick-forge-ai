#!/usr/bin/env bash

# Lint backend code
# This script runs linters on Python code using mypy and ruff

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🔍 Linting backend code..."

# Enter backend directory
cd "$BACKEND_DIR"

# Run type checking
echo "🧪 Running type checking with mypy..."
mypy app || {
  echo "❌ Type checking errors found"
  exit 1
}

# Run code linting
echo "🧹 Running code linting with ruff check..."
ruff check app || {
  echo "❌ Linting errors found"
  exit 1
}

# Check code formatting
echo "✨ Checking code formatting with ruff..."
ruff format app --check || {
  echo "❌ Code formatting errors found"
  echo "💡 Run 'make backend-format' to fix formatting issues"
  exit 1
}

echo "✅ Linting completed successfully - no issues found"
