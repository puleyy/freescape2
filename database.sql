CREATE DATABASE IF NOT EXISTS freespace_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE freespace_db;

SET NAMES utf8mb4;

DROP VIEW IF EXISTS v_pesanan;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS konsep_simulasi;
DROP TABLE IF EXISTS konsultasi;
DROP TABLE IF EXISTS analisis_kos;
DROP TABLE IF EXISTS metode_pembayaran;
DROP TABLE IF EXISTS portofolio;
DROP TABLE IF EXISTS layanan;

CREATE TABLE layanan (
  slug          VARCHAR(60)  NOT NULL,
  nama          VARCHAR(100) NOT NULL,
  kategori      VARCHAR(40)  NOT NULL,
  tarif_per_m2  INT UNSIGNED NULL COMMENT 'Rupiah per m2, NULL = tanpa tarif',
  deskripsi     TEXT         NULL,
  gambar        VARCHAR(150) NULL,
  urutan        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  aktif         TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (slug)
) ENGINE=InnoDB;

CREATE TABLE portofolio (
  slug           VARCHAR(60)  NOT NULL,
  judul          VARCHAR(120) NOT NULL,
  jenis_layanan  VARCHAR(60)  NOT NULL,
  kota           VARCHAR(60)  NOT NULL,
  luas_m2        SMALLINT UNSIGNED NOT NULL,
  jumlah_lantai  TINYINT UNSIGNED  NOT NULL DEFAULT 1,
  kategori       VARCHAR(40)  NOT NULL,
  gambar         VARCHAR(150) NULL,
  urutan         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  aktif          TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (slug),
  KEY idx_porto_kategori (kategori)
) ENGINE=InnoDB;

CREATE TABLE metode_pembayaran (
  id             TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  kode           VARCHAR(20)  NOT NULL,
  nama           VARCHAR(60)  NOT NULL,
  nomor_rekening VARCHAR(40)  NULL,
  atas_nama      VARCHAR(80)  NULL,
  jenis          ENUM('transfer','qris') NOT NULL DEFAULT 'transfer',
  aktif          TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_metode_kode (kode)
) ENGINE=InnoDB;

CREATE TABLE konsep_simulasi (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sumber       VARCHAR(30)  NOT NULL COMMENT 'interior / kitchen / facade / kalkulator',
  judul        VARCHAR(120) NULL,
  layanan      VARCHAR(100) NULL,
  rincian      LONGTEXT     NULL COMMENT 'JSON: daftar baris rincian konsep',
  total_biaya  BIGINT UNSIGNED NOT NULL DEFAULT 0,
  dibuat_pada  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_konsep_sumber (sumber)
) ENGINE=InnoDB;

