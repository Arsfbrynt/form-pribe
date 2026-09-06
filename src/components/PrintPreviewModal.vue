<script setup lang="ts">
import type { OrderForm, SizeQtyRow } from "../types/order";
import logoUrl from "../assets/logo-pribe.png";
import { formatDateID } from "../utils/date";
import { onBeforeUnmount, ref, watch } from "vue";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const props = defineProps<{
  open: boolean;
  form: OrderForm;
  rows: SizeQtyRow[];
  columnTotals: {
    lenganPendek: number;
    lenganCustom: number;
    lenganPanjang: number;
    anakLenganPendek: number;
    anakLenganPanjang: number;
  };
  grandTotal: number;
  rowTotal: (row: SizeQtyRow) => number;
  estimasiSelesai: string;
}>();

const mockupPreviewUrl = ref<string | null>(null);

const emit = defineEmits<{ (e: "close"): void }>();

const cols: {
  key: keyof Omit<SizeQtyRow, "size">;
  label: string;
  group: "utama" | "anak";
}[] = [
  { key: "lenganPendek", label: "Lengan Pendek", group: "utama" },
  { key: "lenganCustom", label: "Lengan Custom", group: "utama" },
  { key: "lenganPanjang", label: "Lengan Panjang", group: "utama" },
  { key: "anakLenganPendek", label: "Lengan Pendek", group: "anak" },
  { key: "anakLenganPanjang", label: "Lengan Panjang", group: "anak" },
];

function displayValue(v: string | number | null | undefined, fallback = "—") {
  if (v === null || v === undefined || v === "") return fallback;
  return v;
}

async function captureAsImage(): Promise<string | null> {
  const element = document.getElementById("print-area");
  if (!element) return null;

  await document.fonts.ready;
  element.classList.add("pdf-export-mode");

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      windowWidth: 794,
    });
    return canvas.toDataURL("image/jpeg", 1.0);
  } finally {
    element.classList.remove("pdf-export-mode");
  }
}

async function handleDownload() {
  const imgData = await captureAsImage();
  if (!imgData) return;

  const filename = `Form-Pesanan-${props.form.noOrder || "PRIBE-STUDIO"}.pdf`;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // ambil dimensi asli gambar buat hitung rasio
  const img = new Image();
  img.src = imgData;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const imgWidth = 210;
  const imgHeight = (img.height * imgWidth) / img.width;

  pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}

