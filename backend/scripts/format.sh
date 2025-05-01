#!/usr/bin/env bash

# Format backend code
# This script formats Python code using ruff

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🔍 Formatting backend code..."

# Enter backend directory
cd "$BACKEND_DIR"

# Run code formatter
echo "🧹 Checking and fixing code issues..."
ruff check app scripts --fix || {
  echo "❌ Error fixing code issues"
  exit 1
}

echo "✨ Applying code formatting..."
ruff format app scripts || {
  echo "❌ Error formatting code"
  exit 1
}

echo "✅ Formatting completed successfully"