CREATE TABLE booking (
  id               CHAR(9)      NOT NULL COMMENT 'Format FS-XXXXXX',
  layanan_nama     VARCHAR(100) NOT NULL,
  tanggal          DATE         NOT NULL,
  jam              TIME         NOT NULL,
  lokasi_tipe      ENUM('studio','proyek','online') NOT NULL,
  alamat_proyek    TEXT         NULL,
  nama             VARCHAR(100) NOT NULL,
  email            VARCHAR(120) NOT NULL,
  whatsapp         VARCHAR(25)  NOT NULL,
  biaya_reservasi  INT UNSIGNED NOT NULL DEFAULT 100000,
  status           ENUM('menunggu_pembayaran','menunggu_verifikasi','dibayar','selesai','batal','kedaluwarsa')
                   NOT NULL DEFAULT 'menunggu_pembayaran',
  metode_bayar     VARCHAR(40)  NULL,
  nama_pengirim    VARCHAR(100) NULL,
  bukti_bayar      VARCHAR(255) NULL COMMENT 'Path file bukti transfer (uploads/bukti/...)',
  konsep_id        INT UNSIGNED NULL,
  kedaluwarsa_pada DATETIME     NULL,
  dibayar_pada     DATETIME     NULL,
  selesai_pada     DATETIME     NULL,
  dibuat_pada      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diubah_pada      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_book_jadwal (tanggal, jam),
  KEY idx_book_status (status),
  KEY idx_book_email (email),
  KEY idx_book_wa (whatsapp),
  CONSTRAINT fk_book_konsep FOREIGN KEY (konsep_id)
    REFERENCES konsep_simulasi (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE konsultasi (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipe_hasil     VARCHAR(100) NOT NULL COMMENT 'Profil gaya hasil konsultasi',
  ringkasan      TEXT         NULL COMMENT 'Pilihan client (mudah dibaca)',
  estimasi_min   BIGINT UNSIGNED NULL,
  estimasi_maks  BIGINT UNSIGNED NULL,
  data_input     LONGTEXT     NULL COMMENT 'JSON lengkap jawaban form',
  dibuat_pada    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE VIEW v_pesanan AS
SELECT
  b.dibuat_pada,
  b.id AS booking_id,
  b.status,
  b.nama,
  b.whatsapp,
  b.email,
  b.layanan_nama AS layanan,
  b.tanggal AS tgl_konsultasi,
  b.jam,
  b.lokasi_tipe AS lokasi,
  b.metode_bayar,
  b.bukti_bayar,
  k.sumber AS konsep_dari,
  k.total_biaya AS estimasi_biaya
FROM booking b
LEFT JOIN konsep_simulasi k ON k.id = b.konsep_id
ORDER BY b.dibuat_pada DESC;

INSERT INTO layanan (slug, nama, kategori, tarif_per_m2, deskripsi, gambar, urutan) VALUES
('desain-3d-interior',  'Desain 3D Interior',  'Interior',       80000,  'Visualisasi 3D interior realistis dengan material dan pencahayaan sesuai konsep Anda.', 'images/layanan/desain-3d-interior.jpg', 1),
('desain-3d-bangunan',  'Desain 3D Bangunan',  'Arsitektur',     50000,  'Desain fasad dan massa bangunan 3D modern yang siap diajukan PBG.',                      'images/layanan/desain-3d-bangunan.jpg', 2),
('bestek-gambar-kerja', 'Bestek / Gambar Kerja','Dokumen',       80000,  'Gambar kerja DED dan spesifikasi teknis lengkap untuk pelaksanaan.',                       'images/layanan/bestek-gambar-kerja.jpg', 3),
('analisis-struktur',   'Analisis Struktur',   'Engineering',    50000,  'Perhitungan struktur mengacu SNI 1726 tahan gempa.',                                       'images/layanan/analisis-struktur.jpg', 4),
('estimasi-rab',        'Estimasi RAB',        'Dokumen',        40000,  'Rincian anggaran biaya transparan per item pekerjaan.',                                    'images/layanan/estimasi-rab.jpg', 5),
('paket-all-in',        'Paket All In',        'Design & Build', 250000, 'Paket terpadu dari desain, struktur, RAB hingga dokumen siap izin.',                       'images/layanan/paket-all-in.jpg', 6),
('kontraktor-arsitek-bangunan', 'Kontraktor Arsitek & Bangunan', 'Konstruksi', NULL, 'Eksekutor lapangan yang membangun rumah, ruko, kos, dan villa sesuai gambar kerja dan RAB yang disepakati.', 'images/layanan/paket-all-in.jpg', 7);

INSERT INTO portofolio (slug, judul, jenis_layanan, kota, luas_m2, jumlah_lantai, kategori, gambar, urutan) VALUES
('rumah-tropis-dago',         'Rumah Tropis Dago',          'Desain Arsitektur',      'Bandung', 240, 2, 'Hunian',      'images/portfolio/rumah-tropis-dago.jpg', 1),
('rumah-minimalis-buah-batu', 'Rumah Minimalis Buah Batu',  'Desain Arsitektur',      'Bandung', 150, 2, 'Hunian',      'images/portfolio/rumah-minimalis-buah-batu.jpg', 2),
('ded-villa-lembang',         'DED Villa Lembang',          'Gambar Teknis DED',      'Lembang', 320, 2, 'Villa',       'images/portfolio/ded-villa-lembang.jpg', 3),
('ded-rumah-cibiru',          'DED Rumah 2 Lantai Cibiru',  'Gambar Teknis DED',      'Bandung', 180, 2, 'Hunian',      'images/portfolio/ded-rumah-cibiru.jpg', 4),
('ded-ruko-soreang',          'DED Ruko 3 Lantai Soreang',  'Gambar Teknis DED',      'Soreang', 270, 3, 'Ruko',        'images/portfolio/ded-ruko-soreang.jpg', 5),
('kos-gsh-antapani',          'Kos GSH Antapani',           'Bangunan Jadi',          'Bandung', 480, 3, 'Kos',         'images/portfolio/kos-gsh-antapani.jpg', 6),
('ruko-cimahi',               'Ruko Cimahi',                'Bangunan Jadi',          'Cimahi',  360, 3, 'Ruko',        'images/portfolio/ruko-cimahi.jpg', 7),
('interior-master-suite',     'Master Suite Japandi',       'Interior & Woodworking', 'Bandung',  42, 1, 'Interior',    'images/portfolio/interior-master-suite.jpg', 8),
('kitchen-set-japandi',       'Kitchen Set Japandi',        'Interior & Woodworking', 'Bandung',  18, 1, 'Kitchen Set', 'images/portfolio/kitchen-set-japandi.jpg', 9),
('walk-in-closet',            'Walk-in Closet Woodworking', 'Interior & Woodworking', 'Bandung',  12, 1, 'Woodworking', 'images/portfolio/walk-in-closet.jpg', 10);

INSERT INTO metode_pembayaran (kode, nama, nomor_rekening, atas_nama, jenis) VALUES
('BCA',     'Transfer BCA',     '1234567890',    'a.n. FREESPACE BUILDING', 'transfer'),
('MANDIRI', 'Transfer Mandiri', '1300012345678', 'a.n. FREESPACE BUILDING', 'transfer'),
('QRIS',    'E-walet Qris',     NULL,            NULL,                      'qris');