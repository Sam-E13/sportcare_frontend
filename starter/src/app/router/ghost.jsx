import GhostGuard from "middleware/GhostGuard";

const ghostRoutes = {
  id: "ghost",
  Component: GhostGuard,
  children: [
    {
      path: "login",
      lazy: async () => ({
        Component: (await import("app/pages/Auth")).default,
      }),
    },
    {
      path: "recuperar-password",
      lazy: async () => ({
        Component: (await import("app/pages/RecuperarPassword")).default,
      }),
    },
    {
      path: "restablecer-password",
      lazy: async () => ({
        Component: (await import("app/pages/RestablecerPassword")).default,
      }),
    },
  ],
};

export { ghostRoutes };
