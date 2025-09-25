import { Navigate } from "react-router";
// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";


// ----------------------------------------------------------------------



const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            {
              path:"PerfilAtleta",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/PerfilAtleta")).default,
              }),
            },
            {
              path: "Atleta",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/atletas")).default,
              }),
              // Proteger esta ruta solo para profesionales de salud
              
            },
          ],
        },
        {
          path: "catalogos",
          children: [
            {
              path: "deporte",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/deporte/index.jsx")).default,
              }),
            },
            {
              path: "grupoDeportivo",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/grupoDeportivo")).default,
              }),
            }, 
            {
              path: "metodologo",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/metodologo")).default,
              }),
            }, 
            {
              path: "horarios",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/horarios")).default,
              }),
            },
            {
              path: "disponibilidad-temporal",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/disponibilidadTemporal")).default,
              }),
            },
            {
              path: "atleta",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/Atleta")).default,
              }),
            },
            {
              path: "entrenadores",
              lazy: async () => ({
                Component: (await import("app/pages/catalogos/entrenadores")).default,
              }),
            },
            {
              path: "categorias",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (await import("app/pages/Catalogos/Categorias")).default,
                  }),
                },
              ],
            },
            {
              path: "responsable",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (await import("app/pages/Catalogos/Responsable")).default,
                  }),
                },
                {
                  path: ":atletaId",
                  lazy: async () => ({
                    Component: (await import("app/pages/Catalogos/Responsable")).default,
                  }),
                },
                
              ],
            },
            {
              path: "consultorios",
              lazy: async () => ({
                Component: (await import("app/pages/Catalogos/Consultorios")).default,
              }),
            },
          ],
        },
        {
          path: "modulos",
          children: [
            {
              path: "agendar-citas",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/agendar-citas")).default,
              }),
            },
            //CONSULTAS
            {
              path: "consultas",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/consultas")).default,
              }),
            },
            {
              path: "consultas/nueva-consulta",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/consultas/actions/NuevaConsulta")).default,
              }),
            },
            {
              path: "reportesCitas",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/reportesCitas")).default,
              }),
            },  
            {
              path: "reportesConsultas",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/reportesConsultas")).default,
              }),
            },
            {
              path: "Programas-Entrenamiento",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/programa-entrenamiento")).default,
              }),
            },
            {
              path: "Programas-Entrenamiento/nuevo", 
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/programa-entrenamiento/actions/GestionarPrograma")).default,
              }),
            },
            // RUTA PARA EDITAR un programa existente
            {
              path: "Programas-Entrenamiento/editar/:programaId", // Ruta dinámica con el ID
              lazy: async () => ({
                // CAMBIO: Apunta al MISMO componente renombrado
                Component: (await import("app/pages/Modulos/programa-entrenamiento/actions/GestionarPrograma")).default,
              }),
            },  
            //asignacion de programas de entrenamiento
            {
              path: "asignar-programas",
              lazy: async () => ({
                Component: (await import("app/pages/Modulos/asignacion-programas")).default,
              }),
            },
          ],
        },
        {
          path: "errores",
          children: [
            {
              index: true,
              element: <Navigate to="pages/errors/RootErrorBoundary" />,
            },
          ],
        },
      ],
    },
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General")).default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/Appearance")).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };