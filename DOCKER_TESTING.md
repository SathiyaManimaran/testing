# Docker Desktop Testing Guide

This guide shows you how to build and test your Full Stack application using Docker Desktop.

## Prerequisites

1. **Docker Desktop Installed**: Already installed (Docker v28.5.1)
2. **Docker Desktop Running**: Make sure Docker Desktop is running (check system tray)
3. **Backend Built**: Run `mvn clean package` in the backend folder (one-time setup)

## Step 1: Prepare Backend

The backend needs to be built as a JAR file for Docker:

```powershell
cd backend
mvn clean package
cd ..
```

This creates `backend/target/demo-0.0.1-SNAPSHOT.jar` which the Dockerfile uses.

## Step 2: Test with Docker Compose (Easiest)

Docker Compose automatically builds and runs both frontend and backend together:

```powershell
# From project root directory
docker-compose up --build

# Wait for both containers to start (about 30-60 seconds)
# You'll see:
# demo-backend   | 2026-02-24 ... Started DemoApplication
# demo-frontend  | ... (Nginx started)
```

### In Another Terminal - Test the Services

```powershell
# Test backend API
curl http://localhost:8080/api/hello

# Or open browser to:
# Frontend: http://localhost
# Backend: http://localhost:8080/api/hello
```

### Stop Everything

```powershell
# Press Ctrl+C in the docker-compose terminal
# Or in another terminal:
docker-compose down
```

---

## Step 3: Manual Testing (Advanced)

If you prefer to build and run containers separately:

### 3.1 Build Backend Image

```powershell
docker build -t demo-backend:latest backend
```

### 3.2 Build Frontend Image

```powershell
docker build -t demo-frontend:latest frontend
```

### 3.3 Create Network

```powershell
docker network create fullstack
```

### 3.4 Run Backend

```powershell
docker run -d `
  --name demo-backend `
  --network fullstack `
  -p 8080:8080 `
  demo-backend:latest
```

### 3.5 Run Frontend

```powershell
docker run -d `
  --name demo-frontend `
  --network fullstack `
  -p 80:80 `
  demo-frontend:latest
```

### 3.6 Test

```powershell
# Check containers are running
docker ps

# Test backend
curl http://localhost:8080/api/hello

# Open browser to http://localhost
```

### 3.7 Cleanup

```powershell
docker stop demo-backend demo-frontend
docker rm demo-backend demo-frontend
docker network rm fullstack
```

---

## Useful Docker Commands

### Check Running Containers

```powershell
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a
```

### View Logs

```powershell
# View frontend logs
docker logs demo-frontend

# View backend logs
docker logs demo-backend

# Stream logs (live)
docker logs -f demo-backend

# View specific number of lines
docker logs --tail 50 demo-backend
```

### Access Container Shell

```powershell
# Backend shell
docker exec -it demo-backend /bin/sh

# Frontend shell
docker exec -it demo-frontend /bin/sh

# Exit shell
exit
```

### View Container Details

```powershell
# Detailed info
docker inspect demo-backend

# Network info
docker network inspect fullstack
```

### Delete Images

```powershell
# Delete specific image
docker rmi demo-backend:latest
docker rmi demo-frontend:latest

# Delete all unused images
docker image prune -a
```

---

## Docker Compose Commands Reference

```powershell
# Start containers and build if needed
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend

# Stream logs
docker-compose logs -f backend

# Stop all containers
docker-compose stop

# Remove containers (keep images)
docker-compose down

# Remove everything (images too)
docker-compose down --rmi all

# Rebuild specific service
docker-compose build backend

# Rebuild all
docker-compose build --no-cache
```

---

## Testing the Application

### 1. Check Backend API

```powershell
# Using curl
curl http://localhost:8080/api/hello

# Should return the greeting message
```

### 2. Check Frontend

```powershell
# Open browser to:
http://localhost
```

You should see:
- Angular app with "Angular + Spring Boot App" heading
- The greeting message from backend

### 3. Check Container Health

```powershell
# View container status
docker ps

# Look for STATUS column - should show "Up X seconds"

# Check health status (if configured)
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## Troubleshooting

### Backend Won't Start

```powershell
# Check logs
docker logs demo-backend

# Common issue: JAR doesn't exist
# Solution: Run mvn clean package in backend folder

# Check if port 8080 is in use
netstat -ano | findstr :8080

# If in use, find and stop the process:
Get-Process -Id (Get-NetTCPConnection | Where {$_.LocalPort -eq 8080}).OwningProcess
```

### Frontend Won't Connect to Backend

**Issue**: Frontend shows error connecting to backend

**Solutions**:
1. Check backend is running: `docker ps`
2. Test backend directly: `curl http://localhost:8080/api/hello`
3. Check backend logs: `docker logs demo-backend`
4. Verify they're on same network: `docker network inspect fullstack`

### Port Already in Use

```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different ports in docker-compose.yml
```

### Out of Memory

```powershell
# Check Docker Desktop resources
# Settings → Resources → Memory increase to 4GB or more

# Reduce memory in containers:
# Edit docker-compose.yml and add:
# deploy:
#   resources:
#     limits:
#       memory: 512M
```

### Clean Everything and Start Fresh

```powershell
# Stop all containers
docker-compose down

# Remove all images
docker image prune -a

# Remove dangling volumes
docker volume prune

# Rebuild from scratch
docker-compose up --build
```

---

## Development Workflow

### 1. Make Code Changes

```powershell
# Frontend changes auto-reload in dev mode
# Backend changes need rebuild

# Option A: Rebuild backend image
docker-compose down
mvn clean package -f backend/pom.xml
docker-compose up --build

# Option B: Use volume mounts for live reload (advanced)
# Edit docker-compose.yml to add volumes
```

### 2. Quick Testing Loop

```powershell
# Test with compose
docker-compose up

# In another terminal, test API
curl http://localhost:8080/api/hello

# View browser at http://localhost

# Make changes and rebuild
docker-compose build backend
docker-compose up
```

### 3. Push to Docker Hub (For CI/CD)

```powershell
# Login to Docker Hub
docker login

# Tag images
docker tag demo-backend:latest <username>/demo-backend:latest
docker tag demo-frontend:latest <username>/demo-frontend:latest

# Push
docker push <username>/demo-backend:latest
docker push <username>/demo-frontend:latest
```

---

## Docker Desktop Kubernetes (One-Click Deploy)

After testing with Docker Compose, you can deploy to Kubernetes in Docker Desktop:

### 1. Enable Kubernetes in Docker Desktop
- Settings → Kubernetes → Enable Kubernetes → Apply

### 2. Deploy to Kubernetes
```powershell
kubectl apply -f k8s/
kubectl port-forward svc/frontend-service 3000:80
```

---

## Quick Start Commands

```bash
# One-liner to test everything
docker-compose up --build

# Test in another terminal
curl http://localhost:8080/api/hello

# Open browser
# http://localhost (frontend)
```

---

## Docker Desktop Dashboard

Docker Desktop includes a visual dashboard:
1. Click Docker icon in system tray
2. Select "Dashboard"
3. View running containers, logs, and resource usage

Perfect for monitoring your app!

---

## Next Steps

1. **Make sure Docker Desktop is running** (check system tray)
2. **Run** `mvn clean package` in the backend folder
3. **Run** `docker-compose up --build` in project root
4. **Test** at http://localhost
5. **Check logs** with `docker-compose logs`
6. **Stop** with Ctrl+C

That's it! 🚀
