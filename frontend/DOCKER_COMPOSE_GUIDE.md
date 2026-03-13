# Local Docker Compose Testing Guide - Frontend

## Prerequisites
- Docker and Docker Compose installed

## Quick Start

### 1. Start Frontend
```bash
docker-compose up -d
```

### 2. View Logs
```bash
docker-compose logs -f frontend
```

### 3. Access Frontend
- **Frontend**: http://localhost:3000

### 4. Stop Service
```bash
docker-compose down
```

## Development Workflow

### Making Changes
1. Edit code in your local repository
2. Changes are automatically reflected in the container (hot reload)
3. Check logs for errors: `docker-compose logs -f frontend`

### Rebuild
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Port 3000 already in use
```bash
# Find what's using the port
lsof -i :3000

# Change port in docker-compose.yml or stop conflicting service
```

### Container won't start
```bash
# Check service status
docker-compose ps

# View full logs
docker-compose logs frontend
```

### Clear cache and rebuild
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```
