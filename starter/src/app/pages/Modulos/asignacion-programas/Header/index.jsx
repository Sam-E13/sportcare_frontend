// Import Dependencies
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FaRunning, FaDumbbell } from "react-icons/fa";

// Local Imports
import { Input, Badge } from "components/ui";
import { useBoardContext } from "../Board.context";

// ----------------------------------------------------------------------

export function Header() {
  const { searchTerm, setSearchTerm, unassignedAthletes, programColumns } = useBoardContext();

  // Calcular estadísticas
  const totalAthletes = unassignedAthletes.length + programColumns.reduce((acc, col) => acc + col.tasks.length, 0);
  const assignedAthletes = programColumns.reduce((acc, col) => acc + col.tasks.length, 0);

  return (
    <div className="transition-content px-[--margin-x] shrink-0 sm:pt-5">
      {/* Header principal */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <FaDumbbell className="size-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="truncate text-xl font-semibold text-gray-900 dark:text-dark-50">
              Asignación de Programas
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-300">
              Gestiona la asignación de atletas a programas de entrenamiento
            </p>
          </div>
        </div>
        
        {/* Estadísticas */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaRunning className="size-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-dark-300">
              Total atletas:
            </span>
            <Badge color="primary" variant="soft" size="sm">
              {totalAthletes}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-dark-300">
              Asignados:
            </span>
            <Badge color="success" variant="soft" size="sm">
              {assignedAthletes}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-dark-300">
              Sin asignar:
            </span>
            <Badge color="warning" variant="soft" size="sm">
              {unassignedAthletes.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-dark-700">
        <div className="relative flex-1 max-w-md">
          <Input
            classNames={{
              root: "w-full",
              input: "h-10 pl-10 pr-10 text-sm",
            }}
            placeholder="Buscar atleta por nombre..."
            prefix={<MagnifyingGlassIcon className="size-5 text-gray-400" />}
            suffix={
              searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-600"
                >
                  <XMarkIcon className="size-4 text-gray-400" />
                </button>
              )
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Indicador de búsqueda activa */}
        {searchTerm && (
          <div className="text-sm text-gray-500 dark:text-dark-400">
            Mostrando resultados para: <span className="font-medium text-gray-700 dark:text-dark-200">&quot;{searchTerm}&quot;</span>
          </div>
        )}
      </div>
    </div>
  );
}