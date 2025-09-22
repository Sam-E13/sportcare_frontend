
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
import {
  getEntrenadorByUserId,
  getProgramasByEntrenador,
  getAllDeportes,
  getAllEntrenadores,
  deletePrograma
} from "./api/ProgramaEntrenamientoApi";
import { useAuthContext } from "app/contexts/auth/context";
import { ProgramaPrintView } from "./actions/ProgramaPrintView";
// ----------------------------------------------------------------------

export default function ProgramasEntrenamientoDatatable() {
  const { cardSkin } = useThemeContext();
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthContext();
  const [entrenador, setEntrenador] = useState(null);
  
  // Referencias para impresión
  const printRef = useRef();
  const [programasParaImprimir, setProgramasParaImprimir] = useState([]);
  const [isSelectedPrint, setIsSelectedPrint] = useState(false);

  useEffect(() => {
    const fetchEntrenadorAndProgramas = async () => {
      if (!isAuthenticated || !user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        // 1. Obtener el perfil del entrenador logueado
        const responseEntrenador = await getEntrenadorByUserId(user.id);
        const entrenadorData = responseEntrenador.data?.[0] || responseEntrenador.data;
        
        if (!entrenadorData || !entrenadorData.id) {
          setEntrenador(null); // No se encontró un perfil de entrenador
          setLoading(false);
          return;
        }

        setEntrenador(entrenadorData);

        // 2. Obtener datos necesarios en paralelo para eficiencia
        const [programasResponse, deportesResponse, entrenadoresResponse] = await Promise.all([
          getProgramasByEntrenador(entrenadorData.id),
          getAllDeportes(),
          getAllEntrenadores()
        ]);

        const programasData = programasResponse.data || [];
        const deportesMap = new Map(deportesResponse.data.map(d => [d.id, d.nombre]));
        const entrenadoresMap = new Map(entrenadoresResponse.data.map(e => [e.id, `${e.nombre} ${e.apPaterno} ${e.apMaterno}`]));

        // 3. Transformar los datos: añadir los nombres de las relaciones
        const programasTransformados = programasData.map(programa => ({
          ...programa,
          deporte_nombre: deportesMap.get(programa.deporte) || 'No especificado',
          entrenador_nombre: entrenadoresMap.get(programa.entrenador) || 'No especificado',
        }));

        setProgramas(programasTransformados);

      } catch (error) {
        console.error("Error al obtener datos para la tabla:", error);
        // Aquí podrías establecer un estado de error para mostrar un mensaje al usuario
      } finally {
        setLoading(false);
      }
    };

    fetchEntrenadorAndProgramas();
  }, [isAuthenticated, user]);

  // Configuración de impresión
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Programas_Entrenamiento_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    onAfterPrint: () => {
      console.log('Impresión completada');
    },
    onPrintError: (errorLocation, error) => {
      console.error('Error en impresión:', errorLocation, error);
    },
  });

  // Función para imprimir programas seleccionados
  const handlePrintSelected = (selectedProgramas) => {
    console.log('handlePrintSelected llamado con:', selectedProgramas);
    if (!selectedProgramas || selectedProgramas.length === 0) {
      console.error('No hay programas seleccionados para imprimir');
      return;
    }
    setProgramasParaImprimir(selectedProgramas);
    setIsSelectedPrint(true);
    setTimeout(() => {
      if (printRef.current) {
        console.log('Iniciando impresión de programas seleccionados');
        handlePrint();
      } else {
        console.error('printRef.current es null');
      }
    }, 200);
  };

  // Función para imprimir todos los programas
  const handlePrintAll = () => {
    console.log('handlePrintAll llamado con programas:', programas);
    if (!programas || programas.length === 0) {
      console.error('No hay programas disponibles para imprimir');
      return;
    }
    setProgramasParaImprimir(programas);
    setIsSelectedPrint(false);
    setTimeout(() => {
      if (printRef.current) {
        console.log('Iniciando impresión de todos los programas');
        handlePrint();
      } else {
        console.error('printRef.current es null');
      }
    }, 200);
  };

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "column-visibility-programas",
    {},
  );
  const [columnPinning, setColumnPinning] = useLocalStorage(
    "column-pinning-programas",
    {},
  );

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: programas,
    columns: columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setProgramas((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return { ...old[rowIndex], [columnId]: value };
            }
            return row;
          }),
        );
      },
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        setProgramas((old) => old.filter((oldRow) => oldRow.id !== row.original.id));
      },
      deleteRows: async (rows) => {
        try {
          skipAutoResetPageIndex();
          const deletePromises = rows.map(row => deletePrograma(row.original.id));
          await Promise.all(deletePromises);
          const rowIds = rows.map((row) => row.original.id);
          setProgramas((old) => old.filter((row) => !rowIds.includes(row.id)));
        } catch (err) {
          console.error("Error deleting programas:", err);
          // Aquí podrías establecer un estado de error para mostrar un mensaje al usuario
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

  useDidUpdate(() => table.resetRowSelection(), [programas]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (loading) {
    return <div className="p-4">Cargando programas de entrenamiento...</div>;
  }

  if (!entrenador) {
    return <div className="p-4">No se encontró un perfil de entrenador asociado a este usuario.</div>;
  }

  return (
    <Page title="Programas de Entrenamiento">
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            "flex h-full w-full flex-col",
            tableSettings.enableFullScreen &&
              "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900",
          )}
        >
          <Toolbar table={table} onPrintAll={handlePrintAll} />
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
                            style={{ width: header.getSize() }}
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
                                style={{ width: cell.column.getSize() }}
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
              <SelectedRowsActions table={table} onPrint={handlePrintSelected} />
              {table.getRowModel().rows.length > 0 && (
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
      
      {/* Componente de impresión oculto */}
      <div style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '210mm',
        minHeight: '297mm'
      }}>
        <ProgramaPrintView
          ref={printRef}
          programas={programasParaImprimir}
          isSelectedOnly={isSelectedPrint}
        />
      </div>
    </Page>
  );
}