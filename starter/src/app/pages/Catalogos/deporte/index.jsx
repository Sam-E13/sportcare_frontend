// Import Dependencies
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
// Local Imports
import { Table, Card, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getAllDeportes, updateDeporte, deleteDeporte } from "./api/deporteList.api";
import { DeportePrintView } from "./actions/DeportePrintView";
// Añadir este import 
// ----------------------------------------------------------------------
 
export default function DeportesDatatable() {
  console.log('=== COMPONENTE DEPORTES CARGADO ===');
  console.log('getAllDeportes function:', getAllDeportes);

  const { cardSkin } = useThemeContext();

  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referencia para la impresión
  const printRef = useRef();
  const [deportesToPrint, setDeportesToPrint] = useState([]);
  const [isSelectedOnly, setIsSelectedOnly] = useState(false);

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

  // Función para imprimir todos los deportes
  const printAllDeportes = () => {
    setDeportesToPrint(deportes);
    setIsSelectedOnly(false);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Función para imprimir solo deportes seleccionados
  const printSelectedDeportes = (selectedDeportes) => {
    setDeportesToPrint(selectedDeportes);
    setIsSelectedOnly(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };


  // Cargar datos de la API
  useEffect(() => {
    console.log('=== useEffect DE DEPORTES EJECUTÁNDOSE ===');
    async function loadDeportes() {
      console.log('=== INICIANDO loadDeportes ===');
      try {
        setLoading(true);
        console.log('=== ANTES DE LLAMAR getAllDeportes ===');
        const response = await getAllDeportes();
        console.log('=== RESPUESTA RECIBIDA ===', response);
        console.log('=== DATOS DE LA RESPUESTA ===', response.data);
        setDeportes(response.data);
      } catch (err) {
        console.error('=== ERROR EN loadDeportes ===', err);
        setError("Error al cargar los deportes");
      } finally {
        setLoading(false);
      }
    }
    loadDeportes();
  }, []);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-deportes",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-deportes",
    {}
  );

  const [autoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: deportes,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {

      addRow: async (newDeporte) => {
        try {
          // Forzar recarga completa de datos desde el servidor
          const response = await getAllDeportes();
          setDeportes(response.data);
        } catch (error) {
          console.error("Error al actualizar la tabla:", error);
          // Fallback: agregar el nuevo deporte localmente
          setDeportes(prev => [newDeporte, ...prev]);
        }
      },

      updateRow: async (id, updatedData) => {
        try {
          await updateDeporte(id, updatedData);
          setDeportes(prev => prev.map(item =>
            item.id === id ? { ...item, ...updatedData } : item
          ));
          return true;
        } catch (error) {
          console.error("Error updating deporte:", error);
          return false;
        }
      },

      deleteRow: async (row) => {
        try {
          await deleteDeporte(row.original.id);
          setDeportes((old) => old.filter((oldRow) => oldRow.id !== row.original.id));
        } catch (err) {
          console.error("Error deleting deporte:", err);
          setError("Error al eliminar el deporte");
        }
      },
      deleteRows: async (rows) => {
        try {
          const deletePromises = rows.map(row => deleteDeporte(row.original.id));
          await Promise.all(deletePromises);
          const rowIds = rows.map((row) => row.original.id);
          setDeportes((old) => old.filter((row) => !rowIds.includes(row.id)));
        } catch (err) {
          console.error("Error deleting deportes:", err);
          setError("Error al eliminar los deportes");
        }
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [deportes]);
  useLockScrollbar(tableSettings.enableFullScreen);



  if (loading) {
    return (
      <Page title="Cargando deportes...">
        <div className="flex h-64 items-center justify-center">
          <p>Cargando datos de deportes...</p>
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
    <Page title="Lista de Deportes">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
            "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar table={table} onPrint={printAllDeportes} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-[--margin-x]"
            )}
          > 

            <Card
              ref={printRef}
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden"
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto"
              >
                <Table
                  hoverable
                  dense={tableSettings.enableRowDense}
                  sticky={tableSettings.enableFullScreen}
                  className="w-full text-left rtl:text-right"
                >
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className={clsx(
                              "bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 ltr:first:rounded-tl-lg ltr:last:rounded-tr-lg rtl:first:rounded-tr-lg rtl:last:rounded-tl-lg",
                              header.column.getCanPin() && [
                                header.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                                header.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
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
                        className={clsx(
                          "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                          row.getIsSelected() &&
                          "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            className={clsx(
                              "relative bg-white",
                              cardSkin === "shadow"
                                ? "dark:bg-dark-700"
                                : "dark:bg-dark-900",
                              cell.column.getCanPin() && [
                                cell.column.getIsPinned() === "left" &&
                                "sticky z-2 ltr:left-0 rtl:right-0",
                                cell.column.getIsPinned() === "right" &&
                                "sticky z-2 ltr:right-0 rtl:left-0",
                              ]
                            )}
                          >
                            {cell.column.getIsPinned() && (
                              <div
                                className={clsx(
                                  "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                  cell.column.getIsPinned() === "left"
                                    ? "ltr:border-r rtl:border-l"
                                    : "ltr:border-l rtl:border-r"
                                )}
                              />
                            )}
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
              </div>
              <SelectedRowsActions table={table} onPrint={printSelectedDeportes} />
              {table.getCoreRowModel().rows.length > 0 && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                    "bg-gray-50 dark:bg-dark-800",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4"
                  )}
                >
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>

          </div>
        </div>
      </div>
      {/* Componente oculto para impresión */}
      <div className="hidden">
        <DeportePrintView
          ref={printRef}
          deportes={deportesToPrint}
          isSelectedOnly={isSelectedOnly}
        />
      </div>
    </Page>
  );
}