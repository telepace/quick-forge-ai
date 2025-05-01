#!/usr/bin/env bash

# Generate OpenAPI client
# This script generates OpenAPI specifications from a FastAPI application and uses them for frontend client code generation

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🔨 Generating OpenAPI client..."

# Enter the backend directory and generate OpenAPI JSON
cd "$PROJECT_ROOT/backend"
python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > "$PROJECT_ROOT/openapi.json" || {
  echo "❌ Failed to generate OpenAPI specification"
  exit 1
}

# Move to the frontend directory and generate the client
if [ -f "$PROJECT_ROOT/openapi.json" ]; then
  mv "$PROJECT_ROOT/openapi.json" "$PROJECT_ROOT/frontend/"
  cd "$PROJECT_ROOT/frontend"
  npm run generate-client || {
    echo "❌ Failed to generate client"
    exit 1
  }
  npx biome format --write ./src/client || {
    echo "❌ Failed to format client code"
    exit 1
  }
  echo "✅ Client generated successfully"
else
  echo "❌ OpenAPI specification file not found"
  exit 1
fi
