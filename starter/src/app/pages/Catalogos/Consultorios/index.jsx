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
import { useState, useEffect } from "react";
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
import { getAllConsultorios, createConsultorio, updateConsultorio, deleteConsultorio } from "./api/consultorioList.api";

export default function ConsultoriosDatatable() {
  const { cardSkin } = useThemeContext();
  const [refreshKey, setRefreshKey] = useState(0);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConsultorios = async () => {
      try {
        setLoading(true);
        const data = await getAllConsultorios();
        setConsultorios(data);
        setError(null);
      } catch (err) {
        console.error("Error cargando consultorios:", err);
        setError("Error al cargar los consultorios. Verifica que el servidor esté corriendo y la ruta sea correcta");
      } finally {
        setLoading(false);
      }
    };
    
    loadConsultorios();
  }, [refreshKey]);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-consultorios",
    {}
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-consultorios",
    {}
  );

  const [autoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: consultorios,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      addRow: async (newConsultorio) => {
        try {
          const created = await createConsultorio(newConsultorio);
          setConsultorios(prev => [created, ...prev]);
          return { success: true };
        } catch (error) {
          console.error("Error al crear consultorio:", error);
          return { success: false, error: error.message };
        }
      },
      updateRow: async (id, updatedData) => {
        try {
          // Primero hacemos la llamada al API
          const response = await updateConsultorio(id, updatedData);
          
          // Si la respuesta es exitosa, actualizamos el estado local
          if (response) {
            setConsultorios(prev => prev.map(item => 
              item.id === id ? { ...item, ...response } : item
            ));
            return { success: true };
          }
          return { success: false, error: "No se recibió respuesta del servidor" };
        } catch (error) {
          console.error("Error actualizando consultorio:", error);
          // Forzamos recarga de datos para sincronizar con el servidor
          setRefreshKey(prev => prev + 1);
          return { 
            success: false, 
            error: error.response?.data?.message || error.message || "Error al actualizar el consultorio"
          };
        }
      },
      deleteRow: async (row) => {
        try {
          await deleteConsultorio(row.original.id);
          setConsultorios(prev => prev.filter(item => item.id !== row.original.id));
          return { success: true };
        } catch (err) {
          setRefreshKey(prev => prev + 1);
          console.error("Error eliminando consultorio:", err);
          setError("Error al eliminar el consultorio");
          return { success: false, error: err.message };
        }
      },
      deleteRows: async (rows) => {
        try {
          await Promise.all(rows.map(row => deleteConsultorio(row.original.id)));
          const idsToRemove = rows.map(row => row.original.id);
          setConsultorios(prev => prev.filter(item => !idsToRemove.includes(item.id)));
          return { success: true };
        } catch (err) {
          setRefreshKey(prev => prev + 1);
          console.error("Error eliminando consultorios:", err);
          setError("Error al eliminar los consultorios");
          return { success: false, error: err.message };
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

  useDidUpdate(() => table.resetRowSelection(), [consultorios]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    return (
      <Page title="Cargando consultorios...">
        <div className="flex h-64 items-center justify-center">
          <p>Cargando datos de consultorios...</p>
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
    <Page title="Lista de Consultorios">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900"
          )}
        >
          <Toolbar table={table} />
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
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
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
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={columns.length} className="h-24 text-center">
                          No se encontraron consultorios
                        </Td>
                      </Tr>
                    )}
                  </TBody>
                </Table>
              </div>
              <SelectedRowsActions table={table} />
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
    </Page>
  );
}