
import { useState } from "react";
import { Button, Input, Textarea, Select } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { FilePond } from "components/shared/form/Filepond";
import { EstudiosList } from "./EstudiosList";
import { toast } from "sonner";

const tiposEstudio = [
  { value: "LAB", label: "Análisis de Laboratorio" },
  { value: "IMG", label: "Estudio de Imagen" },
  { value: "CAR", label: "Cardiología" },
  { value: "NEU", label: "Neurológico" },
  { value: "ODO", label: "Odontológico" },
  { value: "OFT", label: "Oftalmológico" },
  { value: "OTR", label: "Otros" },
];

const initialCurrentEstudioState = {
    id: Date.now(),
    tipo_estudio: "",
    nombre: "",
    resultado: "",
    fecha_realizacion: new Date().toISOString().split("T")[0], // "YYYY-MM-DD"
    fecha_entrega: "",     // Opcional
    archivo: null,
};

export const EstudiosTab = ({ estudios, setEstudios }) => {
  const [currentEstudio, setCurrentEstudio] = useState(initialCurrentEstudioState);
  

  const handleAddEstudio = () => {
    if (!currentEstudio.tipo_estudio) {
        toast.error("Por favor seleccione el tipo de estudio");
        return;
    }
    if (!currentEstudio.resultado) {
        toast.error("Por favor ingrese los resultados del estudio");
        return;
    }
    if (!currentEstudio.fecha_realizacion) {
        toast.error("Por favor ingrese la fecha de realización");
        return;
    }
    // El archivo es opcional, no forzar validación aquí

    setEstudios([...estudios, {
        ...currentEstudio,
        id: Date.now()
    }]);
    setCurrentEstudio({
        ...initialCurrentEstudioState,
        id: Date.now()
    });
  };

  // Generic handler for most input types (text, select, textarea)
  const handleEstudioFieldChange = (field, value) => {
    setCurrentEstudio(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setCurrentEstudio(prev => ({ ...prev, [name]: value }));
      
  };

  // DatePicker handler: siempre guardar en formato YYYY-MM-DD
  const handleEstudioDateChange = (fieldName) => (dateFromPicker) => {
    const formattedDate = dateFromPicker
      ? new Date(dateFromPicker).toISOString().split("T")[0]
      : "";
    setCurrentEstudio(prev => ({ ...prev, [fieldName]: formattedDate }));
  };

  // Specific handler for FilePond
  const handleEstudioFileChange = (file) => {
    setCurrentEstudio(prev => ({ ...prev, archivo: file }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Select
            label="Tipo de Estudio"
            name="tipo_estudio"
            data={tiposEstudio}
            value={currentEstudio.tipo_estudio}
            onChange={handleSelectChange}
            placeholder="Seleccione tipo"
          />
          <Input
            label="Nombre del Estudio (Opcional)"
            value={currentEstudio.nombre}
            onChange={(e) =>
              handleEstudioFieldChange("nombre", e.target.value)
            }
            placeholder="Ej: Hemograma completo"
          />
        </div>

        <div className="space-y-4">
          <DatePicker
            label="Fecha de Realización"
            value={currentEstudio.fecha_realizacion} // Value is "YYYY-MM-DD" string
            onChange={handleEstudioDateChange("fecha_realizacion")}
          />
          <DatePicker
            label="Fecha de Entrega (Opcional)"
            value={currentEstudio.fecha_entrega} // Value is "YYYY-MM-DD" string
            onChange={handleEstudioDateChange("fecha_entrega")}
          />
        </div>
      </div>

      <FilePond
        label="Archivo del Estudio (Opcional si se proporciona enlace)"
        files={currentEstudio.archivo ? [currentEstudio.archivo] : []}
        onupdatefiles={(fileItems) => {
          const file = fileItems.length > 0 ? fileItems[0].file : null;
          handleEstudioFileChange(file); // Use specific file handler
        }}
        onremovefile={() => {
          handleEstudioFileChange(null); // Use specific file handler
        }}
        allowMultiple={false}
        maxFiles={1}
        name="estudio_archivo"
        acceptedFileTypes={["application/pdf"]} // Solo PDF
        labelIdle='Arrastra y suelta tu archivo o <span class="filepond--label-action">Explora</span>'
      />

      <Textarea
        label="Resultados"
        rows={4}
        value={currentEstudio.resultado}
        onChange={(e) =>
          handleEstudioFieldChange("resultado", e.target.value)
        }
        placeholder="Descripción detallada de los resultados"
      />

      <div className="flex justify-end">
        <Button
          onClick={handleAddEstudio}
          disabled={!currentEstudio.tipo_estudio || !currentEstudio.resultado || !currentEstudio.fecha_realizacion}
          className="min-w-[150px]"
        >
          Agregar Estudio
        </Button>
      </div>

      <EstudiosList
        estudios={estudios}
        onRemove={(idToRemove) =>
          setEstudios(estudios.filter((estudio) => estudio.id !== idToRemove))
        }
      />
    </div>
  );
};