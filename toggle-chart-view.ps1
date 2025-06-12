# PowerShell script to toggle the chart view and capture before/after screenshots
# This script will:
# 1. Open the browser to the application
# 2. Wait for the page to load
# 3. Capture the initial state
# 4. Open the browser console to check for errors
# 5. Manually toggle the chart view by executing JavaScript
# 6. Capture the toggled state

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Capture-Screen {
    param (
        [string]$OutputPath
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
    
    Write-Host "Screen captured and saved to: $OutputPath"
}

function Toggle-ChartView {
    param (
        [int]$InitialDelaySeconds = 5,
        [int]$ToggleDelaySeconds = 3
    )

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $initialCapturePath = "chart-before-toggle-$timestamp.png"
    $toggleCapturePath = "chart-after-toggle-$timestamp.png"
    
    # Open the browser to the application
    Write-Host "Opening browser to localhost:5173..."
    Start-Process "http://localhost:5173"
    
    Write-Host "Waiting $InitialDelaySeconds seconds for the page to load..."
    Start-Sleep -Seconds $InitialDelaySeconds
    
    # Capture the initial state
    Write-Host "Capturing initial screen state..."
    Capture-Screen -OutputPath $initialCapturePath
    
    # Press F12 to open developer tools
    Write-Host "Opening developer tools (F12)..."
    $wshell = New-Object -ComObject wscript.shell
    $wshell.AppActivate("localhost:5173")
    Start-Sleep -Seconds 1
    $wshell.SendKeys("{F12}")
    
    # Wait for developer tools to open
    Write-Host "Waiting for developer tools to open..."
    Start-Sleep -Seconds 2
    
    # Press Escape to focus on the console
    $wshell.SendKeys("{ESC}")
    Start-Sleep -Seconds 1
    
    # Type and execute JavaScript to toggle the chart view
    Write-Host "Executing JavaScript to toggle chart view..."
    $toggleScript = "document.querySelector('.chart-icon-container').click();"
    
    foreach ($char in $toggleScript.ToCharArray()) {
        $wshell.SendKeys($char)
        Start-Sleep -Milliseconds 10
    }
    
    # Press Enter to execute
    $wshell.SendKeys("{ENTER}")
    
    # Wait for the toggle to take effect
    Write-Host "Waiting $ToggleDelaySeconds seconds for toggle to take effect..."
    Start-Sleep -Seconds $ToggleDelaySeconds
    
    # Capture the toggled state
    Write-Host "Capturing toggled screen state..."
    Capture-Screen -OutputPath $toggleCapturePath
    
    Write-Host "Toggle operation complete!"
    Write-Host "Before toggle: $((Get-Item $initialCapturePath).FullName)"
    Write-Host "After toggle: $((Get-Item $toggleCapturePath).FullName)"
}

# Execute the function with default parameters
Toggle-ChartView -InitialDelaySeconds 5 -ToggleDelaySeconds 3

Write-Host "Done! You can now examine the captured images."
