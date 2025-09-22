import {
  MagnifyingGlassIcon,
  PlusIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const cleanTextForPDF = (text) => {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/<[^>]*>?/gm, '')
    .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ.,-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const exportEntrenadoresToPDF = (table) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm"
    });

    const columns = table.getAllLeafColumns()
      .filter(column => column.getIsVisible())
      .map(column => {
        const header = column.columnDef.header;
        let headerText = '';
        
        if (typeof header === 'string') {
          headerText = cleanTextForPDF(header);
        } else if (header?.props?.children) {
          headerText = cleanTextForPDF(header.props.children);
        } else {
          headerText = cleanTextForPDF(column.id);
        }

        return {
          id: column.id,
          header: headerText,
          accessor: column.accessorKey || column.id,
          accessorFn: column.columnDef.accessorFn
        };
      });

    const cleanData = table.getCoreRowModel().rows.map(row => {
      const cleanRow = {};
      columns.forEach(col => {
        let cellValue = row.original[col.accessor] ?? '';
        
        if (col.accessorFn) {
          cellValue = col.accessorFn(row.original);
        }
        
        if (col.id === 'sexo') {
          cleanRow[col.id] = cellValue === 'M' ? 'Masculino' : 'Femenino';
        } else if (col.id === 'fechaNacimiento') {
          cleanRow[col.id] = new Date(cellValue).toLocaleDateString();
        } else if (col.id === 'disciplinas') {
          cleanRow[col.id] = row.original.disciplinas.map(d => d.nombre).join(', ');
        } else {
          cleanRow[col.id] = cleanTextForPDF(cellValue);
        }
      });
      return cleanRow;
    });

    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: cleanData.map(row => columns.map(col => row[col.id])),
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'center'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        nombreCompleto: { cellWidth: 30 },
        sexo: { cellWidth: 15 },
        fechaNacimiento: { cellWidth: 20 },
        telefono: { cellWidth: 20 },
        disciplinas: { cellWidth: 30 }
      }
    });

    const dateString = new Date().toLocaleDateString();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generado el ${dateString}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10
    );

    doc.save(`Reporte_Entrenadores_${dateString.replace(/\//g, '-')}.pdf`);

  } catch (error) {
    console.error("Error al generar PDF:", error);
    alert("No se pudo generar el PDF. Ver consola para detalles.");
  }
};

export function Toolbar({ table, onPrint, onAddClick }) {
  const { isXs } = useBreakpointsContext();
  // Añadimos un valor por defecto para tableSettings si no existe
  const tableSettings = table.getState().tableSettings || { enableFullScreen: false };
  
  const handlePrint = () => {
    exportEntrenadoresToPDF(table);
    if (onPrint) onPrint();
  };

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          tableSettings.enableFullScreen ? "px-4 sm:px-5" : "px-[--margin-x] pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Lista de Entrenadores
          </h2>
        </div>
        {isXs ? (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              as={Button}
              variant="flat"
              className="size-8 shrink-0 rounded-full p-0"
            >
              <EllipsisHorizontalIcon className="size-4.5" />
            </MenuButton>
            <Transition
              as={MenuItems}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="absolute z-[100] mt-1.5 min-w-[10rem] whitespace-nowrap rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
            >
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={onAddClick}
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Nuevo Entrenador</span>
                  </button>
                )}
              </MenuItem>

              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handlePrint}
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Exportar PDF</span>
                  </button>
                )}
              </MenuItem>
            </Transition>
          </Menu>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              onClick={handlePrint}
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
            >
              <PrinterIcon className="size-4" />
              <span>Exportar PDF</span>
            </Button>

            <Button
              onClick={onAddClick}
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
            >
              <PlusIcon className="size-4" />
              <span>Nuevo Entrenador</span>
            </Button>
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1",
              tableSettings.enableFullScreen ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              tableSettings.enableFullScreen ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
            tableSettings.enableFullScreen ? "px-4 sm:px-5" : "px-[--margin-x]",
          )}
          style={{
            "--margin-scroll": tableSettings.enableFullScreen
              ? "1.25rem"
              : "var(--margin-x)",
          }}
        >
          <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
            <SearchInput table={table} />
            <Filters table={table} />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: "h-8 text-xs ring-primary-500/50 focus:ring",
        root: "shrink-0",
      }}
      placeholder="Buscar entrenadores..."
    />
  );
}

function Filters({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
        >
          Resetear filtros
        </Button>
      )}
    </>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  onPrint: PropTypes.func,
  onAddClick: PropTypes.func.isRequired,
};

SearchInput.propTypes = {
  table: PropTypes.object.isRequired,
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
};