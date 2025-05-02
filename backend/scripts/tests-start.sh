#!/usr/bin/env bash

# Start backend tests
# This script prepares the environment and runs tests

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🔧 Preparing test environment..."

# Enter backend directory
cd "$BACKEND_DIR"

# Initialize test environment
echo "🏁 Running test pre-start checks..."
python app/tests_pre_start.py || {
  echo "❌ Test environment preparation failed"
  exit 1
}

# Run the test script
echo "🧪 Running tests..."
bash "$SCRIPT_DIR/test.sh" "$@" || {
  echo "❌ Tests failed"
  exit 1
}

echo "✅ All tests completed successfully"
