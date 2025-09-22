// Import Dependencies
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PrinterIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid"; // Importar useState
import PropTypes from "prop-types";

import { useState } from "react";
import { CreateHorarioModal } from "./actions/CreateHorarioModal";

// Local Imports
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { FacedtedFilterNumber } from "components/shared/table/FacedtedFilterNumber";
// ----------------------------------------------------------------------

export function Toolbar({ table, onPrint}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = (newDeporte) => {
    // Actualiza la tabla con el nuevo deporte
    table.options.meta?.addRow(newDeporte);
  };

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x] pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Lista de Horarios
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
              {
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Nuevo Horario</span>
                    </button>
                  )}
                </MenuItem>
              }

              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={onPrint} // Aquí usamos onPrint
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Imprimir</span>
                  </button>
                )}
              </MenuItem>

              
            </Transition>
            <CreateHorarioModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={handleCreateSuccess}
            />
          </Menu>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              onClick={onPrint} // Aquí usamos onPrint
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
            >
              <PrinterIcon className="size-4" />
              <span>Imprimir</span>
            </Button>

            <Menu
              as="div"
              className="relative inline-block whitespace-nowrap text-left"
            >
              
              <Transition
                as={MenuItems}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
              >
                
              </Transition>
            </Menu>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
            >
              <PlusIcon className="size-4" />
              <span>Nuevo Horario</span>
            </Button>
            {/* Agrega el modal de creación */}
            <CreateHorarioModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={handleCreateSuccess}
            />
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled
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

// En el SearchInput component
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
      placeholder="Buscar por profesional o consultorio"
    />
  );
}

function Filters({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const diasSemana = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" },
  ];

  // Obtener los valores actuales de los filtros
  const horaInicioFilter = table.getColumn("hora_inicio")?.getFilterValue() || "";

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">

      {/* Filtro por día de la semana */}
      {table.getColumn("dia") && (
        <FacedtedFilterNumber
          options={diasSemana}
          column={table.getColumn("dia")}
          title="Dias de la semana"
          Icon={CalendarDaysIcon}
        />
      )}

      {/* Filtro por hora de inicio - Versión corregida */}
      <Input
        type="time"
        value={horaInicioFilter}
        onChange={(e) => {
          const value = e.target.value;
          const column = table.getColumn("hora_inicio");

          if (!column) return;

          if (!value) {
            column.setFilterValue(undefined);
          } else {
            column.setFilterValue(value);

            // Asegurar que se esté usando un filtro exacto para la hora
            if (!column.columnDef.filterFn) {
              column.columnDef.filterFn = (row, columnId, filterValue) => {
                // Comparar solo la parte de la hora (sin segundos)
                const rowTime = String(row.getValue(columnId)).substring(0, 5);
                return rowTime === filterValue;
              };
            }
          }
        }}
        placeholder="Hora inicio"
        className="h-8 w-[120px] text-xs"
      />

      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
Toolbar.propTypes = {
  table: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};

Filters.propTypes = {
  table: PropTypes.object,
};