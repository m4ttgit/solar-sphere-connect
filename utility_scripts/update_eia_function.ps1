# Update EIA Function Script
# Runs database migration and deploys the updated eia-data-ingest function

# Change to the supabase directory
Set-Location .\supabase

# Apply database migrations
Write-Host "Applying database migrations..."
try {
npx supabase migration run
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Database migration failed with exit code $LASTEXITCODE."
        exit 1
    }
    Write-Host "Database migrations applied successfully."
} catch {
    Write-Error "An error occurred during database migration: $($_.Exception.Message)"
    exit 1
}

# Deploy the eia-data-ingest function
Write-Host "Deploying eia-data-ingest function..."
try {
    npx supabase functions deploy eia-data-ingest
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Function deployment failed with exit code $LASTEXITCODE."
        exit 1
    }
    Write-Host "EIA data ingest function deployed successfully."
} catch {
    Write-Error "An error occurred during function deployment: $($_.Exception.Message)"
    exit 1
}

Write-Host "Update completed successfully!"
