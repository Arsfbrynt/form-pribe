<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createOrderForm } from "./composables/useOrderForm";
import { useAssetPreloader } from "./composables/useAssetPreloader";
import logoUrl from "./assets/logo-pribe.png";

import AppHeader from "./components/AppHeader.vue";
import SectionDataCustomer from "./components/SectionDataCustomer.vue";
import SectionDetailPesanan from "./components/SectionDetailPesanan.vue";
import SectionRincianUkuran from "./components/SectionRincianUkuran.vue";
import SectionDetailDesain from "./components/SectionDetailDesain.vue";
import AppLoadingScreen from "./components/AppLoadingScreen.vue";
import SectionChecklistProduksi from "./components/SectionChecklistProduksi.vue";
import AppFooter from "./components/AppFooter.vue";
import PrintPreviewModal from "./components/PrintPreviewModal.vue";
import SectionMockupUpload from "./components/SectionMockupUpload.vue";

const { form, columnTotals, rowTotal, grandTotal, estimasiSelesai } =
  createOrderForm();
const { progress, isDone, preload } = useAssetPreloader([logoUrl], 1500);
const previewOpen = ref(false);
onMounted(() => {
  preload();
});
</script>

<template>
  <AppLoadingScreen v-if="!isDone" :progress="progress" />

  <div
    v-show="isDone"
    class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-10 relative"
  >
    <div class="max-w-5xl mx-auto">
      <AppHeader :form="form" />

      <main class="space-y-6">
        <!-- Section 1 & 2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionDataCustomer :form="form" />
          <SectionDetailPesanan :form="form" />
        </div>

        <!-- Section 3 (full width) -->
        <SectionRincianUkuran
          :form="form"
          :rows="form.rincianUkuran"
          :column-totals="columnTotals"
          :grand-total="grandTotal"
          :row-total="rowTotal"
        />

        <!-- Section 4 & 5 -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div class="md:col-span-6">
            <SectionMockupUpload :form="form" />
          </div>
          <div class="md:col-span-6 flex flex-col gap-6">
            <SectionDetailDesain :form="form" />
            <!-- <SectionEstimasiProduksi
              :form="form"
              :estimasi-selesai="estimasiSelesai"
            /> -->
          </div>
        </div>

        <!-- Section 6 (full width) -->
        <SectionChecklistProduksi :checklist="form.checklist" />
      </main>

      <AppFooter />
    </div>

    <PrintPreviewModal
      :open="previewOpen"
      :form="form"
      :column-totals="columnTotals"
      :grand-total="grandTotal"
      :row-total="rowTotal"
      :rows="form.rincianUkuran"
      :estimasi-selesai="estimasiSelesai"
      @close="previewOpen = false"
    />
  </div>

  <!-- Action bar -->
  <div class="sticky bottom-3 absolute flex justify-end mr-6">
    <button
      @click="previewOpen = true"
      class="rounded-full w-12 !h-12 bg-brand-500 flex items-center justify-center hover:bg-brand-600 text-white font-bold px-6 shadow-lg transition-colors"
    >
      <font-awesome-icon icon="print" />
    </button>
  </div>
</template>
