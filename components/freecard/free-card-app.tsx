"use client";

import { useState } from "react";
import { Hero } from "@/components/freecard/hero";

export function FreeCardApp() {
  const [lightMode, setLightMode] = useState(false);

  return (
    <main className={lightMode ? "freecard-app light-mode" : "freecard-app"}>
      <Hero
        lightMode={lightMode}
        onToggleMode={() => setLightMode((current) => !current)}
      />
    </main>
  );
}
