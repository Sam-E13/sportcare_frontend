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
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

// Componentes UI
import { Table, Card, THead, TBody, Th, Tr, Td, Button } from "components/ui";
import { Page } from "components/shared/Page";
import { useLockScrollbar, useDidUpdate, useLocalStorage } from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { AddResponsableModal } from "./AddResponsableModal";

// API
import { fetchAtletaData, deleteResponsable } from "./api/responsable.api";

export default function ResponsableDatatable() {
  const { cardSkin } = useThemeContext();
  const { atletaId } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [responsables, setResponsables] = useState([]);
  const [atletaInfo, setAtletaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddSuccess = (newResponsable) => {
    setResponsables(prev => [...prev, newResponsable]);
  };

  const [tableSettings, setTableSettings] = useState({
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility] = useLocalStorage("column-visibility-responsable", {});
  const [columnPinning] = useLocalStorage("column-pinning-responsable", {});

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { atletaInfo, responsables } = await fetchAtletaData(atletaId);
      setAtletaInfo(atletaInfo);
      setResponsables(responsables);
      
    } catch (err) {
      console.error("Error en fetchData:", err);
      
      if (err.response?.status === 401) {
        setError("No autorizado - Por favor inicie sesión");
      } else {
        setError(err.response?.data?.message || "Error al cargar los datos");
      }
    } finally {
      setLoading(false);
    }
  }, [atletaId]);

  useEffect(() => {
    if (atletaId) {
      fetchData();
    } else {
      setError("ID de atleta no especificado en la URL");
      setLoading(false);
    }
  }, [atletaId, fetchData]);

  const handleDeleteResponsable = async (responsableId) => {
    try {
      await deleteResponsable(responsableId);
      // Recargar datos después de eliminar
      await fetchData();
    } catch (error) {
      // El error ya se muestra en deleteResponsable
      console.error("Error en handleDeleteResponsable:", error);
    }
  };

  const table = useReactTable({
    data: responsables,
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
        setResponsables((old) =>
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
        handleDeleteResponsable(row.original.id);
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        const rowIds = rows.map((row) => row.original.id);
        setResponsables((old) => old.filter((row) => !rowIds.includes(row.id)));
      },
      setTableSettings,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [responsables]);
  useLockScrollbar(tableSettings.enableFullScreen);

  if (!atletaId) {
    return (
      <Page title="Error">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-error dark:text-error-light">
            No se especificó el ID del atleta en la URL
          </p>
        </div>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page title="Cargando...">
        <div className="flex justify-center items-center h-64 flex-col">
          <p>Cargando información...</p>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Error">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-error dark:text-error-light">{error}</p>
          <Button onClick={fetchData}>Reintentar</Button>
        </div>
      </Page>
    );
  }

  return (    
    <Page title={`Responsables - ${atletaInfo?.nombre || 'Atleta'}`}>
      <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
        <div className={clsx("flex h-full w-full flex-col", tableSettings.enableFullScreen && "fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900")}>
        <Toolbar 
          table={table} 
          atletaInfo={atletaInfo} 
          onAddResponsable={() => setIsAddModalOpen(true)} 
        />
          
          <div className={clsx("transition-content flex grow flex-col pt-3", tableSettings.enableFullScreen ? "overflow-hidden" : "px-[--margin-x]")}>
            <Card className={clsx("relative flex grow flex-col", tableSettings.enableFullScreen && "overflow-hidden")}>
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table hoverable dense={tableSettings.enableRowDense} sticky={tableSettings.enableFullScreen} className="w-full text-left rtl:text-right">
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th key={header.id} className={clsx("bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100", header.column.getCanPin() && [
                              header.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                              header.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                            ])}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Th>
                        ))}
                      </Tr>
                    ))}
                  </THead>
                  <TBody>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <Tr key={row.id} className={clsx("relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500", row.getIsSelected() && "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500")}>
                          {row.getVisibleCells().map((cell) => (
                            <Td key={cell.id} className={clsx("relative bg-white", cardSkin === "shadow" ? "dark:bg-dark-700" : "dark:bg-dark-900", cell.column.getCanPin() && [
                                cell.column.getIsPinned() === "left" && "sticky z-2 ltr:left-0 rtl:right-0",
                                cell.column.getIsPinned() === "right" && "sticky z-2 ltr:right-0 rtl:left-0",
                              ])}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                          ))}
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={columns.length} className="text-center py-8">
                          No se encontraron responsables para este atleta
                        </Td>
                      </Tr>
                    )}
                  </TBody>
                </Table>
              </div>
              
              <SelectedRowsActions table={table} />
              
              {table.getCoreRowModel().rows.length > 0 && (
                <div className={clsx("px-4 pb-4 sm:px-5 sm:pt-4", tableSettings.enableFullScreen && "bg-gray-50 dark:bg-dark-800", !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && "pt-4")}>
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <AddResponsableModal
        atletaId={atletaId}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </Page>
  );
}