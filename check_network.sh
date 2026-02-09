echo "=== Network Diagnostic ==="
echo "1. Backend process:"
ps aux | grep uvicorn | grep -v grep
echo ""
echo "2. Port 8000 status:"
netstat -tulpn 2>/dev/null | grep :8000 || echo "Not found in netstat"
echo ""
echo "3. Can we connect?:"
(timeout 2 bash -c 'echo > /dev/tcp/localhost/8000' 2>/dev/null && echo "✓ Port 8000 is open" || echo "✗ Port 8000 is closed")
echo ""
echo "4. Testing from Python:"
python3 -c "
import socket
import sys
try:
    sock = socket.create_connection(('localhost', 8000), timeout=2)
    print('✓ Socket connection successful')
    sock.close()
except Exception as e:
    print(f'✗ Socket error: {e}')
"
echo ""
echo "5. Testing HTTP:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ 2>/dev/null || echo "Curl failed"
echo ""
