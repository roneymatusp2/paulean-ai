# PowerShell script to fix Supabase Edge Functions
# Execute in Windows PowerShell

Write-Host "Setting up environment variables..." -ForegroundColor Green

# Create .env file with correct values
$envContent = @"
# Supabase Configuration
VITE_SUPABASE_URL=https://gjvtncdjcslnkfctqnfy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnRuY2RqY3NsbmtmY3RxbmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzM0MDEsImV4cCI6MjA1OTU0OTQwMX0.AzALxUUvYLJJtDkvxt7efJ7bGxeKmzOs-fT5bQOndiU
"@

Set-Content -Path ".env" -Value $envContent
Write-Host ".env file created with Supabase credentials" -ForegroundColor Green

Write-Host "`nTo verify authentication works, run:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Cyan

Write-Host "`nIf you still get 401 errors, you need to update the Edge Functions to accept anon key." -ForegroundColor Yellow
Write-Host "Go to Supabase Dashboard > Edge Functions > Settings and disable JWT verification for these functions:" -ForegroundColor Yellow
Write-Host "- ask-paulean" -ForegroundColor Cyan
Write-Host "- transcribe-paulean-audio" -ForegroundColor Cyan
Write-Host "- speak-paulean-answer" -ForegroundColor Cyan