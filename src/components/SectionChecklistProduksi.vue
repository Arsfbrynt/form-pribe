<script setup lang="ts">
import type { ChecklistItem } from "../types/order";

defineProps<{ checklist: ChecklistItem[] }>();
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
        >6</span
      >
      CHECKLIST PRODUKSI (INTERNAL)
    </div>

    <div class="p-4 sm:p-6">
      <p class="text-xs text-gray-400 italic mb-4">
        Klik ikon setiap tahap untuk menandai progres pesanan sudah sampai di
        mana.
      </p>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        <button
          v-for="item in checklist"
          :key="item.key"
          type="button"
          class="flex flex-col items-center gap-2 rounded-xl border p-3 sm:p-4 transition-colors"
          :class="[
            item.done
              ? 'checklist-done border-brand-300 bg-brand-50'
              : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50/40',
          ]"
        >
          <span
            class="checklist-icon-wrap w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg"
            :class="
              item.done
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-brand-500'
            "
          >
            <font-awesome-icon :icon="item.icon" />
          </span>
          <span
            class="text-[11px] sm:text-xs font-semibold text-center leading-tight"
            :class="item.done ? 'text-brand-700' : 'text-gray-600'"
          >
            {{ item.label }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
