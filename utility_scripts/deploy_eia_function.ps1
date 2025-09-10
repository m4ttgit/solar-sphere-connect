# Deploy to Supabase Cloud
Write-Host "Deploying to Supabase Cloud..."

# Get database password from .env
$dbPassword = (Get-Content .env | Select-String "POSTGRES_PASSWORD=(.*)").Matches.Groups[1].Value

# Link to Supabase project with password
supabase link --project-ref vtjpbsfogcwqvgbllsqe --db-password $dbPassword

# Set environment variables in Supabase project
supabase secrets set --env-file .env

# Deploy the function to cloud
supabase functions deploy eia-data-ingest

# Get function URL
$functionUrl = supabase functions get-url eia-data-ingest
Write-Host "Function deployed at: $functionUrl"

# The following lines that update the API trigger are unnecessary and have been removed.

# Test the function
Write-Host "Testing cloud function..."
$response = Invoke-WebRequest -Uri $functionUrl -Method POST
Write-Host "Function response: $($response.Content)"
