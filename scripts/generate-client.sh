#!/usr/bin/env bash

# Generate OpenAPI client
# This script generates OpenAPI specifications from a FastAPI application and uses them for frontend client code generation

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🔨 Generating OpenAPI client..."
echo "📍 Script directory: $SCRIPT_DIR"
echo "📍 Project root: $PROJECT_ROOT"
echo "📍 Current directory: $(pwd)"

# 显示Python环境信息
echo "🐍 Python environment:"
which python || echo "Python command not found"
python --version || echo "Python version command failed"
echo "🔍 Python path: $PYTHONPATH"
echo "🔍 Python executable: $(which python)"

# 在进入backend目录之前，确保安装必要的依赖
echo "📦 Installing required dependencies..."
python -m pip install --no-cache-dir sentry_sdk posthog || {
  echo "⚠️ Warning: Failed to install dependencies with python -m pip"
  echo "⚠️ Trying with pip directly..."
  pip install --no-cache-dir sentry_sdk posthog || {
    echo "❌ Failed to install dependencies"
    exit 1
  }
}

# Enter the backend directory and generate OpenAPI JSON
cd "$PROJECT_ROOT/backend"
echo "📍 Changed to backend directory: $(pwd)"

# 检查依赖项是否安装
echo "📦 Checking for required dependencies..."
python -c "import sys; print('Python version:', sys.version); print('Path:', sys.path)" || {
  echo "❌ Python is not available"
  exit 1
}

# 列出已安装的包
echo "📦 Installed packages:"
pip list | grep sentry || echo "sentry_sdk not found in pip list"
pip list | grep posthog || echo "posthog not found in pip list"

# 检查是否安装了sentry_sdk
python -c "import sentry_sdk; print('sentry_sdk installed successfully')" || {
  echo "❌ sentry_sdk is not installed or not accessible"
  echo "🔍 Attempting again with explicit pip install..."
  python -m pip install --verbose --no-cache-dir sentry_sdk
  python -c "import sentry_sdk; print('sentry_sdk installed successfully')" || {
    echo "❌ Still cannot import sentry_sdk after reinstall"
    exit 1
  }
}

# 检查是否安装了posthog
python -c "import posthog; print('posthog imported successfully')" || {
  echo "❌ posthog is not installed or not accessible"
  echo "🔍 Attempting again with explicit pip install..."
  python -m pip install --verbose --no-cache-dir posthog
  python -c "import posthog; print('posthog imported successfully')" || {
    echo "❌ Still cannot import posthog after reinstall"
    exit 1
  }
}

echo "✅ Dependencies check passed"

# 生成OpenAPI JSON
echo "📝 Generating OpenAPI JSON..."
python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > "$PROJECT_ROOT/openapi.json" || {
  echo "❌ Failed to generate OpenAPI specification"
  exit 1
}

# Move to the frontend directory and generate the client
if [ -f "$PROJECT_ROOT/openapi.json" ]; then
  echo "✅ OpenAPI JSON generated successfully"
  echo "📦 Moving to frontend directory and generating client..."
  mv "$PROJECT_ROOT/openapi.json" "$PROJECT_ROOT/frontend/"
  cd "$PROJECT_ROOT/frontend"
  echo "📍 Changed to frontend directory: $(pwd)"
  
  npm run generate-client || {
    echo "❌ Failed to generate client"
    exit 1
  }
  
  echo "🧹 Formatting generated client code..."
  npx biome format --write ./src/client || {
    echo "❌ Failed to format client code"
    exit 1
  }
  
  echo "✅ Client generated successfully"
else
  echo "❌ OpenAPI specification file not found"
  exit 1
fi
