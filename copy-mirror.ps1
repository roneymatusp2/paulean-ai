# PowerShell script to copy mirror files
$source = "C:\Users\roney\WebstormProjects\paulean-ai\stpauls_mirror\www.stpauls.br"
$destination = "C:\Users\roney\WebstormProjects\paulean-ai\public\stpauls_site_mirror"

# Create destination directory if it doesn't exist
if (!(Test-Path -Path $destination)) {
    New-Item -ItemType Directory -Force -Path $destination
}

# Copy all files while preserving structure
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force

Write-Host "Mirror files copied successfully to public/stpauls_site_mirror"