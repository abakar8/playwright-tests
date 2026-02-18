$xamppPath = "C:\xampp"

Write-Host "🚀 Starting XAMPP services..."

# Démarrer Apache
Write-Host "Starting Apache..."
Start-Process "$xamppPath\apache_start.bat" -WindowStyle Hidden

# Attendre 3 secondes
Start-Sleep -Seconds 3

# Démarrer MySQL
Write-Host "Starting MySQL..."
Start-Process "$xamppPath\mysql_start.bat" -WindowStyle Hidden

# Attendre 3 secondes
Start-Sleep -Seconds 3

# Vérifier les processus
$apache = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
$mysql = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue

if ($apache) {
    Write-Host "✅ Apache is running"
} else {
    Write-Host "❌ Apache failed to start"
}

if ($mysql) {
    Write-Host "✅ MySQL is running"
} else {
    Write-Host "❌ MySQL failed to start"
}

# Tester l'accès à OrangeHRM
Write-Host "Testing OrangeHRM accessibility..."
try {
    $response = Invoke-WebRequest -Uri "https://localhost/orangehrm-5.7/web/index.php/auth/login" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ OrangeHRM is accessible at https://localhost/orangehrm-5.7/web/index.php/auth/login"
    }
} catch {
    Write-Host "⚠️  OrangeHRM may not be accessible yet"
}

Write-Host "`n✅ XAMPP startup complete!"

Ajouter au workflow avant les tests:

```yaml
- name: Start XAMPP (if not running)
  shell: powershell
  run: |
    $apache = Get-Process -Name "httpd" -ErrorAction SilentlyContinue
    if ($null -eq $apache) {
      .\scripts\start-xampp.ps1
    } else {
      Write-Host "XAMPP is already running"
    }
```
