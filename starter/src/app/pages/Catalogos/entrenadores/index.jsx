import {
  flexRender,
  getCoreRowModel,
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
import { Toolbar } from "./Toolbar";
import { columns } from "./columns";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { SelectedRowsActions } from "./SelectedRowsActions";
import { useThemeContext } from "app/contexts/theme/context";
import { getAllEntrenadores, deleteEntrenador } from "./api/entrenadorList.api";
import { CreateEntrenadorModal } from "./CreateEntrenadorModal";
import { UpdateEntrenadorModal } from "./UpdateEntrenadorModal";

export default function EntrenadoresDatatable() {
  const { cardSkin } = useThemeContext();
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEntrenador, setSelectedEntrenador] = useState(null);

  useEffect(() => {
    async function loadEntrenadores() {
      try {
        const response = await getAllEntrenadores();
        setEntrenadores(response.data);
      } catch (err) {
        console.error("Error cargando entrenadores:", err);
        setError("Error al cargar los entrenadores");
      } finally {
        setLoading(false);
      }
    }
    loadEntrenadores();
  }, []);

  const handleEntrenadorCreated = (newEntrenador) => {
    setEntrenadores(prev => [...prev, newEntrenador]);
  };

  const handleEditEntrenador = (entrenador) => {
    setSelectedEntrenador(entrenador);
    setIsUpdateModalOpen(true);
  };

  const handleEntrenadorUpdated = (updatedEntrenador) => {
    setEntrenadores(prev =>
      prev.map(e => e.id === updatedEntrenador.id ? updatedEntrenador : e)
    );
  };

  const handleDeleteEntrenador = async (id) => {
    try {
      await deleteEntrenador(id);
      setEntrenadores(prev => prev.filter(entrenador => entrenador.id !== id));
      return true;
    } catch (err) {
      console.error("Error eliminando entrenador:", err);
      throw err;
    }
  };

  const tableColumns = columns.map(col => {
    if (col.id === 'actions') {
      return {
        ...col,
        cell: (props) => col.cell({ 
          ...props, 
          onEdit: handleEditEntrenador,
          onDelete: handleDeleteEntrenador
        })
      };
    }
    return col;
  });

  const table = useReactTable({
    data: entrenadores,
    columns: tableColumns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <Page title="Cargando entrenadores...">
        <div className="flex h-64 items-center justify-center">
          <p>Cargando datos de entrenadores...</p>
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
    <Page title="Lista de Entrenadores">
      <div className="transition-content w-full pb-5">
        <div className="flex h-full w-full flex-col">
          <Toolbar 
            table={table}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            onAddClick={() => setIsCreateModalOpen(true)}
          />
          <div className="transition-content flex grow flex-col pt-3 px-[--margin-x]">
            <Card className="relative flex grow flex-col">
              <div className="table-wrapper min-w-full grow overflow-x-auto">
                <Table className="w-full text-left rtl:text-right">
                  <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <Th
                            key={header.id}
                            className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 ltr:first:rounded-tl-lg ltr:last:rounded-tr-lg rtl:first:rounded-tr-lg rtl:last:rounded-tl-lg"
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
                              cardSkin === "shadow" ? "dark:bg-dark-700" : "dark:bg-dark-900"
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
              </div>
              <SelectedRowsActions table={table} />
              {table.getCoreRowModel().rows.length > 0 && (
                <div className="px-4 pb-4 sm:px-5 sm:pt-4 pt-4">
                  <PaginationSection table={table} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <CreateEntrenadorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleEntrenadorCreated}
      />

      <UpdateEntrenadorModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        entrenador={selectedEntrenador}
        onUpdate={handleEntrenadorUpdated}
      />
    </Page>
  );
}