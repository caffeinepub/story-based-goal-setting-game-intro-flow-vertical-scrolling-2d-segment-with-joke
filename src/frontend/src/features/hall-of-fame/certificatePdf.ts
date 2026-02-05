import { sanitizeCertificateFilename } from './sanitizeCertificateFilename';

// Type definitions for pdf-lib loaded from CDN
interface PDFLibModule {
  PDFDocument: any;
  rgb: (r: number, g: number, b: number) => any;
  StandardFonts: {
    Helvetica: string;
    HelveticaBold: string;
  };
}

/**
 * Loads pdf-lib from CDN if not already loaded.
 */
async function loadPdfLib(): Promise<PDFLibModule> {
  // Check if already loaded
  if ((window as any).PDFLib) {
    return (window as any).PDFLib;
  }

  // Load from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.onload = () => {
      if ((window as any).PDFLib) {
        resolve((window as any).PDFLib);
      } else {
        reject(new Error('pdf-lib failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load pdf-lib from CDN'));
    document.head.appendChild(script);
  });
}

/**
 * Loads the certificate template PDF from the app's static assets.
 */
async function loadTemplatePdf(): Promise<ArrayBuffer> {
  const response = await fetch('/assets/certificate-v2.pdf');
  if (!response.ok) {
    throw new Error('Failed to load certificate template');
  }
  return response.arrayBuffer();
}

/**
 * Generates a certificate PDF by loading the template and overlaying the player's name.
 * The name is centered horizontally and positioned closer to the top of page 1.
 */
export async function generateCertificatePdf(name: string) {
  // Load pdf-lib from CDN
  const PDFLib = await loadPdfLib();
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  
  // Load the template PDF from static assets
  const templateBytes = await loadTemplatePdf();
  const pdfDoc = await PDFDocument.load(templateBytes);
  
  // Get the first page of the template
  const pages = pdfDoc.getPages();
  const page = pages[0];
  const { width, height } = page.getSize();
  
  // Embed font for the name
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Calculate text dimensions for centering
  const fontSize = 32;
  const textWidth = font.widthOfTextAtSize(name, fontSize);
  
  // Position the name centered horizontally
  const x = (width - textWidth) / 2;
  
  // Position Y to place the name at 66% from bottom
  const y = height * 0.66;
  
  // Draw the player name on the page in white
  page.drawText(name, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(1, 1, 1), // White text
  });
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  
  // Create blob and trigger download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const sanitizedName = sanitizeCertificateFilename(name);
  const filename = `${sanitizedName}_Certificate.pdf`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
