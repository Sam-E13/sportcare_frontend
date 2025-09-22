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
import { getAllGruposDeportivos, updateGrupoDeportivo, deleteGrupoDeportivo } from "./api/grupoDeportivo.api";
import { GrupoDeportivoPrintView } from "./actions/GrupoDeportivoPrintView";

// ----------------------------------------------------------------------

export default function GruposDeportivosDatatable() {
  const { cardSkin } = useThemeContext();

  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referencia para la impresión
  const printRef = useRef();
  const [gruposToPrint, setGruposToPrint] = useState([]);
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

  // Función para imprimir todos los grupos deportivos
  const printAllGrupos = () => {
    setGruposToPrint(grupos);
    setIsSelectedOnly(false);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Función para imprimir solo grupos seleccionados
  const printSelectedGrupos = (selectedGrupos) => {
    setGruposToPrint(selectedGrupos);
    setIsSelectedOnly(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Cargar datos de la API
  useEffect(() => {
    async function loadGrupos() {
      try {
        const response = await getAllGruposDeportivos();
        setGrupos(response.data);
      } catch (err) {
        console.error("Error cargando grupos deportivos:", err);
        setError("Error al cargar los grupos deportivos");
      } finally {
        setLoading(false);
      }
    }
    loadGrupos();
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
    "column-visibility-grupos-deportivos",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-grupos-deportivos",
    {}
  );

  const [autoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: grupos,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      addRow: async (newGrupo) => {
        try {
          const response = await getAllGruposDeportivos();
          setGrupos(response.data);
        } catch (error) {
          console.error("Error al actualizar la tabla:", error);
          setGrupos(prev => [newGrupo, ...prev]);
        }
      },
      updateRow: async (id, updatedData) => {
        try {
          await updateGrupoDeportivo(id, updatedData);
          setGrupos(prev => prev.map(item =>
            item.id === id ? { ...item, ...updatedData } : item
          ));
          return true;
        } catch (error) {
          console.error("Error updating grupo deportivo:", error);
          return false;
        }
      },
      deleteRow: async (row) => {
        try {
          await deleteGrupoDeportivo(row.original.id);
          setGrupos((old) => old.filter((oldRow) => oldRow.id !== row.original.id));
        } catch (err) {
          console.error("Error deleting grupo deportivo:", err);
          setError("Error al eliminar el grupo deportivo");
        }
      },
      deleteRows: async (rows) => {
        try {
          const deletePromises = rows.map(row => deleteGrupoDeportivo(row.original.id));
          await Promise.all(deletePromises);
          const rowIds = rows.map((row) => row.original.id);
          setGrupos((old) => old.filter((row) => !rowIds.includes(row.id)));
        } catch (err) {
          console.error("Error deleting grupos deportivos:", err);
          setError("Error al eliminar los grupos deportivos");
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

  useDidUpdate(() => table.resetRowSelection(), [grupos]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    return (
      <Page title="Cargando grupos deportivos...">
        <div className="flex h-64 items-center justify-center">
          <p>Cargando datos de grupos deportivos...</p>
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
    <Page title="Lista de Grupos Deportivos">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
            "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar table={table} onPrint={printAllGrupos} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-[--margin-x]"
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden"
              )}
            >
              <div className="table-wrapper min-w-full grow overflow-x-auto">
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
                            style={{
                              width: header.getSize() !== 150 ? header.getSize() : undefined,
                            }}
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
                              "relative bg-white py-3 px-4",
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
              <SelectedRowsActions table={table} onPrint={printSelectedGrupos} />
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
      <div style={{ display: 'none' }}>
        <GrupoDeportivoPrintView
          ref={printRef}
          grupos={gruposToPrint}
          isSelectedOnly={isSelectedOnly}
        />
      </div>
    </Page>
  );
}