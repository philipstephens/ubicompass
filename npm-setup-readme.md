# npm Setup for VSCode

This guide explains how to ensure npm works correctly when you first open VSCode.

## Files Created

1. **npm-setup.ps1**: A PowerShell script that ensures npm is available in your PATH.
2. **PowerShell Profiles**:
   - `Microsoft.VSCode_profile.ps1`: Runs when PowerShell is started in VSCode.
   - `Microsoft.PowerShell_profile.ps1`: Runs for all PowerShell sessions.
3. **VSCode Settings**:
   - `.vscode/settings.json`: Configures VSCode to use PowerShell with the correct profile.
   - `.vscode/tasks.json`: Provides tasks for setting up npm and running common commands.

## How to Use

### Option 1: Automatic Setup (Recommended)

When you open VSCode, the integrated terminal will automatically:
1. Load your PowerShell profile
2. Run the npm-setup.ps1 script
3. Add npm to your PATH if needed

### Option 2: Manual Setup

If the automatic setup doesn't work, you can:

1. Run the "Setup npm" task:
   - Press `Ctrl+Shift+P`
   - Type "Tasks: Run Task"
   - Select "Setup npm"

2. Or run the setup script directly in the terminal:
   ```powershell
   .\npm-setup.ps1
   ```

### Useful Aliases

The PowerShell profiles include several useful aliases:

- `nps`: Run `npm start`
- `npd`: Run `npm run dev`
- `npb`: Run `npm run build`
- `cdp`: Navigate to your projects directory (E:\programming)

## Troubleshooting

If npm is still not available after these steps:

1. **Check Node.js Installation**:
   ```powershell
   # Check if Node.js is installed
   node --version
   ```

2. **Check npm Installation**:
   ```powershell
   # Check if npm is installed
   npm --version
   ```

3. **Check PATH Environment Variable**:
   ```powershell
   # Check if Node.js paths are in your PATH
   $env:PATH -split ";"
   ```

4. **Check Execution Policy**:
   ```powershell
   # Check your PowerShell execution policy
   Get-ExecutionPolicy -List
   
   # Set a more permissive policy if needed
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

5. **Manually Add Node.js to PATH**:
   ```powershell
   # Add Node.js to PATH for the current session
   $env:PATH = "C:\Program Files\nodejs;$env:PATH"
   ```

## Additional Notes

- The setup only affects the current PowerShell session. To make permanent changes to your PATH, you need to modify your system environment variables.
- If you install or update Node.js, you may need to restart VSCode for the changes to take effect.
- These scripts are designed for Windows. If you're using macOS or Linux, you'll need different scripts.
