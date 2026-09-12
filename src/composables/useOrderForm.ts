import { reactive, computed } from "vue";
import type { OrderForm, RincianUkuranGroup, SizeQtyRow } from "../types/order";
import { SIZE_ROWS } from "../types/order";
import { addDaysFormatted } from "../utils/date";

export const MAX_RINCIAN_GROUPS = 2;

/** Ambil huruf awal dari kata pertama nama customer, dibersihkan dari tanda baca. Contoh: "M. Andy" -> "M", "Budi" -> "BUDI" */
function extractPrefix(nama: string): string {
  const firstWord = (nama || "").trim().split(/\s+/)[0] || "";
  const letters = firstWord.replace(/[^A-Za-z]/g, "");
  return letters;
}

function emptySizeRows(): SizeQtyRow[] {
  return SIZE_ROWS.map((size) => ({
    size,
    lenganPendek: 0,
    lenganCustom: 0,
    lenganPanjang: 0,
    anakLenganPendek: 0,
    anakLenganPanjang: 0,
  }));
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

  // ===== Nomor order tampil: {AwalanNama}-{noOrder yang diketik user} =====
  // form.noOrder tetap raw input angka/teks yang diketik user (mis. "201920").
  // noOrderDisplay dipakai untuk ditampilkan/di-print, hasilnya "Budi-201920".
  const noOrderDisplay = computed(() => {
    const prefix = extractPrefix(form.customer.namaCustomer);
    if (!form.noOrder) return prefix || "—";
    return prefix ? `${prefix}-${form.noOrder}` : form.noOrder;
  });

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
    estimasiSelesai,
    MAX_RINCIAN_GROUPS,
    noOrderDisplay,
  };
}

export type OrderFormApi = ReturnType<typeof createOrderForm>;
