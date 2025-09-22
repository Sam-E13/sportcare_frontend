// Import Dependencies
import PropTypes from "prop-types";
import { ArrowUpRightIcon, CalendarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

// Local Imports
import { Avatar, Badge, Button, Card } from "components/ui";
import { ReagendarCitaModal } from "./ReagendarCitaModal";
import { DetallesCitaModal } from "./DetallesCitaModal";

// ----------------------------------------------------------------------

export function CitaCard({ isActive, cita, onCitaUpdated }) {
  const [isReagendarModalOpen, setIsReagendarModalOpen] = useState(false);
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);
  
  // Destructure cita data
  const {
    area_nombre,
    consultorio_nombre,
    profesional_salud_nombre,
    slot_hora_inicio,
    slot_hora_fin,
    slot_fecha,
    estado,
    observaciones
  } = cita;

  // Format date
  const formattedDate = formatDate(slot_fecha);
  
  // Format time range
  const timeRange = `${formatTime(slot_hora_inicio)} - ${formatTime(slot_hora_fin)}`;
  
  // Verificar si la cita se puede reagendar (solo pendientes y confirmadas)
  const puedeReagendar = ['Pendiente', 'Confirmada'].includes(estado);
  
  const handleReagendar = (citaActualizada) => {
    if (onCitaUpdated) {
      onCitaUpdated(citaActualizada);
    }
  };
  
  const handleViewDetails = () => {
    setIsDetallesModalOpen(true);
  };
  
  return (
    <>
      <Card
        {...{ skin: isActive ? "none" : undefined }}
        className={clsx(
          "flex flex-col p-4 sm:p-5",
          isActive && "bg-primary-600 dark:bg-primary-500",
        )}
      >
        <div className="grow">
          <div className="flex items-center gap-3">
            <Avatar
              size={8}
              name={profesional_salud_nombre}
              src={null}
              initialColor="auto" 
              classNames={{ display: "text-xs+ ring-1 ring-white/10" }}
            />
            <div className="min-w-0">
              <h3
                className={clsx(
                  "truncate text-base font-medium",
                  isActive ? "text-white" : "text-gray-800 dark:text-dark-100",
                )}
              >
                {area_nombre}
              </h3>
              <p
                className={clsx(
                  "mt-0.5 truncate text-xs",
                  isActive && "text-white/90",
                )}
              >
                {consultorio_nombre}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className={clsx("text-xs+", isActive && "text-white/90")}>
            {formattedDate}
          </p>
          <p
            className={clsx(
              "text-xl font-medium",
              isActive ? "text-white" : "text-gray-800 dark:text-dark-100",
            )}
          >
            {timeRange}
          </p>
          <p className={clsx("mt-1 text-sm", isActive ? "text-white/90" : "text-gray-600")}>
            Dr. {profesional_salud_nombre}
          </p>
          <Badge
            unstyled={isActive}
            variant={isActive ? undefined : "soft"}
            color={getBadgeColor(estado)}
            className={clsx(
              "mt-3 rounded-full px-2 py-1.5 text-xs leading-none",
              isActive && "bg-black/20 text-white",
            )}
          >
            {estado}
          </Badge>
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {/* Espacio reservado para posibles avatares adicionales */}
          </div>
          <div className="flex gap-2">
            {/* Botón de reagendar - solo para citas pendientes y confirmadas */}
            {puedeReagendar && (
              <Button 
                className="size-8 rounded-full" 
                isIcon
                onClick={() => setIsReagendarModalOpen(true)}
                title="Reagendar cita"
              >
                <CalendarIcon className="size-4" />
              </Button>
            )}
            
            {/* Botón de ver detalles */}
            <Button 
              className="size-8 rounded-full" 
              isIcon
              onClick={handleViewDetails}
              title="Ver detalles"
            >
              <ArrowUpRightIcon className="size-4" />
            </Button>
          </div>
        </div>
        {observaciones && (
          <div className="mt-3 text-xs">
            <p className={clsx(isActive ? "text-white/80" : "text-gray-500")}>
              {observaciones}
            </p>
          </div>
        )}
      </Card>
      
      {/* Modal de reagendar */}
      <ReagendarCitaModal
        isOpen={isReagendarModalOpen}
        onClose={() => setIsReagendarModalOpen(false)}
        cita={cita}
        onReagendar={handleReagendar}
      />
      
      {/* Modal de detalles */}
      <DetallesCitaModal
        isOpen={isDetallesModalOpen}
        onClose={() => setIsDetallesModalOpen(false)}
        cita={cita}
      />
    </>
  );
}

// Helper functions
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return format(date, "EEE, d MMM yyyy", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

function formatTime(timeString) {
  if (!timeString) return "";
  
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeString;
}

function getBadgeColor(estado) {
  switch (estado) {
    case "Pendiente":
      return "warning";
    case "Confirmada":
      return "success";
    case "Completada":
      return "info";
    case "Cancelada":
      return "error";
    default:
      return "primary";
  }
}

CitaCard.propTypes = {
  isActive: PropTypes.bool,
  cita: PropTypes.shape({
    id: PropTypes.number.isRequired,
    area_nombre: PropTypes.string.isRequired,
    consultorio_nombre: PropTypes.string.isRequired,
    profesional_salud_nombre: PropTypes.string.isRequired,
    slot_hora_inicio: PropTypes.string.isRequired,
    slot_hora_fin: PropTypes.string.isRequired,
    slot_fecha: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    observaciones: PropTypes.string,
    atleta: PropTypes.number.isRequired,
    area: PropTypes.number.isRequired,
    consultorio: PropTypes.number.isRequired,
    profesional_salud: PropTypes.number.isRequired,
    slot: PropTypes.number.isRequired
  }).isRequired
};