# PowerShell script to capture the screen and prepare it for sharing
# This script will:
# 1. Wait for a specified number of seconds
# 2. Capture the entire screen
# 3. Save it as a PNG file with a timestamp
# 4. Provide instructions for sharing the file

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Capture-For-Sharing {
    param (
        [int]$DelaySeconds = 5,
        [string]$Prefix = "screenshot"
    )

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $outputPath = "$Prefix-$timestamp.png"

    Write-Host "Screen capture will begin in $DelaySeconds seconds..." -ForegroundColor Cyan
    Write-Host "Please arrange your windows as needed." -ForegroundColor Cyan

    # Countdown
    for ($i = $DelaySeconds; $i -gt 0; $i--) {
        Write-Host "Capturing in $i seconds..." -NoNewline -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        Write-Host "`r" -NoNewline
    }

    Write-Host "Capturing screen now!" -ForegroundColor Green

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

    $fullPath = (Get-Item $outputPath).FullName

    Write-Host "`nScreen captured and saved to: $outputPath" -ForegroundColor Green
    Write-Host "Full path: $fullPath" -ForegroundColor Green

    # Display sharing instructions
    Write-Host "`n===== SHARING INSTRUCTIONS =====" -ForegroundColor Magenta
    Write-Host "To share this screenshot with the AI assistant:" -ForegroundColor White
    Write-Host "1. Copy the file path below (it's already formatted for easy copying)" -ForegroundColor White
    Write-Host "2. Paste it directly into the chat window" -ForegroundColor White
    Write-Host "============================" -ForegroundColor Magenta

    # Display the path in a way that's easy to copy
    Write-Host "`nCOPY THIS PATH:" -ForegroundColor Yellow
    Write-Host $fullPath -ForegroundColor Cyan -BackgroundColor DarkBlue

    # Copy the path to clipboard
    $fullPath | Set-Clipboard
    Write-Host "`nPath copied to clipboard! Just press Ctrl+V to paste it." -ForegroundColor Green

    # Show a simple popup notification
    Add-Type -AssemblyName System.Windows.Forms
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Screen Capture Complete"
    $form.Size = New-Object System.Drawing.Size(400, 200)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false
    $form.TopMost = $true

    $label = New-Object System.Windows.Forms.Label
    $label.Location = New-Object System.Drawing.Point(10, 20)
    $label.Size = New-Object System.Drawing.Size(380, 80)
    $label.Text = "Screenshot captured successfully!`n`nPath copied to clipboard!`nJust press Ctrl+V to paste it."
    $form.Controls.Add($label)

    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Location = New-Object System.Drawing.Point(150, 120)
    $okButton.Size = New-Object System.Drawing.Size(100, 30)
    $okButton.Text = "OK"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($okButton)
    $form.AcceptButton = $okButton

    # Set a timer to auto-close the form after 60 seconds
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 60000  # 60 seconds
    $timer.Add_Tick({
            Write-Host "Popup notification auto-closed after 60 seconds timeout." -ForegroundColor Yellow
            $form.Close()
            $timer.Stop()
        })
    $timer.Start()

    # Show the form
    $form.ShowDialog() | Out-Null
    $timer.Stop()

    # Return the file path for convenience
    return $fullPath
}

# Execute the function with parameters
Capture-For-Sharing -DelaySeconds 5 -Prefix "screenshot-for-ai"

Write-Host "`nDone! Simply copy and paste the highlighted path above into the chat window." -ForegroundColor Green
Write-Host "The AI assistant will be able to access the screenshot from this path." -ForegroundColor Cyan
