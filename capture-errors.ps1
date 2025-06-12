# PowerShell script to capture error messages from the browser console
# This script creates a simple HTML page that captures and displays console errors

param (
    [Parameter(Mandatory=$false)]
    [string]$TargetUrl = "http://localhost:5173",
    
    [Parameter(Mandatory=$false)]
    [string]$OutputFile = "console-errors.txt"
)

# Create a temporary HTML file to capture console errors
$tempHtmlFile = [System.IO.Path]::GetTempFileName() + ".html"

$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Console Error Capture</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        .error-log {
            background-color: #fff0f0;
            border: 1px solid #ffcccc;
            border-radius: 4px;
            padding: 10px;
            margin-top: 20px;
            white-space: pre-wrap;
            font-family: monospace;
            max-height: 400px;
            overflow-y: auto;
        }
        .button {
            background-color: #4a86e8;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 8px;
        }
        .button:hover {
            background-color: #3a76d8;
        }
        iframe {
            width: 100%;
            height: 300px;
            border: 1px solid #ddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Console Error Capture</h1>
        <p>This page captures console errors from the target URL.</p>
        
        <div>
            <button id="captureBtn" class="button">Capture Errors</button>
            <button id="copyBtn" class="button">Copy to Clipboard</button>
            <button id="saveBtn" class="button">Save to File</button>
        </div>
        
        <div class="error-log" id="errorLog">No errors captured yet. Click "Capture Errors" to start.</div>
        
        <iframe id="targetFrame" src="$TargetUrl"></iframe>
    </div>

    <script>
        // Store captured errors
        let capturedErrors = [];
        
        // Function to capture errors
        function captureErrors() {
            const errorLog = document.getElementById('errorLog');
            const iframe = document.getElementById('targetFrame');
            
            errorLog.textContent = 'Capturing errors...';
            capturedErrors = [];
            
            // Reload the iframe to capture fresh errors
            iframe.src = iframe.src;
            
            // Wait for iframe to load
            iframe.onload = function() {
                try {
                    // Try to access the iframe's console
                    const iframeWindow = iframe.contentWindow;
                    
                    // Override console.error in the iframe
                    const originalConsoleError = iframeWindow.console.error;
                    iframeWindow.console.error = function() {
                        // Call the original console.error
                        originalConsoleError.apply(this, arguments);
                        
                        // Capture the error
                        const errorMsg = Array.from(arguments).join(' ');
                        capturedErrors.push(errorMsg);
                        
                        // Update the error log
                        errorLog.textContent = capturedErrors.join('\\n\\n');
                    };
                    
                    errorLog.textContent = 'Listening for errors...';
                    
                    // If there are already errors in the console, we won't catch them
                    // This is a limitation of this approach
                } catch (e) {
                    errorLog.textContent = 'Error accessing iframe content: ' + e.message + '\\n' +
                        'This might be due to cross-origin restrictions.';
                }
            };
        }
        
        // Function to copy errors to clipboard
        function copyToClipboard() {
            const errorLog = document.getElementById('errorLog');
            navigator.clipboard.writeText(errorLog.textContent)
                .then(() => {
                    alert('Errors copied to clipboard!');
                })
                .catch(err => {
                    alert('Failed to copy: ' + err);
                });
        }
        
        // Function to save errors to file
        function saveToFile() {
            const errorLog = document.getElementById('errorLog');
            const blob = new Blob([errorLog.textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'console-errors.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        // Add event listeners
        document.getElementById('captureBtn').addEventListener('click', captureErrors);
        document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
        document.getElementById('saveBtn').addEventListener('click', saveToFile);
        
        // Start capturing on page load
        window.onload = captureErrors;
    </script>
</body>
</html>
"@

# Save the HTML content to the temporary file
$htmlContent | Out-File -FilePath $tempHtmlFile -Encoding utf8

# Open the HTML file in the default browser
Write-Host "Opening error capture page in your browser..."
Start-Process $tempHtmlFile

# Instructions
Write-Host "Instructions:"
Write-Host "1. The error capture page has been opened in your browser."
Write-Host "2. Click 'Capture Errors' to refresh and capture new errors."
Write-Host "3. Click 'Copy to Clipboard' to copy the errors to your clipboard."
Write-Host "4. Click 'Save to File' to save the errors to a text file."
Write-Host "5. The target URL is: $TargetUrl"
Write-Host "6. You can change the target URL by editing the script parameter."
