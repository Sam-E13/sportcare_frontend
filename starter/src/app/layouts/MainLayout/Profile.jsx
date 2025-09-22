// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { TbUser } from "react-icons/tb";
import { Link } from "react-router";
import { useAuthContext } from "app/contexts/auth/context"; // Importa el contexto

// Local Imports
import { Avatar, AvatarDot, Button } from "components/ui";

// ----------------------------------------------------------------------

const links = [
  {
    id: "1",
    title: "Perfil",
    description: "Datos de tu cuenta",
    to: "/settings/general",
    Icon: TbUser,
    color: "success",
  },
];

export function Profile() {
  const { user, logout } = useAuthContext(); // Obtén user y logout del contexto

  const handleLogout = async () => {
    try {
      await logout();
      // Redirige al login después de cerrar sesión si es necesario
      window.location.href = '/login';
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Popover className="relative">
      <PopoverButton
        as={Avatar}
        size={12}
        role="button"
        src="/images/100x100.png"
        alt="Profile"
        indicator={
          <AvatarDot color="success" className="ltr:right-0 rtl:left-0" />
        }
      />
      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-x-2 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="duration-200 ease-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-2 opacity-0"
      >
        <PopoverPanel
          anchor={{ to: "right end", gap: 12 }}
          className="z-[70] flex w-64 flex-col rounded-lg border border-gray-150 bg-white shadow-soft transition dark:border-dark-600 dark:bg-dark-700 dark:shadow-none"
        >
          {({ close }) => (
            <>
              <div className="flex items-center gap-4 rounded-t-lg bg-gray-100 px-4 py-5 dark:bg-dark-800">
                <Avatar
                  size={14}
                  src="/images/100x100.png"
                  alt="Profile"
                />
                <div>
                  <Link
                    className="text-base font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
                    to="/settings/general"
                  >
                    {user ? user.username : "Usuario"} {/* Muestra el nombre del usuario */}
                  </Link>

                  <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                    {user ? user.tipo_usuario || "Usuario" : "Invitado"} {/* Muestra el rol si existe */}
                  </p>
                </div>
              </div>
              <div className="flex flex-col pb-5 pt-2">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    to={link.to}
                    onClick={close}
                    className="group flex items-center gap-3 px-4 py-2 tracking-wide outline-none transition-all hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-600 dark:focus:bg-dark-600"
                  >
                    <Avatar
                      size={8}
                      initialColor={link.color}
                      classNames={{ display: "rounded-lg" }}
                    >
                      <link.Icon className="size-4.5" />
                    </Avatar>
                    <div>
                      <h2 className="font-medium text-gray-800 transition-colors group-hover:text-primary-600 group-focus:text-primary-600 dark:text-dark-100 dark:group-hover:text-primary-400 dark:group-focus:text-primary-400">
                        {link.title}
                      </h2>
                      <div className="truncate text-xs text-gray-400 dark:text-dark-300">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Button 
                    className="w-full gap-2"
                    onClick={handleLogout} // Agrega el manejador de logout
                  >
                    <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                    <span>Cerrar Sesion</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}