# PowerShell script to capture the screen after a delay
# This script will:
# 1. Wait for a specified number of seconds
# 2. Capture the entire screen
# 3. Save it as a PNG file with a timestamp

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Capture-With-Delay {
    param (
        [int]$DelaySeconds = 5,
        [string]$Prefix = "screen"
    )

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $outputPath = "$Prefix-$timestamp.png"
    
    Write-Host "Screen capture will begin in $DelaySeconds seconds..."
    Write-Host "Please arrange your windows as needed."
    
    # Countdown
    for ($i = $DelaySeconds; $i -gt 0; $i--) {
        Write-Host "Capturing in $i seconds..." -NoNewline
        Start-Sleep -Seconds 1
        Write-Host "`r" -NoNewline
    }
    
    Write-Host "Capturing screen now!"
    
    # Get the screen bounds
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen
    $bounds = $screen.Bounds
    
    # Create a bitmap to hold the screenshot
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    
    # Create a graphics object from the bitmap
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Capture the screen
    $graphics.CopyFromScreen($bounds.X, $bounds.Y, 0, 0, $bounds.Size)
    
    # Save the bitmap as a PNG file
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Screen captured and saved to: $outputPath"
    Write-Host "File path: $((Get-Item $outputPath).FullName)"
}

# Execute the function with parameters
Capture-With-Delay -DelaySeconds 5 -Prefix "chart-view"

Write-Host "Done! You can now share this image."
