"use client";

import { Button } from "./ui/button";
import { motion } from "framer-motion";

const MedicalCrossIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="2" width="8" height="20" rx="2" fill="currentColor" />
    <rect x="2" y="8" width="20" height="8" rx="2" fill="currentColor" />
  </svg>
);

const policyStyles: Record<string, { color: string; label: string }> = {
  VidaSana: { color: "hsl(168, 65%, 38%)", label: "VidaSana" },
  SaludTotal: { color: "hsl(210, 100%, 52%)", label: "SaludTotal" },
  "EliteCare VIP": { color: "hsl(280, 60%, 50%)", label: "EliteCare VIP" },
};

export const Navbar = ({
  selectedPolicy,
}: {
  selectedPolicy?: string | null;
}) => {
  const policy = selectedPolicy ? policyStyles[selectedPolicy] : null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-xl bg-background/80"
    >
      <div className="flex items-center justify-between h-14 px-4 md:px-6 max-w-[1400px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(168,65%,38%)] to-[hsl(168,65%,28%)] text-white shadow-md shadow-[hsl(168,65%,38%)]/20">
            <MedicalCrossIcon size={18} />
          </div>
          <div className="flex flex-col">
            <h1
              className="text-[15px] font-bold leading-tight tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Estimador Agéntico
            </h1>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Asistente Inteligente de Copagos
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Policy badge */}
          {policy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                borderColor: `${policy.color}30`,
                backgroundColor: `${policy.color}10`,
                color: policy.color,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: policy.color }}
              />
              {policy.label}
            </motion.div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5 hidden sm:inline-flex"
            onClick={() => window.location.reload()}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Nueva Consulta
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:hidden"
            onClick={() => window.location.reload()}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
