// Import Dependencies
import { useState } from "react";
import { Link } from "react-router";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

// Local Imports
import Logo from "assets/appLogo.svg?react";
import { Button, Card, Input } from "components/ui";
import { RecuperarContrasenaApi } from "./api/RecuperarContrasenaApi";

// ----------------------------------------------------------------------

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Por favor ingresa tu correo electrónico.");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const result = await RecuperarContrasenaApi.solicitarRecuperacion(email);
      
      if (result.success) {
        setMessage(result.message);
        setIsSuccess(true);
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
    } catch {
      setMessage("Error al enviar el correo de recuperación. Inténtalo de nuevo.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
      <div className="w-full max-w-[26rem] p-4 sm:px-5">
        <div className="text-center">
          <Logo className="mx-auto size-16" />
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-400 dark:text-dark-300">
              Ingresa tu correo electrónico para recibir un enlace de recuperación
            </p>
          </div>
        </div>
        <Card className="mt-5 rounded-lg p-5 lg:p-7">
          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              isSuccess 
                ? "bg-green-100 text-green-600" 
                : "bg-red-100 text-red-600"
            }`}>
              {message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Correo Electrónico"
                  placeholder="Ingresa tu correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                />
              </div>

              <Button
                className="mt-5 w-full"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar E-mail de Recuperación"}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <Button
                className="mt-5 w-full"
                color="primary"
                onClick={() => {
                  setMessage("");
                  setIsSuccess(false);
                  setEmail("");
                }}
              >
                Enviar Otro Enlace
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center text-xs+">
            <p className="line-clamp-1">
              <span>¿Recordaste tu contraseña?</span>{" "}
              <Link
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                to="/login"
              >
                Volver al Login
              </Link>
            </p>
          </div>
        </Card>
        <div className="mt-8 flex justify-center text-xs text-gray-400 dark:text-dark-300">
          <a href="##">Privacy Notice</a>
          <div className="mx-2.5 my-0.5 w-px bg-gray-200 dark:bg-dark-500"></div>
          <a href="##">Term of service</a>
        </div>
      </div>
    </main>
  );
}