// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    DateCell,
    ProfesionalCell,
    AtletaCell,
    DiagnosticoCell,
    TratamientoCell
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
   
    columnHelper.accessor((row) => row.atleta_nombre, {
        id: "atleta",
        label: "Atleta",
        header: "Paciente",
        cell: AtletaCell,
    }),
    columnHelper.accessor((row) => row.profesional_salud_nombre, {
        id: "profesional_salud",
        label: "Profesional de Salud",
        header: "Profesional",
        cell: ProfesionalCell,
    }),
    columnHelper.accessor((row) => row.fecha, {
        id: "fecha",
        label: "Fecha Consulta",
        header: "Fecha de Consulta",
        cell: DateCell,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.diagnostico, {
        id: "diagnostico",
        label: "Diagnóstico",
        header: "Diagnóstico",
        cell: DiagnosticoCell,
    }),
    columnHelper.accessor((row) => row.tratamiento, {
        id: "tratamiento",
        label: "Tratamiento",
        header: "Tratamiento",
        cell: TratamientoCell,
    }),
    columnHelper.display({
        id: "accions",
        label: "Row Actions",
        header: "Acciones",
        cell: RowActions
    }),
];