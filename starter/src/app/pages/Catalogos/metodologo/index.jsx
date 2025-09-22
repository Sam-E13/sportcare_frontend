// Import Dependencies
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, 
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useThemeContext } from "app/contexts/theme/context";
import { useReactToPrint } from "react-to-print";
import { getAllMetodologos } from "./api/metodologoList.api";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Toolbar } from "./Toolbar";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { MetodologoPrintView } from "./actions/MetodologoPrintView";

export default function MetodologosDatatable() {
  const { cardSkin } = useThemeContext();
  const [metodologos, setMetodologos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  
  // Referencias para impresión - igual que deportes
  const printRef = useRef();
  const [metodologosToPrint, setMetodologosToPrint] = useState([]);
  const [isSelectedOnly, setIsSelectedOnly] = useState(false);

  // Configuración de impresión - igual que deportes
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .print-container { padding: 20px; }
      }
    `,
  });

  // Función para imprimir todos los metodólogos - igual que deportes
  const printAllMetodologos = () => {
    setMetodologosToPrint(metodologos);
    setIsSelectedOnly(false);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Función para imprimir solo metodólogos seleccionados - igual que deportes
  const printSelectedMetodologos = (selectedMetodologos) => {
    setMetodologosToPrint(selectedMetodologos);
    setIsSelectedOnly(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Función para recargar datos desde la API
  const reloadData = async () => {
    try {
      setLoading(true);
      const response = await getAllMetodologos();
      setMetodologos(response.data || response || []);
    } catch (err) {
      console.error("Error recargando metodólogos:", err);
      setError("Error al recargar los metodólogos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de la API
  useEffect(() => {
    reloadData();
  }, []);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Funciones para manejar las acciones de la tabla
  const updateRow = async (id, updatedData) => {
    setMetodologos(prev => 
      prev.map(item => item.id === id ? { ...item, ...updatedData } : item)
    );
  };

  const deleteRow = (row) => {
    setMetodologos(prev => prev.filter(item => item.id !== row.original.id));
  };

  const deleteRows = async (rows) => {
    const idsToDelete = rows.map(row => row.original.id);
    setMetodologos(prev => prev.filter(item => !idsToDelete.includes(item.id)));
    setRowSelection({});
  };

  const addRow = (newMetodologo) => {
    setMetodologos(prev => [newMetodologo, ...prev]);
  };

  const table = useReactTable({
    data: metodologos,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateRow,
      deleteRow,
      deleteRows,
      addRow,
      reloadData,
    },
  });

  if (loading) {
    return (
      <Page title="Cargando metodólogos...">
        <div className="flex h-64 items-center justify-center">
          <p>Cargando datos de metodólogos...</p>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Error">
        <div className="flex h-64 items-center justify-center text-error">
          <p>{error}</p>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Lista de Metodólogos">
      <div className="transition-content w-full pb-5">
        <div className="flex h-full w-full flex-col">
          {/* Pasar la función de impresión al Toolbar - igual que deportes */}
          <Toolbar table={table} onPrint={printAllMetodologos} />
          <div className="flex grow flex-col pt-3 px-[--margin-x]">
            <Card className="relative flex grow flex-col">
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                {metodologos.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    <p>No hay metodólogos para mostrar</p>
                  </div>
                ) : (
                  <Table hoverable className="w-full text-left rtl:text-right">
                    <THead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <Th
                              key={header.id}
                              className={clsx(
                                "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 ltr:first:rounded-tl-lg ltr:last:rounded-tr-lg rtl:first:rounded-tr-lg rtl:last:rounded-tl-lg"
                              )}
                            >
                              {header.column.getCanSort() ? (
                                <div
                                  className="flex cursor-pointer select-none items-center space-x-3 rtl:space-x-reverse"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  <span className="flex-1">
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </span>
                                  <TableSortIcon
                                    sorted={header.column.getIsSorted()}
                                  />
                                </div>
                              ) : header.isPlaceholder ? null : (
                                flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )
                              )}
                            </Th>
                          ))}
                        </Tr>
                      ))}
                    </THead>
                    <TBody>
                      {table.getRowModel().rows.map((row) => (
                        <Tr
                          key={row.id}
                          className="relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <Td
                              key={cell.id}
                              className={clsx(
                                "relative bg-white",
                                cardSkin === "shadow"
                                  ? "dark:bg-dark-700"
                                  : "dark:bg-dark-900"
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Td>
                          ))}
                        </Tr>
                      ))}
                    </TBody>
                  </Table>
                )}
              </div>
              {/* SelectedRowsActions con función de impresión - igual que deportes */}
              <SelectedRowsActions table={table} onPrint={printSelectedMetodologos} />
              {table.getCoreRowModel().rows.length > 0 && (
                <div className="px-4 pb-4 sm:px-5 pt-4">
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Componente oculto para impresión - igual que deportes */}
      <div className="hidden">
        <MetodologoPrintView
          ref={printRef}
          metodologos={metodologosToPrint}
          isSelectedOnly={isSelectedOnly}
        />
      </div>
    </Page>
  );
}