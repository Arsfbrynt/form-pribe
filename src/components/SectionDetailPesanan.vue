<script setup lang="ts">
import type { OrderForm } from "../types/order";
import {
  MODEL_KAOS_OPTIONS,
  JENIS_SABLON_OPTIONS,
  TYPE_BAHAN,
} from "../types/order";

const props = defineProps<{ form: OrderForm }>();
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
        >2</span
      >
      DETAIL PESANAN
    </div>
    <div class="p-4 sm:p-5 space-y-4">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1"
          >Model Kaos</label
        >
        <div class="flex gap-2">
          <select
            v-model="form.detailPesanan.modelKaos"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="" disabled>Pilih model kaos</option>
            <option v-for="opt in MODEL_KAOS_OPTIONS" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <input
            v-if="form.detailPesanan.modelKaos === 'Lainnya'"
            v-model="form.detailPesanan.modelKaosLainnya"
            type="text"
            placeholder="Tulis model kaos"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1"
          >Jenis Bahan</label
        >
        <div class="flex gap-2">
          <select
            v-model="form.detailPesanan.jenisBahan"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="" disabled>Pilih jenis bahan</option>
            <option v-for="opt in TYPE_BAHAN" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <input
            v-if="form.detailPesanan.jenisBahan === 'Lainnya'"
            v-model="form.detailPesanan.jenisBahanLainnya"
            type="text"
            placeholder="Tulis jenis bahan"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1"
          >Warna Kaos</label
        >
        <input
          v-model="form.detailPesanan.warnaKaos"
          type="text"
          placeholder="mis. Hitam"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-2"
          >Jenis Sablon</label
        >
        <div class="flex gap-2">
          <select
            v-model="form.detailPesanan.jenisSablon"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="" disabled>Pilih jenis sablon</option>
            <option v-for="opt in JENIS_SABLON_OPTIONS" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <input
            v-if="form.detailPesanan.jenisSablon === 'Lainnya'"
            v-model="form.detailPesanan.jenisSablonLainnya"
            type="text"
            placeholder="Tulis jenis sablon"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>
    </div>
  </section>
</template>
