# Simple PowerShell script to capture the screen and show a message box
# This script will:
# 1. Wait for 5 seconds to give you time to set up the window
# 2. Capture the entire screen
# 3. Save it as a PNG file in the current directory
# 4. Show a simple message box with an OK button

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Countdown function
function Start-Countdown {
    param (
        [int]$Seconds = 5
    )
    
    Write-Host "Screen capture will begin in $Seconds seconds..."
    Write-Host "Please arrange your windows as needed."
    
    for ($i = $Seconds; $i -gt 0; $i--) {
        Write-Host "Capturing in $i seconds..." -NoNewline
        Start-Sleep -Seconds 1
        Write-Host "`r" -NoNewline
    }
    
    Write-Host "Capturing screen now!"
}

# Capture screen function
function Invoke-ScreenCapture {
    param (
        [string]$OutputPath = "screen-capture.png"
    )
    
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
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    
    $fullPath = (Get-Item $OutputPath).FullName
    Write-Host "Screen captured and saved to: $OutputPath"
    Write-Host "File path: $fullPath"
    
    return $fullPath
}

# Show message box function
function Show-MessageBox {
    param (
        [string]$Message,
        [string]$Title = "Information"
    )
    
    # Create a simple message box
    [System.Windows.Forms.MessageBox]::Show($Message, $Title, 
        [System.Windows.Forms.MessageBoxButtons]::OK, 
        [System.Windows.Forms.MessageBoxIcon]::Information)
}

# Main execution
try {
    # Start countdown
    Start-Countdown -Seconds 5
    
    # Capture screen
    $filePath = Invoke-ScreenCapture
    
    # Show message box
    $message = "Screen capture complete!`n`nThe screenshot has been saved to:`n$filePath"
    Show-MessageBox -Message $message -Title "Screen Capture Complete"
    
    Write-Host "Done! You can now share this image."
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
}
