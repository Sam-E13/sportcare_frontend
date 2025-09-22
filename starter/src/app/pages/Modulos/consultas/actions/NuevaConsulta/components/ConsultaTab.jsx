import { Input, Textarea } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { TextEditor } from "components/shared/form/TextEditor";

export const ConsultaTab = ({ consultaData, handleConsultaChange, handleTextEditorChange, handleDateChange }) => {
  return (
    <div className="space-y-8">
      {/* Información básica */}
      <div className="grid gap-6 md:grid-cols-2">
        <Textarea
          label="Motivo de Consulta"
          rows={3}
          placeholder="Describa el motivo de la consulta"
          name="motivo"
          value={consultaData.motivo}
          onChange={handleConsultaChange}
        />
        <DatePicker
          label="Fecha de Consulta"
          placeholder="Seleccione una fecha..."
          value={consultaData.fecha}
          onChange={handleDateChange}
        />
      </div>

      {/* Signos Vitales */}
      <div>
        <h3 className="text-sm font-medium text-primary mb-4 border-b border-primary/30 pb-2">Signos Vitales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Presión Arterial"
            name="presion_arterial"
            value={consultaData.presion_arterial}
            onChange={handleConsultaChange}
          />
          <Input
            label="Frec. Cardiaca"
            name="frecuencia_cardiaca"
            value={consultaData.frecuencia_cardiaca}
            onChange={handleConsultaChange}
          />
          <Input
            label="Frec. Respiratoria"
            name="frecuencia_respiratoria"
            value={consultaData.frecuencia_respiratoria}
            onChange={handleConsultaChange}
          />
          <Input
            label="Temperatura"
            name="temperatura"
            value={consultaData.temperatura}
            onChange={handleConsultaChange}
          />
        </div>
      </div>

      {/* Antecedentes */}
      <div>
        <h3 className="text-sm font-medium text-primary mb-4 border-b border-primary/30 pb-2">Antecedentes</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Textarea
            label="Antecedentes Familiares"
            rows={4}
            placeholder="Antecedentes familiares relevantes"
            name="antecedentes_familiares"
            value={consultaData.antecedentes_familiares}
            onChange={handleConsultaChange}
          />
          <Textarea
            label="Antecedentes No Patológicos"
            rows={4}
            placeholder="Antecedentes no patológicos"
            name="antecedentes_no_patologicos"
            value={consultaData.antecedentes_no_patologicos}
            onChange={handleConsultaChange}
          />
        </div>
      </div>

      {/* Diagnóstico y Tratamiento */}
      <div>
        <h3 className="text-sm font-medium text-primary mb-4 border-b border-primary/30 pb-2">Diagnóstico y Tratamiento</h3>
        <div className="space-y-6">
          <TextEditor
            label="Diagnóstico"
            rows={4}
            placeholder="Diagnóstico médico"
            value={consultaData.diagnostico}
            onChange={(content) => handleTextEditorChange("diagnostico", content)}
          />

          <TextEditor
            label="Tratamiento Prescrito"
            rows={3}
            placeholder="Indicaciones médicas y tratamiento"
            value={consultaData.tratamiento}
            onChange={(content) => handleTextEditorChange("tratamiento", content)}
          />
        </div>
      </div>
    </div>
  );
};