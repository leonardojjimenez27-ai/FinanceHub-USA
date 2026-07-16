import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: TestPage,
});

function TestPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-display text-4xl font-bold text-foreground">✅ Ruta de prueba funcionando</h1>
      <p className="mt-4 text-muted-foreground">
        Si ves este mensaje, el enrutador está funcionando correctamente.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Ahora prueba: <a href="/dashboard/stocks" className="text-accent underline">/dashboard/stocks</a>
      </p>
    </div>
  );
}