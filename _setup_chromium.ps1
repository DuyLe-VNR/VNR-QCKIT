$src  = 'D:\SourceCode\AutomationProcess\vnr-qckit\tools\pw-chromium\chrome-win'
$dest = "$env:LOCALAPPDATA\pw-chromium\chrome-win"
if (Test-Path $src) {
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force
  Write-Host "OK: Chromium -> $dest"
} else {
  Write-Host "SKIP: source not found -> $src"
}
