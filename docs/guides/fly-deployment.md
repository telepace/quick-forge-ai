# Deploying to Fly.io

This guide explains how to deploy the Quick Forge AI project to [Fly.io](https://fly.io).

## Prerequisites

1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Sign up for a Fly.io account and authenticate: `fly auth login`

## Setting Up the Database

1. Create a PostgreSQL database on Fly:

```bash
fly postgres create --name quick-forge-ai-db --region iad
```

2. Take note of the connection details provided after creation.

## Deploying the Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Update `fly.toml` with your domain name and other configuration.

3. Set necessary secrets:

```bash
fly secrets set SECRET_KEY="your-secure-secret-key" \
  FIRST_SUPERUSER="admin@example.com" \
  FIRST_SUPERUSER_PASSWORD="secure-admin-password" \
  SMTP_HOST="your-smtp-host" \
  SMTP_USER="your-smtp-user" \
  SMTP_PASSWORD="your-smtp-password" \
  EMAILS_FROM_EMAIL="no-reply@example.com" \
  SENTRY_DSN="your-sentry-dsn-if-any"
```

4. Attach the Postgres database:

```bash
fly postgres attach quick-forge-ai-db
```

5. Deploy the backend:

```bash
fly deploy
```

6. Check the deployment status:

```bash
fly status
```

## Deploying the Frontend

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Update `fly.toml` with your backend API URL and other configuration.

3. Deploy the frontend:

```bash
fly deploy
```

4. Check the deployment status:

```bash
fly status
```

## Deploying the Website

1. Navigate to the website directory:

```bash
cd ../website
```

2. Update `fly.toml` with any necessary configuration.

3. Deploy the website:

```bash
fly deploy
```

4. Check the deployment status:

```bash
fly status
```

## Setting Up Custom Domains

1. For each app, you can set up custom domains:

```bash
# For backend
fly certs add api.your-domain.com -a quick-forge-ai-backend

# For frontend 
fly certs add dashboard.your-domain.com -a quick-forge-ai-frontend

# For website
fly certs add your-domain.com -a quick-forge-ai-website
```

2. Update your DNS settings to point to the Fly.io apps. Fly will provide you with the correct values.

## Monitoring and Maintenance

- View logs: `fly logs`
- Access an app's console: `fly ssh console`
- Scale an app: `fly scale count n` (where n is the number of instances)

## Troubleshooting

- If migrations fail, you can run them manually:
  ```bash
  fly ssh console -C "cd /app && alembic upgrade head"
  ```

- Check health endpoints for each service to ensure they're running correctly.

- Review logs for any errors: `fly logs` 