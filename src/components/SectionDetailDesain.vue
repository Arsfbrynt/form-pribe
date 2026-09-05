<script setup lang="ts">
import type { OrderForm } from "../types/order";

defineProps<{ form: OrderForm }>();
</script>

<template>
  <section
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <div
      class="bg-brand-500 text-white font-bold text-sm px-4 py-2.5 flex items-center gap-2"
    >
      <span
        class="bg-white text-brand-500 rounded-md w-5 h-5 flex items-center justify-center text-xs"
        >4</span
      >
      DETAIL DESAIN
    </div>
    <div class="flex">
      <div class="p-4 sm:p-5 space-y-4">
        <label class="block text-xs font-semibold text-gray-600"
          >Posisi Sablon <b>Depan</b></label
        >

        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1"
            >Ukuran</label
          >
          <input
            v-model="form.detailDesain.sizeFront"
            type="text"
            placeholder="mis. 28 x 35 cm"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>
      <div class="p-4 sm:p-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-2"
            >Posisi Sablon <b>Belakang</b></label
          >
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1"
            >Ukuran</label
          >
          <input
            v-model="form.detailDesain.sizeBack"
            type="text"
            placeholder="mis. 28 x 35 cm"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>
    </div>
    <div class="p-4 sm:p-5 space-y-4">
      <label class="block text-xs font-semibold text-gray-600 mb-1"
        >Catatan Order / Instruksi Khusus</label
      >
      <textarea
        v-model="form.detailDesain.catatanDesain"
        rows="5"
        placeholder="Instruksi tambahan untuk desain..."
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
      ></textarea>
    </div>
  </section>
</template>
