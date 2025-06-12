# PowerShell script to open a browser and take a screenshot

# Load required assemblies for screenshot capability
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Function to take a screenshot
function Take-Screenshot {
    param (
        [string]$FilePath = "$env:USERPROFILE\Desktop\screenshot.png"
    )
    
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.X, $bounds.Y, 0, 0, $bounds.Size)
    
    $bitmap.Save($FilePath)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Screenshot saved to: $FilePath"
    return $FilePath
}

# Main script execution
try {
    # 1. Open the browser to the UBI calculator
    Start-Process "http://localhost:5173"
    Write-Host "Opening browser to http://localhost:5173"
    
    # Wait for the page to load
    Start-Sleep -Seconds 5
    
    # 2. Take a screenshot
    $screenshot = Take-Screenshot -FilePath "$env:USERPROFILE\Desktop\ubi_calculator.png"
    
    Write-Host "Process completed successfully."
    Write-Host "Screenshot saved to: $screenshot"
    
} catch {
    Write-Host "An error occurred: $_"
}
