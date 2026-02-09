echo "=== System Check ==="
echo "1. Backend process:"
ps aux | grep uvicorn | grep -v grep
echo ""
echo "2. Port 8000 status:"
timeout 1 curl -s http://localhost:8000/ && echo "✓ Backend responding" || echo "✗ Backend not responding"
echo ""
echo "3. Frontend process:"
ps aux | grep -E "(node|vite|npm)" | grep -v grep
echo ""
echo "4. Try to start simple Python server:"
python3 -m http.server 8002 > /dev/null 2>&1 &
sleep 1
timeout 1 curl -s http://localhost:8002/ > /dev/null && echo "✓ Python HTTP server works" || echo "✗ Python HTTP server fails"
pkill -f "http.server 8002"
