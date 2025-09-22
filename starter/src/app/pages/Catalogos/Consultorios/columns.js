import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import {
  NombreCell,
  DireccionCell,
  CiudadCell,
  EstadoCell,
  PaisCell
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
    header: "Nombre del consultorio",
    cell: NombreCell,
  }),
  columnHelper.accessor(row => `${row.calle} ${row.numero} ${row.colonia} ${row.cp}`, {
    id: "direccion",
    header: "Dirección Completa",
    cell: DireccionCell,
  }),
  columnHelper.accessor('ciudad', {
    id: "ciudad",
    header: "Ciudad",
    cell: CiudadCell,
  }),
  columnHelper.accessor('estado', {
    id: "estado",
    header: "Estado",
    cell: EstadoCell,
  }),
  columnHelper.accessor('pais', {
    id: "pais",
    header: "País",
    cell: PaisCell,
  }),
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    cell: RowActions
  }),
];