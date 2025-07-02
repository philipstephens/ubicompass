# Vercel Build Log Filter
# Filters Vercel build logs to show only relevant error information

param(
    [Parameter(Mandatory=$true)]
    [string]$LogFile,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowAll
)

function Filter-VercelLog {
    param([string]$LogPath, [bool]$ShowAllLines = $false)
    
    if (-not (Test-Path $LogPath)) {
        Write-Error "Log file not found: $LogPath"
        return
    }
    
    $lines = Get-Content $LogPath
    $filteredLines = @()
    $inErrorSection = $false
    $errorContext = @()
    
    # Keywords that indicate important information
    $importantKeywords = @(
        "Error:",
        "Failed",
        "Cannot",
        "Missing",
        "BUILD FAILED",
        "npm ERR!",
        "TypeError:",
        "SyntaxError:",
        "ReferenceError:",
        "ModuleNotFoundError:",
        "ENOENT:",
        "exit code 1",
        "Command failed",
        "Build failed",
        "Rollup failed",
        "Cannot bundle",
        "plugin:",
        "vite:",
        "esbuild:",
        "Duplicate key",
        "Unreachable code",
        "Declaration or statement expected"
    )
    
    # Build phase indicators
    $buildPhases = @(
        "Running build",
        "Installing dependencies",
        "Running ""npm run",
        "build.client",
        "build.server", 
        "build.types",
        "vercel-build",
        "✓ Built",
        "transforming...",
        "rendering chunks..."
    )
    
    # Success indicators
    $successKeywords = @(
        "✓ built in",
        "✓ Built client modules",
        "added.*packages in",
        "Cloning completed:",
        "Build machine configuration:"
    )
    
    foreach ($line in $lines) {
        $shouldInclude = $false
        
        if ($ShowAllLines) {
            $shouldInclude = $true
        } else {
            # Check for important keywords (errors)
            foreach ($keyword in $importantKeywords) {
                if ($line -match $keyword) {
                    $shouldInclude = $true
                    $inErrorSection = $true
                    break
                }
            }
            
            # Check for build phases
            if (-not $shouldInclude) {
                foreach ($phase in $buildPhases) {
                    if ($line -match $phase) {
                        $shouldInclude = $true
                        break
                    }
                }
            }
            
            # Check for success indicators (brief)
            if (-not $shouldInclude) {
                foreach ($success in $successKeywords) {
                    if ($line -match $success) {
                        $shouldInclude = $true
                        break
                    }
                }
            }
            
            # Include context around errors
            if ($inErrorSection) {
                $errorContext += $line
                if ($errorContext.Count -gt 10) {
                    $errorContext = $errorContext[-10..-1]  # Keep last 10 lines
                }
                
                # Stop error section after some non-error lines
                if ($line -match "^\s*$" -or $line -match "^[0-9]{4}-[0-9]{2}-[0-9]{2}") {
                    $inErrorSection = $false
                }
            }
        }
        
        if ($shouldInclude) {
            # Add timestamp if available
            if ($line -match "^\[([0-9:\.]+)\]") {
                $timestamp = $matches[1]
                $filteredLines += "[$timestamp] $($line -replace '^\[[0-9:\.]+\]\s*', '')"
            } else {
                $filteredLines += $line
            }
        }
    }
    
    # Output results
    Write-Host "=== FILTERED VERCEL BUILD LOG ===" -ForegroundColor Cyan
    Write-Host "Showing important lines from: $LogPath" -ForegroundColor Gray
    Write-Host "Total lines: $($lines.Count) | Filtered: $($filteredLines.Count)" -ForegroundColor Gray
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    foreach ($line in $filteredLines) {
        # Color coding
        if ($line -match "Error:|Failed|Cannot|Missing|BUILD FAILED") {
            Write-Host $line -ForegroundColor Red
        } elseif ($line -match "✓|built in|completed|added.*packages") {
            Write-Host $line -ForegroundColor Green
        } elseif ($line -match "build\.|Installing|Running") {
            Write-Host $line -ForegroundColor Yellow
        } elseif ($line -match "warn|deprecated") {
            Write-Host $line -ForegroundColor DarkYellow
        } else {
            Write-Host $line
        }
    }
    
    Write-Host "=" * 50 -ForegroundColor Cyan
    Write-Host "End of filtered log" -ForegroundColor Gray
}

# Main execution
if ($ShowAll) {
    Write-Host "Showing ALL lines (no filtering)" -ForegroundColor Magenta
    Filter-VercelLog -LogPath $LogFile -ShowAllLines $true
} else {
    Write-Host "Filtering log for important information..." -ForegroundColor Cyan
    Filter-VercelLog -LogPath $LogFile -ShowAllLines $false
}

# Usage examples
Write-Host ""
Write-Host "USAGE EXAMPLES:" -ForegroundColor Cyan
Write-Host "  .\filter-vercel-logs.ps1 -LogFile 'build.log'" -ForegroundColor Gray
Write-Host "  .\filter-vercel-logs.ps1 -LogFile 'build.log' -ShowAll" -ForegroundColor Gray
Write-Host "  Get-Content 'vercel-output.txt' | Out-File 'build.log'; .\filter-vercel-logs.ps1 -LogFile 'build.log'" -ForegroundColor Gray
