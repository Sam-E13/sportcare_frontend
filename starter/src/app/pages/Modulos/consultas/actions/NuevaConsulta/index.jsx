import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { DocumentTextIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import { Select, Button, Card } from "components/ui";
import { ConsultaTab } from "./components/ConsultaTab";
import { EstudiosTab } from "./components/EstudiosTab";
import { useAuthContext } from "app/contexts/auth/context";
import { useEffect, useState } from "react";
import Quill from "quill"; // Import Quill
const Delta = Quill.import("delta"); // Import Delta from Quill
import { toast } from "sonner"; 
import { useNavigate } from "react-router";
import { Link } from "react-router";
import {
  getProfesionalByUserId,
  getAllAtletas,
  getCitasByProfesional,
  createConsulta,
} from "../../api/ConsultasApi";

const NuevaConsultaForm = () => {
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [profesional, setProfesional] = useState(null);
  const [loadingProfesional, setLoadingProfesional] = useState(true);
  const [atletas, setAtletas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to create a temporary Quill instance for HTML conversion
  const deltaToHtml = (delta) => {
    if (!delta || typeof delta.ops !== "object") {
      return ""; // Not a valid Delta or empty
    }
    // Check if the delta is effectively empty (e.g., just { ops: [] } or { ops: [{ insert: '\n' }] })
    if (
      delta.ops.length === 0 ||
      (delta.ops.length === 1 &&
        delta.ops[0].insert === "\n" &&
        Object.keys(delta.ops[0]).length === 1)
    ) {
      return "";
    }
    const tempContainer = document.createElement("div");
    const tempQuill = new Quill(tempContainer);
    tempQuill.setContents(delta);
    let html = tempQuill.root.innerHTML;
    // Quill often leaves <p><br></p> for an empty line, backend might prefer truly empty string
    if (html === "<p><br></p>") {
      html = "";
    }
    return html;
  };

  const [consultaData, setConsultaData] = useState({
    atleta: "",
    cita: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    antecedentes_familiares: "",
    antecedentes_no_patologicos: "", // Campo agregado
    presion_arterial: "",
    frecuencia_cardiaca: "",
    frecuencia_respiratoria: "", // Campo agregado
    temperatura: "", // Campo agregado
    diagnostico: new Delta(),
    tratamiento: new Delta(),
  });

  const [estudios, setEstudios] = useState([]);

  useEffect(() => {
    const fetchProfesional = async () => {
      setLoadingProfesional(true);
      try {
        if (isAuthenticated && user && user.id) {
          const response = await getProfesionalByUserId(user.id);
          if (
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            setProfesional(response.data[0]);
          } else if (response.data && !Array.isArray(response.data)) {
            setProfesional(response.data);
          } else {
            setProfesional(null);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del profesional:", error);
        setProfesional(null);
      } finally {
        setLoadingProfesional(false);
      }
    };
    fetchProfesional();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await getAllAtletas();
        setAtletas([
          { value: "", label: "Seleccione un Paciente", disabled: true },
          ...response.data.map((p) => ({
            label: p.nombre + " " + p.apPaterno + " " + p.apMaterno,
            value: p.id,
            disabled: false,
          })),
        ]);
      } catch (error) {
        console.error("Error al obtener atletas:", error);
      }
    };
    fetchAtletas();
  }, []);

  useEffect(() => {
    const fetchCitas = async () => {
      if (profesional && profesional.id) {
        try {
          const response = await getCitasByProfesional(profesional.id);
          setCitas(
            
            response.data.filter(
              (c) => c.estado == "Confirmada",
            ) || [],
          );
        } catch (error) {
          console.error("Error al obtener citas:", error);
        }
      } else {
        setCitas([]);
      }
    };
    fetchCitas();
  }, [profesional]);

  const handleConsultaChange = (e) => {
    const { name, value } = e.target;
    setConsultaData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (fieldName) => (dateFromPicker) => {
    const formattedDate = dateFromPicker
      ? new Date(dateFromPicker).toISOString().split("T")[0]
      : "";
      setConsultaData(prev => ({ ...prev, [fieldName]: formattedDate }));
  };


  // TextEditor's onChange prop calls this with the Delta object
  const handleTextEditorChange = (name, deltaContent) => {
    setConsultaData((prev) => ({ ...prev, [name]: deltaContent }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setConsultaData(prev => ({ ...prev, [name]: value }));
      
  };
  
  const handleSubmit = async () => {
    if (!profesional || !profesional.id) {
      toast.error("No se ha podido identificar al profesional de salud."); 
      return;
    }
    if (!consultaData.atleta) {
      toast.error("Por favor, seleccione un paciente."); 
      return;
    }
    if (!consultaData.motivo) {
      toast.error("Por favor, ingrese el motivo de la consulta."); 
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar
      const datosParaEnviar = {
        ...consultaData,
        profesional_salud: profesional.id, // Ya es un número
        atleta: consultaData.atleta ? parseInt(consultaData.atleta, 10) : null, // Convertir a número
        cita: consultaData.cita ? parseInt(consultaData.cita, 10) : null, // Convertir a número o null
        diagnostico: deltaToHtml(consultaData.diagnostico),
        tratamiento: deltaToHtml(consultaData.tratamiento),
        estudios: estudios.map((estudio) => ({
          ...estudio, // tipo_estudio debería ser un string aquí
          fecha_realizacion: estudio.fecha_realizacion,
          fecha_entrega: estudio.fecha_entrega || null,
          archivo: estudio.archivo instanceof File ? estudio.archivo : null,
        })),
      };
      console.log("Datos para enviar (corregidos):", datosParaEnviar); 

      await createConsulta(datosParaEnviar);

      toast.success("Consulta creada exitosamente!");
      //redirecciona al listado de consultas
      navigate("/modulos/consultas");
      // Resetear formulario
      setConsultaData({
        atleta: "",
        cita: "",
        fecha: new Date().toISOString().split("T")[0],
        motivo: "",
        antecedentes_familiares: "",
        presion_arterial: "",
        frecuencia_cardiaca: "",
        diagnostico: new Delta(),
        tratamiento: new Delta(),
      });
      setEstudios([]);
    } catch (error) {
      console.error("Error al crear la consulta:", error);
      let errorMessage = "Error al crear la consulta";
      if (error.response) {
        if (error.response.data) {
          errorMessage += `: ${JSON.stringify(error.response.data)}`;
        } else {
          errorMessage += `: ${error.response.statusText}`;
        }
      } else {
        errorMessage += `: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: "consulta",
      title: "Datos de Consulta",
      icon: DocumentTextIcon,
      component: (
        <ConsultaTab
          consultaData={consultaData}
          handleConsultaChange={handleConsultaChange}
          handleTextEditorChange={handleTextEditorChange}
          handleDateChange={handleDateChange}
        />
      ),
    },
    {
      id: "estudios",
      title: "Estudios Médicos",
      icon: FolderPlusIcon,
      component: <EstudiosTab estudios={estudios} setEstudios={setEstudios} />,
    },
  ];

  const citaOptions = [
    { value: "", label: "Sin cita asociada (Consulta libre)", disabled: false },
    ...citas.map((c) => ({
      value: c.id.toString(),
      label: `Cita ${c.id} - ${c.atleta_nombre} - ${c.slot_fecha} ${c.slot_hora_inicio}`,
    })),
  ];

  return (
    <div className="transition-content px-[--margin-x] pb-6">
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center gap-1">
          <DocumentTextIcon className="size-6" />
          <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
            Nueva Consulta Médica
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
          
            className="min-w-[7rem]"
            variant="outlined"
            onClick={() => {
              /* TODO: Handle cancel */
            }}
          >
            <Link to ="../consultas">
            Cancelar
            </Link>
          </Button>
          <Button
            className="min-w-[7rem]"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || loadingProfesional}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card className="p-4 sm:px-5">
            <TabGroup>
              <div className="mb-6 overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-800">
                <TabList className="flex">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      className={({ selected }) =>
                        `flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                          selected
                            ? "text-primary dark:text-primary-light bg-white dark:bg-dark-700"
                            : "text-gray-600 hover:bg-gray-200 dark:text-dark-300 dark:hover:bg-dark-600"
                        }`
                      }
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.title}</span>
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels>
                {tabs.map((tab) => (
                  <TabPanel key={tab.id} className="space-y-6">
                    {tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </Card>
        </div>

        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
          <Card className="p-4 sm:px-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-dark-100">
              Información Personal
            </h3>
            <div className="mt-5 space-y-5">
            <Select
                label="Paciente (Atleta)"
                name="atleta"
                placeholder="Seleccione atleta"
                data={atletas} // Aquí pasamos los datos obtenidos
                value={consultaData.atleta}
                onChange={handleSelectChange}
                
              />
              <Select
                label="Cita Agendada (Opcional)"
                name="cita"
                placeholder="Sin cita asociada o seleccione una cita"
                data={citaOptions}
                value={consultaData.cita}
                onChange={handleSelectChange}
                disabled={loadingProfesional || !profesional}
              />
              
            </div>
          </Card>

          <Card className="p-4 sm:px-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-dark-100">
              Resumen
            </h3>
            <div className="mt-5 space-y-5">
              <div className="text-sm text-gray-600 dark:text-dark-300">
                <p>
                  Profesional:{" "}
                  <span className="font-medium">
                    {loadingProfesional
                      ? "Cargando..."
                      : profesional
                        ? `Dr. ${profesional.nombre} ${profesional.apellido_paterno || ""}`
                        : "Usuario no identificado"}
                  </span>
                </p>
                <p>
                  Fecha Actual:{" "}
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </p>
                <p>
                  Estudios:{" "}
                  <span className="font-medium">
                    {estudios.length} agregado(s)
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NuevaConsultaForm;
