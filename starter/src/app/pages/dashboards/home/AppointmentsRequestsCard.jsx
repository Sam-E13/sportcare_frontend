import PropTypes from "prop-types";
import {
  ArrowUpRightIcon,
  CheckIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function AppointmentsRequestsCard({
  atletaNombre,
  estado,
  areaNombre,
  fecha,
  hora,
  onConfirm,
  onCancel,
  onViewDetails
}) {
  const getStatusColor = () => {
    switch (estado) {
      case "Pendiente":
        return "text-yellow-500";
      case "Confirmada":
        return "text-green-600";
      case "Cancelada":
        return "text-red-500";
      case "Completada":
        return "text-blue-600";
      default:
        return "text-gray-400";
    }
  };

  const getStatusLabel = () => {
    switch (estado) {
      case "Pendiente":
        return "🕒 Pendiente";
      case "Confirmada":
        return "✅ Confirmada";
      case "Cancelada":
        return "❌ Cancelada";
      case "Completada":
        return "✔️ Completada";
      default:
        return "Desconocido";
    }
  };

  

  return (
    <Card className="p-5 shadow-lg rounded-2xl border border-gray-200 dark:border-dark-400 space-y-5">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size={12} name={atletaNombre || "Paciente"} initialColor="auto" />
          <div>
            <p className="font-semibold text-lg text-gray-900 dark:text-dark-100">{atletaNombre}</p>
            <span className={`text-xs font-semibold ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
          </div>
        </div>
        <Button
          className="size-8 rounded-full"
          isIcon
          onClick={onViewDetails}
          title="Ver detalles"
        >
          <ArrowUpRightIcon className="size-4" />
        </Button>
      </div>

      {/* Información de la cita */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3 text-sm text-gray-700 dark:text-dark-200">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="size-4 text-primary-500" />
          <span className="font-medium">{areaNombre}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-primary-500" />
          <span>{fecha}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-primary-500" />
          <span>{hora}</span>
        </div>
      </div>

      {/* Acciones */}
      {estado === "Pendiente" && (
        <div className="flex justify-end gap-3 pt-2">
          <Button
            className="px-3 py-1 text-sm"
            color="success"
            variant="soft"
            onClick={onConfirm}
          >
            <CheckIcon className="inline size-4 mr-1" />
            Confirmar
          </Button>
          <Button
            className="px-3 py-1 text-sm"
            color="error"
            variant="soft"
            onClick={onCancel}
          >
            <XMarkIcon className="inline size-4 mr-1" />
            Cancelar
          </Button>
        </div>
      )}
    </Card>
  );
}

AppointmentsRequestsCard.propTypes = {
  atletaNombre: PropTypes.string,
  estado: PropTypes.string,
  areaNombre: PropTypes.string,
  fecha: PropTypes.string,
  hora: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onViewDetails: PropTypes.func
};
