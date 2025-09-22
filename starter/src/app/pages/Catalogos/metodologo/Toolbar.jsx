// Import Dependencies
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
import { useState } from "react";
import { CreateMetodologoModal } from "./actions/CreateMetodologoModal";

// Local Imports
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// ----------------------------------------------------------------------

export function Toolbar({ table, onPrint }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings?.enableFullScreen || false;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = (newMetodologo) => {
    // Actualiza la tabla con el nuevo metodólogo
    table.options.meta?.addRow(newMetodologo);
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
            Lista de Metodólogos
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
                    onClick={() => setIsCreateModalOpen(true)}
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Nuevo Metodólogo</span>
                  </button>
                )}
              </MenuItem>

              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={onPrint}
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus && "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Imprimir</span>
                  </button>
                )}
              </MenuItem>
            </Transition>
            
            <CreateMetodologoModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onCreate={handleCreateSuccess}
            />
          </Menu>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              onClick={onPrint}
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
              <span>Nuevo Metodólogo</span>
            </Button>
            
            {/* Modal de creación */}
            <CreateMetodologoModal
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

// Componente SearchInput
function SearchInput({ table }) {
  return (
    <div className="relative flex max-w-xs flex-1">
      <Input
        type="text"
        placeholder="Buscar metodólogos..."
        value={table.getState().globalFilter ?? ''}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="pl-9"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 size-4 text-gray-400" />
    </div>
  );
}

function Filters({ table }) {
  const columnFilters = table.getState().columnFilters || [];
  const isFiltered = columnFilters.length > 0;

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
  table: PropTypes.object,
  onPrint: PropTypes.func,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};

Filters.propTypes = {
  table: PropTypes.object,
};