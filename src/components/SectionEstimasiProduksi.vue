<script setup lang="ts">
import type { OrderForm } from "../types/order";

defineProps<{ form: OrderForm; estimasiSelesai: string }>();
</script>

<template>
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-brand-500 text-white font-bold text-sm px-4 py-2.5 flex items-center gap-2">
      <span class="bg-white text-brand-500 rounded-md w-5 h-5 flex items-center justify-center text-xs">5</span>
      ESTIMASI PRODUKSI
    </div>
    <div class="p-4 sm:p-5 space-y-4">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">
          <font-awesome-icon icon="calendar-days" class="mr-1 text-brand-500" />
          Estimasi Selesai
          <span class="font-normal text-gray-400">(otomatis, 14 hari setelah tanggal order)</span>
        </label>
        <input
          :value="estimasiSelesai || '— isi tanggal order terlebih dahulu —'"
          type="text"
          readonly
          class="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Catatan Produksi</label>
        <textarea
          v-model="form.estimasiProduksi.catatanProduksi"
          rows="4"
          placeholder="Catatan internal terkait proses produksi..."
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        ></textarea>
      </div>
    </div>
  </section>
</template>
