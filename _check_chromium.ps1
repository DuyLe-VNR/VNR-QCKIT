$dest = "$env:LOCALAPPDATA\pw-chromium\chrome-win\chrome.exe"
if (Test-Path $dest) { Write-Host "Chromium EXISTS at LOCALAPPDATA" } else { Write-Host "Chromium NOT found at LOCALAPPDATA" }

$msPath = "$env:USERPROFILE\AppData\Local\ms-playwright"
if (Test-Path $msPath) {
  Write-Host "ms-playwright found:"
  Get-ChildItem $msPath | Select-Object -First 5 | ForEach-Object { Write-Host $_.FullName }
} else { Write-Host "ms-playwright not found" }
