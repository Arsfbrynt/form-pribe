import { reactive, computed, watch } from "vue";
import type { OrderForm, RincianUkuranGroup, SizeQtyRow } from "../types/order";
import { SIZE_ROWS } from "../types/order";
import { addDaysFormatted } from "../utils/date";

export const MAX_RINCIAN_GROUPS = 2;
export const MAX_CUSTOM_SIZE_ROWS = 3; // maksimal baris ukuran tambahan per tabel

const ORDER_SEQ_STORAGE_KEY = "pribe-studio-order-seq";
const ORDER_SEQ_PAD = 4; // Budy-0001 s/d Budy-9999
const ORDER_SEQ_MAX = 9999;

/** Ambil kata pertama nama customer, dibersihkan dari tanda baca. Contoh: "Budy Santoso" -> "Budy" */
function extractPrefix(nama: string): string {
  const firstWord = (nama || "").trim().split(/\s+/)[0] || "";
  return firstWord.replace(/[^A-Za-z0-9]/g, "");
}

/** Ambil & naikkan nomor urut order dari localStorage (persist antar sesi/browser). Wrap balik ke 1 setelah 9999. */
function nextOrderSeq(): number {
  if (typeof window === "undefined" || !window.localStorage) return 1;
  const current = Number(
    window.localStorage.getItem(ORDER_SEQ_STORAGE_KEY) || "0",
  );
  const next = current >= ORDER_SEQ_MAX ? 1 : current + 1;
  window.localStorage.setItem(ORDER_SEQ_STORAGE_KEY, String(next));
  return next;
}

function emptySizeRows(): SizeQtyRow[] {
  return SIZE_ROWS.map((size) => ({
    id: size,
    size,
    isCustom: false,
    lenganPendek: 0,
    lenganCustom: 0,
    lenganPanjang: 0,
    anakLenganPendek: 0,
    anakLenganPanjang: 0,
  }));
}

/** Baris ukuran tambahan (custom) — label-nya kosong & bisa diketik bebas oleh user. */
function createCustomSizeRow(): SizeQtyRow {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    size: "",
    isCustom: true,
    lenganPendek: 0,
    lenganCustom: 0,
    lenganPanjang: 0,
    anakLenganPendek: 0,
    anakLenganPanjang: 0,
  };
}

