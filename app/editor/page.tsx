"use client";

import { useState } from "react";
import { CoverEditor } from "@/components/freecard/cover-editor";

export default function EditorPage() {
  const [lightMode, setLightMode] = useState(false);

  return (
    <main className={lightMode ? "freecard-app light-mode" : "freecard-app"}>
      <CoverEditor
        lightMode={lightMode}
        onToggleMode={() => setLightMode((current) => !current)}
      />
    </main>
  );
}
