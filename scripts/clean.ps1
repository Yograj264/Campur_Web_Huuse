$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$targets = @((Join-Path $projectRoot 'dist'))
foreach ($sourceFolder in @('campus_project', 'portal')) {
    $sourcePath = Join-Path $projectRoot $sourceFolder
    if (Test-Path -LiteralPath $sourcePath) {
        $targets += @(Get-ChildItem -LiteralPath $sourcePath -Directory -Filter '__pycache__' -Recurse | ForEach-Object { $_.FullName })
    }
}
foreach ($target in $targets) {
    $absoluteTarget = [System.IO.Path]::GetFullPath($target)
    if (-not $absoluteTarget.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Cleanup target is outside the project.'
    }
    if (Test-Path -LiteralPath $absoluteTarget) {
        Remove-Item -LiteralPath $absoluteTarget -Recurse -Force
        Write-Output ('Removed ' + $absoluteTarget.Substring($projectRoot.Length + 1))
    }
}
