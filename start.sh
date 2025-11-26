#!/bin/bash

echo "========================================="
echo "ObjectVision AI - Startup Script"
echo "========================================="

# Start backend in background
echo "Starting Flask API..."
cd api
python flask_app_yolo.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting React Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo "✓ Services Started!"
echo "========================================="
echo "Backend API: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo "========================================="

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
