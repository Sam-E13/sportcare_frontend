// Import Dependencies
import {  useRef, useState } from "react";
import {
  Cog8ToothIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { RiFilter3Line } from "react-icons/ri";
import PropTypes from "prop-types";

// Local Imports
import { Button, Input, Select, Card, Badge } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useIsomorphicEffect } from "hooks";

// ----------------------------------------------------------------------

export function Toolbar({
  query = '',
  setQuery = () => { },
  filters = {},
  setFilters = () => { },
  areas = [],
  onResetFilters = () => { }
}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const mobileSearchRef = useRef();

  const { isXs } = useBreakpointsContext();

  useIsomorphicEffect(() => {
    if (showMobileSearch) mobileSearchRef?.current?.focus();
  }, [showMobileSearch]);

  const handleFilterChange = (name, value) => {
    console.log('Cambiando filtro:', name, value); // Para debug
    if (name === 'area' && value !== '') {
      setFilters(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetAllFilters = () => {
    setQuery("");
    setFilters({
      area: "",
      fecha: "",
      horario: ""
    });
    onResetFilters();
  };

  const hasActiveFilters = filters.area || filters.fecha || filters.horario;
  const activeFiltersCount = [filters.area, filters.fecha, filters.horario].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4 py-5 lg:py-6">
      {/* Header con título y controles */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center space-x-1 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium text-gray-700 dark:text-dark-50 lg:text-2xl">
            Citas Disponibles
          </h2>
          {activeFiltersCount > 0 && (
            <Badge className="ml-2">{activeFiltersCount}</Badge>
          )}
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Buscador para desktop */}
          <Input
            classNames={{
              input: "h-10 rounded-full text-sm",
              root: "max-sm:hidden w-80",
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por área, consultorio o profesional..."
            prefix={<MagnifyingGlassIcon className="size-5" />}
          />

          {/* Botón de búsqueda para mobile */}
          <Button
            onClick={() => setShowMobileSearch(true)}
            className="size-10 shrink-0 rounded-full sm:hidden"
            isIcon
            variant="flat"
          >
            <MagnifyingGlassIcon className="size-5" />
          </Button>

          {/* Botón de filtros mejorado */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="size-10 shrink-0 rounded-full relative"
            isIcon
            variant={hasActiveFilters ? "filled" : "flat"}
            color={hasActiveFilters ? "primary" : "neutral"}  // Cambiar "default" por "neutral"
          >
            <RiFilter3Line className="size-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Botón de configuración */}
          <Button
            className="size-10 shrink-0 rounded-full"
            isIcon
            variant="flat"
          >
            <Cog8ToothIcon className="size-5" />
          </Button>
        </div>
      </div>

      {/* Buscador para mobile */}
      {showMobileSearch && isXs && (
        <Input
          classNames={{
            root: "flex-1",
            input: "h-10 text-sm",
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por área, consultorio o profesional..."
          ref={mobileSearchRef}
          prefix={<MagnifyingGlassIcon className="size-5" />}
          suffix={
            <Button
              variant="flat"
              className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
              onClick={() => {
                setQuery("");
                setShowMobileSearch(false);
              }}
            >
              <XMarkIcon className="size-4 text-gray-500 dark:text-dark-200" />
            </Button>
          }
        />
      )}

      {/* Panel de filtros mejorado */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-dark-100 flex items-center gap-2">
              <RiFilter3Line className="size-5" />
              Filtros Avanzados
            </h3>
            <Button
              onClick={() => setShowFilters(false)}
              variant="flat"
              isIcon
              className="size-8"
            >
              <XMarkIcon className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <BuildingOfficeIcon className="size-4" />
                Área
              </label>
              <Select
                value={filters.area || ""}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full"
              >
                <option value="">Todas las áreas</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </Select>
            </div>

            {/* Filtro de Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <CalendarIcon className="size-4" />
                Fecha
              </label>
              <DatePicker
                value={filters.fecha || ""}
                onChange={(date) => {
                  if (date.length > 0) {
                    const selectedDate = date[0];
                    let formattedDate;
                    
                    if (selectedDate instanceof Date) {
                      // Compensar la zona horaria local para obtener la fecha correcta
                      const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // offset en milisegundos
                      const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset);
                      formattedDate = adjustedDate.toISOString().split('T')[0];
                    } else {
                      formattedDate = selectedDate;
                    }
                    
                    console.log('Fecha seleccionada original:', selectedDate);
                    console.log('Fecha formateada (corregida):', formattedDate);
                    handleFilterChange('fecha', formattedDate);
                  } else {
                    handleFilterChange('fecha', "");
                  }
                }}
                options={{
                  dateFormat: "Y-m-d",
                  minDate: "today",
                  maxDate: new Date().fp_incr(90)
                }}
                placeholder="Seleccionar fecha"
              />
            </div>

            {/* Filtro de Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <ClockIcon className="size-4" />
                Horario
              </label>
              <Select
                value={filters.horario || ""}
                onChange={(e) => handleFilterChange('horario', e.target.value)}
                className="w-full"
              >
                <option value="">Cualquier horario</option>
                <option value="morning">🌅 Mañana (8:00 - 12:00)</option>
                <option value="afternoon">☀️ Tarde (12:00 - 18:00)</option>
                <option value="evening">🌙 Noche (18:00 - 22:00)</option>
              </Select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-dark-500">
            <div className="text-sm text-gray-500 dark:text-dark-400">
              {activeFiltersCount > 0 ? `${activeFiltersCount} filtro(s) activo(s)` : 'Sin filtros activos'}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={resetAllFilters}
                variant="flat"
                className="flex items-center gap-2"
                disabled={!hasActiveFilters}
              >
                <ArrowPathIcon className="size-4" />
                Limpiar filtros
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                color="primary"
                className="flex items-center gap-2"
              >
                Aplicar filtros
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filtros activos como badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-dark-400">Filtros activos:</span>

          {filters.area && (
            <FilterBadge
              label={`Área: ${areas.find(a => String(a.id) === String(filters.area))?.nombre || 'Desconocida'}`}
              onRemove={() => handleFilterChange('area', '')}
              icon={<BuildingOfficeIcon className="size-3" />}
            />
          )}

          {filters.fecha && (
            <FilterBadge
              label={`Fecha: ${(() => {
                try {
                  const [year, month, day] = filters.fecha.split('-');
                  return new Date(year, month - 1, day).toLocaleDateString();
                } catch {
                  return filters.fecha;
                }
              })()}`}
              onRemove={() => handleFilterChange('fecha', '')}
              icon={<CalendarIcon className="size-3" />}
            />
          )}

          {filters.horario && (
            <FilterBadge
              label={`Horario: ${getHorarioLabel(filters.horario)}`}
              onRemove={() => handleFilterChange('horario', '')}
              icon={<ClockIcon className="size-3" />}
            />
          )}

          <button
            onClick={resetAllFilters}
            className="text-sm text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 ml-2"
          >
            <ArrowPathIcon className="size-4" />
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}

// Componente mejorado para mostrar los filtros activos
function FilterBadge({ label, onRemove, icon }) {
  return (
    <Badge
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:text-primary-600 focus:outline-none transition-colors"
        onClick={onRemove}
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </Badge>
  );
}

// Función auxiliar para mostrar etiquetas de horario
function getHorarioLabel(value) {
  const labels = {
    morning: "Mañana (8:00 - 12:00)",
    afternoon: "Tarde (12:00 - 18:00)",
    evening: "Noche (18:00 - 22:00)"
  };
  return labels[value] || value;
}

Toolbar.propTypes = {
  query: PropTypes.string,
  setQuery: PropTypes.func,
  filters: PropTypes.shape({
    area: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fecha: PropTypes.string,
    horario: PropTypes.string,
  }),
  setFilters: PropTypes.func,
  areas: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
  })),
  onResetFilters: PropTypes.func,
};

Toolbar.defaultProps = {
  query: '',
  filters: {},
  areas: [],
  onResetFilters: () => { },
};