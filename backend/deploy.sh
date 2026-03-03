#!/bin/bash
# deploy.sh — Run this on EC2 to deploy/update the backend Docker container
# Usage: bash deploy.sh
# Called via: ssh ubuntu@EC2_IP 'bash ~/deploy.sh'

set -e  # Exit on any error

APP_DIR="/home/ubuntu/app"
IMAGE_NAME="taskmanager-backend"
CONTAINER_NAME="taskmanager-api"
PORT=5000

echo "🚀 Starting deployment..."

# 1. Navigate to app directory
cd $APP_DIR

# 2. Pull latest code from GitHub
echo "📥 Pulling latest code..."
git pull origin main

# 3. Stop and remove old container (ignore errors if not running)
echo "🛑 Stopping old container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 4. Build new Docker image
echo "🔨 Building Docker image..."
cd backend
docker build -t $IMAGE_NAME:latest .

# 5. Run new container
echo "▶️  Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  --env-file /home/ubuntu/.env \
  -p $PORT:$PORT \
  --restart unless-stopped \
  $IMAGE_NAME:latest

# 6. Wait and health check
echo "⏳ Waiting for health check..."
sleep 5

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/health)
if [ "$STATUS" = "200" ]; then
  echo "✅ Deployment successful! API is healthy."
else
  echo "❌ Health check failed (HTTP $STATUS). Rolling back..."
  docker stop $CONTAINER_NAME
  exit 1
fi

# 7. Clean up old images
docker image prune -f

echo "🎉 Done!"
