// columns.js
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import { NombreCell, DescripcionCell } from "./rows";

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Selección",
        header: SelectHeader,
        cell: SelectCell,
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
    }),
    columnHelper.accessor('nombre', {
        id: "nombre",
        label: "Nombre",
        header: "Nombre",
        cell: NombreCell,
        filterFn: "includesString",
        size: 200,
        minSize: 150,
    }),
    columnHelper.accessor('descripcion', {
        id: "descripcion",
        label: "Descripción",
        header: "Descripción",
        cell: DescripcionCell,
        filterFn: "includesString",
        size: 300,
        minSize: 200,
    }),
    columnHelper.display({
        id: "actions",
        label: "Acciones",
        header: "Acciones",
        cell: RowActions,
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
    }),
];