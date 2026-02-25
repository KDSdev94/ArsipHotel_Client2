# Script: dev.ps1
# Fungsi: Matikan semua proses di port 5173-5180, lalu jalankan vite dev server

Write-Host "Membersihkan port 5173-5180..." -ForegroundColor Yellow

$ports = 5173..5180

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $processId = $conn.OwningProcess
        if ($processId -and $processId -ne 0) {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "  Port $port -> PID $processId dihentikan." -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Menjalankan Vite di port 5173..." -ForegroundColor Cyan
bun run dev
