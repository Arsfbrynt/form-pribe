<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import type { OrderForm } from "../types/order";

const props = defineProps<{ form: OrderForm }>();

const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

function setFile(file: File) {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = URL.createObjectURL(file);
  props.form.detailDesain.mockupFile = file;
  props.form.detailDesain.mockupFileName = file.name;
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) setFile(file);
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (file) setFile(file);
}

function clearFile() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  props.form.detailDesain.mockupFile = null;
  props.form.detailDesain.mockupFileName = "";
  if (fileInput.value) fileInput.value.value = "";
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});
</script>

<template>
  <section
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col"
  >
    <div
      class="bg-brand-500 text-white font-bold text-sm px-4 py-2.5 flex items-center gap-2"
    >
      <span
        class="bg-white text-brand-500 rounded-md w-5 h-5 flex items-center justify-center text-xs"
      >
        <font-awesome-icon icon="shirt" class="text-brand-500" />
      </span>
      MOCKUP DESAIN
    </div>

    <div class="p-4 sm:p-5 flex-1 flex flex-col gap-3">
      <div
        v-if="!previewUrl"
        class="flex-1 min-h-[220px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors"
        @click="fileInput?.click()"
        @dragover.prevent
        @drop="handleDrop"
      >
        <font-awesome-icon icon="cloud-arrow-up" style="font-size: 28px" />
        <p class="text-sm">Klik atau drag file mockup ke sini</p>
        <p class="text-xs text-gray-300">PNG, JPG, atau JPEG</p>
      </div>

      <div
        v-else
        class="flex-1 min-h-[220px] relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
      >
        <img
          :src="previewUrl"
          alt="Preview Mockup"
          class="w-full max-h-[615px] object-contain"
        />
        <button
          type="button"
          @click="clearFile"
          class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-600 shadow flex items-center justify-center text-xs"
          aria-label="Hapus file"
        >
          ✕
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        class="hidden"
        @change="handleFileChange"
      />

      <p
        v-if="form.detailDesain.mockupFileName"
        class="text-xs text-gray-500 truncate"
      >
        <font-awesome-icon icon="paperclip" class="mr-1" />
        {{ form.detailDesain.mockupFileName }}
      </p>
    </div>
  </section>
</template>
