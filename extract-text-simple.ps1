# PowerShell script to extract text from a web page using a simple method
# This script uses Invoke-WebRequest to get the HTML and then extracts text

param (
    [Parameter(Mandatory=$false)]
    [string]$Url = "http://localhost:5173",
    
    [Parameter(Mandatory=$false)]
    [string]$OutputFile = "page-text.txt"
)

function Extract-WebPageText {
    param (
        [string]$Url,
        [string]$OutputFile
    )
    
    Write-Host "Extracting text from: $Url"
    Write-Host "This will take a few seconds..."
    
    try {
        # Get the web page content
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        
        # Extract text from HTML
        $html = $response.Content
        
        # Simple HTML to text conversion
        $text = $html -replace '<head>.*?</head>', '' -replace '<script.*?>.*?</script>', '' -replace '<style.*?>.*?</style>', ''
        $text = $text -replace '<[^>]+>', ' ' -replace '&nbsp;', ' ' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&amp;', '&'
        $text = $text -replace '\s+', ' ' -replace '^\s+', '' -replace '\s+$', ''
        
        # Save the text to a file
        $text | Out-File -FilePath $OutputFile -Encoding utf8
        
        Write-Host "Text extracted successfully and saved to: $OutputFile"
        Write-Host "Content preview:"
        Write-Host "----------------------------------------"
        $preview = $text.Substring(0, [Math]::Min(500, $text.Length))
        Write-Host $preview
        Write-Host "----------------------------------------"
        Write-Host "Full content saved to: $OutputFile"
        
        # Copy the file path to clipboard for easy access
        Set-Clipboard -Value (Resolve-Path $OutputFile).Path
        Write-Host "File path copied to clipboard."
        
        # Return the text
        return $text
    }
    catch {
        Write-Host "Error extracting text: $_" -ForegroundColor Red
        return $null
    }
}

# Create a notification dialog
function Show-Notification {
    param (
        [string]$Message
    )
    
    Add-Type -AssemblyName System.Windows.Forms
    
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Text Extraction Complete"
    $form.Size = New-Object System.Drawing.Size(400, 200)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    
    $label = New-Object System.Windows.Forms.Label
    $label.Location = New-Object System.Drawing.Point(10, 20)
    $label.Size = New-Object System.Drawing.Size(380, 80)
    $label.Text = $Message
    $form.Controls.Add($label)
    
    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Location = New-Object System.Drawing.Point(150, 120)
    $okButton.Size = New-Object System.Drawing.Size(100, 30)
    $okButton.Text = "OK"
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($okButton)
    $form.AcceptButton = $okButton
    
    $form.TopMost = $true
    $form.ShowDialog() | Out-Null
}

# Main execution
$text = Extract-WebPageText -Url $Url -OutputFile $OutputFile

# Show notification
if ($text) {
    $message = "Text successfully extracted from $Url and saved to $OutputFile`n`nThe file path has been copied to your clipboard."
    Show-Notification -Message $message
}
