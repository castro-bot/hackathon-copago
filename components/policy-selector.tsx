"use client";

import { motion, AnimatePresence } from "framer-motion";

const policies = [
  {
    id: "VidaSana",
    name: "VidaSana",
    tagline: "Plan Esencial",
    description:
      "Cobertura médica fundamental con acceso a red de especialistas y laboratorios.",
    color: "168, 65%, 38%",
    gradient: "from-[hsl(168,65%,42%)] to-[hsl(168,65%,28%)]",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    ),
    features: ["Red de especialistas", "Laboratorios básicos", "Consultas generales"],
  },
  {
    id: "SaludTotal",
    name: "SaludTotal",
    tagline: "Plan Completo",
    description:
      "Cobertura ampliada con beneficios adicionales en diagnóstico e imagenología.",
    color: "210, 100%, 52%",
    gradient: "from-[hsl(210,100%,56%)] to-[hsl(210,100%,40%)]",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12h6m-3-3v6" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: ["Todo de VidaSana", "Imagenología con copago reducido", "Más especialidades"],
  },
  {
    id: "EliteCare VIP",
    name: "EliteCare VIP",
    tagline: "Plan Premium",
    description:
      "La cobertura más completa: sin copagos en imagenología y acceso prioritario.",
    color: "280, 60%, 50%",
    gradient: "from-[hsl(280,60%,55%)] to-[hsl(280,60%,38%)]",
    popular: true,
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
      </svg>
    ),
    features: ["Todo de SaludTotal", "Sin copago en imagenología", "Acceso VIP prioritario"],
  },
];

export function PolicySelector({
  onSelect,
}: {
  onSelect: (policyId: string) => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="policy-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl px-4 sm:px-6"
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              className="inline-flex mb-5"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(168,65%,38%)] to-[hsl(168,65%,28%)] flex items-center justify-center shadow-xl shadow-[hsl(168,65%,38%)]/20">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="8"
                      y="2"
                      width="8"
                      height="20"
                      rx="2"
                      fill="white"
                    />
                    <rect
                      x="2"
                      y="8"
                      width="20"
                      height="8"
                      rx="2"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[hsl(38,92%,50%)] border-2 border-background flex items-center justify-center">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Selecciona tu Póliza de Seguro
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto"
            >
              Para brindarte una estimación precisa de copagos, necesitamos
              saber cuál es tu plan de seguro médico.
            </motion.p>
          </div>

          {/* Policy cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {policies.map((policy, index) => (
              <motion.button
                key={policy.id}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.45 + index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                onClick={() => onSelect(policy.id)}
                className="group relative flex flex-col text-left p-5 sm:p-6 rounded-2xl border border-border/70 bg-card/80 hover:bg-card hover:border-transparent hover:shadow-2xl transition-all duration-400 cursor-pointer overflow-hidden"
                style={
                  {
                    "--card-color": policy.color,
                  } as React.CSSProperties
                }
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, hsl(${policy.color} / 0.08) 0%, transparent 70%)`,
                  }}
                />

                {/* Popular badge */}
                {"popular" in policy && policy.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[hsl(280,60%,50%)]/10 text-[hsl(280,60%,50%)] border border-[hsl(280,60%,50%)]/20">
                      Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${policy.gradient} text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                  style={{
                    boxShadow: `0 8px 24px hsl(${policy.color} / 0.2)`,
                  }}
                >
                  {policy.icon}
                </div>

                {/* Text */}
                <div className="relative">
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider mb-1 block"
                    style={{ color: `hsl(${policy.color})` }}
                  >
                    {policy.tagline}
                  </span>
                  <h3
                    className="text-lg font-bold text-foreground mb-1.5"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {policy.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {policy.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-1.5 mb-5">
                    {policy.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ color: `hsl(${policy.color})` }}
                          className="shrink-0"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div
                    className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${policy.gradient} text-white text-sm font-semibold text-center opacity-80 group-hover:opacity-100 group-hover:shadow-lg transition-all duration-300`}
                    style={{
                      boxShadow: `0 4px 16px hsl(${policy.color} / 0.15)`,
                    }}
                  >
                    Seleccionar
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
