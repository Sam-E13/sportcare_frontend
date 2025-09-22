import { PropTypes } from "prop-types";
import { Highlight } from "components/shared/Highlight";
import { Button, Card } from "components/ui";
import { useState } from "react";
import { ReservationModal } from "./actions/ConfirmModal";

export function SlotCard({
  area = '',
  consultorio = '',
  profesional = '',
  fecha = '',
  horaInicio = '',
  horaFin = '',
  disponible = false,
  query = '',
  slotId = null,
  areaId = null,
  consultorioId = null,
  profesionalId = null,
  onReservationSuccess = () => {},
}) {
  // Formateo de fechas y horas
  const formattedFecha = (() => {
    try {
      if (!fecha) return 'Sin fecha';
      const [year, month, day] = fecha.split('-');
      return new Date(year, month - 1, day).toLocaleDateString();
    } catch {
      return 'Fecha inválida';
    }
  })();

  const formatHora = (hora) => {
    try {
      return hora ? new Date(`1970-01-01T${hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    } catch {
      return '--:--';
    }
  };

  const horaInicioStr = formatHora(horaInicio);
  const horaFinStr = formatHora(horaFin);

  // Manejar apertura/cierre del modal como en RowActions.jsx
  const [isModalOpen, setIsModalOpen] = useState(false);
  const open = () => setIsModalOpen(true);
  const close = () => setIsModalOpen(false);

  return (
    <>
      <Card className="flex flex-col">
        <div className="flex grow flex-col px-4 pb-5 pt-4">
          <div className="mb-3">
            <span className="text-xs+ font-medium text-primary-600 dark:text-primary-400">
              <Highlight query={query}>{area}</Highlight>
            </span>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-medium text-gray-700 dark:text-dark-100">
              <Highlight query={query}>{consultorio}</Highlight>
            </h3>
          </div>
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-dark-200">
              <Highlight query={query}>{profesional}</Highlight>
            </p>
          </div>
          
          <div className="my-2 flex items-center space-x-3 text-xs">
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
            <p>{formattedFecha}</p>
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">{horaInicioStr} - {horaFinStr}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              disponible ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
            }`}>
              {disponible ? 'Disponible' : 'Ocupado'}
            </span>
          </div>
          
          <div className="mt-2">
            <Button 
              color="primary" 
              className="rounded-full w-full"
              disabled={!disponible}
              onClick={open}
            >
              {disponible ? 'Reservar Cita' : 'No Disponible'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal, mismo patrón que DeporteUpdateModal.jsx */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={close}
        slotData={{
          area,
          consultorio,
          profesional,
          formattedFecha,
          horaInicioStr,
          horaFinStr,
          slotId,
          areaId,
          consultorioId,
          profesionalId,
        }}
        onReservationSuccess={onReservationSuccess}
      />
    </>
  );
}

SlotCard.propTypes = {
  area: PropTypes.string,
  consultorio: PropTypes.string,
  profesional: PropTypes.string,
  fecha: PropTypes.string,
  horaInicio: PropTypes.string,
  horaFin: PropTypes.string,
  disponible: PropTypes.bool,
  query: PropTypes.string,
  slotId: PropTypes.number,
  areaId: PropTypes.number,
  consultorioId: PropTypes.number,
  profesionalId: PropTypes.number,
  onReservationSuccess: PropTypes.func,
};