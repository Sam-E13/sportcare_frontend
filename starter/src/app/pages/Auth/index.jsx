// Import Dependencies
import { useState } from "react";
import { Link, } from "react-router";
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

// Local Imports
import Logo from "assets/appLogo.svg?react";
import { Button, Card, Checkbox, Input } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
// ----------------------------------------------------------------------

export default function SignInV1() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, errorMessage } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    const result = await login({ username, password });

    if (result.success) {
      console.log("Login successful:"); 
    }
  };

  return (
    <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
      <div className="w-full max-w-[26rem] p-4 sm:px-5">
        <div className="text-center">
          <Logo className="mx-auto size-16" />
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
              Bienvenido
            </h2>
            <p className="text-gray-400 dark:text-dark-300">
              Por favor inicie sesión para continuar
            </p>
          </div>
        </div>
        <Card className="mt-5 rounded-lg p-5 lg:p-7">
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Usuario"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                prefix={
                  <UserIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
              />
              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
              />

              <div className="flex items-center justify-between space-x-2">
                <Checkbox
                  label="Recuerdame"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Link
                  to="/recuperar-password"
                  className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
                >
                  Olvido su contraseña?
                </Link>
              </div>
            </div>

            <Button
              className="mt-5 w-full"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Iniciar Sesion" : "Iniciar Sesion"}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs+">
            <p className="line-clamp-1">
              <span>No tiene Cuenta?</span>{" "}
              <Link
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                to="/pages/sign-up-v1"
              >
                Crear Cuenta
              </Link>
            </p>
          </div>
          <div className="my-7 flex items-center space-x-3 text-xs rtl:space-x-reverse">
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
            <p>O</p>
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
          </div>
          <div className="flex gap-4">
            <Button className="h-10 flex-1 gap-3" variant="outlined">
              <img
                className="size-5.5"
                src="/images/100x100.png"
                alt="Google logo"
              />
              <span>Google</span>
            </Button>
            <Button className="h-10 flex-1 gap-3" variant="outlined">
              <img
                className="size-5.5"
                src="/images/100x100.png"
                alt="Github logo"
              />
              <span>Github</span>
            </Button>
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