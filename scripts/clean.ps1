[CmdletBinding()]
param([switch]$IncludeCollectedStatic)

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$projectPrefix = $projectRoot + [IO.Path]::DirectorySeparatorChar
$targets = @((Join-Path $projectRoot 'dist'))
if ($IncludeCollectedStatic) {
    $targets += Join-Path $projectRoot 'staticfiles'
}
foreach ($sourceFolder in @('campus_project', 'portal')) {
    $sourcePath = Join-Path $projectRoot $sourceFolder
    if (Test-Path -LiteralPath $sourcePath) {
        $targets += @(Get-ChildItem -LiteralPath $sourcePath -Directory -Filter '__pycache__' -Recurse | ForEach-Object { $_.FullName })
    }
}
$removedCount = 0
foreach ($target in $targets | Sort-Object -Unique) {
    $absoluteTarget = [IO.Path]::GetFullPath($target)
    if (-not $absoluteTarget.StartsWith($projectPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Cleanup target is outside the project.'
    }
    if (-not (Test-Path -LiteralPath $absoluteTarget)) { continue }
    $item = Get-Item -LiteralPath $absoluteTarget -Force
    if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -or
        @(Get-ChildItem -LiteralPath $absoluteTarget -Recurse -Force -Attributes ReparsePoint).Count) {
        throw "Cleanup stopped: a target contains a symbolic link or junction: $absoluteTarget"
    }
    Remove-Item -LiteralPath $absoluteTarget -Recurse -Force
    $removedCount += 1
}
Write-Output "Removed $removedCount generated/cache directories. Source code, current frontend assets, dependencies, database, environment and backups were preserved."
