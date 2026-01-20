$ErrorActionPreference = "Stop"

$ImageLocal = "server-app-k8s:latest"
$ImageRemote = "suhag12/server-app-k8s:latest"

Write-Host "Building project (npm run build)..."
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) { Write-Host "Project build failed." -ForegroundColor Red; exit $LASTEXITCODE }

Write-Host "Building image $ImageLocal..."
docker build -t $ImageLocal .
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed." -ForegroundColor Red; exit $LASTEXITCODE }

Write-Host "Tagging image as $ImageRemote..."
docker tag $ImageLocal $ImageRemote
if ($LASTEXITCODE -ne 0) { Write-Host "Tag failed." -ForegroundColor Red; exit $LASTEXITCODE }

Write-Host "Pushing $ImageRemote..."
try {
  docker push $ImageRemote
  if ($LASTEXITCODE -ne 0) { throw "Push failed" }
  Write-Host "Push completed." -ForegroundColor Green
} catch {
  Write-Host "Push failed. Please run: docker login" -ForegroundColor Yellow
  exit 1
}
