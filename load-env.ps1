Get-Content .env.local | ForEach-Object {
  $_.Trim() | ForEach-Object {
    if ($_ -match '^(?<key>[^=]+)=(?<value>.*)$') {
      $key = $Matches['key'].Trim()
      $value = $Matches['value'].Trim().Trim('"')
      # Force remove Windows carriage return if any.
      $value = $value -replace "`r",""

      if ($value -match '^\$\{(.+?)\}$') {
        $envVarName = $Matches[1]
        $envVarValue = [System.Environment]::GetEnvironmentVariable($envVarName, 'Process')
        [System.Environment]::SetEnvironmentVariable($key, $envVarValue, 'Process')
      } else {
        [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
      }
    }
  }
}
