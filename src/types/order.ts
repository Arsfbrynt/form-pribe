export const MODEL_KAOS_OPTIONS = [
  "Oblong",
  "Wangki",
  "Jersey",
  "Workshirt",
  "Tunik",
  "Boxy",
  "Oversize",
  "Lainnya",
] as const;
export type ModelKaos = (typeof MODEL_KAOS_OPTIONS)[number];

export const JENIS_SABLON_OPTIONS = [
  "DTF",
  "Jersey (Sublimasi)",
  "Plastisol",
  "Lainnya",
] as const;
export type JenisSablon = (typeof JENIS_SABLON_OPTIONS)[number];

export const FILE_DESAIN_OPTIONS = [
  "Sudah Ada (Customer)",
  "Dibuat oleh PRIBE STUDIO",
] as const;
export type FileDesain = (typeof FILE_DESAIN_OPTIONS)[number];

export const SIZE_ROWS = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "4XL",
  "5XL",
] as const;
export type SizeRow = (typeof SIZE_ROWS)[number];

export const TYPE_BAHAN = [
  "Amerika Drill",
  "Benzema",
  "Cotton Combed 16s",
  "Cotton Combed 20s",
  "Cotton Combed 24s",
  "Cotton Combed 30s",
  "Embos",
  "Milano",
  "Tropical",
  "Lainnya",
] as const;
export type TypeBahan = (typeof TYPE_BAHAN)[number];

/** One "model" column in the size x model qty grid (mirrors the reference sheet). */
export interface SizeQtyRow {
  size: SizeRow;
  lenganPendek: number;
  lenganCustom: number;
  lenganPanjang: number;
  anakLenganPendek: number;
  anakLengan34?: number;
  anakLenganPanjang: number;
}

export interface CustomerData {
  namaCustomer: string;
  namaInstansi: string;
  noHp: string;
  alamat: string;
}
export interface DetailPesananData {
  modelKaos: ModelKaos | "";
  modelKaosLainnya: string;
  jenisBahan: TypeBahan | "";
  jenisBahanLainnya: string;
  warnaKaos: string;
  keterangan: string;
  jenisSablon: JenisSablon | "";
  jenisSablonLainnya: string;
  jumlahWarnaSablon: number | null;
}
export interface DetailDesainData {
  posisiDepan: boolean;
  posisiBelakang: boolean;
  ukuran: string;
  fileDesain: FileDesain | "";
  catatanDesain: string;
  catatanPesanan: string;
  mockupFile: File | null;
  mockupFileName: string;
  sizeFront: SizeSablon | "";
  sizeBack: SizeSablon | "";
}

export interface EstimasiProduksiData {
  catatanProduksi: string;
}

export interface ChecklistItem {
  key: string;
  label: string;
  icon: string; // FontAwesome icon name in kebab-case, e.g. "pen", "magnifying-glass"
  done: boolean;
}

export interface OrderForm {
  noOrder: string;
  lenganCustom: string;
  tanggalOrder: string; // ISO yyyy-mm-dd
  customer: CustomerData;
  detailPesanan: DetailPesananData;
  rincianUkuran: RincianUkuranGroup[];
  detailDesain: DetailDesainData;
  estimasiProduksi: EstimasiProduksiData;
  checklist: ChecklistItem[];
}

export const SIZE_SABLON_OPTIONS = ["LOGO", "MID", "A5", "A4", "A3"] as const;
export type SizeSablon = (typeof SIZE_SABLON_OPTIONS)[number];

export interface RincianUkuranGroup {
  id: string;
  warnaKaos: string;
  lenganCustom: string;
  rows: SizeQtyRow[];
}
