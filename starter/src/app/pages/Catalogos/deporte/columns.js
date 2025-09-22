// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import { NombreCell, GrupoCell } from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Selección",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor('nombre', {
        id: "nombre",
        label: "Nombre",
        header: "Nombre",
        cell: NombreCell,
        filterFn: "includesString",
    }),
    columnHelper.accessor('grupo_display', {  // Cambiado a usar grupo_display
        id: "grupo",
        label: "Grupo Deportivo",
        header: "Grupo Deportivo",
        cell: GrupoCell,
        filterFn: "includesString",
    }),
    columnHelper.display({
        id: "actions",
        label: "Acciones",
        header: "Acciones",
        cell: RowActions
    }),
];