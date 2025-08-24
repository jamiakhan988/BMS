import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  business: any;
  dateRange: { start: string; end: string };
  summary: any;
  salesData: any[];
  topProducts: any[];
  branchPerformance: any[];
  employeePerformance: any[];
}

export const generatePDFReport = async (data: ReportData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Add watermark
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  pdf.setFontSize(60);
  pdf.setTextColor(200, 200, 200);
  pdf.text('BMS', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
  
  // Reset opacity for main content
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  let yPosition = 20;
  
  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(59, 130, 246); // Blue color
  pdf.text('Business Report', 20, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(75, 85, 99); // Gray color
  pdf.text(data.business?.name || 'Business Name', 20, yPosition);
  
  yPosition += 8;
  pdf.setFontSize(12);
  pdf.text(`Report Period: ${new Date(data.dateRange.start).toLocaleDateString()} - ${new Date(data.dateRange.end).toLocaleDateString()}`, 20, yPosition);
  
  yPosition += 8;
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  
  // Add line separator
  yPosition += 10;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;
  
  // Summary Section
  pdf.setFontSize(18);
  pdf.setTextColor(17, 24, 39);
  pdf.text('Executive Summary', 20, yPosition);
  yPosition += 15;
  
  // Summary cards
  const summaryItems = [
    { label: 'Total Sales', value: `₹${data.summary.totalSales.toLocaleString()}`, color: [16, 185, 129] },
    { label: 'Total Transactions', value: data.summary.totalTransactions.toString(), color: [59, 130, 246] },
    { label: 'Average Order Value', value: `₹${data.summary.averageOrderValue.toFixed(0)}`, color: [147, 51, 234] },
    { label: 'Growth Rate', value: `${data.summary.growth.toFixed(1)}%`, color: data.summary.growth >= 0 ? [16, 185, 129] : [239, 68, 68] }
  ];
  
  summaryItems.forEach((item, index) => {
    const x = 20 + (index % 2) * 90;
    const y = yPosition + Math.floor(index / 2) * 25;
    
    // Card background
    pdf.setFillColor(249, 250, 251);
    pdf.rect(x, y - 5, 85, 20, 'F');
    
    // Card border
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(x, y - 5, 85, 20);
    
    // Label
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(item.label, x + 5, y);
    
    // Value
    pdf.setFontSize(14);
    pdf.setTextColor(item.color[0], item.color[1], item.color[2]);
    pdf.text(item.value, x + 5, y + 8);
  });
  
  yPosition += 60;
  
  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = 20;
  }
  
  // Top Products Section
  pdf.setFontSize(16);
  pdf.setTextColor(17, 24, 39);
  pdf.text('Top Performing Products', 20, yPosition);
  yPosition += 15;
  
  // Table header
  pdf.setFontSize(10);
  pdf.setTextColor(75, 85, 99);
  pdf.text('Product Name', 20, yPosition);
  pdf.text('Quantity Sold', 80, yPosition);
  pdf.text('Revenue', 130, yPosition);
  
  yPosition += 5;
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;
  
  // Table rows
  data.topProducts.slice(0, 10).forEach((product, index) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(9);
    pdf.setTextColor(17, 24, 39);
    
    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(20, yPosition - 3, pageWidth - 40, 8, 'F');
    }
    
    pdf.text(product.name.substring(0, 30), 20, yPosition);
    pdf.text(product.quantity.toString(), 80, yPosition);
    pdf.text(`₹${product.revenue.toLocaleString()}`, 130, yPosition);
    
    yPosition += 8;
  });
  
  yPosition += 15;
  
  // Branch Performance Section
  if (data.branchPerformance.length > 0) {
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Branch Performance', 20, yPosition);
    yPosition += 15;
    
    // Table header
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text('Branch Name', 20, yPosition);
    pdf.text('Sales', 80, yPosition);
    pdf.text('Transactions', 130, yPosition);
    
    yPosition += 5;
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;
    
    // Table rows
    data.branchPerformance.forEach((branch, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(9);
      pdf.setTextColor(17, 24, 39);
      
      // Alternate row background
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(20, yPosition - 3, pageWidth - 40, 8, 'F');
      }
      
      pdf.text(branch.name.substring(0, 25), 20, yPosition);
      pdf.text(`₹${branch.sales.toLocaleString()}`, 80, yPosition);
      pdf.text(branch.transactions.toString(), 130, yPosition);
      
      yPosition += 8;
    });
  }
  
  // Footer on each page
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Generated by Business Management System', 20, pageHeight - 12);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 12);
    
    // Company info
    if (data.business?.email) {
      pdf.text(data.business.email, 20, pageHeight - 6);
    }
    if (data.business?.phone) {
      pdf.text(data.business.phone, pageWidth / 2, pageHeight - 6, { align: 'center' });
    }
  }
  
  // Save the PDF
  const fileName = `business-report-${data.dateRange.start}-to-${data.dateRange.end}.pdf`;
  pdf.save(fileName);
};

export const generateReceiptPDF = async (saleData: any, businessData: any) => {
  const pdf = new jsPDF('p', 'mm', [80, 120]); // Receipt size
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  let yPosition = 10;
  
  // Business header
  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39);
  pdf.text(businessData?.name || 'Business Name', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 6;
  if (businessData?.address) {
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99);
    const addressLines = pdf.splitTextToSize(businessData.address, pageWidth - 10);
    addressLines.forEach((line: string) => {
      pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 4;
    });
  }
  
  if (businessData?.phone) {
    pdf.text(`Tel: ${businessData.phone}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 4;
  }
  
  // Separator
  yPosition += 2;
  pdf.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 6;
  
  // Receipt details
  pdf.setFontSize(10);
  pdf.setTextColor(17, 24, 39);
  pdf.text('RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;
  
  pdf.setFontSize(8);
  pdf.text(`Receipt #: ${saleData.id.slice(-8)}`, 5, yPosition);
  yPosition += 4;
  pdf.text(`Date: ${new Date(saleData.created_at).toLocaleString()}`, 5, yPosition);
  yPosition += 4;
  
  if (saleData.customer_name) {
    pdf.text(`Customer: ${saleData.customer_name}`, 5, yPosition);
    yPosition += 4;
  }
  
  // Separator
  yPosition += 2;
  pdf.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 4;
  
  // Items
  saleData.items.forEach((item: any) => {
    pdf.text(item.product.name, 5, yPosition);
    yPosition += 3;
    pdf.text(`${item.quantity} x ₹${item.product.price}`, 5, yPosition);
    pdf.text(`₹${item.total_price.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
    yPosition += 5;
  });
  
  // Separator
  pdf.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 4;
  
  // Totals
  pdf.text(`Subtotal:`, 5, yPosition);
  pdf.text(`₹${saleData.subtotal.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
  yPosition += 4;
  
  if (saleData.discount_amount > 0) {
    pdf.text(`Discount:`, 5, yPosition);
    pdf.text(`-₹${saleData.discount_amount.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
    yPosition += 4;
  }
  
  pdf.text(`Tax:`, 5, yPosition);
  pdf.text(`₹${saleData.tax_amount.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
  yPosition += 4;
  
  // Total
  pdf.setFontSize(10);
  pdf.text(`TOTAL:`, 5, yPosition);
  pdf.text(`₹${saleData.total_amount.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
  yPosition += 6;
  
  // Payment method
  pdf.setFontSize(8);
  pdf.text(`Payment: ${saleData.payment_method.toUpperCase()}`, 5, yPosition);
  yPosition += 6;
  
  // Footer
  pdf.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
  
  // Save the PDF
  pdf.save(`receipt-${saleData.id.slice(-8)}.pdf`);
};