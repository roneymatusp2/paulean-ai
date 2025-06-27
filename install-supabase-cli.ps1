# Install Supabase CLI on Windows
# Run this in PowerShell as Administrator

# Install via Scoop (if not already installed)
if (!(Get-Command scoop -ErrorAction SilentlyContinue)) {
    # Install Scoop
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
}

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase