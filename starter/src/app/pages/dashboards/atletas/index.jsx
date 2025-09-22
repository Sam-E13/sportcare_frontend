// Import Dependencies
import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { Avatar } from "components/ui";
import { CitaCard } from "./CitaCard";
import { getAtletaByUserId, getCitasByAtletaId } from "./api/api";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

export default function CitasAtleta() {
  const [citas, setCitas] = useState({
    pendientes: [],
    confirmadas: [],
    completadas: []
  });
  const [atleta, setAtleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  // Función para manejar actualizaciones de citas
  const handleCitaUpdated = (citaActualizada) => {
    setCitas(prevCitas => {
      // Reorganizar las citas según el nuevo estado
      const todasLasCitas = [
        ...prevCitas.pendientes,
        ...prevCitas.confirmadas,
        ...prevCitas.completadas
      ].map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);

      return {
        pendientes: todasLasCitas.filter(cita => cita.estado === "Pendiente"),
        confirmadas: todasLasCitas.filter(cita => cita.estado === "Confirmada"),
        completadas: todasLasCitas.filter(cita => cita.estado === "Completada")
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!user || !user.id) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }
        
        const userId = user.id;
        
        const atletaResponse = await getAtletaByUserId(userId);
        const atletaData = atletaResponse.data;
        
        if (atletaData && atletaData.length > 0) {
          setAtleta(atletaData[0]);
          
          const citasResponse = await getCitasByAtletaId(atletaData[0].id);
          const citasData = citasResponse.data;
          
          const pendientes = citasData.filter(cita => cita.estado === "Pendiente");
          const confirmadas = citasData.filter(cita => cita.estado === "Confirmada");
          const completadas = citasData.filter(cita => cita.estado === "Completada");
          
          setCitas({
            pendientes,
            confirmadas,
            completadas
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Extraer profesionales únicos de las citas
  const healthProfessionals = React.useMemo(() => {
    const todasLasCitas = [
      ...citas.pendientes,
      ...citas.confirmadas,
      ...citas.completadas
    ];
    
    // Crear un Map para evitar duplicados basado en el nombre del profesional
    const profesionalesMap = new Map();
    
    todasLasCitas.forEach((cita, index) => {
      if (cita.profesional_salud_nombre && !profesionalesMap.has(cita.profesional_salud_nombre)) {
        profesionalesMap.set(cita.profesional_salud_nombre, {
          uid: `prof-${index}`, // ID único basado en el índice
          name: cita.profesional_salud_nombre,
          avatar: null, // Puedes agregar lógica para avatares si tienes esa información
        });
      }
    });
    
    return Array.from(profesionalesMap.values());
  }, [citas]);

  if (loading) return <div className="flex justify-center p-10">Cargando citas...</div>;
  if (error) return <div className="flex justify-center p-10 text-red-500">{error}</div>;

  return (
    <Page title="Mis Citas">
      <div className="transition-content w-full px-[--margin-x] pb-8">
        <div className="mt-6 flex flex-col items-center justify-between space-y-2 text-center sm:flex-row sm:space-y-0 sm:text-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              Tus Citas Médicas
            </h3>
            <p className="mt-1 hidden sm:block">
              {atleta ? `Citas programadas para ${atleta.nombre} ${atleta.apPaterno} ${atleta.apMaterno}` : "Citas programadas"}
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-800 dark:text-dark-100">
              Profesionales de Salud
            </p>
            <div className="mt-2 flex space-x-2 rtl:space-x-reverse">
              {healthProfessionals.map((professional) => (
                <Avatar
                  size={8}
                  key={professional.uid}
                  name={professional.name}
                  src={professional.avatar}
                  initialColor="auto"
                  classNames={{
                    display: "mask is-squircle rounded-none text-xs+",
                  }}
                />
              ))}
              <Avatar
                size={8}
                component="button"
                title="Añadir Profesional"
                classNames={{
                  display: "mask is-squircle rounded-none text-xs+",
                }}
                initialColor="primary"
              >
                <PlusIcon className="size-4" />
              </Avatar>
            </div>
          </div>
        </div>

        {citas.pendientes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-base font-medium text-gray-800 dark:text-dark-100">
              Citas Pendientes
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {citas.pendientes.map((cita) => (
                <CitaCard
                  key={cita.id}
                  isActive={true}
                  cita={cita}
                  onCitaUpdated={handleCitaUpdated}
                />
              ))}
            </div>
          </div>
        )}

        {citas.confirmadas.length > 0 && (
          <div className="mt-4 sm:mt-5 lg:mt-6">
            <h3 className="text-base font-medium text-gray-800 dark:text-dark-100">
              Citas Confirmadas
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {citas.confirmadas.map((cita) => (
                <CitaCard
                  key={cita.id}
                  isActive={false}
                  cita={cita}
                  onCitaUpdated={handleCitaUpdated}
                />
              ))}
            </div>
          </div>
        )}

        {citas.completadas.length > 0 && (
          <div className="mt-4 sm:mt-5 lg:mt-6">
            <h3 className="text-base font-medium text-gray-800 dark:text-dark-100">
              Citas Completadas
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {citas.completadas.map((cita) => (
                <CitaCard
                  key={cita.id}
                  isActive={false}
                  cita={cita}
                  onCitaUpdated={handleCitaUpdated}
                />
              ))}
            </div>
          </div>
        )}

        {citas.pendientes.length === 0 && citas.confirmadas.length === 0 && citas.completadas.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-500">No tienes citas programadas</p>
          </div>
        )}
      </div>
    </Page>
  );
}