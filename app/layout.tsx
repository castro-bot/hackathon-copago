import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Estimador Agéntico — Copago Inteligente",
  description:
    "Asistente inteligente impulsado por IA para estimar copagos médicos. Consulta tu cobertura, calcula costos y obtén orientación personalizada.",
  keywords: ["copago", "seguro médico", "estimador", "IA", "cobertura"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'DM Sans', sans-serif",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}