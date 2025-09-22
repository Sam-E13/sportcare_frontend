import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (title, columns, data) => {
  const doc = new jsPDF();
  
  // Título del documento
  doc.text(title, 14, 16);
  
  // Preparar datos para la tabla
  const tableData = data.map(row => {
    return columns.map(col => {
      // Para columnas personalizadas (como nombre completo)
      if (col.accessorFn) {
        return col.accessorFn(row);
      }
      return row[col.accessor];
    });
  });

  // Encabezados de columnas
  const headers = columns.map(col => col.header);

  // Generar tabla
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 20,
    styles: {
      cellPadding: 2,
      fontSize: 9,
      valign: 'middle',
      halign: 'center'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    }
  });

  // Guardar el PDF
  doc.save(`${title}.pdf`);
};