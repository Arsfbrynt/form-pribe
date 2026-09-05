# PRIBE STUDIO — Form Pesanan (SPA)

Aplikasi input & cetak form pesanan PRIBE STUDIO. Vue 3 + TypeScript + Tailwind CSS + FontAwesome.
Data disimpan sementara di memory browser (belum ada backend/database — sesuai scope awal).

## Fitur

- Input data pesanan (Data Customer, Detail Pesanan, Rincian Ukuran, Detail Desain, Estimasi Produksi)
- Total pesanan (per model & grand total) otomatis ke-hitung dari tabel ukuran
- "Jumlah Warna Sablon" hanya muncul kalau Jenis Sablon = Plastisol
- Estimasi Selesai otomatis (read-only) = Tanggal Order + 14 hari
- Checklist Produksi internal — klik ikon buat menandai progres (dicoret)
- Print Preview (layout A4) + Download PDF (pakai html2pdf.js) + tombol Print langsung

## Cara Menjalankan

Butuh Node.js versi 18 ke atas.

```bash
npm install       # install semua dependency
npm run dev       # jalanin di localhost buat development
npm run build     # build production-ready ke folder dist/
npm run preview   # preview hasil build production
```

Setelah `npm run dev`, buka link yang muncul di terminal (biasanya `http://localhost:5173`).

## Struktur Folder

```
src/
  assets/          logo & aset gambar
  components/      semua komponen section (Data Customer, Detail Pesanan, dst)
  composables/     useOrderForm.ts — state form + logic hitungan otomatis
  types/           TypeScript types & daftar opsi (model kaos, jenis sablon, dll)
  utils/           helper tanggal & export PDF
  App.vue          layout utama (grid 2 kolom + section full width)
  style.css        Tailwind + CSS khusus print (A4)
```

## Ganti Logo

Logo ada di `src/assets/logo-pribe.png`. Tinggal timpa file itu dengan logo baru
(disarankan ukuran persegi, minimal 400x400px) kalau mau ganti.

## Custom Warna Brand

Warna utama (merah PRIBE STUDIO) ada di `tailwind.config.js` pada key `brand`.
Tinggal ubah value hex-nya kalau brand color berubah.

## Catatan

- Belum ada backend/database — kalau nanti butuh simpan riwayat pesanan lintas
  perangkat, perlu ditambahkan backend terpisah (di luar scope versi ini).
- PDF di-generate langsung dari tampilan Print Preview via `html2pdf.js`,
  jadi hasil PDF akan selalu match sama apa yang keliatan di preview.
