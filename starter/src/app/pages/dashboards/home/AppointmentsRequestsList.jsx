// Import Dependencies
import { useEffect, useState } from "react";
import { useAuthContext } from "app/contexts/auth/context";
import { register } from "swiper/element/bundle";



// Local Imports
import { AppointmentsRequestsCard } from "./AppointmentsRequestsCard";
import {
  getProfesionalByUserId,
  getCitasByProfesionalId,
  confirmarCita,
  cancelarCita
} from "./api/profesional-user";

// ----------------------------------------------------------------------

register();

export function AppointmentsRequestsList() {
  const { isAuthenticated, user } = useAuthContext();
  const [profesional, setProfesional] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesionalAndCitas = async () => {
      try {
        if (isAuthenticated && user && user.id) {
          const responseProfesional = await getProfesionalByUserId(user.id);
          let profesionalData = null;

          if (responseProfesional.data && Array.isArray(responseProfesional.data) && responseProfesional.data.length > 0) {
            profesionalData = responseProfesional.data[0];
          } else if (responseProfesional.data) {
            profesionalData = responseProfesional.data;
          }

          setProfesional(profesionalData);

          if (profesionalData && profesionalData.id) {
            const responseCitas = await getCitasByProfesionalId(profesionalData.id);
            if (responseCitas.data) {
              setCitas(responseCitas.data);
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesionalAndCitas();
  }, [isAuthenticated, user]);

  const handleConfirmCita = async (citaId) => {
    try {
      await confirmarCita(citaId);
      setCitas(prev =>
        prev.map(c =>
          c.id === citaId ? { ...c, estado: 'Confirmada' } : c
        )
      );
    } catch (error) {
      console.error("Error al confirmar la cita:", error);
    }
  };
  
  const handleCancelCita = async (citaId) => {
    try {
      await cancelarCita(citaId);
      setCitas(prev =>
        prev.map(c =>
          c.id === citaId ? { ...c, estado: 'Cancelada' } : c
        )
      );
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
    }
  };

  const handleViewDetails = (citaId) => {
    console.log("Ver detalles de la cita:", citaId);
  };

  // Solo citas pendientes, ordenadas de la más próxima a la fecha y hora actual
  const pendientes = citas
    .filter(cita => cita.estado === "Pendiente")
    .sort((a, b) => {
      const fechaHoraA = new Date(`${a.slot_fecha}T${a.slot_hora_inicio || "00:00"}`);
      const fechaHoraB = new Date(`${b.slot_fecha}T${b.slot_hora_inicio || "00:00"}`);
      return fechaHoraA - fechaHoraB;
    });

  const formatFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    try {
      return new Date(fecha).toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long' 
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Cargando citas...</div>;
  }

  if (!profesional) {
    return <div className="p-4">No se encontró información del profesional.</div>;
  }

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <div className="flex h-8 items-center justify-between">
        <h2 className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Appointment request
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs+ font-medium text-primary-600 outline-none transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      {pendientes.length === 0 ? (
        <div className="mt-3 p-4 text-center text-gray-500">
          No hay citas pendientes para mostrar.
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {pendientes.slice(0, 3).map((cita) => (
            <AppointmentsRequestsCard
              key={cita.id}
              atletaNombre={cita.atleta_nombre}
              estado={cita.estado}
              areaNombre={cita.area_nombre}
              fecha={formatFecha(cita.slot_fecha)}
              hora={cita.slot_hora_inicio || "Hora no disponible"}
              onConfirm={() => handleConfirmCita(cita.id)}
              onCancel={() => handleCancelCita(cita.id)}
              onViewDetails={() => handleViewDetails(cita.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
