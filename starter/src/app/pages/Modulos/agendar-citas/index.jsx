import { Page } from "components/shared/Page";
import { Toolbar } from "./Toolbar";
import { SlotCard } from "./CitaCard";
import { useFuse } from "hooks";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "components/ui";
import {
  getCitasDisponiblesByFilters,
  getAllAreas
} from "./api/CitasDisponiblesApi";

export default function CitasDisponibles() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    area: "",
    fecha: "",
    horario: ""
  });
  const [areasList, setAreasList] = useState([]);

  const {
    result: filteredSlots,
    query,
    setQuery,
  } = useFuse(slots, {
    keys: ["area_nombre", "consultorio_nombre", "profesional_salud_nombre"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  // Función para recargar las citas
  const fetchCitas = useCallback(async () => {
    try {
      console.log('Obteniendo citas con filtros:', filters); // Para debug
      const response = await getCitasDisponiblesByFilters(filters);
      // Filtrar slots no disponibles
      const availableSlots = response.data.filter(slot => slot.disponible);
      setSlots(availableSlots);
      console.log('Citas obtenidas:', availableSlots.length); // Para debug
    } catch (error) {
      console.error("Error fetching citas:", error);
    }
  }, [filters]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener áreas para los filtros
        const areasRes = await getAllAreas();
        setAreasList(areasRes.data);

        // Obtener citas con filtros iniciales
        await fetchCitas();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchCitas]);

  if (loading) {
    return (
      <Page title="Citas Disponibles">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-gray-600 dark:text-dark-300">Cargando citas disponibles...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Citas Disponibles">
      <div className="transition-content w-full px-[--margin-x] pb-8">
        <Toolbar
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilters={setFilters}
          areas={areasList}
          onResetFilters={() => setFilters({ area: "", fecha: "", horario: "" })}
        />
        
        {filteredSlots.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-dark-300">
              Mostrando {filteredSlots.length} cita(s) disponible(s)
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSlots.map(({ item: slot, index }) => (
                <SlotCard
                  key={`slot-${slot.id}-${index}`}
                  area={slot.area_nombre}
                  consultorio={slot.consultorio_nombre}
                  profesional={slot.profesional_salud_nombre}
                  fecha={slot.fecha}
                  horaInicio={slot.hora_inicio}
                  horaFin={slot.hora_fin}
                  disponible={slot.disponible}
                  query={query}
                  slotId={slot.id}
                  areaId={slot.area}
                  consultorioId={slot.consultorio}
                  profesionalId={slot.profesional_salud}
                  onReservationSuccess={fetchCitas}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-4 size-16 rounded-full bg-gray-100 dark:bg-dark-600 flex items-center justify-center">
                <svg className="size-8 text-gray-400 dark:text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-dark-100 mb-2">
                No hay citas disponibles
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-300">
                No se encontraron citas disponibles con los criterios seleccionados.
                Intenta ajustar los filtros o seleccionar una fecha diferente.
              </p>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}