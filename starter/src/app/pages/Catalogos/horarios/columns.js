// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";

const columnHelper = createColumnHelper();

const diasSemana = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
};

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Selección", 
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor('profesional_salud_nombre', {  // Usa el campo plano del serializer
    id: "profesional_salud_nombre",
    label: "Profesional",
    header: "Profesional",
    cell: ({ getValue }) => getValue() || 'No especificado'
  }),
  columnHelper.accessor('consultorio_nombre', {  // Usa el campo plano del serializer
    id: "consultorio_nombre",
    label: "Consultorio",
    header: "Consultorio",
    cell: ({ getValue }) => getValue() || 'No especificado'
  }),
  columnHelper.accessor('dia', {
    id: "dia",
    label: "Día",
    header: "Día",
    cell: ({ getValue }) => diasSemana[getValue()] || getValue(),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      const rowValue = row.getValue(columnId);
      return filterValue.includes(Number(rowValue));
    },
  }),
  columnHelper.accessor('hora_inicio', {
    id: "hora_inicio",
    label: "Hora Inicio",
    header: "Hora Inicio",
    cell: ({ getValue }) => {
      const hora = getValue();
      if (!hora) return '-';
  
      // Si la hora ya viene en formato HH:MM
      if (typeof hora === 'string' && hora.match(/^\d{2}:\d{2}/)) {
        return hora;
      }
  
      // Si viene como objeto Time de Django (ej: {hours: 8, minutes: 0})
      if (typeof hora === 'object' && hora.hours !== undefined) {
        return `${hora.hours.toString().padStart(2, '0')}:${hora.minutes.toString().padStart(2, '0')}`;
      }
  
      // Si viene como timestamp o ISO string
      try {
        const date = new Date(hora);
        return isNaN(date.getTime()) ? '-' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '-';
      }
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      
      const rowValue = row.getValue(columnId);
      if (!rowValue) return false;
      
      // Normalizar el valor de la fila a formato HH:MM
      let normalizedRowValue;
      
      if (typeof rowValue === 'string' && rowValue.match(/^\d{2}:\d{2}/)) {
        normalizedRowValue = rowValue.substring(0, 5);
      } else if (typeof rowValue === 'object' && rowValue.hours !== undefined) {
        normalizedRowValue = `${rowValue.hours.toString().padStart(2, '0')}:${rowValue.minutes.toString().padStart(2, '0')}`;
      } else {
        try {
          const date = new Date(rowValue);
          if (!isNaN(date.getTime())) {
            normalizedRowValue = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            return false;
          }
        } catch {
          return false;
        }
      }
      
      return normalizedRowValue === filterValue;
    },
  }),
  columnHelper.accessor('hora_fin', {
    id: "hora_fin",
    label: "Hora Fin",
    header: "Hora Fin",
    cell: ({ getValue }) => {
      const hora = getValue();
      if (!hora) return '-';

      if (typeof hora === 'string' && hora.match(/^\d{2}:\d{2}/)) {
        return hora;
      }

      if (typeof hora === 'object' && hora.hours !== undefined) {
        return `${hora.hours.toString().padStart(2, '0')}:${hora.minutes.toString().padStart(2, '0')}`;
      }

      try {
        const date = new Date(hora);
        return isNaN(date.getTime()) ? '-' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '-';
      }
    }
  }),
  columnHelper.accessor('duracion_cita', {
    id: "duracion",
    label: "Duración (min)",
    header: "Duración",
    cell: ({ getValue }) => `${getValue()} min`
  }),
  columnHelper.display({
    id: "actions",
    label: "Acciones",
    header: "Acciones",
    cell: RowActions
  }),
];