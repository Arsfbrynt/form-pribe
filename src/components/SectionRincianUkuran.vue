<script setup lang="ts">
import type { OrderForm, SizeQtyRow } from "../types/order";

const props = defineProps<{
  form: OrderForm;
  rows: SizeQtyRow[];
  columnTotals: {
    lenganPendek: number;
    lenganCustom: number;
    lenganPanjang: number;
    anakLenganPendek: number;
    // anakLengan34: number;
    anakLenganPanjang: number;
  };
  grandTotal: number;
  rowTotal: (row: SizeQtyRow) => number;
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
</script>

<template>
  <section class="card-wrapper">
    <!-- Header Section -->
    <div class="card-header">
      <span class="badge-number">3</span>
      RINCIAN UKURAN &amp; JUMLAH
    </div>

    <div class="card-body">
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
                  v-model="form.lenganCustom"
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
            <tr v-for="row in rows" :key="row.size" class="table-row">
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
              <td class="tfoot-cell">{{ columnTotals.lenganPendek }}</td>
              <td class="tfoot-cell">{{ columnTotals.lenganCustom }}</td>
              <td class="tfoot-cell">{{ columnTotals.lenganPanjang }}</td>
              <td class="tfoot-cell">{{ columnTotals.anakLenganPendek }}</td>
              <td class="tfoot-cell">{{ columnTotals.anakLenganPanjang }}</td>
              <td class="tfoot-grand-total">
                {{ grandTotal }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer Action / Summary -->
      <div class="table-summary-footer">
        <p class="summary-note">
          *Pastikan ukuran dan jumlah sudah sesuai sebelum proses produksi.
        </p>
        <div class="summary-badge">TOTAL PESANAN: {{ grandTotal }} PCS</div>
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
