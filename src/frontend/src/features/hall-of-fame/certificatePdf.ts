import { sanitizeCertificateFilename } from './sanitizeCertificateFilename';
import { TAKEAWAYS } from '../outro/takeawaysContent';

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
 * Generates a multi-page PDF certificate using the provided template PDF,
 * overlaying the player name on page 1 and appending a Key Takeaways page.
 * Creates a real PDF binary file and triggers a browser download.
 */
export async function generateCertificatePdf(name: string) {
  // Load pdf-lib from CDN
  const PDFLib = await loadPdfLib();
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  
  // Load the template PDF
  const templateUrl = '/assets/certificate-of-achievament.pdf';
  const templateBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
  
  // Load the template document
  const pdfDoc = await PDFDocument.load(templateBytes);
  
  // Get the first page (certificate page)
  const pages = pdfDoc.getPages();
  const certificatePage = pages[0];
  const { width, height } = certificatePage.getSize();
  
  // Embed font for the name overlay
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Calculate text dimensions for centering
  const fontSize = 28;
  const textWidth = font.widthOfTextAtSize(name, fontSize);
  
  // Position the name centered horizontally on the page
  // The underscore region is approximately at y=540 based on the original PDF layout
  // Center horizontally across the page width
  const x = (width - textWidth) / 2;
  const y = 540;
  
  // Draw the player name on the certificate page
  certificatePage.drawText(name, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0.85, 0.85, 0.85), // Light gray to match certificate style
  });
  
  // Add Key Takeaways page
  const takeawaysPage = pdfDoc.addPage([612, 792]);
  
  // Draw background
  takeawaysPage.drawRectangle({
    x: 0,
    y: 0,
    width: 612,
    height: 792,
    color: rgb(0.11, 0.12, 0.15), // Dark navy background
  });
  
  // Draw double-line border - outer
  takeawaysPage.drawRectangle({
    x: 40,
    y: 40,
    width: 532,
    height: 712,
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 2,
  });
  
  // Draw double-line border - inner
  takeawaysPage.drawRectangle({
    x: 50,
    y: 50,
    width: 512,
    height: 692,
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 1.5,
  });
  
  // Embed fonts for takeaways page
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Page title
  const titleText = 'Key Takeaways';
  const titleSize = 24;
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);
  takeawaysPage.drawText(titleText, {
    x: (612 - titleWidth) / 2,
    y: 710,
    size: titleSize,
    font: boldFont,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  // Add each takeaway
  let yPosition = 660;
  const lineHeight = 12;
  const titleFontSize = 12;
  const bodyFontSize = 10;
  const leftMargin = 70;
  const maxWidth = 472;
  
  TAKEAWAYS.forEach((takeaway, index) => {
    // Title
    takeawaysPage.drawText(`${index + 1}. ${takeaway.title}`, {
      x: leftMargin,
      y: yPosition,
      size: titleFontSize,
      font: boldFont,
      color: rgb(0.85, 0.85, 0.85),
    });
    yPosition -= lineHeight + 4;
    
    // Body text - wrap manually
    const bodyLines = wrapText(takeaway.body, 80);
    bodyLines.forEach(line => {
      takeawaysPage.drawText(line, {
        x: leftMargin,
        y: yPosition,
        size: bodyFontSize,
        font: regularFont,
        color: rgb(0.75, 0.75, 0.75),
      });
      yPosition -= lineHeight;
    });
    
    // Link if present
    if (takeaway.link) {
      yPosition -= 4;
      takeawaysPage.drawText(takeaway.link.text, {
        x: leftMargin,
        y: yPosition,
        size: bodyFontSize,
        font: regularFont,
        color: rgb(0.65, 0.55, 0.85),
      });
      yPosition -= lineHeight;
      
      takeawaysPage.drawText(takeaway.link.url, {
        x: leftMargin,
        y: yPosition,
        size: bodyFontSize,
        font: regularFont,
        color: rgb(0.65, 0.55, 0.85),
      });
      yPosition -= lineHeight;
    }
    
    yPosition -= 8; // Extra spacing between takeaways
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

/**
 * Simple text wrapping utility that breaks text into lines of approximately maxChars length.
 */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}
