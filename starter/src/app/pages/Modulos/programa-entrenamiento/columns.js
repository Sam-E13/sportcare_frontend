// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    NombreCell,
    DescripcionCell,
    DeporteCell,
    NivelCell,
    ObjetivoCell,
    DuracionCell,
    EntrenadorCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Row Selection",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor("nombre", {
        id: "nombre",
        label: "Nombre del Programa",
        header: "Nombre",
        cell: NombreCell,
    }),
    columnHelper.accessor("descripcion", {
        id: "descripcion",
        label: "Descripción",
        header: "Descripción",
        cell: DescripcionCell,
    }),
    columnHelper.accessor((row) => row.deporte_nombre, {
        id: "deporte",
        label: "Deporte",
        header: "Deporte",
        cell: DeporteCell,
    }),
    columnHelper.accessor("nivel", {
        id: "nivel",
        label: "Nivel",
        header: "Nivel",
        cell: NivelCell,
    }),
    columnHelper.accessor("objetivo", {
        id: "objetivo",
        label: "Objetivo",
        header: "Objetivo",
        cell: ObjetivoCell,
    }),
    columnHelper.accessor("duracion_dias", {
        id: "duracion_dias",
        label: "Duración (días)",
        header: "Duración",
        cell: DuracionCell,
    }),
    columnHelper.accessor((row) => row.entrenador_nombre, {
        id: "entrenador",
        label: "Entrenador",
        header: "Entrenador",
        cell: EntrenadorCell,
    }),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Acciones",
        cell: RowActions,
    }),
];