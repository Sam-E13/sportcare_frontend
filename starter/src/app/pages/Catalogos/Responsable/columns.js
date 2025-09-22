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
  ParentescoCell,
  TelefonoCell
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Selección",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.nombre, {
    id: "nombre",
    header: "Nombre",
    cell: NombreCell,
  }),
  columnHelper.accessor((row) => row.parentesco, {
    id: "parentesco",
    header: "Parentesco",
    cell: ParentescoCell,
  }),
  columnHelper.accessor((row) => row.telefono, {
    id: "telefono",
    header: "Teléfono",
    cell: TelefonoCell,
  }),
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    cell: RowActions
  }),
];