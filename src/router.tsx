import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,

    context: {
      queryClient,
    },

    scrollRestoration: true,

    // React Query controla su propio stale state.
    // Esto hace que los loaders del Router vuelvan a ejecutarse
    // cuando corresponda.
    defaultPreloadStaleTime: 0,
  });

  // Integra React Query con el SSR de TanStack Router.
  setupRouterSsrQueryIntegration({
    router,
    queryClient,

    // IMPORTANTE:
    // Tu __root.tsx ya contiene QueryClientProvider.
    // Por eso evitamos envolver la aplicación dos veces.
    wrapQueryClient: false,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}