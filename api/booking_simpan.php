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

function ms_ke_datetime($ms): ?string
{
    return is_numeric($ms) && $ms > 0 ? date('Y-m-d H:i:s', (int) round($ms / 1000)) : null;
}

function simpan_bukti(string $id, string $dataUrl): ?string
{
    if (!preg_match('#^data:image/(png|jpeg|jpg|webp|gif);base64,#i', $dataUrl, $m)) return null;

    $bin = base64_decode(substr($dataUrl, strlen($m[0])), true);
    if ($bin === false || strlen($bin) > 5 * 1024 * 1024) return null;

    $info = @getimagesizefromstring($bin);
    if (!$info) return null;

    $ext = [IMAGETYPE_PNG => 'png', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'][$info[2]] ?? null;
    if (!$ext) return null;

    $dir = dirname(__DIR__) . '/uploads/bukti';
    if (!is_dir($dir) && !mkdir($dir, 0775, true)) return null;

    $nama = $id . '.' . $ext;
    if (file_put_contents($dir . '/' . $nama, $bin) === false) return null;

    return 'uploads/bukti/' . $nama;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    keluar(405, ['ok' => false, 'error' => 'Gunakan metode POST']);
}

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) keluar(400, ['ok' => false, 'error' => 'Body harus berupa JSON']);
$id = strtoupper(trim((string) ($in['id'] ?? '')));
if (!preg_match('/^FS-[A-Z0-9]{1,6}$/', $id)) keluar(400, ['ok' => false, 'error' => 'Booking ID tidak valid']);

$layanan = potong(trim((string) ($in['layanan'] ?? '')), 100);
$tanggal = (string) ($in['tanggal'] ?? '');
$jam     = (string) ($in['jam'] ?? '');
$lokasi  = (string) ($in['lokasi_tipe'] ?? 'studio');
$alamat  = trim((string) ($in['alamat_proyek'] ?? ''));
$nama    = potong(trim((string) ($in['nama'] ?? '')), 100);
$email   = potong(trim((string) ($in['email'] ?? '')), 120);
$wa      = potong(trim((string) ($in['whatsapp'] ?? '')), 25);
$biaya   = max(0, (int) ($in['biaya'] ?? 100000));

$d = DateTime::createFromFormat('Y-m-d', $tanggal);
if (!$d || $d->format('Y-m-d') !== $tanggal)          keluar(400, ['ok' => false, 'error' => 'Tanggal tidak valid']);
if (!preg_match('/^\d{2}:\d{2}$/', $jam))             keluar(400, ['ok' => false, 'error' => 'Jam tidak valid']);
if (!in_array($lokasi, ['studio', 'proyek', 'online'], true)) keluar(400, ['ok' => false, 'error' => 'Tipe lokasi tidak valid']);
if ($layanan === '' || $nama === '' || $wa === '')    keluar(400, ['ok' => false, 'error' => 'Layanan, nama, dan WhatsApp wajib diisi']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL))       keluar(400, ['ok' => false, 'error' => 'Email tidak valid']);

$metode   = isset($in['metode']) ? potong(trim((string) $in['metode']), 40) : null;
$pengirim = isset($in['pengirim']) ? potong(trim((string) $in['pengirim']), 100) : null;
$expMs    = $in['kedaluwarsa_ms'] ?? null;
$bayarMs  = $in['dibayar_ms'] ?? null;
$selesaiMs = $in['selesai_ms'] ?? null;

$status = 'menunggu_pembayaran';
if ($selesaiMs)      $status = 'selesai';
elseif ($bayarMs)    $status = 'menunggu_verifikasi';
elseif (is_numeric($expMs) && $expMs / 1000 < time()) $status = 'kedaluwarsa';

$urutan = ['kedaluwarsa' => -1, 'menunggu_pembayaran' => 0, 'menunggu_verifikasi' => 1, 'dibayar' => 2, 'selesai' => 3];

try {
    $cek = $pdo->prepare('SELECT status, bukti_bayar FROM booking WHERE id = ?');
    $cek->execute([$id]);
    $ada = $cek->fetch();

    if (!$ada) {
        $pdo->beginTransaction();

        $konsepId = null;
        $k = $in['konsep'] ?? null;
        if (is_array($k)) {
            $ins = $pdo->prepare(
                'INSERT INTO konsep_simulasi (sumber, judul, layanan, rincian, total_biaya) VALUES (?, ?, ?, ?, ?)'
            );
            $ins->execute([
                potong((string) ($k['sumber'] ?? 'simulasi'), 30),
                isset($k['judul']) ? potong((string) $k['judul'], 120) : null,
                isset($k['layanan']) ? potong((string) $k['layanan'], 100) : null,
                json_encode($k['rincian'] ?? [], JSON_UNESCAPED_UNICODE),
                max(0, (int) ($k['total'] ?? 0)),
            ]);
            $konsepId = (int) $pdo->lastInsertId();
        }

        $bukti = (!empty($in['bukti']) && $bayarMs) ? simpan_bukti($id, (string) $in['bukti']) : null;

        $ins = $pdo->prepare(
            'INSERT INTO booking
               (id, layanan_nama, tanggal, jam, lokasi_tipe, alamat_proyek, nama, email, whatsapp,
                biaya_reservasi, status, metode_bayar, nama_pengirim, bukti_bayar, konsep_id,
                kedaluwarsa_pada, dibayar_pada, selesai_pada, dibuat_pada)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $ins->execute([
            $id, $layanan, $tanggal, $jam . ':00', $lokasi, $lokasi === 'proyek' ? $alamat : null,
            $nama, $email, $wa, $biaya, $status, $bayarMs ? $metode : null, $bayarMs ? $pengirim : null, $bukti, $konsepId,
            ms_ke_datetime($expMs), ms_ke_datetime($bayarMs), ms_ke_datetime($selesaiMs),
            ms_ke_datetime($in['dibuat_ms'] ?? null) ?? date('Y-m-d H:i:s'),
        ]);

        $pdo->commit();
        keluar(200, ['ok' => true, 'id' => $id, 'status' => $status, 'baru' => true]);
    }

    $set = [];
    $val = [];

    if ($bayarMs && empty($ada['bukti_bayar'])) {
        $bukti = !empty($in['bukti']) ? simpan_bukti($id, (string) $in['bukti']) : null;
        $set[] = 'metode_bayar = ?';   $val[] = $metode;
        $set[] = 'nama_pengirim = ?';  $val[] = $pengirim;
        $set[] = 'bukti_bayar = ?';    $val[] = $bukti;
        $set[] = 'dibayar_pada = ?';   $val[] = ms_ke_datetime($bayarMs);
    }
    if ($selesaiMs) {
        $set[] = 'selesai_pada = COALESCE(selesai_pada, ?)';
        $val[] = ms_ke_datetime($selesaiMs);
    }
    if ($ada['status'] !== 'batal' && ($urutan[$status] ?? 0) > ($urutan[$ada['status']] ?? 0)) {
        $set[] = 'status = ?';
        $val[] = $status;
    }

    if ($set) {
        $val[] = $id;
        $pdo->prepare('UPDATE booking SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($val);
    }
    keluar(200, ['ok' => true, 'id' => $id, 'status' => $status, 'baru' => false]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    keluar(500, ['ok' => false, 'error' => 'Gagal menyimpan ke database: ' . $e->getMessage()]);
}
