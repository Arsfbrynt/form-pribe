<script setup lang="ts">
import logoUrl from "../assets/logo-pribe.png";
</script>

<template>
  <footer class="bg-brand-900 text-white rounded-xl overflow-hidden mt-6">
    <div
      class="px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <img
          :src="logoUrl"
          alt="PRIBE STUDIO"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p class="font-extrabold leading-tight">PRIBE STUDIO</p>
          <p class="text-[11px] text-brand-100/80 tracking-wide">
            One Stop Clothing
          </p>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-brand-50"
      >
        <span class="inline-flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-brand-300"></span>
          0812 3456 7890
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-brand-300"></span>
          @pribestudio
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-brand-300"></span>
          PRIBE STUDIO — Sablon &amp; Konveksi
        </span>
      </div>
    </div>
  </footer>
</template>
