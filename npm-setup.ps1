# npm-setup.ps1
# This script ensures npm is available in your PowerShell session

# Check if npm is already in the PATH
$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if ($null -eq $npmPath) {
    Write-Host "npm not found in PATH. Adding Node.js paths..." -ForegroundColor Yellow
    
    # Common Node.js installation paths
    $possiblePaths = @(
        "$env:ProgramFiles\nodejs",
        "${env:ProgramFiles(x86)}\nodejs",
        "$env:APPDATA\npm",
        "$HOME\AppData\Roaming\npm"
    )
    
    # Add existing paths to PATH
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Host "Adding $path to PATH" -ForegroundColor Green
            $env:PATH = "$path;$env:PATH"
        }
    }
    
    # Check if npm is now available
    $npmPath = Get-Command npm -ErrorAction SilentlyContinue
    if ($null -eq $npmPath) {
        Write-Host "npm still not found. Please ensure Node.js is installed correctly." -ForegroundColor Red
        Write-Host "You can download Node.js from https://nodejs.org/" -ForegroundColor Cyan
    } else {
        Write-Host "npm is now available in this session!" -ForegroundColor Green
        Write-Host "npm version: $(npm --version)" -ForegroundColor Cyan
    }
} else {
    Write-Host "npm is already available in PATH" -ForegroundColor Green
    Write-Host "npm version: $(npm --version)" -ForegroundColor Cyan
}

# Check PowerShell execution policy
$executionPolicy = Get-ExecutionPolicy
Write-Host "Current PowerShell execution policy: $executionPolicy" -ForegroundColor Cyan

if ($executionPolicy -eq "Restricted") {
    Write-Host "Your execution policy is Restricted, which may prevent npm scripts from running." -ForegroundColor Yellow
    Write-Host "Consider changing it to RemoteSigned for your user scope with:" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned" -ForegroundColor Cyan
}

# Display Node.js and npm information
Write-Host "`nNode.js and npm information:" -ForegroundColor Cyan
Write-Host "------------------------" -ForegroundColor Cyan
try {
    Write-Host "Node.js version: $(node --version)" -ForegroundColor White
    Write-Host "npm version: $(npm --version)" -ForegroundColor White
    Write-Host "npm prefix: $(npm config get prefix)" -ForegroundColor White
} catch {
    Write-Host "Error getting Node.js/npm information: $_" -ForegroundColor Red
}

Write-Host "`nSetup complete! npm should now be available in your PowerShell session." -ForegroundColor Green
