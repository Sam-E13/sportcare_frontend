import { DynamicLayout } from "app/layouts/DynamicLayout";

const publicRoutes = {
  id: "public",
  children: [
    
    {
      Component: DynamicLayout,
      children: [
        {
          path: "dashboards",
          children: [
            // ... otras rutas existentes ...
            
          ],
        },
      ],
    },
  ],
};

export { publicRoutes };