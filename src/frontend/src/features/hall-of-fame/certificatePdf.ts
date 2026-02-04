import { sanitizeCertificateFilename } from './sanitizeCertificateFilename';

/**
 * Generates a valid PDF certificate with the player's name and issued date.
 * Creates a real PDF binary file and triggers a browser download.
 */
export function generateCertificatePdf(name: string) {
  const issuedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate minimal valid PDF with certificate content
  const pdfContent = generateMinimalPdf(name, issuedDate);
  
  // Create blob with PDF MIME type
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  // Create download link with sanitized filename
  const sanitizedName = sanitizeCertificateFilename(name);
  const filename = `${sanitizedName}_Certificate.pdf`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the blob URL
  URL.revokeObjectURL(url);
}

/**
 * Generates a minimal valid PDF document with certificate content.
 * Uses PDF 1.4 format with basic text rendering.
 */
function generateMinimalPdf(name: string, issuedDate: string): string {
  // Escape special PDF characters in text
  const escapePdfString = (str: string) => {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  };

  const escapedName = escapePdfString(name);
  const escapedDate = escapePdfString(issuedDate);

  // Build PDF content with proper structure
  const content = `
BT
/F1 24 Tf
100 750 Td
(Certificate of Completion) Tj
ET

BT
/F1 14 Tf
100 710 Td
(This certifies that) Tj
ET

BT
/F2 18 Tf
100 680 Td
(${escapedName}) Tj
ET

BT
/F1 12 Tf
100 650 Td
(has successfully completed the journey with Barnabus,) Tj
0 -20 Td
(demonstrating commitment to understanding the art of goal setting) Tj
0 -20 Td
(and personal growth.) Tj
ET

BT
/F1 10 Tf
100 550 Td
(Issued on ${escapedDate}) Tj
ET
`.trim();

  // Calculate content length for PDF structure
  const contentLength = content.length;

  // Build complete PDF with proper cross-reference table
  const pdf = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length ${contentLength}
>>
stream
${content}
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000${(374 + contentLength).toString().padStart(3, '0')} 00000 n 
0000000${(452 + contentLength).toString().padStart(3, '0')} 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
${535 + contentLength}
%%EOF`;

  return pdf;
}
