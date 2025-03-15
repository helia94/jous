# Define the folder path
$folderPath = "C:\Dev\jous\frontend\src\components"

# Define the output text file path
$outputFile = "C:\Dev\jous\frontend\src\components\Combinedcomponents.txt"

# Define the list of files to process
$fileList = @(
    "TweetItem2.css",
    "TweetItem2.jsx",
    "theme.css",

    "AddTweet.jsx",
    "MainPage.jsx",
    "Random.jsx",
    "ShareModal.jsx",
    "TweetDetailPage.jsx"
 )

# Clear the output file if it already exists
if (Test-Path $outputFile) {
    Clear-Content -Path $outputFile
}

# Loop through each file in the list and append its contents to the output file
foreach ($fileName in $fileList) {
    $filePath = Join-Path -Path $folderPath -ChildPath $fileName

    # Check if the file exists
    if (Test-Path $filePath) {
        # Write the file name as a header
        Add-Content -Path $outputFile -Value "=== $fileName ==="

        # Append the file contents
        Get-Content -Path $filePath | Add-Content -Path $outputFile

        # Add a newline for separation
        Add-Content -Path $outputFile -Value "`n"
    } else {
        Write-Host "File not found: $fileName"
    }
}

Write-Host "Contents of the specified files have been written to $outputFile"