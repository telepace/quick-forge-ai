#!/bin/bash

# Script to help configure database options for quick-forge-ai
# This script helps users switch between direct PostgreSQL deployment and Supabase

echo "Quick Forge AI - Database Configuration"
echo "========================================"
echo ""
echo "This script will help you configure your database settings."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found in the current directory."
    echo "Please make sure you're running this script from the project root."
    exit 1
fi

# Function to update .env file
update_env_var() {
    local key=$1
    local value=$2
    
    # If the key exists, replace its value
    if grep -q "^${key}=" .env; then
        sed -i.bak "s|^${key}=.*|${key}=${value}|" .env
    else
        # Otherwise, add the key-value pair
        echo "${key}=${value}" >> .env
    fi
}

# Prompt for database option
echo "Please select your database option:"
echo "1) Direct PostgreSQL deployment (default)"
echo "2) Supabase cloud service"
read -p "Enter your choice (1/2): " db_choice

case $db_choice in
    2)
        echo ""
        echo "You've selected Supabase cloud service."
        
        # Get Supabase connection URL
        read -p "Enter your Supabase connection URL (postgresql://...): " supabase_url
        
        # Update .env file for Supabase
        update_env_var "USE_SUPABASE" "true"
        update_env_var "SUPABASE_URL" "$supabase_url"
        update_env_var "USE_POSTGRES_SERVICE" "none"
        update_env_var "USE_POSTGRES_PRESTART_SERVICE" "none"
        
        echo ""
        echo "Configuration updated to use Supabase!"
        echo "You can now run 'docker-compose up -d' to start your services."
        ;;
    *)
        echo ""
        echo "You've selected direct PostgreSQL deployment."
        
        # Get PostgreSQL settings
        read -p "PostgreSQL server (default: db): " postgres_server
        postgres_server=${postgres_server:-db}
        
        read -p "PostgreSQL port (default: 5432): " postgres_port
        postgres_port=${postgres_port:-5432}
        
        read -p "PostgreSQL user (default: postgres): " postgres_user
        postgres_user=${postgres_user:-postgres}
        
        read -p "PostgreSQL password: " postgres_password
        
        read -p "PostgreSQL database name (default: app): " postgres_db
        postgres_db=${postgres_db:-app}
        
        # Update .env file for direct PostgreSQL
        update_env_var "USE_SUPABASE" "false"
        update_env_var "POSTGRES_SERVER" "$postgres_server"
        update_env_var "POSTGRES_PORT" "$postgres_port"
        update_env_var "POSTGRES_USER" "$postgres_user"
        update_env_var "POSTGRES_PASSWORD" "$postgres_password"
        update_env_var "POSTGRES_DB" "$postgres_db"
        update_env_var "USE_POSTGRES_SERVICE" "default"
        update_env_var "USE_POSTGRES_PRESTART_SERVICE" "default"
        
        echo ""
        echo "Configuration updated to use direct PostgreSQL deployment!"
        echo "You can now run 'docker-compose up -d' to start your services."
        ;;
esac

# Clean up any backup files
rm -f .env.bak

echo ""
echo "Done!" 