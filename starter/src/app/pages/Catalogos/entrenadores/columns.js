import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import {
  NombreCompletoCell,
  SexoCell,
  FechaNacimientoCell
} from "./rows";
 
const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Selección",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor(row => `${row.nombre} ${row.apPaterno} ${row.apMaterno}`, {
    id: "nombreCompleto",
    header: "Nombre Completo",
    cell: NombreCompletoCell,
  }),
  columnHelper.accessor('sexo', {
    id: "sexo",
    header: "Sexo",
    cell: SexoCell,
  }),
  columnHelper.accessor('fechaNacimiento', {
    id: "fechaNacimiento",
    header: "Fecha Nacimiento",
    cell: FechaNacimientoCell,
  }),
  columnHelper.accessor('telefono', {
    id: "telefono",
    header: "Teléfono",
  }),
  columnHelper.accessor('disciplinas_display', {
    id: "disciplinas",
    header: "Disciplinas",
    cell: ({ getValue }) => getValue()
  }),
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    cell: RowActions
  }),
];