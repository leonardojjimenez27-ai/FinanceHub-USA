import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const attachSupabaseAuth = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const request = getRequest();
  
  // Si no hay request, pasamos sin autenticación
  if (!request) {
    return next();
  }

  // Aquí puedes agregar lógica de autenticación si es necesario
  // Por ahora, solo pasamos al siguiente middleware
  return next();
});