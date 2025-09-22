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
import { useState, useEffect } from "react";
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
import { getProfesionalByUserId, getConsultasByProfesional } from "./api/ConsultasApi";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

export default function ConsultasDatatable() {
  const { cardSkin } = useThemeContext();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const {isAuthenticated,user} = useAuthContext();
  const [profesional ,setProfesional] = useState(null);

  useEffect(() => {
      const fetchProfesionalAndConsultas = async () => {
        try {
          if (isAuthenticated && user && user.id) {
            const responseProfesional = await getProfesionalByUserId(user.id);
            let profesionalData = null;
  
            if (responseProfesional.data && Array.isArray(responseProfesional.data) && responseProfesional.data.length > 0) {
              profesionalData = responseProfesional.data[0];
            } else if (responseProfesional.data) {
              profesionalData = responseProfesional.data;
            }
  
            setProfesional(profesionalData);
  
            if (profesionalData && profesionalData.id) {
              const responseConsultas = await getConsultasByProfesional(profesionalData.id);
              if (responseConsultas.data) {
                setConsultas(responseConsultas.data);
              }
            }
          }
        } catch (error) {
          console.error("Error al obtener datos:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProfesionalAndConsultas();
    }, [isAuthenticated, user]);

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-consultas",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-consultas",
    {},
  );

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: consultas,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setConsultas((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setConsultas((old) =>
          old.filter((oldRow) => oldRow.id !== row.original.id),
        );
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const rowIds = rows.map((row) => row.original.id);
        setConsultas((old) => old.filter((row) => !rowIds.includes(row.id)));
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: true,
    enableColumnFilters: true,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
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

  useDidUpdate(() => table.resetRowSelection(), [consultas]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    return <div>Cargando consultas...</div>;
  }

  if (!profesional) {
    return <div className="p-4">No se encontró información del profesional.</div>;
  }

  return (
    <Page title="Historial de Consultas">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar table={table} />
          <div
            className={clsx(
              "transition-content flex grow flex-col pt-3",
              tableSettings.enableFullScreen
                ? "overflow-hidden"
                : "px-[--margin-x]",
            )}
          >
            <Card
              className={clsx(
                "relative flex grow flex-col",
                tableSettings.enableFullScreen && "overflow-hidden",
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
                              ],
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
                                        header.getContext(),
                                      )}
                                </span>
                                <TableSortIcon
                                  sorted={header.column.getIsSorted()}
                                />
                              </div>
                            ) : header.isPlaceholder ? null : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            )}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          className={clsx(
                            "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                            row.getIsSelected() &&
                              "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                          )}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
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
                                  ],
                                )}
                              >
                                {cell.column.getIsPinned() && (
                                  <div
                                    className={clsx(
                                      "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                      cell.column.getIsPinned() === "left"
                                        ? "ltr:border-r rtl:border-l"
                                        : "ltr:border-l rtl:border-r",
                                    )}
                                  ></div>
                                )}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </TBody>
                </Table>
              </div>
              <SelectedRowsActions table={table} />
              {table.getCoreRowModel().rows.length && (
                <div
                  className={clsx(
                    "px-4 pb-4 sm:px-5 sm:pt-4",
                    tableSettings.enableFullScreen &&
                      "bg-gray-50 dark:bg-dark-800",
                    !(
                      table.getIsSomeRowsSelected() ||
                      table.getIsAllRowsSelected()
                    ) && "pt-4",
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

