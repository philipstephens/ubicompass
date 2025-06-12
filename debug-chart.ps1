# PowerShell script to help debug chart rendering issues
# This script will:
# 1. Open the browser to the application
# 2. Wait for a specified delay
# 3. Capture the screen
# 4. Save it as a PNG file with a timestamp
# 5. Optionally toggle the chart view and capture again

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

function Debug-Chart {
    param (
        [int]$InitialDelaySeconds = 3,
        [int]$ToggleDelaySeconds = 2,
        [switch]$CaptureToggle = $false
    )

    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $initialCapturePath = "chart-initial-$timestamp.png"
    $toggleCapturePath = "chart-toggled-$timestamp.png"
    
    # Open the browser to the application
    Write-Host "Opening browser to localhost:5173..."
    Start-Process "http://localhost:5173"
    
    Write-Host "Waiting $InitialDelaySeconds seconds for the page to load..."
    Start-Sleep -Seconds $InitialDelaySeconds
    
    # Capture the initial state
    Write-Host "Capturing initial screen state..."
    Capture-Screen -OutputPath $initialCapturePath
    
    if ($CaptureToggle) {
        # Simulate clicking the toggle button (you'll need to position this correctly)
        Write-Host "Simulating click on toggle button..."
        $toggleX = 950  # Adjust these coordinates based on your screen
        $toggleY = 110  # Adjust these coordinates based on your screen
        
        # Move mouse and click
        [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($toggleX, $toggleY)
        $mouse = New-Object System.Windows.Forms.MouseEventArgs([System.Windows.Forms.MouseButtons]::Left, 1, $toggleX, $toggleY, 0)
        [System.Windows.Forms.Application]::DoEvents()
        [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($toggleX, $toggleY)
        
        # Simulate mouse down and up
        $signature = @'
        [DllImport("user32.dll",CharSet=CharSet.Auto,CallingConvention=CallingConvention.StdCall)]
        public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint cButtons, uint dwExtraInfo);
'@
        $SendMouseClick = Add-Type -memberDefinition $signature -name "Win32MouseEventNew" -namespace Win32Functions -passThru
        
        # Mouse down
        $SendMouseClick::mouse_event(0x00000002, 0, 0, 0, 0)
        Start-Sleep -Milliseconds 100
        # Mouse up
        $SendMouseClick::mouse_event(0x00000004, 0, 0, 0, 0)
        
        # Wait for the toggle to take effect
        Write-Host "Waiting $ToggleDelaySeconds seconds for toggle to take effect..."
        Start-Sleep -Seconds $ToggleDelaySeconds
        
        # Capture the toggled state
        Write-Host "Capturing toggled screen state..."
        Capture-Screen -OutputPath $toggleCapturePath
    }
    
    Write-Host "Debug complete!"
    Write-Host "Initial capture: $((Get-Item $initialCapturePath).FullName)"
    if ($CaptureToggle) {
        Write-Host "Toggled capture: $((Get-Item $toggleCapturePath).FullName)"
    }
}

# Execute the function with default parameters
Debug-Chart -InitialDelaySeconds 5 -CaptureToggle:$false

Write-Host "Done! You can now examine the captured images."
