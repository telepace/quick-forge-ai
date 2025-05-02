#!/usr/bin/env bash

# Deploy application to Docker Swarm
# This script deploys the application to the Docker Swarm cluster

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check for necessary environment variables
if [ -z "$DOMAIN" ] || [ -z "$STACK_NAME" ] || [ -z "$TAG" ]; then
  echo "❌ Error: Missing necessary environment variables"
  echo "Example: DOMAIN=example.com STACK_NAME=myapp TAG=latest ./scripts/deploy.sh"
  exit 1
fi

echo "🚀 Deploying application to Docker Swarm..."
echo "Domain: $DOMAIN"
echo "Stack name: $STACK_NAME"
echo "Image tag: $TAG"

# Generate docker stack configuration
cd "$PROJECT_ROOT"
docker-compose -f docker-compose.yml config > docker-stack.yml || {
  echo "❌ Failed to generate stack configuration"
  exit 1
}

# Apply Docker labels
docker-auto-labels docker-stack.yml || {
  echo "❌ Failed to apply Docker labels"
  exit 1
}

# Deploy stack
docker stack deploy -c docker-stack.yml --with-registry-auth "${STACK_NAME}" || {
  echo "❌ Deployment failed"
  exit 1
}

echo "✅ Deployment completed successfully"
