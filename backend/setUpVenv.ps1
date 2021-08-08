python -m venv "C:\Python\jous\venv"
$PythonVenv = "C:\Python\jous\venv"
$scripts = "$($PythonVenv)\Scripts\"
$reqfile = "C:\Projects\github\jous\backend\requirements.txt"
Set-Location -Path "$($scripts)" -PassThru
try
{
    $activate="$($scripts)activate.ps1"
    .$activate

    python -m pip install --upgrade pip
    pip install --upgrade setuptools
    pip install -r "$($reqfile)"
    $localError = $LastExitCode

    $deactivate = "deactivate"
    .$deactivate
    Write-Host '=== pip install finished ! (ExitCode:' $localError') ==='
}