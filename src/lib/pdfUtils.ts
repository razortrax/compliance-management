import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const getViolationDescription = (code: string): string => {
  // In a real application, this would fetch from a database or a comprehensive JSON file.
  // For now, we'll return a placeholder.
  return `Description for violation code ${code} not available.`;
};

export const generatePdfFromComponent = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}; 