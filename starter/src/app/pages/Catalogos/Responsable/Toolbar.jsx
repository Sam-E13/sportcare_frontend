import { Button } from "components/ui";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import PropTypes from 'prop-types';

export function Toolbar({ table, atletaInfo, onAddResponsable }) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-100">
          Responsables de {atletaInfo?.nombre || 'Atleta'}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            placeholder="Buscar..."
            value={table.getState().globalFilter || ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 dark:border-dark-500 sm:w-64"
          />
        </div>

        <Button
          className="flex items-center gap-2 whitespace-nowrap"
          onClick={onAddResponsable}
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo Responsable
        </Button>
      </div>
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  atletaInfo: PropTypes.object,
  onAddResponsable: PropTypes.func.isRequired,
};