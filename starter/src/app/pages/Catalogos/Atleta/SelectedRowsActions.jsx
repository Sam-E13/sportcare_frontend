import { Transition } from "@headlessui/react";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button, GhostSpinner } from "components/ui";
import { deleteAtleta } from "./api/atletaList.api";

export function SelectedRowsActions({ table }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const selectedRows = table.getSelectedRowModel().rows;

  const handleDeleteRows = async () => {
    if (selectedRows.length > 0) {
      setDeleteLoading(true);
      try {
        // Eliminar cada atleta individualmente
        await Promise.all(
          selectedRows.map(row => deleteAtleta(row.original.id))
        );
        // Actualizar la tabla
        table.options.meta?.deleteRows(selectedRows);
      } catch (error) {
        console.error("Error eliminando atletas:", error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm"
      });
  
      const columns = table.getAllLeafColumns()
        .filter(column => column.getIsVisible())
        .map(column => {
          let headerText = '';
          if (typeof column.columnDef.header === 'string') {
            headerText = column.columnDef.header;
          } else if (column.columnDef.header?.props?.children) {
            headerText = String(column.columnDef.header.props.children);
          } else {
            headerText = column.id;
          }
  
          return {
            id: column.id,
            header: headerText.trim(),
            accessor: column.accessorKey || column.id,
            accessorFn: column.columnDef.accessorFn
          };
        });
  
      const data = (table.getSelectedRowModel().rows?.length > 0
        ? table.getSelectedRowModel().rows.map(row => row.original)
        : table.getCoreRowModel().rows.map(row => row.original)
      );
  
      const tableData = data.map(rowData => {
        return columns.map(col => {
          let value = col.accessorFn 
            ? col.accessorFn(rowData) 
            : rowData[col.accessor];
          
          if (value === undefined || value === null) return '';
          if (typeof value === 'object') return '';
          
          if (col.id === 'sexo') {
            return value === 'M' ? 'Masculino' : 'Femenino';
          }
          
          if (col.id === 'fechaNacimiento') {
            return new Date(value).toLocaleDateString();
          }
          
          if (col.id === 'deportes') {
            return rowData.deportes.map(d => d.nombre).join(', ');
          }
          
          return String(value).trim();
        });
      });
  
      autoTable(doc, {
        head: [columns.map(col => col.header)],
        body: tableData,
        startY: 20,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Nombre Completo
          1: { cellWidth: 15 }, // Sexo
          2: { cellWidth: 20 }, // Fecha Nacimiento
          3: { cellWidth: 25 }, // CURP
          4: { cellWidth: 20 }, // RFC
          5: { cellWidth: 30 }  // Deportes
        }
      });
  
      doc.save(`atletas_${new Date().toISOString().slice(0,10)}.pdf`);
  
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar PDF. Ver consola para detalles.");
    }
  };

  return (
    <Transition
      as={Fragment}
      show={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
      enter="transition-all duration-200"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-4"
    >
      <div className="pointer-events-none sticky inset-x-0 bottom-0 z-5 flex items-center justify-end">
        <div className="w-full max-w-xl px-2 py-4 sm:absolute sm:-translate-y-1/2 sm:px-4">
          <div className="pointer-events-auto flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 font-medium text-gray-100 dark:bg-dark-50 dark:text-dark-900 sm:px-4 sm:py-3">
            <p>
              <span>{selectedRows.length} Seleccionados</span>
              <span className="max-sm:hidden">
                {" "}
                de {table.getCoreRowModel().rows.length}
              </span>
            </p>
            <div className="flex space-x-1.5 rtl:space-x-reverse">
              <Button
                onClick={handleDeleteRows}
                className="w-7 space-x-1.5 rounded-full px-3 py-1.5 text-xs+ sm:w-auto sm:rounded rtl:space-x-reverse"
                color="error"
                disabled={deleteLoading || selectedRows.length <= 0}
              >
                {deleteLoading ? (
                  <div className="flex size-4 items-center justify-center">
                    <GhostSpinner
                      className="size-3.5 shrink-0 border-2"
                      variant="soft"
                    />
                  </div>
                ) : (
                  <TrashIcon className="size-4 shrink-0" />
                )}
                <span className="max-sm:hidden">Eliminar</span>
              </Button>

              <Button
                onClick={handleExportPDF}
                className="w-7 space-x-1.5 rounded-full px-3 py-1.5 text-xs+ sm:w-auto sm:rounded rtl:space-x-reverse"
              >
                <ArrowUpTrayIcon className="size-4 shrink-0" />
                <span className="max-sm:hidden">Exportar PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

SelectedRowsActions.propTypes = {
  table: PropTypes.object,
};