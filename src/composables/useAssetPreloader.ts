import { ref, computed } from "vue";

export function useAssetPreloader(urls: string[], minDurationMs = 5000) {
  const loadedCount = ref(0);
  const total = urls.length;
  const isDone = ref(false);

  const progress = computed(() =>
    total === 0 ? 100 : Math.round((loadedCount.value / total) * 100),
  );

  function loadImages() {
    if (total === 0) return Promise.resolve();

    const promises = urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedCount.value++;
            resolve();
          };
          img.onerror = () => {
            loadedCount.value++;
            resolve();
          };
          img.src = url;
        }),
    );

    return Promise.all(promises).then(() => {});
  }

  function wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async function preload() {
    await Promise.all([loadImages(), wait(minDurationMs)]);
    isDone.value = true;
  }

  return { progress, loaded: loadedCount, total, isDone, preload };
}
