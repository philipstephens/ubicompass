# PowerShell script to restart the Vite server
Write-Host "Restarting Vite server..."

# Kill any existing Node.js processes (be careful with this in a real environment)
Write-Host "Stopping any existing Node.js processes..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment for processes to terminate
Start-Sleep -Seconds 2

# Start the server with a clean environment
Write-Host "Starting Vite server with clean environment..."
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# Start the server in a new window
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npx vite --mode dev; Read-Host 'Press Enter to close'"

Write-Host "Server restart initiated. Check the new PowerShell window for server output."
Write-Host "Open http://localhost:5173 in your browser to access the application."
