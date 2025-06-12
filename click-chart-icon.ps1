# PowerShell script to open a browser, navigate to the UBI calculator, and click the chart icon

# Load required assemblies for browser automation
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

# Function to simulate a click at specific coordinates
function Click-At {
    param (
        [int]$X,
        [int]$Y
    )
    
    $signature = @'
    [DllImport("user32.dll", CharSet=CharSet.Auto, CallingConvention=CallingConvention.StdCall)]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint cButtons, uint dwExtraInfo);
'@
    
    $type = Add-Type -MemberDefinition $signature -Name "MouseEvents" -Namespace "Win32" -PassThru
    
    # Move cursor to position
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($X, $Y)
    
    # Left mouse button down and up (click)
    $type::mouse_event(0x00000002, 0, 0, 0, 0) # MOUSEEVENTF_LEFTDOWN
    Start-Sleep -Milliseconds 100
    $type::mouse_event(0x00000004, 0, 0, 0, 0) # MOUSEEVENTF_LEFTUP
    
    Write-Host "Clicked at position X: $X, Y: $Y"
}

# Main script execution
try {
    # 1. Open the browser to the UBI calculator
    Start-Process "http://localhost:5173"
    Write-Host "Opening browser to http://localhost:5173"
    
    # Wait for the page to load
    Start-Sleep -Seconds 5
    
    # 2. Take a screenshot before clicking
    $beforeScreenshot = Take-Screenshot -FilePath "$env:USERPROFILE\Desktop\before_click.png"
    
    # 3. Click on the chart icon (you'll need to adjust these coordinates for your screen)
    # These are example coordinates - you'll need to find the right position for your screen
    # The chart icon is typically in the top-right corner of the UBI Impact by Income Quintile section
    $chartIconX = 960  # Example X coordinate
    $chartIconY = 110  # Example Y coordinate
    
    Click-At -X $chartIconX -Y $chartIconY
    
    # Wait for the chart to appear
    Start-Sleep -Seconds 2
    
    # 4. Take a screenshot after clicking
    $afterScreenshot = Take-Screenshot -FilePath "$env:USERPROFILE\Desktop\after_click.png"
    
    Write-Host "Process completed successfully."
    Write-Host "Before screenshot: $beforeScreenshot"
    Write-Host "After screenshot: $afterScreenshot"
    
} catch {
    Write-Host "An error occurred: $_"
}
