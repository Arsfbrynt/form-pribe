import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export async function downloadOrderPdf(filename: string) {
  const element = document.getElementById("print-area");
  if (!element) {
    console.error("Print area element (#print-area) not found");
    return;
  }

  // 1. Tangkap elemen HTML menggunakan html2canvas-pro
  const canvas = await html2canvas(element, {
    scale: 4, // Kualitas tinggi / Retina
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    // Mengunci lebar elemen sesuai A4 px
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  // 2. Buat Dokumen PDF A4
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // 3. Masukkan gambar ke PDF
  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  // 4. Download PDF
  pdf.save(filename || "Form-Pesanan.pdf");
}

export function printOrder() {
  window.print();
}
