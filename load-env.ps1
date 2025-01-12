Get-Content .env.local | ForEach-Object {
    $line = $_ -split '='
    [System.Environment]::SetEnvironmentVariable($line[0], $line[1], 'Process')
}
