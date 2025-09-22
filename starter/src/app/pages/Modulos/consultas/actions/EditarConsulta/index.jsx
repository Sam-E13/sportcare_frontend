import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { DocumentTextIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import { Select, Button, Card } from "components/ui";
import { ConsultaTab } from "../NuevaConsulta/components/ConsultaTab";
import { EstudiosTab } from "../NuevaConsulta/components/EstudiosTab";
import { useAuthContext } from "app/contexts/auth/context";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Quill from "quill"; // Import Quill
const Delta = Quill.import("delta"); // Import Delta from Quill
import { toast } from "sonner"; 
//import { Link } from "react-router";
import {
  getProfesionalByUserId,
  getAllAtletas,
  getCitasByProfesional,
  getConsultaById,
  updateConsulta,
} from "../../api/ConsultasApi";

const EditarConsultaForm = () => {
  const { consultaId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const [profesional, setProfesional] = useState(null);
  const [loadingProfesional, setLoadingProfesional] = useState(true);
  const [loadingConsulta, setLoadingConsulta] = useState(true);
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

  // Helper to convert HTML to Delta
  const htmlToDelta = (html) => {
    if (!html || html.trim() === "") {
      return new Delta();
    }
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = html;
    const tempQuill = new Quill(tempContainer);
    return tempQuill.getContents();
  };

  const [consultaData, setConsultaData] = useState({
    atleta: "",
    cita: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    antecedentes_familiares: "",
    antecedentes_no_patologicos: "",
    presion_arterial: "",
    frecuencia_cardiaca: "",
    frecuencia_respiratoria: "",
    temperatura: "",
    diagnostico: new Delta(), // Initialize with an empty Delta
    tratamiento: new Delta(), // Initialize with an empty Delta
    observaciones: "",
  });

  const [estudios, setEstudios] = useState([]);

  // Cargar datos del profesional
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

  // Cargar datos de la consulta
  useEffect(() => {
    const fetchConsulta = async () => {
      if (!consultaId) return;
      
      setLoadingConsulta(true);
      try {
        const response = await getConsultaById(consultaId);
        const consulta = response.data;
        
        setConsultaData({
          atleta: consulta.atleta?.toString() || "",
          cita: consulta.cita?.toString() || "",
          fecha: consulta.fecha || new Date().toISOString().split("T")[0],
          motivo: consulta.motivo || "",
          antecedentes_familiares: consulta.antecedentes_familiares || "",
          antecedentes_no_patologicos: consulta.antecedentes_no_patologicos || "",
          presion_arterial: consulta.presion_arterial || "",
          frecuencia_cardiaca: consulta.frecuencia_cardiaca || "",
          frecuencia_respiratoria: consulta.frecuencia_respiratoria || "",
          temperatura: consulta.temperatura || "",
          diagnostico: htmlToDelta(consulta.diagnostico || ""),
          tratamiento: htmlToDelta(consulta.tratamiento || ""),
          observaciones: consulta.observaciones || "",
        });

        // Cargar estudios si existen
        if (consulta.estudios && consulta.estudios.length > 0) {
          const estudiosFormateados = consulta.estudios.map(estudio => ({
            id: estudio.id || Date.now() + Math.random(),
            tipo_estudio: estudio.tipo_estudio,
            nombre: estudio.nombre || "",
            resultado: estudio.resultado,
            fecha_realizacion: estudio.fecha_realizacion,
            fecha_entrega: estudio.fecha_entrega || "",
            observaciones: estudio.observaciones || "",
            // Para archivos existentes, crear un objeto que el componente pueda mostrar
            archivo: estudio.archivo ? {
              name: estudio.archivo.split('/').pop(),
              url: estudio.archivo,
              isExisting: true
            } : null,
          }));
          
          setEstudios(estudiosFormateados);
        } else {
          setEstudios([]);
        }

      } catch (error) {
        console.error("Error al cargar la consulta:", error);
        toast.error("Error al cargar los datos de la consulta");
        navigate("/modulos/consultas");
      } finally {
        setLoadingConsulta(false);
      }
    };

    fetchConsulta();
  }, [consultaId, navigate]);

  // Cargar atletas
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

  // Cargar citas del profesional
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
        profesional_salud: profesional.id,
        atleta: consultaData.atleta ? parseInt(consultaData.atleta, 10) : null,
        cita: consultaData.cita ? parseInt(consultaData.cita, 10) : null,
        diagnostico: deltaToHtml(consultaData.diagnostico),
        tratamiento: deltaToHtml(consultaData.tratamiento),
        estudios: estudios.map((estudio) => ({
          tipo_estudio: estudio.tipo_estudio,
          nombre: estudio.nombre || "",
          resultado: estudio.resultado,
          fecha_realizacion: estudio.fecha_realizacion,
          fecha_entrega: estudio.fecha_entrega || null,
          observaciones: estudio.observaciones || "",
          // Solo incluir archivo si es un File nuevo
          archivo: (estudio.archivo instanceof File) ? estudio.archivo : null,
        })),
      };


      await updateConsulta(consultaId, datosParaEnviar);

      toast.success("Consulta actualizada exitosamente!"); 
      navigate("/modulos/consultas");
      
    } catch (error) {
      console.error("Error al actualizar la consulta:", error);
      let errorMessage = "Error al actualizar la consulta";
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

  if (loadingConsulta || loadingProfesional) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando datos de la consulta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-content px-[--margin-x] pb-6">
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center gap-1">
          <DocumentTextIcon className="size-6" />
          <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
            Editar Consulta Médica
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            className="min-w-[7rem]"
            variant="outlined"
            onClick={() => navigate("/modulos/consultas")}
          >
            Cancelar
          </Button>
          <Button
            className="min-w-[7rem]"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || loadingProfesional}
          >
            {isSubmitting ? "Actualizando..." : "Actualizar"}
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
                data={atletas}
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
                  Fecha de Consulta:{" "}
                  <span className="font-medium">
                    {consultaData.fecha ? new Date(consultaData.fecha).toLocaleDateString() : "No especificada"}
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

export default EditarConsultaForm;