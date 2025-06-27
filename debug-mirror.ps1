# Debug script to check mirror structure
$mirrorPath = "./public/stpauls_site_mirror"

Write-Host "=== St. Paul's Mirror Debug ===" -ForegroundColor Yellow

# Check if mirror exists
if (Test-Path $mirrorPath) {
    Write-Host "Mirror folder exists at: $mirrorPath" -ForegroundColor Green
    
    # List key files and folders
    Write-Host "`nChecking for expected files:" -ForegroundColor Cyan
    
    $expectedFiles = @(
        "index.html",
        "about-us.html",
        "academic.html",
        "admissions.html",
        "about-us/index.html",
        "academic/index.html",
        "admissions/index.html"
    )
    
    foreach ($file in $expectedFiles) {
        $fullPath = Join-Path $mirrorPath $file
        if (Test-Path $fullPath) {
            Write-Host "Found: $file" -ForegroundColor Green
        } else {
            Write-Host "Missing: $file" -ForegroundColor Red
        }
    }
    
    # Show directory structure
    Write-Host "`nDirectory structure (first level):" -ForegroundColor Cyan
    Get-ChildItem $mirrorPath -Directory | Select-Object -First 10 | ForEach-Object {
        Write-Host "DIR: $($_.Name)" -ForegroundColor Yellow
    }
    
    Write-Host "`nHTML files in root:" -ForegroundColor Cyan
    Get-ChildItem $mirrorPath -Filter "*.html" | Select-Object -First 10 | ForEach-Object {
        Write-Host "FILE: $($_.Name)" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "Mirror folder not found at: $mirrorPath" -ForegroundColor Red
    Write-Host "Please run the copy-mirror.ps1 script first to set up the static mirror." -ForegroundColor Yellow
}

Write-Host "`n=== End Debug ===" -ForegroundColor Yellow