<script setup lang="ts">
import type { OrderForm } from "../types/order";

defineProps<{ form: OrderForm }>();
</script>

<template>
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-brand-500 text-white font-bold text-sm px-4 py-2.5 flex items-center gap-2">
      <span class="bg-white text-brand-500 rounded-md w-5 h-5 flex items-center justify-center text-xs">1</span>
      DATA CUSTOMER
    </div>
    <div class="p-4 sm:p-5 space-y-4">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Customer</label>
        <input
          v-model="form.customer.namaCustomer"
          type="text"
          placeholder="Nama lengkap customer"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">
          Nama Instansi / Komunitas <span class="font-normal text-gray-400">(Opsional)</span>
        </label>
        <input
          v-model="form.customer.namaInstansi"
          type="text"
          placeholder="mis. Karang Taruna RW 05"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">No. HP / WhatsApp</label>
        <input
          v-model="form.customer.noHp"
          type="tel"
          placeholder="08xx xxxx xxxx"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
        <textarea
          v-model="form.customer.alamat"
          rows="3"
          placeholder="Alamat lengkap customer"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        ></textarea>
      </div>
    </div>
  </section>
</template>