watch(
  () => props.form.detailDesain.mockupFile,
  (file) => {
    if (mockupPreviewUrl.value) {
      URL.revokeObjectURL(mockupPreviewUrl.value);
      mockupPreviewUrl.value = null;
    }
    if (file) {
      mockupPreviewUrl.value = URL.createObjectURL(file);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (mockupPreviewUrl.value) {
    URL.revokeObjectURL(mockupPreviewUrl.value);
  }
});

function resolveValue(
  selected: string | null | undefined,
  customValue: string | null | undefined,
  fallback = "—",
) {
  if (selected === "Lainnya") return displayValue(customValue, fallback);
  return displayValue(selected, fallback);
}

function isCustomValue(selected: string | null | undefined) {
  return selected === "Lainnya";
}

async function handlePrint() {
  const imgData = await captureAsImage();
  if (!imgData) return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(`
    <html>
      <head>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; }
          img { width: 210mm; display: block; }
        </style>
      </head>
      <body>
        <img src="${imgData}" />
      </body>
    </html>
  `);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // bersihin iframe abis print dialog ditutup (delay dikit biar print dialog sempat kebuka)
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
}
</script>

<template>
  <div v-if="open" class="modal-backdrop">
    <div class="modal-card">
      <!-- Toolbar -->
      <div class="toolbar no-print">
        <h2 class="toolbar-title">Print Preview — Form Pesanan</h2>
        <div class="toolbar-actions">
          <button @click="handlePrint" class="btn btn-secondary">
            <font-awesome-icon icon="print" />
            Print
          </button>
          <button @click="handleDownload" class="btn btn-primary">
            <font-awesome-icon icon="file-pdf" />
            Download PDF
          </button>
          <button @click="emit('close')" class="btn-close" aria-label="Tutup">
            ✕
          </button>
        </div>
      </div>

      <!-- Preview Wrapper -->
      <div class="preview-wrapper">
        <div id="print-area" class="print-paper">
          <div class="page-boundary-line no-print"></div>
          <div>
            <!-- Header -->
            <div class="header-section">
              <div class="brand-box">
                <img :src="logoUrl" alt="PRIBE STUDIO" class="brand-logo" />
                <div>
                  <p class="brand-name">PRIBE STUDIO</p>
                  <p class="brand-tagline">ONE STOP CLOTHING</p>
                </div>
              </div>
              <div class="order-meta">
                <p class="meta-label">No. Order</p>
                <p class="meta-val mb-1">{{ displayValue(form.noOrder) }}</p>
                <div class="flex gap-2 justify-end">
                  <div class="p-1.5 border rounded-lg">
                    <p class="meta-label">Tanggal Order</p>
                    <p class="meta-val">
                      {{ formatDateID(form.tanggalOrder) }}
                    </p>
                  </div>
                  <div class="p-1.5 border rounded-lg bg-red-50">
                    <p class="meta-label !text-brand-500 font-bold">Deadline</p>
                    <p class="meta-val">
                      {{ estimasiSelesai || "____ / ____ / ______" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 1 & 2 -->
            <div class="grid-2-col mb-4">
              <div>
                <div class="section-banner"><span>1</span>DATA CUSTOMER</div>
                <table class="info-table">
                  <tbody>
                    <tr>
                      <td class="lbl label-w-28">Nama Customer</td>
                      <td class="val">
                        : {{ displayValue(form.customer.namaCustomer) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="lbl">Instansi</td>
                      <td class="val">
                        : {{ displayValue(form.customer.namaInstansi, "-") }}
                      </td>
                    </tr>
                    <tr>
                      <td class="lbl">No. HP/WA</td>
                      <td class="val">
                        : {{ displayValue(form.customer.noHp) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="lbl">Alamat</td>
                      <td class="val">
                        : {{ displayValue(form.customer.alamat) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <div class="section-banner"><span>2</span>DETAIL PESANAN</div>
                <table class="info-table">
                  <tbody>
                    <tr>
                      <td class="lbl label-w-28">Model Kaos</td>
                      <td
                        class="val"
                        :class="{
                          'val-custom': isCustomValue(
                            form.detailPesanan.modelKaos,
                          ),
                        }"
                      >
                        :
                        {{
                          resolveValue(
                            form.detailPesanan.modelKaos,
                            form.detailPesanan.modelKaosLainnya,
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td class="lbl">Jenis Bahan</td>
                      <td
                        class="val"
                        :class="{
                          'val-custom': isCustomValue(
                            form.detailPesanan.jenisBahan,
                          ),
                        }"
                      >
                        :
                        {{
                          resolveValue(
                            form.detailPesanan.jenisBahan,
                            form.detailPesanan.jenisBahanLainnya,
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td class="lbl">Warna Kaos</td>
                      <td class="val">
                        :
                        {{ form.detailPesanan.warnaKaos }}
                      </td>
                    </tr>
                    <tr>
                      <td class="lbl">Jenis Sablon</td>
                      <td
                        class="val"
                        :class="{
                          'val-custom': isCustomValue(
                            form.detailPesanan.jenisSablon,
                          ),
                        }"
                      >
                        :
                        {{
                          resolveValue(
                            form.detailPesanan.jenisSablon,
                            form.detailPesanan.jenisSablonLainnya,
                          )
                        }}
                      </td>
                    </tr>
                    <tr v-if="form.detailPesanan.jenisSablon === 'Plastisol'">
                      <td class="lbl">Jumlah Warna</td>
                      <td class="val">
                        :
                        {{
                          displayValue(
                            form.detailPesanan.jumlahWarnaSablon,
                            "0",
                          )
                        }}
                        Warna
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Section 3 -->
            <div class="mb-4">
              <div class="section-banner">
                <span>3</span> RINCIAN UKURAN &amp; JUMLAH
              </div>
              <div class="size-table-wrapper">
                <table class="size-input-table !w-full !min-w-[500px]">
                  <thead>
                    <tr>
                      <th rowspan="2" class="th-main text-xs !p-0">Ukuran</th>
                      <th colspan="3" class="th-main !p-0.5 text-center">
                        Dewasa
                      </th>
                      <th colspan="2" class="th-sub-anak !p-0.5 text-center">
                        Anak-anak
                      </th>
                      <th rowspan="2" class="th-main text-xs">Jumlah</th>
                    </tr>
                    <tr>
                      <th
                        v-for="c in cols"
                        :key="c.key"
                        class="th-sub"
                        :class="c.group === 'anak' ? 'is-anak' : 'is-utama'"
                      >
                        {{
                          c.key == "lenganCustom"
                            ? "Lengan " + form.lenganCustom
                            : c.label
                        }}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="row in form.rincianUkuran"
                      :key="row.size"
                      class="table-row"
                    >
                      <td class="td-cell font-semibold">{{ row.size }}</td>
                      <td
                        v-for="c in cols"
                        :key="c.key"
                        class="td-cell"
                        :class="(row as any)[c.key] && 'font-bold'"
                      >
                        {{ (row as any)[c.key] || "-" }}
                      </td>
                      <td class="td-cell font-semibold">
                        {{ rowTotal(row) || "-" }}
                      </td>
                    </tr>
                  </tbody>

                  <tfoot class="tfoot">
                    <tr>
                      <td class="th-cell">TOTAL</td>
                      <td class="th-cell">
                        {{ columnTotals.lenganPendek }}
                      </td>
                      <td class="th-cell">
                        {{ columnTotals.lenganCustom }}
                      </td>
                      <td class="th-cell">
                        {{ columnTotals.lenganPanjang }}
                      </td>
                      <td class="th-cell">
                        {{ columnTotals.anakLenganPendek }}
                      </td>
                      <td class="th-cell">
                        {{ columnTotals.anakLenganPanjang }}
                      </td>
                      <td
                        class="tfoot-grand-total !bg-brand-500 !text-white !font-bold"
                      >
                        {{ grandTotal }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Section 4 & 5 -->
            <div class="section-4-5-grid mb-4 min-h-[240px]">
              <div class="mockup-panel">
                <div class="section-banner">
                  <span class="!p-2">
                    <font-awesome-icon icon="shirt" class="text-brand-500" />
                  </span>
                  PREVIEW MOCKUP
                </div>
                <div class="mockup-box">
                  <img
                    v-if="mockupPreviewUrl"
                    :src="mockupPreviewUrl"
                    alt="Preview Mockup Desain"
                    class="mockup-img"
                  />
                  <div v-else class="mockup-empty">Belum ada file mockup</div>
                </div>
              </div>

              <div class="section-4-5-stack">
                <div>
                  <div class="section-banner"><span>4</span> DETAIL DESAIN</div>
                  <table class="info-table">
                    <tbody>
                      <tr>
                        <td class="lbl">Ukuran Sablon <b>(Depan)</b></td>
                        <td class="val">
                          : {{ displayValue(form.detailDesain.sizeFront) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="lbl">Ukuran Sablon <b>(Belakang)</b></td>
                        <td class="val">
                          : {{ displayValue(form.detailDesain.sizeBack) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="text-xs text-gray-500">Catatan:</div>
                  <p
                    style="white-space: pre-wrap"
                    class="text-xs text-justify text-gray-700"
                  >
                    {{ displayValue(form.detailDesain.catatanDesain, "-") }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Section 6 -->
            <div class="mb-4">
              <div class="section-banner">
                <span>5</span>CHECKLIST PRODUKSI (INTERNAL)
              </div>

              <div class="checklist-grid">
                <div
                  v-for="item in form.checklist"
                  :key="item.key"
                  class="checklist-item"
                >
                  <div
                    class="checklist-icon"
                    :class="item.done ? 'is-done' : 'is-pending'"
                  >
                    <font-awesome-icon :icon="item.icon" />
                    <div v-if="item.done" class="strike-line"></div>
                  </div>
                  <span class="checklist-label">{{ item.label }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer-banner">
              <span class="footer-title flex items-center gap-2">
                <img
                  :src="logoUrl"
                  alt="PRIBE STUDIO"
                  class="w-6 h-6 rounded-full object-cover"
                />PRIBE STUDIO
              </span>
              <span>
                <font-awesome-icon icon="phone" /> +62 823-2140-7440 &nbsp;|
                <font-awesome-icon icon="globe" /> pribestudio.com &nbsp;|&nbsp;
                ONE STOP CLOTHING
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-boundary-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 1123px; /* 297mm dikonversi ke px: 297 * 3.7795 ≈ 1123px, sama kayak lebar 794px = 210mm */
  border-top: 2px dashed #ef4444;
  pointer-events: none;
  z-index: 20;

  &::after {
    content: "Batas 1 Halaman A4";
    position: absolute;
    top: -9px;
    right: 8px;
    background: #ef4444;
    color: white;
    font-size: 9px;
    font-weight: bold;
    padding: 1px 6px;
    border-radius: 3px;
  }
}

/* Layout Container */
.modal-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4;
}

.modal-card {
  @apply bg-gray-200 rounded-xl shadow-2xl w-full max-w-[880px] max-h-[92vh] flex flex-col overflow-hidden;
}

.toolbar {
  @apply flex items-center justify-between gap-3 px-6 py-3 bg-white border-b border-gray-200 shrink-0;

  &-title {
    @apply font-bold text-gray-800 text-sm sm:text-base;
  }

  &-actions {
    @apply flex items-center gap-2;
  }
}

.btn {
  @apply inline-flex items-center gap-2 rounded-lg text-xs sm:text-sm font-semibold px-3 py-2 transition-colors;

  &-primary {
    @apply bg-brand-500 hover:bg-brand-600 text-white;
  }
  &-secondary {
    @apply bg-gray-100 hover:bg-gray-200 text-gray-700;
  }
}

.btn-close {
  @apply inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors;
}

.preview-wrapper {
  @apply p-6 overflow-auto flex-1 flex justify-center items-start w-full;
}

/* Kunci font-family & letter-spacing di .print-paper */
.print-paper {
  @apply bg-white shadow-md rounded-sm shrink-0;
  width: 794px;
  min-height: 1120px;
  padding: 32px 40px;
  box-sizing: border-box;
  position: relative;

  /* Tambahkan ini untuk cegah teks dempet horizontal */
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: normal !important;
  word-spacing: normal !important;
}

/* Header */
.header-section {
  @apply flex items-center justify-between border-b-2 border-brand-500 pb-3 mb-4;
}

.brand-box {
  @apply flex items-center gap-3;
}

.brand-logo {
  width: 65px;
  height: 65px;
  border-radius: 9999px;
  object-fit: cover;
}

.brand-name {
  @apply font-extrabold text-brand-500 leading-tight;
  font-size: 18px;
}

.brand-tagline {
  @apply text-gray-500;
  font-size: 9.5px;
  letter-spacing: 0.05em;
}

.order-meta {
  @apply text-right;
  font-size: 11px;

  .meta-label {
    @apply text-gray-500 text-[10px];
  }
  .meta-val {
    @apply font-bold text-gray-800 text-[11px] !tracking-widest;
  }
}

/* Grids & Sections */
.grid-2-col {
  @apply grid grid-cols-2 gap-6;
}
.section-banner {
  @apply bg-brand-500 flex  text-white rounded-sm font-bold text-sm px-4 py-1 flex items-center gap-2;
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.02em; /* Tambahkan sedikit ruang antar huruf */
  white-space: nowrap; /* Mencegah teks banner numpuk */
  span {
    @apply bg-white text-brand-500 rounded-sm w-3 h-3 flex items-center justify-center text-[10px];
  }
}

/* Tables */
.info-table {
  @apply w-full border-separate;
  border-spacing: 0 3px;

  .lbl {
    @apply text-gray-500 align-top py-0.5 pr-2;
    font-size: 12px;
    white-space: nowrap;
    width: 110px; /* Set lebar pasti untuk kolom kiri */
  }

  .val {
    @apply py-0.5 text-gray-800 align-top;
    font-size: 12px;
    line-height: 1.35;
    &.val-custom {
      @apply text-purple-700 font-semibold;
    }
  }
}

.size-table-wrapper {
  @apply overflow-hidden rounded border border-gray-200;
}

.size-table {
  @apply w-full border-collapse;
  font-size: 11px;
}

.th-cell {
  @apply bg-gray-100 border-b border-gray-200  !text-[12px]  px-2 py-1.5 text-center align-middle font-semibold text-gray-700;
}

.td-cell {
  @apply border-b border-gray-100 px-2 py-1.5 !text-[12px] text-center align-middle text-gray-700;
}

.table-row {
  &:nth-child(even) {
    @apply bg-brand-50;
  }
  .td-cell {
    @apply text-gray-700 border-gray-200 border-b border !py-0;
  }
}

.tfoot-row {
  @apply font-bold bg-gray-50;
}

/* Section 4 & 5 Mockup */
.section-4-5-grid {
  @apply grid gap-6;
  grid-template-columns: 1fr 1fr;
}

.mockup-panel {
  @apply flex flex-col h-full;
}

.mockup-box {
  @apply flex-1 w-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded p-2;
  min-height: 180px;
}

.mockup-img {
  @apply max-h-[370px] w-auto object-contain;
}

.mockup-empty {
  @apply text-gray-400 text-xs  flex items-center justify-center;
}

.section-4-5-stack {
  @apply flex flex-col gap-3;
}

/* Checklist Section */
.checklist-grid {
  @apply grid grid-cols-6 gap-2 mt-2;
}

.checklist-item {
  @apply flex flex-col items-center text-center relative;
}

.checklist-icon {
  @apply w-9 h-9 rounded-full flex items-center justify-center relative;
  font-size: 14px;

  &.is-done {
    @apply bg-brand-500 text-white;
  }

  &.is-pending {
    @apply bg-gray-100 text-brand-500;
  }
}

.strike-line {
  position: absolute;
  left: -2px;
  right: -2px;
  top: 50%;
  height: 2px;
  background: #b70112;
  transform: rotate(-10deg);
}

.checklist-label {
  @apply mt-1 font-medium text-gray-600;
  font-size: 9px;
  line-height: 1.2;
}

/* Footer */
.footer-banner {
  @apply mt-2 bg-brand-900 text-white rounded-sm px-4 py-2 flex items-center justify-between;
  font-size: 9.5px;

  .footer-title {
    @apply font-extrabold text-xs;
  }
}

#print-area.pdf-export-mode .page-boundary-line {
  display: none !important;
}

.tfoot {
  td {
    @apply border border-gray-200 !py-1;
  }
}
.th-sub {
  @apply py-0;
}
</style>
