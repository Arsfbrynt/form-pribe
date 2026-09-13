<script setup lang="ts">
import type { OrderForm } from "../types/order";
import logoUrl from "../assets/logo.png";

defineProps<{ form: OrderForm }>();
</script>

<template>
  <header
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img
          :src="logoUrl"
          alt="PRIBE STUDIO"
          class="w-16 h-16 rounded-full object-cover shadow"
        />
        <div>
          <h1 class="text-xl font-extrabold text-brand-500 leading-tight">
            PRIBE STUDIO
          </h1>
          <p class="text-xs text-gray-500 tracking-wide">ONE STOP CLOTHING</p>
        </div>
      </div>

      <!-- No. Order (otomatis) & Tanggal Order -->
      <!-- <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto"> -->
      <div class="">
        <div v-if="false">
          <label class="block text-xs font-semibold text-gray-600 mb-1"
            >No. Order</label
          >
          <div
            class="w-full sm:w-48 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5"
          >
            <font-awesome-icon icon="hashtag" class="text-brand-500 text-xs" />
            <span>{{ form.noOrder || "Isi nama customer dulu" }}</span>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">
            <font-awesome-icon
              icon="calendar-days"
              class="mr-1 text-brand-500"
            />
            Tanggal Order
          </label>
          <input
            v-model="form.tanggalOrder"
            type="date"
            class="w-full sm:w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>
    </div>
  </header>
</template>
