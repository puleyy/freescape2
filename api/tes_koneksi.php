<?php
require __DIR__ . '/koneksi.php';

echo json_encode([
    'ok'              => true,
    'database'        => 'freespace_db',
    'port_dipakai'    => $DB_PORT,
    'layanan'         => (int) $pdo->query('SELECT COUNT(*) FROM layanan')->fetchColumn(),
    'portofolio'      => (int) $pdo->query('SELECT COUNT(*) FROM portofolio')->fetchColumn(),
    'booking'         => (int) $pdo->query('SELECT COUNT(*) FROM booking')->fetchColumn(),
    'konsep_simulasi' => (int) $pdo->query('SELECT COUNT(*) FROM konsep_simulasi')->fetchColumn(),
    'konsultasi'      => (int) $pdo->query('SELECT COUNT(*) FROM konsultasi')->fetchColumn(),
], JSON_PRETTY_PRINT);
