$ErrorActionPreference = "Stop"

Write-Host "Starting deployment packaging..." -ForegroundColor Cyan

# Google Drive folder ID
$DriveFolderId = "1iQx1Sxbmx1bUAoEXi4h9gQVhXMPSvSa0"

# 1. Build the project locally
Write-Host "Building the React application..." -ForegroundColor Yellow
# Use cmd /c to ensure npm runs correctly in all environments
cmd /c "npm run build"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Aborting." -ForegroundColor Red
    exit 1
}

# 2. Create the zip file
Write-Host "Zipping required files..." -ForegroundColor Yellow

$FilesToZip = @(
    "dist",
    "server.js",
    "package.json",
    "package-lock.json"

)

$OutputFile = "production-deploy.zip"

# Remove existing zip if it exists
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile
}

# Create Zip
Compress-Archive -Path $FilesToZip -DestinationPath $OutputFile

Write-Host "Package created successfully: $OutputFile" -ForegroundColor Green

# Attempt upload using available tools
$Uploaded = $false
if (Get-Command gdrive -ErrorAction SilentlyContinue) {
    Write-Host "Uploading to Google Drive using gdrive..."
    & gdrive upload --parent $DriveFolderId $OutputFile
    if ($LASTEXITCODE -eq 0) { $Uploaded = $true }
}

if (-not $Uploaded -and (Get-Command rclone -ErrorAction SilentlyContinue)) {
    Write-Host "Uploading to Google Drive using rclone (remote 'gdrive')..."
    & rclone copy $OutputFile "gdrive:$DriveFolderId" --progress
    if ($LASTEXITCODE -eq 0) { $Uploaded = $true }
}

if ($Uploaded) {
    Write-Host "Upload completed successfully."
} else {
    Write-Host "Upload tools not found or upload failed."
    Write-Host "Please upload $OutputFile to: https://drive.google.com/drive/folders/$DriveFolderId"
    # Open Google Drive folder in the default browser to streamline manual upload
    try {
        Start-Process "https://drive.google.com/drive/folders/$DriveFolderId"
    } catch {
        Write-Host "Could not open browser automatically." -ForegroundColor Yellow
    }
    # Open Explorer pointing at the generated zip to make selection easy
    try {
        $zipPath = (Resolve-Path $OutputFile).Path
        Start-Process explorer "/select,$zipPath"
    } catch {
        Write-Host "Could not open Explorer automatically." -ForegroundColor Yellow
    }
}
