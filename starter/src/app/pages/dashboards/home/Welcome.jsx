// Local Imports
import Doctor from "assets/illustrations/doctor.svg?react";
import { Button, Card } from "components/ui";
import { useEffect, useState } from "react";
import { getProfesionalByUserId } from "./api/profesional-user";
import { useAuthContext } from "app/contexts/auth/context"; // Importamos el contexto de autenticación

// ----------------------------------------------------------------------

export function Welcome() {
  const { isAuthenticated, user } = useAuthContext(); // Obtenemos el usuario del contexto
  const [profesional, setProfesional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesional = async () => {
      try {
        // Verificamos si estamos autenticados y si tenemos la información del usuario
        if (isAuthenticated && user && user.id) {
          const response = await getProfesionalByUserId(user.id);
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setProfesional(response.data[0]);
          } else if (response.data) {
            setProfesional(response.data);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del profesional:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesional();
  }, [isAuthenticated, user]);

  // Determinar el saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas Noches";
  };

  const getBuenosDeseos = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Ten un buen día de trabajo";
    if (hour < 18) return "Ten una buena tarde de trabajo";
    return "Deberias descansar un poco";
  };


  return (
    <Card className="col-span-12 mt-12 flex flex-col bg-gradient-to-r from-blue-500 to-blue-600 p-5 sm:col-span-8 sm:mt-0 sm:flex-row">
      <div className="flex justify-center sm:order-last">
        <Doctor className="-mt-16 h-40 sm:mt-0" />
      </div>
      <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-start">
        <h3 className="text-xl">
          {getGreeting()}, <span className="font-semibold">
            {loading ? "..." : profesional ? `Dr. ${profesional.nombre}` : "Usuario"}
          </span>
        </h3>
        <p className="mt-2 leading-relaxed">{getBuenosDeseos()}</p>
        

        <Button
          unstyled
          className="mt-6 rounded-lg px-5 py-2 border border-white/10 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30"
        >
          Ver Agenda
        </Button>
      </div>
    </Card>
  );
}