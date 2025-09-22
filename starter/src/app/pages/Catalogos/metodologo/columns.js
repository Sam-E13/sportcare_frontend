import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import { NombreCell, GruposCell, DeportesCell } from "./rows";

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
    columnHelper.accessor('aPaterno', {
        id: "aPaterno",
        label: "Apellido Paterno", 
        header: "Apellido Paterno",
        filterFn: "includesString",
    }),
    columnHelper.accessor('aMaterno', {
        id: "aMaterno",
        label: "Apellido Materno",
        header: "Apellido Materno", 
        filterFn: "includesString",
    }),
    columnHelper.accessor('grupos_display', {  // Usar grupos_display del backend
        id: "grupos",
        label: "Grupos",
        header: "Grupos",
        cell: GruposCell,
        filterFn: "includesString",
    }),
    columnHelper.accessor('deportes_display', {  // Usar deportes_display del backend
        id: "deportes", 
        label: "Deportes",
        header: "Deportes",
        cell: DeportesCell,
        filterFn: "includesString",
    }),
    columnHelper.display({
        id: "actions",
        label: "Acciones", 
        header: "Acciones",
        cell: RowActions
    }),
];