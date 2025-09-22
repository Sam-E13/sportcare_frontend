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
  columnHelper.accessor('profesional_salud_nombre', {
    id: "profesional_salud_nombre",
    label: "Profesional",
    header: "Profesional",
    cell: ({ getValue }) => getValue() || 'No especificado'
  }),
  columnHelper.accessor('consultorio_nombre', {
    id: "consultorio_nombre",
    label: "Consultorio",
    header: "Consultorio",
    cell: ({ getValue }) => getValue() || 'No especificado'
  }),
  columnHelper.accessor('fecha_inicio', {
    id: "fecha_inicio",
    label: "Fecha Inicio",
    header: "Fecha Inicio",
    cell: ({ getValue }) => {
      const fecha = getValue();
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  }),
  columnHelper.accessor('fecha_fin', {
    id: "fecha_fin",
    label: "Fecha Fin",
    header: "Fecha Fin",
    cell: ({ getValue }) => {
      const fecha = getValue();
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  }),
  columnHelper.accessor('dias_semana', {
    id: "dias_semana",
    header: "Días",
    filterFn: 'arrayIncludes', // Agregar función de filtro personalizada
    cell: ({ getValue }) => {
      const dias = getValue();
      if (!dias) return '-';
      
      // Asegurarnos que siempre sea un array
      const diasArray = Array.isArray(dias) ? dias : [dias].filter(Boolean);
      
      return diasArray.map(dia => diasSemana[dia] || dia).join(', ') || '-';
    }
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
    }
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
  columnHelper.accessor('activo', {
    id: "activo",
    label: "Activo",
    header: "Activo",
    filterFn: 'boolean', // Agregar función de filtro personalizada
    cell: ({ getValue }) => getValue() ? 'Sí' : 'No'
  }),
  columnHelper.display({
    id: "actions",
    label: "Acciones",
    header: "Acciones",
    cell: RowActions
  }),
];