param (
    [Parameter(Mandatory=$true)]
    [string]$Action
)

$captureFile = "terminal-capture.txt"

function Start-Capture {
    Write-Host "Starting terminal capture. Output will be saved to $captureFile"
    # Clear any existing capture file
    if (Test-Path $captureFile) {
        Remove-Item $captureFile -Force
    }
    
    # Start the transcript
    Start-Transcript -Path $captureFile -Append
    Write-Host "Terminal capture started at $(Get-Date)"
}

function Stop-Capture {
    Write-Host "Stopping terminal capture"
    Stop-Transcript
    
    # Display the content of the capture file
    if (Test-Path $captureFile) {
        Write-Host "Capture saved to $captureFile"
        Write-Host "Capture content:"
        Get-Content $captureFile | ForEach-Object {
            Write-Host $_
        }
    } else {
        Write-Host "No capture file found"
    }
}

# Main script
if ($Action -eq "on") {
    Start-Capture
} elseif ($Action -eq "off") {
    Stop-Capture
} else {
    Write-Host "Invalid action. Use 'on' to start capture or 'off' to stop capture."
}
