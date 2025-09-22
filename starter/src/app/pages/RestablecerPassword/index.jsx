// Import Dependencies
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Local Imports
import Logo from "assets/appLogo.svg?react";
import { Button, Card, Input } from "components/ui";
import { RestablecerContrasenaApi } from "./api/RestablecerContrasenaApi";

// ----------------------------------------------------------------------

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setMessage("Token de recuperación requerido.");
      setTokenValid(false);
    } else {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    }
  }, [searchParams]);

  const validateToken = async (tokenToValidate) => {
    try {
      const result = await RestablecerContrasenaApi.validarToken(tokenToValidate);
      
      if (result.success && result.valid) {
        setTokenValid(true);
        setUserEmail(result.userEmail || "");
      } else {
        setTokenValid(false);
        setMessage(result.message || "Token inválido o expirado.");
      }
    } catch {
      setTokenValid(false);
      setMessage("Error al validar el token.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Por favor completa todos los campos.");
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const result = await RestablecerContrasenaApi.restablecerContrasena(
        token, 
        password, 
        confirmPassword
      );
      
      if (result.success) {
        setMessage(result.message);
        setIsSuccess(true);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
      
    } catch {
      setMessage("Error al restablecer la contraseña. Inténtalo de nuevo.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <Logo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Validando...
              </h2>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
      <div className="w-full max-w-[26rem] p-4 sm:px-5">
        <div className="text-center">
          <Logo className="mx-auto size-16" />
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
              Restablecer Contraseña
            </h2>
            <p className="text-gray-400 dark:text-dark-300">
              {userEmail ? `Para: ${userEmail}` : "Ingresa tu nueva contraseña"}
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

          {!isSuccess && tokenValid ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Nueva Contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="size-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="size-5 text-gray-400" />
                      )}
                    </button>
                  }
                />
                
                <Input
                  label="Confirmar Contraseña"
                  placeholder="Confirma tu nueva contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="size-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="size-5 text-gray-400" />
                      )}
                    </button>
                  }
                />
              </div>

              <Button
                className="mt-5 w-full"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
              </Button>
            </form>
          ) : isSuccess ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-dark-300 mb-4">
                Serás redirigido al login en unos segundos...
              </p>
              <Button
                className="w-full"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Ir al Login Ahora
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Link
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                to="/recuperar-password"
              >
                Solicitar Nuevo Enlace
              </Link>
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