$ErrorActionPreference = 'Stop'
# Run once from PowerShell as Administrator. Allows only local-subnet access.
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Open PowerShell as Administrator, then run this script to add the local-subnet firewall rule.'
}
$ruleName = 'Campus Connect development - local subnet'
$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if (-not $existingRule) {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8000,3000 -RemoteAddress LocalSubnet -Profile Any | Out-Null
    Write-Host 'Allowed TCP 8000 and 3000 from the local subnet only.'
} else {
    Write-Host 'Campus Connect local-subnet rule already exists.'
}
