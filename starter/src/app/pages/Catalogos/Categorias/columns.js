import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import {
  NombreCell,
  EdadMinCell,
  EdadMaxCell,
  RangoEdadCell
} from "./rows";

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
    header: "Nombre",
    cell: NombreCell,
  }),
  columnHelper.accessor('edadMin', {
    id: "edadMin",
    header: "Edad Mínima",
    cell: EdadMinCell,
  }),
  columnHelper.accessor('edadMax', {
    id: "edadMax",
    header: "Edad Máxima",
    cell: EdadMaxCell,
  }),
  columnHelper.display({
    id: "rangoEdad",
    header: "Rango de Edad",
    cell: RangoEdadCell,
  }),
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    cell: RowActions
  }),
];