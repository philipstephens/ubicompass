# PowerShell script to capture the screen after a delay
# This script will:
# 1. Wait for 5 seconds to give you time to set up the window
# 2. Capture the entire screen
# 3. Save it as a PNG file in the current directory
# 4. Show a confirmation dialog when complete

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Capture-Screen {
    param (
        [int]$DelaySeconds = 5,
        [string]$OutputPath = "screen-capture.png"
    )

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
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()

    Write-Host "Screen captured and saved to: $OutputPath"
    Write-Host "File path: $((Get-Item $OutputPath).FullName)"

    # Show a confirmation dialog with OK button
    $fullPath = (Get-Item $OutputPath).FullName

    # Create a Windows Forms message box
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Screen Capture Complete"
    $form.Size = New-Object System.Drawing.Size(500, 200)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false

    # Add a label with the message
    $label = New-Object System.Windows.Forms.Label
    $label.Location = New-Object System.Drawing.Point(20, 20)
    $label.Size = New-Object System.Drawing.Size(460, 100)
    $label.Text = "Screen capture complete!`n`nThe screenshot has been saved to:`n$fullPath"
    $form.Controls.Add($label)

    # Add an OK button
    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Location = New-Object System.Drawing.Point(200, 130)
    $okButton.Size = New-Object System.Drawing.Size(100, 30)
    $okButton.Text = "OK"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($okButton)
    $form.AcceptButton = $okButton

    # Show the form
    $form.ShowDialog() | Out-Null
}

# Execute the function with default parameters
Capture-Screen

Write-Host "Done! You can now share this image."
