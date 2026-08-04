/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Debt } from '../types';
import { formatDate, getEffectivePaidAmount } from './dateUtils';

export async function exportToExcel(debts: Debt[]) {
  const XLSX = await import('xlsx');
  // Format the data for Excel sheet
  const formattedData = debts.map((debt) => {
    const totalPaid = getEffectivePaidAmount(debt.payments);
    return {
      'Nome do Devedor': debt.name,
      'Valor Original (R$)': debt.originalAmount || 0,
      'Valor Pago (R$)': totalPaid,
      'Valor Restante (R$)': debt.currentAmount || 0,
      'Data de Origem': formatDate(debt.createdAt),
      'Data Limite/Vencimento': debt.dueDate ? formatDate(debt.dueDate) : 'Sem vencimento',
      'Status': debt.status === 'pending' ? 'Pendente' : debt.status === 'partial' ? 'Parcialmente Pago' : 'Pago',
      'Observações': debt.description || ''
    };
  });

  // Calculate totals
  const totalOriginal = debts.reduce((sum, d) => sum + (d.originalAmount || 0), 0);
  const totalRemaining = debts.reduce((sum, d) => sum + (d.currentAmount || 0), 0);
  const totalPaidSum = debts.reduce((sum, d) => sum + getEffectivePaidAmount(d.payments), 0);

  // Add a summary row
  formattedData.push({
    'Nome do Devedor': 'TOTAL GERAL',
    'Valor Original (R$)': totalOriginal,
    'Valor Pago (R$)': totalPaidSum,
    'Valor Restante (R$)': totalRemaining,
    'Data de Origem': '',
    'Data Limite/Vencimento': '',
    'Status': '',
    'Observações': ''
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Set explicit column widths for readability
  const colWidths = [
    { wch: 25 }, // Nome do Devedor
    { wch: 18 }, // Valor Original
    { wch: 15 }, // Valor Pago
    { wch: 18 }, // Valor Restante
    { wch: 15 }, // Data de Origem
    { wch: 22 }, // Data de Vencimento
    { wch: 18 }, // Status
    { wch: 30 }, // Observações
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Controle de Débitos');
  
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `controle_de_debitos_${dateStr}.xlsx`);
}

export interface PdfExportOptions {
  title?: string;
  companyName?: string;
  includePayments?: boolean;
  userName?: string;
  userEmail?: string;
  logoUrl?: string;
}

export function createDefaultLogoDataUrl(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const size = 256;
  const r = 56; // Corner radius for modern squircle badge

  // 1. Vibrant Emerald Background (Official PAGMEFY Emerald Logo)
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#10b981'); // Emerald 500
  grad.addColorStop(0.5, '#059669'); // Emerald 600
  grad.addColorStop(1, '#047857'); // Emerald 700

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle top glare shine
  const shineGrad = ctx.createLinearGradient(0, 0, 0, 120);
  shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = shineGrad;
  ctx.fill();

  // Gentle inner border line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 2. White Double Coins Icon (Lucide Coins style)
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Coin 1 (Top-Left Circle)
  const c1x = 102;
  const c1y = 98;
  const c1r = 44;

  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(c1x, c1y, c1r, 0, Math.PI * 2);
  ctx.stroke();

  // Coin 1 Inner Mark "1"
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(c1x - 3, c1y - 15);
  ctx.lineTo(c1x - 3, c1y + 15);
  ctx.stroke();

  // Coin 2 (Bottom-Right Overlapping Coin)
  const c2x = 154;
  const c2y = 154;
  const c2r = 44;

  ctx.lineWidth = 14;
  ctx.beginPath();
  // Arc for coin 2
  ctx.arc(c2x, c2y, c2r, -Math.PI * 0.45, Math.PI * 0.95);
  ctx.stroke();

  // Coin 2 Inner Mark "1"
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(c2x - 3, c2y - 15);
  ctx.lineTo(c2x - 3, c2y + 15);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

export async function exportToPDF(debts: Debt[], options?: PdfExportOptions) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const titleText = options?.title || 'Relatório Financeiro de Cobranças';
  const companyText = options?.companyName || 'PAGMEFY - Gestão de Débitos';
  const includePayments = options?.includePayments !== false;
  const emitterName = options?.userName || 'Gestor do Sistema';

  // Financial Calculations
  const totalOriginal = debts.reduce((sum, d) => sum + (d.originalAmount || 0), 0);
  const totalRemaining = debts.reduce((sum, d) => sum + (d.currentAmount || 0), 0);
  const totalPaidSum = debts.reduce((sum, d) => sum + getEffectivePaidAmount(d.payments), 0);
  const activeCount = debts.filter(d => d.status !== 'paid').length;
  const paidCount = debts.filter(d => d.status === 'paid').length;
  const recoveryRate = totalOriginal > 0 ? (totalPaidSum / totalOriginal) * 100 : 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const docHash = `DOC-${now.getTime().toString(36).toUpperCase()}`;

  // Helper currency formatter
  const fmtPDF = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // 1. TOP EXECUTIVE HEADER BANNER
  // Header background rectangle (Rich Slate Navy)
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(14, 10, 182, 30, 'F');

  // Emerald top accent strip
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(14, 10, 182, 2.5, 'F');

  // Render High Definition Image Logo in PDF Header
  const logoDataUrl = options?.logoUrl || createDefaultLogoDataUrl();
  let hasImageLogo = false;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', 18, 15, 18, 18);
      hasImageLogo = true;
    } catch (e) {
      console.warn('Could not add image logo, using vector fallback:', e);
    }
  }

  if (!hasImageLogo) {
    // Fallback Vector Badge (Emerald 600)
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(18, 15, 18, 18, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('P$', 27, 26.5, { align: 'center' });
  }

  // Company / App Name
  doc.setFontSize(12.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(companyText.toUpperCase(), 39, 22);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('SISTEMA EXECUTIVO DE GESTÃO E RECUPERAÇÃO DE CRÉDITO', 39, 28);

  // Document Title & Metadata (Right Aligned)
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(167, 243, 208); // Emerald 200
  doc.text(titleText, 192, 21, { align: 'right' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Emissão: ${dateStr} às ${timeStr}`, 192, 27, { align: 'right' });
  doc.text(`Emissor: ${emitterName}`, 192, 33, { align: 'right' });

  // 2. FINANCIAL SUMMARY SECTION
  const summaryStartY = 47;

  // Section Label with vertical accent bar
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(14, summaryStartY - 3.2, 2.5, 4.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text('RESUMO FINANCEIRO CONSOLIDADO', 18, summaryStartY);

  // 4 KPI Metric Cards Grid
  const cardY = summaryStartY + 3;
  const cardW = 43.5;
  const cardH = 21;
  const cardGap = 2.6;

  // CARD 1: Total Lançado (Slate)
  const x1 = 14;
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.roundedRect(x1, cardY, cardW, cardH, 2, 2, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('TOTAL LANÇADO', x1 + 4, cardY + 5);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(fmtPDF(totalOriginal), x1 + 4, cardY + 11.5);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${debts.length} cobrança(s) no total`, x1 + 4, cardY + 16.5);

  // CARD 2: Total Recebido (Emerald)
  const x2 = x1 + cardW + cardGap;
  doc.setDrawColor(220, 252, 231); // Emerald 100
  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.roundedRect(x2, cardY, cardW, cardH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(21, 128, 61); // Emerald 700
  doc.text('TOTAL RECEBIDO', x2 + 4, cardY + 5);

  doc.setFontSize(9.5);
  doc.setTextColor(22, 163, 74); // Emerald 600
  doc.text(fmtPDF(totalPaidSum), x2 + 4, cardY + 11.5);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 163, 74);
  doc.text(`${paidCount} cobrança(s) quitada(s)`, x2 + 4, cardY + 16.5);

  // CARD 3: Saldo em Aberto (Rose)
  const x3 = x2 + cardW + cardGap;
  doc.setDrawColor(254, 226, 226); // Rose 100
  doc.setFillColor(254, 242, 242); // Rose 50
  doc.roundedRect(x3, cardY, cardW, cardH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(185, 28, 28); // Rose 700
  doc.text('SALDO EM ABERTO', x3 + 4, cardY + 5);

  doc.setFontSize(9.5);
  doc.setTextColor(220, 38, 38); // Red 600
  doc.text(fmtPDF(totalRemaining), x3 + 4, cardY + 11.5);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 38, 38);
  doc.text(`${activeCount} pendente(s) ativo(s)`, x3 + 4, cardY + 16.5);

  // CARD 4: Taxa de Recuperação (Violet)
  const x4 = x3 + cardW + cardGap;
  doc.setDrawColor(221, 214, 254); // Violet 200
  doc.setFillColor(245, 243, 255); // Violet 50
  doc.roundedRect(x4, cardY, cardW, cardH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(109, 40, 217); // Violet 700
  doc.text('TAXA RECUPERAÇÃO', x4 + 4, cardY + 5);

  doc.setFontSize(9.5);
  doc.setTextColor(124, 58, 237); // Violet 600
  doc.text(`${recoveryRate.toFixed(1)}%`, x4 + 4, cardY + 11.5);

  // Draw progress bar in Card 4
  const barW = 35;
  const barH = 2;
  const barX = x4 + 4;
  const barY = cardY + 14.5;
  
  doc.setFillColor(233, 213, 255); // Violet 200
  doc.roundedRect(barX, barY, barW, barH, 1, 1, 'F');

  const fillBarW = Math.min(barW, Math.max(0, (barW * recoveryRate) / 100));
  if (fillBarW > 0) {
    doc.setFillColor(124, 58, 237); // Violet 600
    doc.roundedRect(barX, barY, fillBarW, barH, 1, 1, 'F');
  }

  // 3. DETAILED DEBTS TABLE SECTION
  const tableTitleY = cardY + cardH + 8;

  // Section Label with vertical accent bar
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(14, tableTitleY - 3.2, 2.5, 4.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DETALHAMENTO DE DEVEDORES E COBRANÇAS', 18, tableTitleY);

  const tableStartY = tableTitleY + 3;

  // Mapping Debts rows
  const tableRows = debts.map((debt) => {
    const totalPaid = getEffectivePaidAmount(debt.payments);
    const statusText = debt.status === 'pending' ? 'Pendente' : debt.status === 'partial' ? 'Parcial' : 'Quitado';
    return [
      debt.name,
      fmtPDF(debt.originalAmount || 0),
      fmtPDF(totalPaid),
      fmtPDF(debt.currentAmount || 0),
      formatDate(debt.createdAt),
      debt.dueDate ? formatDate(debt.dueDate) : '-',
      statusText,
    ];
  });

  const tableHeaders = [['Devedor', 'Valor Original', 'Valor Pago', 'Saldo Devedor', 'Data Origem', 'Vencimento', 'Status']];

  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: tableStartY,
    theme: 'grid',
    margin: { left: 14, right: 14, bottom: 20 },
    headStyles: {
      fillColor: [30, 41, 59], // Executive Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 3,
      halign: 'left',
    },
    bodyStyles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: [15, 23, 42], // Slate 900
      lineColor: [226, 232, 240], // Slate 200
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate 50
    },
    columnStyles: {
      0: { cellWidth: 46 }, // Name
      1: { halign: 'right', cellWidth: 24 },
      2: { halign: 'right', cellWidth: 22 },
      3: { halign: 'right', cellWidth: 24, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 22 },
      5: { halign: 'center', cellWidth: 22 },
      6: { halign: 'center', cellWidth: 22 },
    },
    didDrawCell: (data) => {
      // Custom render status column with colored badge pill
      if (data.section === 'body' && data.column.index === 6) {
        const rawStatus = data.cell.raw as string;
        const cell = data.cell;

        let bgColor = [254, 226, 226]; // Red 100
        let textColor = [185, 28, 28]; // Red 700
        if (rawStatus === 'Quitado') {
          bgColor = [220, 252, 231]; // Green 100
          textColor = [21, 128, 61]; // Green 700
        } else if (rawStatus === 'Parcial') {
          bgColor = [254, 243, 199]; // Amber 100
          textColor = [180, 83, 9]; // Amber 700
        }

        const badgeW = 18;
        const badgeH = 4.5;
        const badgeX = cell.x + (cell.width - badgeW) / 2;
        const badgeY = cell.y + (cell.height - badgeH) / 2;

        // Cover default cell text with pill background
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'F');

        // Draw centered badge label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(rawStatus, cell.x + cell.width / 2, badgeY + 3.2, { align: 'center' });
      }
    },
    foot: [[
      'TOTAIS CONSOLIDADOS',
      fmtPDF(totalOriginal),
      fmtPDF(totalPaidSum),
      fmtPDF(totalRemaining),
      '',
      '',
      ''
    ]],
    footStyles: {
      fillColor: [241, 245, 249], // Slate 100
      textColor: [15, 23, 42], // Slate 900
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3,
      lineColor: [203, 213, 225],
      lineWidth: 0.1,
    },
  });

  let currentY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : tableStartY + 40;

  // 4. EXTRATO DE RECEBIMENTOS DETALHADO (If requested & exists)
  if (includePayments) {
    const allPayments = debts
      .flatMap(d => (d.payments || []).map(p => ({ ...p, debtorName: d.name })))
      .filter(p => p && p.date && typeof p.amount === 'number')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (allPayments.length > 0) {
      if (currentY > 235) {
        doc.addPage();
        currentY = 20;
      }

      // Section Label with vertical accent bar
      doc.setFillColor(16, 185, 129); // Emerald 500
      doc.rect(14, currentY - 3.2, 2.5, 4.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('EXTRATO DETALHADO DE RECEBIMENTOS E AMORTIZAÇÕES', 18, currentY);

      const pmtHeaders = [['Devedor', 'Data Pagamento', 'Observação / Nota', 'Valor Recebido']];
      const pmtRows = allPayments.map(p => [
        p.debtorName,
        formatDate(p.date),
        p.note || '-',
        fmtPDF(p.amount),
      ]);

      autoTable(doc, {
        head: pmtHeaders,
        body: pmtRows,
        startY: currentY + 3,
        theme: 'grid',
        margin: { left: 14, right: 14, bottom: 20 },
        headStyles: {
          fillColor: [30, 41, 59], // Matching Executive Slate 800
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
          cellPadding: 3,
        },
        bodyStyles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: 2.5,
          textColor: [15, 23, 42],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { halign: 'center', cellWidth: 30 },
          2: { cellWidth: 62 },
          3: { halign: 'right', cellWidth: 40, fontStyle: 'bold', textColor: [22, 163, 74] }, // Emerald green text
        },
        foot: [[
          'TOTAL DE RECEBIMENTOS',
          '',
          `${allPayments.length} lançamento(s)`,
          fmtPDF(totalPaidSum),
        ]],
        footStyles: {
          fillColor: [240, 253, 244], // Emerald 50
          textColor: [21, 128, 61], // Emerald 700
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 3,
          lineColor: [187, 247, 208],
          lineWidth: 0.1,
        },
      });
    }
  }

  // 5. FOOTER ON EVERY PAGE (Page numbers & authenticity stamp)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 282, 196, 282);

    // Left Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`${companyText} • Documento Oficial • Auth ID: ${docHash}`, 14, 287);

    // Right Footer - Page Numbering
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Página ${i} de ${totalPages}`, 192, 287, { align: 'right' });
  }

  // Save the generated PDF with robust fallback
  const filenameDate = now.toISOString().slice(0, 10);
  const fileName = `relatorio_financeiro_${filenameDate}.pdf`;

  try {
    doc.save(fileName);
  } catch (err) {
    console.warn('Standard doc.save failed, triggering blob URL fallback:', err);
    try {
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (fallbackErr) {
      console.error('Blob URL download failed, opening PDF in new tab:', fallbackErr);
      const pdfDataUri = doc.output('datauristring');
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${pdfDataUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  }
}

