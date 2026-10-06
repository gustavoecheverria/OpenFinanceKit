"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Portal renderiza componentes fuera del árbol DOM normal.
 * Útil para modales, tooltips, etc. que necesitan estar fuera del flujo.
 */
export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // Busca o crea un elemento #portal-root en el body
  let portalRoot = document.getElementById("portal-root");
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.id = "portal-root";
    portalRoot.setAttribute(
      "style",
      "position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;"
    );
    document.body.appendChild(portalRoot);
  }

  return createPortal(children, portalRoot);
}
