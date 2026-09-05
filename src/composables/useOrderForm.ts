import { reactive, computed } from "vue";
import type { OrderForm, SizeQtyRow } from "../types/order";
import { SIZE_ROWS } from "../types/order";
import { addDaysFormatted } from "../utils/date";

function emptySizeRows(): SizeQtyRow[] {
  return SIZE_ROWS.map((size) => ({
    size,
    lenganPendek: 0,
    lenganCustom: 0,
    lenganPanjang: 0,
    anakLenganPendek: 0,
    // anakLengan34: 0,
    anakLenganPanjang: 0,
  }));
}

export function createOrderForm() {
  const form = reactive<OrderForm>({
    lenganCustom: "3/4",
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
      jumlahWarnaSablon: null,
    },
    rincianUkuran: emptySizeRows(),
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

  // Show "Jumlah Warna Sablon" only when Jenis Sablon = Plastisol
  const showJumlahWarnaSablon = computed(
    () => form.detailPesanan.jenisSablon === "Plastisol",
  );

  // Column totals for the size x model grid
  const columnTotals = computed(() => {
    return form.rincianUkuran.reduce(
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
  });

  // Per-row total (across all model columns) — handy to show a "Jumlah" column
  const rowTotal = (row: SizeQtyRow) =>
    (Number(row.lenganPendek) || 0) +
    (Number(row.lenganCustom) || 0) +
    (Number(row.lenganPanjang) || 0) +
    (Number(row.anakLenganPendek) || 0) +
    (Number(row.anakLengan34) || 0) +
    (Number(row.anakLenganPanjang) || 0);

  // Grand total pesanan (all sizes, all models)
  const grandTotal = computed(() => {
    const t = columnTotals.value;
    return (
      t.lenganPendek +
      t.lenganCustom +
      t.lenganPanjang +
      t.anakLenganPendek +
      t.anakLenganPanjang
    );
  });

  // Estimasi selesai: auto, read-only = tanggal order + 14 hari
  const estimasiSelesai = computed(() =>
    addDaysFormatted(form.tanggalOrder, 7),
  );

  return {
    form,
    showJumlahWarnaSablon,
    columnTotals,
    rowTotal,
    grandTotal,
    estimasiSelesai,
  };
}

export type OrderFormApi = ReturnType<typeof createOrderForm>;
