# PowerShell script to start the Vite server
Write-Host "Starting Vite server..."

# Change to the project directory
Set-Location -Path "E:\programming\Qwik\qwik-csp"

# Start the server
npx vite --mode dev

Write-Host "Server started!"