function createRincianGroup(warnaKaos = ""): RincianUkuranGroup {
  return {
    id: `grp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    warnaKaos,
    lenganCustom: "3/4",
    rows: emptySizeRows(),
  };
}

/** Total per kolom untuk satu tabel (satu group) */
export function columnTotalsFor(rows: SizeQtyRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.lenganPendek += Number(row.lenganPendek) || 0;
      acc.lenganCustom += Number(row.lenganCustom) || 0;
      acc.lenganPanjang += Number(row.lenganPanjang) || 0;
      acc.anakLenganPendek += Number(row.anakLenganPendek) || 0;
      acc.anakLenganPanjang += Number(row.anakLenganPanjang) || 0;
      return acc;
    },
    {
      lenganPendek: 0,
      lenganCustom: 0,
      lenganPanjang: 0,
      anakLenganPendek: 0,
      anakLenganPanjang: 0,
    },
  );
}

export function createOrderForm() {
  const form = reactive<OrderForm>({
    noOrder: "",
    tanggalOrder: "",
    customer: {
      namaCustomer: "",
      namaInstansi: "",
      noHp: "",
      alamat: "",
    },
    detailPesanan: {
      modelKaos: "",
      modelKaosLainnya: "",
      jenisBahan: "",
      jenisBahanLainnya: "",
      warnaKaos: "",
      jenisSablon: "",
      jenisSablonLainnya: "",
      keterangan: "",
      jumlahWarnaSablon: null,
    },
    rincianUkuran: [createRincianGroup()],
    detailDesain: {
      posisiDepan: false,
      posisiBelakang: false,
      ukuran: "",
      fileDesain: "",
      catatanDesain: "",
      catatanPesanan: "",
      mockupFile: null,
      mockupFileName: "",
      sizeFront: "",
      sizeBack: "",
    },
    estimasiProduksi: {
      catatanProduksi: "",
    },
    checklist: [
      { key: "desain", label: "Desain Disetujui", icon: "pen", done: false },
      { key: "bahan", label: "Bahan Ready", icon: "shirt", done: false },
      {
        key: "qc",
        label: "Quality Control (QC)",
        icon: "magnifying-glass",
        done: false,
      },
      { key: "packing", label: "Packing", icon: "box-open", done: false },
      {
        key: "selesai",
        label: "Pesanan Selesai",
        icon: "truck-fast",
        done: false,
      },
      {
        key: "diambil",
        label: "Sudah Diambil / Dikirim",
        icon: "clipboard-check",
        done: false,
      },
    ],
  });

  const showJumlahWarnaSablon = computed(
    () => form.detailPesanan.jenisSablon === "Plastisol",
  );

  // ===== Nomor order full otomatis: {Nama}-{urutan} contoh "Budy-0001" =====
  // Nomor urut di-reserve sekali per sesi form (persist di localStorage),
  // lalu digabung otomatis tiap kali nama customer diketik/diubah. User
  // tidak perlu input nomor order manual sama sekali.
  const orderSeq = nextOrderSeq();

  watch(
    () => form.customer.namaCustomer,
    (nama) => {
      const prefix = extractPrefix(nama);
      form.noOrder = prefix
        ? `${prefix}-${String(orderSeq).padStart(ORDER_SEQ_PAD, "0")}`
        : "";
    },
    { immediate: true },
  );

  // Total per baris (semua kolom model dijumlah)
  const rowTotal = (row: SizeQtyRow) =>
    (Number(row.lenganPendek) || 0) +
    (Number(row.lenganCustom) || 0) +
    (Number(row.lenganPanjang) || 0) +
    (Number(row.anakLenganPendek) || 0) +
    (Number(row.anakLenganPanjang) || 0);

  // Grand total across ALL groups/tabel
  const grandTotal = computed(() =>
    form.rincianUkuran.reduce(
      (sum, g) => sum + g.rows.reduce((s, r) => s + rowTotal(r), 0),
      0,
    ),
  );

  function addRincianGroup() {
    if (form.rincianUkuran.length >= MAX_RINCIAN_GROUPS) return;
    form.rincianUkuran.push(createRincianGroup());
  }

  function removeRincianGroup(id: string) {
    if (form.rincianUkuran.length <= 1) return;
    const idx = form.rincianUkuran.findIndex((g) => g.id === id);
    if (idx !== -1) form.rincianUkuran.splice(idx, 1);
  }

  // Baris ukuran custom (tambahan) per tabel, taruh paling bawah (sebelum TOTAL), maks MAX_CUSTOM_SIZE_ROWS
  function addCustomSizeRow(group: RincianUkuranGroup) {
    const customCount = group.rows.filter((r) => r.isCustom).length;
    if (customCount >= MAX_CUSTOM_SIZE_ROWS) return;
    group.rows.push(createCustomSizeRow());
  }

  function removeCustomSizeRow(group: RincianUkuranGroup, rowId: string) {
    const idx = group.rows.findIndex((r) => r.id === rowId);
    if (idx !== -1) group.rows.splice(idx, 1);
  }

  const estimasiSelesai = computed(() =>
    addDaysFormatted(form.tanggalOrder, 7),
  );

  return {
    form,
    showJumlahWarnaSablon,
    rowTotal,
    grandTotal,
    columnTotalsFor,
    addRincianGroup,
    removeRincianGroup,
    addCustomSizeRow,
    removeCustomSizeRow,
    estimasiSelesai,
    MAX_RINCIAN_GROUPS,
    MAX_CUSTOM_SIZE_ROWS,
  };
}

export type OrderFormApi = ReturnType<typeof createOrderForm>;
