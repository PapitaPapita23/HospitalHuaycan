$url = Read-Host "Ingresa la URL JDBC de Supabase (ej: jdbc:postgresql://db.maptsdpqsyuvmmqhnofv.supabase.co:5432/postgres?currentSchema=hospital_hc)"
if ([string]::IsNullOrEmpty($url)) {
    $url = "jdbc:postgresql://db.maptsdpqsyuvmmqhnofv.supabase.co:5432/postgres?currentSchema=hospital_hc"
}

$user = Read-Host "Ingresa el usuario de la base de datos (ej: postgres)"
if ([string]::IsNullOrEmpty($user)) {
    $user = "postgres"
}

$pass = Read-Host "Ingresa tu contraseña de Supabase" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
$plainPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

Write-Host "Ejecutando prueba de conexión con Maven..." -ForegroundColor Cyan
mvn test "-Dtest=DatabaseConnectionTest" "-Ddb.url=$url" "-Ddb.user=$user" "-Ddb.pass=$plainPass"
