#!/bin/bash

set -e

echo "Building Docker image 'tenshi-backend'..."
docker build -t tenshi-backend .

echo "Cleaning up old container (if exists)..."
docker rm -f tenshi-backend-app 2>/dev/null || true

echo "Running new container 'tenshi-backend-app' on port 3000..."
docker run -d -p 3000:3000 --name tenshi-backend-app tenshi-backend

echo "Deployment complete. Server is running at http://localhost:3000"
