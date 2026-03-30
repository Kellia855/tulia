$ErrorActionPreference = 'Stop'

# Refresh this shell from persisted Machine/User PATH values.
$machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$env:Path = "$machinePath;$userPath"

$npmCmd = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
if (-not (Test-Path $npmCmd)) {
    throw "npm.cmd was not found at '$npmCmd'. Reinstall Node.js LTS from nodejs.org and try again."
}

if (Test-Path '.\.venv\Scripts\Activate.ps1') {
    & .\.venv\Scripts\Activate.ps1
}

if (-not (Test-Path '.\node_modules')) {
    & $npmCmd install
}

& $npmCmd run dev