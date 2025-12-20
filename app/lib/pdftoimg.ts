export interface pdfPageResult{
    imageUrl: string;
    file: File;
    pageNumber: number;
}

export interface PdfConversionResult {
    pages: pdfPageResult[];
    error?: string;
}

let pdfjsLib: any = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;

    // Standard way to load worker in modern build tools (Vite/Webpack)
    const lib = await import("pdfjs-dist/legacy/build/pdf");
    const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
    lib.GlobalWorkerOptions.workerSrc = workerSrc;
    
    pdfjsLib = lib;
    return lib;
}

export async function pdfToImages(
  file: File,
  scale = 2.5 // balanced quality
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

    const pages: pdfPageResult[] = [];
    const dpr = window.devicePixelRatio || 1;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const viewport = page.getViewport({
        scale: scale * dpr,
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) throw new Error("Canvas context not available");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      // Convert to WEBP (small + high quality)
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.85)
      );

      if (blob) {
        const baseName = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File(
          [blob],
          `${baseName}-page-${pageNumber}.webp`,
          { type: "image/webp" }
        );

        pages.push({
          imageUrl: URL.createObjectURL(blob),
          file: imageFile,
          pageNumber,
        });
      }

      // MEMORY CLEANUP (VERY IMPORTANT)
      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
    }

    return { pages };
  } catch (err) {
    return {
      pages: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}