Write-Host "Starting TechnoZone Backend Microservices..." -ForegroundColor Green

# Define services and their entry files
$services = @(
    @{ Name="API Gateway"; Path="technozone-api-gateway"; Command="python app.py" },
    @{ Name="Product Service"; Path="technozone-product-service"; Command="python run.py" },
    @{ Name="Cart Service"; Path="technozone-cart-service"; Command="python run.py" },
    @{ Name="Order Service"; Path="technozone-order-service"; Command="python run.py" },
    @{ Name="Inventory Service"; Path="technozone-inventory-service"; Command="python run.py" },
    @{ Name="Notification Service"; Path="technozone-notification-service"; Command="python run.py" }
)

foreach ($service in $services) {
    Write-Host "Launching $($service.Name)..." -ForegroundColor Cyan
    # Open a new PowerShell window, navigate to directory, install reqs (if not installed), and run the service
    $scriptBlock = "cd $($service.Path); if (!(Test-Path venv)) { python -m venv venv }; .\venv\Scripts\activate; pip install -r requirements.txt; $($service.Command)"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
    Start-Sleep -Seconds 2
}

Write-Host "All services have been launched in separate windows!" -ForegroundColor Green
Write-Host "The API Gateway is running on port 5000." -ForegroundColor Yellow
