# Basic PowerShell script to capture the screen
# This script will:
# 1. Wait for 5 seconds to give you time to set up the window
# 2. Capture the entire screen
# 3. Save it as a PNG file in the current directory
# 4. Create a simple text file with a completion message

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Countdown
Write-Host "Screen capture will begin in 5 seconds..."
Write-Host "Please arrange your windows as needed."

for ($i = 5; $i -gt 0; $i--) {
    Write-Host "Capturing in $i seconds..."
    Start-Sleep -Seconds 1
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
$outputPath = "screen-capture.png"
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up
$graphics.Dispose()
$bitmap.Dispose()

$fullPath = (Get-Item $outputPath).FullName
Write-Host "Screen captured and saved to: $outputPath"
Write-Host "File path: $fullPath"

# Create a completion file
$completionMessage = @"
Screen Capture Complete!

The screenshot has been saved to:
$fullPath

This file was created at $(Get-Date)
"@

$completionFile = "capture-complete.txt"
$completionMessage | Out-File -FilePath $completionFile

# Open the completion file
Invoke-Item $completionFile

Write-Host "Done! You can now share this image."
Write-Host "A completion notification has been created and opened."
