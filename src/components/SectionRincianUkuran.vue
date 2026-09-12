<script setup lang="ts">
import type { OrderForm, RincianUkuranGroup, SizeQtyRow } from "../types/order";

const props = defineProps<{
  form: OrderForm;
  rowTotal: (row: SizeQtyRow) => number;
  columnTotalsFor: (rows: SizeQtyRow[]) => Record<string, number>;
  addGroup: () => void;
  removeGroup: (id: string) => void;
  maxGroups: number;
}>();

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

function groupTotal(group: RincianUkuranGroup) {
  return group.rows.reduce((sum, row) => sum + props.rowTotal(row), 0);
}

function grandTotalAll() {
  return props.form.rincianUkuran.reduce((sum, g) => sum + groupTotal(g), 0);
}
</script>

<template>
  <section class="card-wrapper">
    <!-- Header Section -->
    <div class="card-header">
      <span class="badge-number">3</span>
      RINCIAN UKURAN &amp; JUMLAH
    </div>

    <div class="card-body space-y-5">
      <div
        v-for="(group, gIdx) in form.rincianUkuran"
        :key="group.id"
        class="group-block"
      >
        <div class="group-toolbar">
          <div class="group-toolbar-left">
            <span class="group-badge">Tabel {{ gIdx + 1 }}</span>
            <label class="group-warna-label">
              Warna Kaos
              <input
                v-model="group.warnaKaos"
                type="text"
                placeholder="mis. Merah Maroon"
                class="group-warna-input"
              />
            </label>
          </div>
          <button
            v-if="form.rincianUkuran.length > 1"
            type="button"
            class="btn-remove-group"
            @click="removeGroup(group.id)"
          >
            <font-awesome-icon icon="trash" /> Hapus Tabel
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="size-input-table">
            <thead>
              <tr>
                <th rowspan="2" class="th-main">Ukuran (Size)</th>
                <th colspan="3" class="th-main text-center">Dewasa</th>
                <th colspan="2" class="th-sub-anak text-center">Anak-anak</th>
                <th rowspan="2" class="th-main">Jumlah</th>
              </tr>
              <tr>
                <th
                  v-for="c in cols"
                  :key="c.key"
                  class="th-sub"
                  :class="c.group === 'anak' ? 'is-anak' : 'is-utama'"
                >
                  <select
                    v-if="c.key == 'lenganCustom'"
                    v-model="group.lenganCustom"
                    class="input-qty text-[12px] bg-[#fbd4d4] !border-[#fbd4d4]"
                  >
                    <option value="3/4">Lengan 3/4</option>
                    <option value="7/8">Lengan 7/8</option>
                  </select>
                  <div v-else>
                    {{ c.label }}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in group.rows" :key="row.size" class="table-row">
                <td class="td-size-label">
                  <div>
                    {{ row.size }}
                  </div>
                </td>
                <td v-for="c in cols" :key="c.key" class="td-input-cell">
                  <input
                    v-model.number="(row as any)[c.key]"
                    type="number"
                    min="0"
                    class="input-qty"
                  />
                </td>
                <td class="td-row-total">
                  {{ rowTotal(row) }}
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td class="tfoot-cell">TOTAL</td>
                <td class="tfoot-cell">
                  {{ columnTotalsFor(group.rows).lenganPendek }}
                </td>
                <td class="tfoot-cell">
                  {{ columnTotalsFor(group.rows).lenganCustom }}
                </td>
                <td class="tfoot-cell">
                  {{ columnTotalsFor(group.rows).lenganPanjang }}
                </td>
                <td class="tfoot-cell">
                  {{ columnTotalsFor(group.rows).anakLenganPendek }}
                </td>
                <td class="tfoot-cell">
                  {{ columnTotalsFor(group.rows).anakLenganPanjang }}
                </td>
                <td class="tfoot-grand-total">
                  {{ groupTotal(group) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <button
        v-if="form.rincianUkuran.length < maxGroups"
        type="button"
        class="btn-add-group"
        @click="addGroup"
      >
        <font-awesome-icon icon="plus" /> Tambah Tabel (Warna Kaos Beda)
      </button>

      <!-- Footer Action / Summary -->
      <div class="table-summary-footer">
        <p class="summary-note">
          *Pastikan ukuran dan jumlah sudah sesuai sebelum proses produksi.
        </p>
        <div class="summary-badge">
          TOTAL PESANAN: {{ grandTotalAll() }} PCS
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
/* Card Base */
.card-wrapper {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
}

.card-header {
  @apply bg-brand-500 text-white font-bold text-sm px-4 py-2.5 flex items-center gap-2;

  .badge-number {
    @apply bg-white text-brand-500 rounded-md w-5 h-5 flex items-center justify-center text-xs;
  }
}

.card-body {
  @apply p-4 sm:p-5;
}

/* Per-table group wrapper */
.group-block {
  @apply border border-gray-200 rounded-lg p-3;

  &:not(:last-of-type) {
    @apply mb-1;
  }
}

.group-toolbar {
  @apply flex items-center justify-between flex-wrap gap-2 mb-2;
}

.group-toolbar-left {
  @apply flex items-center gap-3 flex-wrap;
}

.group-badge {
  @apply bg-brand-100 text-brand-800 font-bold text-xs px-2.5 py-1 rounded-md;
}

.group-warna-label {
  @apply flex items-center gap-2 text-xs font-medium text-gray-600;
}

.group-warna-input {
  @apply border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-500;
}

.btn-remove-group {
  @apply inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md px-2.5 py-1.5 transition-colors;
}

.btn-add-group {
  @apply w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-dashed border-brand-300 rounded-lg px-3 py-2 transition-colors;
}

/* Table Base */
.size-input-table {
  @apply w-full border-collapse text-sm min-w-[720px];
}

/* Table Header Styles */
.th-main {
  @apply bg-brand-100 text-brand-800 px-3 py-2 border border-brand-900 align-middle;
}

.th-sub-anak {
  @apply bg-brand-100 text-brand-800 px-3 py-2 border border-brand-900;
}

.th-sub {
  @apply px-2 py-1.5 border text-center font-medium text-xs border-brand-900 text-brand-800 align-middle;

  &.is-utama {
    @apply bg-brand-100;
  }

  &.is-anak {
    @apply bg-brand-100;
  }
}

/* Summary Box Below Table */
.table-summary-footer {
  @apply mt-3 flex items-center justify-between flex-wrap gap-2;
}

.summary-note {
  @apply text-xs text-gray-400 italic;
}

.summary-badge {
  @apply bg-brand-500 text-white rounded-lg px-4 py-2 text-sm font-bold;
}
</style>
