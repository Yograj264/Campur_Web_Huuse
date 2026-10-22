param([switch]$Dev)
$projectDirectory = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectDirectory
$pythonExecutable = Join-Path (Split-Path -Parent $projectDirectory) '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $pythonExecutable)) { throw 'Project Python environment was not found.' }
$env:DJANGO_DEBUG = '1'
& $pythonExecutable manage.py migrate --noinput
if ($LASTEXITCODE -ne 0) { throw 'Database migrations failed.' }
if ($Dev) {
    Write-Host 'Start npm run dev in a second terminal for automatic frontend updates.'
} else {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed. Stop Vite before reinstalling dependencies.' }
}
Write-Host 'On another device use http://<this-computer-Wi-Fi-IP>:8000/ (not localhost).'
& $pythonExecutable manage.py runserver 0.0.0.0:8000
