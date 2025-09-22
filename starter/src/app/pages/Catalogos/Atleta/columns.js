import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import {
  NombreCompletoCell,
  SexoCell,
  FechaNacimientoCell,
  CURPCell,
  RFCell
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
  columnHelper.accessor('curp', {
    id: "curp",
    header: "CURP",
    cell: CURPCell,
  }),
  columnHelper.accessor('rfc', {
    id: "rfc",
    header: "RFC",
    cell: RFCell,
  }),
  columnHelper.accessor('deportes_display', {
    id: "deportes",
    label: "Deportes",
    header: "Deportes",
    cell: ({ getValue }) => getValue()
}),
  
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    cell: RowActions
  }),
];