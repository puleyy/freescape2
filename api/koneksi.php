<?php
$DB_HOST = '127.0.0.1';
$DB_PORTS = ['3306', '3307'];
$DB_NAME = 'freespace_db';
$DB_USER = 'root';
$DB_PASS = '';

date_default_timezone_set('Asia/Jakarta');
header('Content-Type: application/json; charset=utf-8');

set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Kesalahan server: ' . $e->getMessage()]);
});

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === 'null') {           
    header('Access-Control-Allow-Origin: *');
} elseif (preg_match('#^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$#', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { 
    http_response_code(204);
    exit;
}

$pdo = null;
$galat = '';
foreach ($DB_PORTS as $DB_PORT) {
    try {
        $pdo = new PDO(
            "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4",
            $DB_USER,
            $DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT            => 3,
            ]
        );
        $pdo->exec("SET time_zone = '+07:00'");
        break;
    } catch (PDOException $e) {
        $pdo = null;
        $galat .= "[port $DB_PORT] " . $e->getMessage() . ' ';
    }
}
if (!$pdo) {
    http_response_code(500);
    $petunjuk = (strpos($galat, 'Unknown database') !== false)
        ? ' -> Database belum dibuat: buka phpMyAdmin > Import > pilih database.sql'
        : ' -> Pastikan MySQL sudah Start di XAMPP dan port di api/koneksi.php benar';
    echo json_encode(['ok' => false, 'error' => 'Koneksi database gagal: ' . trim($galat) . $petunjuk]);
    exit;
}
