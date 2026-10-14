<?php
require __DIR__ . '/koneksi.php';

function keluar(int $kode, array $data): void
{
    http_response_code($kode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function potong($teks, int $maks): string
{
    $teks = (string) $teks;
    return function_exists('mb_substr') ? mb_substr($teks, 0, $maks) : substr($teks, 0, $maks);
}
function ke_teks($v): string
{
    return is_array($v) ? implode(', ', array_map('strval', $v)) : (string) $v;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    keluar(405, ['ok' => false, 'error' => 'Gunakan metode POST']);
}

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) keluar(400, ['ok' => false, 'error' => 'Body harus berupa JSON']);

$tipe = potong(trim((string) ($in['tipe_hasil'] ?? '')), 100);
if ($tipe === '') keluar(400, ['ok' => false, 'error' => 'Tipe hasil wajib diisi']);

$jawaban = is_array($in['jawaban'] ?? null) ? $in['jawaban'] : [];

$baris = [];
foreach ($jawaban as $kunci => $nilai) {
    $teks = ke_teks($nilai);
    if ($teks !== '') $baris[] = $kunci . ': ' . $teks;
}
$ringkasan = potong(implode(' | ', $baris), 4000);

$min = isset($in['estimasi_min']) && is_numeric($in['estimasi_min']) ? max(0, (int) $in['estimasi_min']) : null;
$maks = isset($in['estimasi_maks']) && is_numeric($in['estimasi_maks']) ? max(0, (int) $in['estimasi_maks']) : null;

try {
    $ins = $pdo->prepare(
        'INSERT INTO konsultasi (tipe_hasil, ringkasan, estimasi_min, estimasi_maks, data_input) VALUES (?, ?, ?, ?, ?)'
    );
    $ins->execute([$tipe, $ringkasan, $min, $maks, json_encode($jawaban, JSON_UNESCAPED_UNICODE)]);
    keluar(200, ['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
} catch (PDOException $e) {
    keluar(500, ['ok' => false, 'error' => 'Gagal menyimpan ke database: ' . $e->getMessage()]);
}
