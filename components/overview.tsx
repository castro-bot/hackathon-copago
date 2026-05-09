"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6m-3-3v6" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Estimación de Copagos",
    description: "Calcula tu copago estimado basado en tu póliza y diagnóstico.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9Z" />
      </svg>
    ),
    title: "Análisis de Cobertura",
    description: "Verifica qué cubre tu seguro para procedimientos específicos.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "Respuestas Instantáneas",
    description: "Obtén información clara sobre tu seguro en segundos.",
  },
];

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="flex-1 flex items-center justify-center px-4"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          className="inline-flex"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(168,65%,38%)] to-[hsl(168,65%,28%)] flex items-center justify-center shadow-xl shadow-[hsl(168,65%,38%)]/15">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="white" opacity="0.9"/>
                <rect x="10" y="6" width="4" height="12" rx="1" fill="white"/>
                <rect x="6" y="10" width="12" height="4" rx="1" fill="white"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[hsl(152,60%,42%)] border-2 border-background flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="space-y-3"
        >
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            ¿En qué puedo ayudarte?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Soy tu asistente inteligente de copagos médicos. Describe tus síntomas o consulta para obtener una estimación.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 + index * 0.08, duration: 0.4 }}
              className="group p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-border hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300 text-left cursor-default"
            >
              <div className="w-9 h-9 rounded-lg bg-[hsl(168,65%,38%)]/10 text-[hsl(168,65%,38%)] flex items-center justify-center mb-3 group-hover:bg-[hsl(168,65%,38%)]/15 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
