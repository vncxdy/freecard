"use client";

import { ChangeEvent, PointerEvent, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BringToFront,
  CassetteTape,
  Disc3,
  Download,
  Layers,
  Moon,
  RotateCcw,
  RotateCw,
  Shuffle,
  Sparkles,
  SquareDashedMousePointer,
  StickyNote,
  Sticker,
  TextCursorInput,
  Trash2,
  Upload,
  Sun,
  WandSparkles
} from "lucide-react";
import { toPng } from "html-to-image";
import { templates, type CoverTemplate, type TemplateKey } from "./templates";
import { siteLinks, stickerPresets, type StickerPreset } from "./site-pages";
import type { EditorElement, EditorState } from "./types";

type HistoryState = {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
};

type DragMode = "move" | "resize" | "rotate";

type ActiveDrag =
  | {
      id: string;
      mode: DragMode;
      startX: number;
      startY: number;
      element: EditorElement;
    }
  | undefined;

const initialState: EditorState = {
  activePage: 0,
  pageCount: 2,
  spineText: "FREECARD MIX VOL. 00",
  effect: "crt",
  texture: "paper",
  elements: [
    {
      id: "title",
      type: "text",
      x: 9,
      y: 10,
      width: 66,
      height: 18,
      rotation: -4,
      z: 3,
      opacity: 1,
      pageIndex: 0,
      text: "FREECARD RADIO",
      color: "#fff200",
      background: "rgba(0, 0, 0, 0.62)",
      fontSize: 34,
      fontFamily: "var(--font-display)"
    },
    {
      id: "advisory",
      type: "advisory",
      x: 8,
      y: 72,
      width: 30,
      height: 14,
      rotation: 2,
      z: 4,
      opacity: 1,
      pageIndex: 0,
      text: "FREE CONTENT",
      color: "#ffffff",
      background: "#000000",
      fontSize: 13
    },
    {
      id: "tracklist",
      type: "tracklist",
      x: 52,
      y: 58,
      width: 36,
      height: 28,
      rotation: -2,
      z: 5,
      opacity: 0.95,
      pageIndex: 0,
      text: "01 NO CREDITS\n02 PNGS ARE FREE\n03 BANK ACCOUNT LIVES\n04 EXPORT AGAIN",
      color: "#101010",
      background: "#f3efe0",
      fontSize: 12,
      fontFamily: "var(--font-marker)"
    }
  ]
};

function cloneState(state: EditorState): EditorState {
  return {
    ...state,
    elements: state.elements.map((element) => ({ ...element }))
  };
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pageLabel(template: CoverTemplate, index: number) {
  const labels: Partial<Record<TemplateKey, string[]>> = {
    cd: ["Front", "Back Tray", "Disc"],
    cassette: ["J-card Front", "Inside Panel", "Back Flap", "Fold 4", "Fold 5", "Fold 6"],
    vhs: ["Front", "Back", "Spine/Insert"],
    dvd: ["Front", "Back", "Insert"],
    ps1: ["Front", "Back", "Manual"],
    vinyl: ["Front", "Back", "Insert", "Center Label"],
    floppy: ["Label"],
    poster: ["Poster"],
    magazine: ["Cover", "Spread 1", "Spread 2", "Back", "Bonus 5", "Bonus 6", "Bonus 7", "Bonus 8"]
  };

  return labels[template.key]?.[index] ?? `Panel ${index + 1}`;
}

function useEditorHistory() {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: []
  });

  function commit(updater: (state: EditorState) => EditorState) {
    setHistory((current) => {
      const next = updater(cloneState(current.present));
      return {
        past: [...current.past, current.present].slice(-50),
        present: next,
        future: []
      };
    });
  }

  function undo() {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future]
      };
    });
  }

  function redo() {
    setHistory((current) => {
      const next = current.future[0];
      if (!next) return current;
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1)
      };
    });
  }

  return {
    state: history.present,
    commit,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  };
}

export function CoverEditor({
  lightMode,
  onToggleMode
}: {
  lightMode?: boolean;
  onToggleMode?: () => void;
}) {
  const [templateKey, setTemplateKey] = useState<TemplateKey>("cd");
  const [selectedId, setSelectedId] = useState("title");
  const [notice, setNotice] = useState("No premium plan. Terrifying concept, we know.");
  const { state, commit, undo, redo, canUndo, canRedo } = useEditorHistory();
  const activeDrag = useRef<ActiveDrag>(undefined);
  const canvasRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const stickerDropCount = useRef(0);

  const template = useMemo(
    () => templates.find((item) => item.key === templateKey) ?? templates[0],
    [templateKey]
  );
  const activeElements = state.elements.filter(
    (element) => (element.pageIndex ?? 0) === state.activePage
  );
  const selected = activeElements.find((element) => element.id === selectedId);

  function updateElement(id: string, updater: (element: EditorElement) => EditorElement) {
    commit((current) => ({
      ...current,
      elements: current.elements.map((element) => (element.id === id ? updater(element) : element))
    }));
  }

  function addElement(element: Omit<EditorElement, "id" | "z" | "pageIndex">) {
    const id = createId(element.type);
    commit((current) => ({
      ...current,
      elements: [
        ...current.elements,
        {
          ...element,
          id,
          z: current.elements.length + 1,
          pageIndex: current.activePage
        }
      ]
    }));
    setSelectedId(id);
  }

  function setActivePage(pageIndex: number) {
    commit((current) => ({
      ...current,
      activePage: clamp(pageIndex, 0, current.pageCount - 1)
    }));
    setSelectedId("");
  }

  function setPageCount(pageCount: number) {
    const nextCount = clamp(pageCount, 1, template.maxPages);
    commit((current) => ({
      ...current,
      pageCount: nextCount,
      activePage: clamp(current.activePage, 0, nextCount - 1)
    }));
    setSelectedId("");
    setNotice(`${nextCount} ${nextCount === 1 ? "page" : "pages"} active. Still $0, which is suspiciously reasonable.`);
  }

  function addText(type: "text" | "note" | "tracklist" = "text") {
    const copy = {
      text: "TEXT IS FREE. WE ARE ALSO CONFUSED.",
      note: "handwritten note:\nno watermark today",
      tracklist: "01 FREE EXPORT\n02 NO TOKENS\n03 PLEASE REWIND\n04 NICE"
    }[type];

    addElement({
      type,
      x: 14,
      y: type === "tracklist" ? 58 : 24,
      width: type === "tracklist" ? 38 : 54,
      height: type === "tracklist" ? 28 : 16,
      rotation: type === "note" ? -7 : -2,
      opacity: 1,
      text: copy,
      color: "#111111",
      background: type === "text" ? "#ffef4a" : "#f8f0d0",
      fontSize: type === "text" ? 22 : 13,
      fontFamily: type === "text" ? "var(--font-display)" : "var(--font-marker)"
    });
  }

  function addAlbumArtBlock() {
    addElement({
      type: "text",
      x: 8,
      y: 10,
      width: 46,
      height: 46,
      rotation: -1,
      opacity: 0.96,
      text: "ALBUM\nCOVER\nART",
      color: "#fff9d8",
      background: "rgba(0, 0, 0, 0.72)",
      fontSize: 26,
      fontFamily: "var(--font-display)"
    });
    setNotice("Album art block placed. Upload art over it or leave it cryptic and call it intentional.");
  }

  function addSongListBlock() {
    addElement({
      type: "tracklist",
      x: 56,
      y: 16,
      width: 35,
      height: 48,
      rotation: 1,
      opacity: 0.96,
      text: "01 OPENING CREDIT\n02 MADE IN INDONESIA\n03 J-CARD ECONOMICS\n04 FREE EXPORTS\n05 PLEASE REWIND\n06 BONUS TRACK",
      color: "#111111",
      background: "#f3efe0",
      fontSize: 11,
      fontFamily: "var(--font-marker)"
    });
    setNotice("Song list block placed. Track counts are free, which apparently needed saying.");
  }

  function addMediaLayout() {
    addAlbumArtBlock();
    addSongListBlock();
    addElement({
      type: "text",
      x: 9,
      y: 62,
      width: 55,
      height: 14,
      rotation: -2,
      opacity: 1,
      text: "ARTIST / TITLE / YEAR",
      color: "#111111",
      background: "#f8ea36",
      fontSize: 18,
      fontFamily: "var(--font-display)"
    });
    setNotice("Starter media layout placed. Would someone charge $20 for this? Sadly, probably.");
  }

  function addSticker() {
    const label = stickerPresets[stickerDropCount.current % stickerPresets.length];
    addPresetSticker(label);
  }

  function addPresetSticker(preset: StickerPreset) {
    const dropIndex = stickerDropCount.current;
    stickerDropCount.current += 1;
    const x = 10 + ((dropIndex * 17) % 58);
    const y = 12 + ((dropIndex * 23) % 58);
    const rotation = preset.rotation ?? -10 + ((dropIndex * 7) % 20);

    addElement({
      type: preset.type ?? "sticker",
      x,
      y,
      width: preset.width,
      height: preset.height,
      rotation,
      opacity: 1,
      text: preset.text,
      color: preset.color,
      background: preset.background,
      fontSize: preset.fontSize,
      fontFamily: preset.fontFamily
    });
    setNotice(`${preset.label} dropped onto the cover. Still not a microtransaction.`);
  }

  function addBarcode() {
    addElement({
      type: "barcode",
      x: 60,
      y: 82,
      width: 29,
      height: 10,
      rotation: 0,
      opacity: 1,
      text: "0 00000 FREE 00",
      color: "#000000",
      background: "#ffffff",
      fontSize: 8
    });
  }

  function addAdvisory() {
    addElement({
      type: "advisory",
      x: 9,
      y: 74,
      width: 29,
      height: 13,
      rotation: -1,
      opacity: 1,
      text: "FREE CONTENT",
      color: "#ffffff",
      background: "#000000",
      fontSize: 12
    });
  }

  function addScratch() {
    addElement({
      type: "scratch",
      x: 8 + Math.random() * 60,
      y: 10 + Math.random() * 68,
      width: 42,
      height: 2,
      rotation: -25 + Math.random() * 50,
      opacity: 0.5,
      color: "#ffffff",
      background: "transparent",
      fontSize: 10
    });
  }

  function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      addElement({
        type: "image",
        src: String(reader.result),
        x: 16,
        y: 18,
        width: 62,
        height: 52,
        rotation: -2,
        opacity: 1,
        filter: "contrast(1.08) saturate(1.25)",
        background: "transparent"
      });
      setNotice("Image uploaded. 0 credits used because dignity is possible.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function onCanvasPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = activeDrag.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dx = ((event.clientX - drag.startX) / rect.width) * 100;
    const dy = ((event.clientY - drag.startY) / rect.height) * 100;

    updateElement(drag.id, (element) => {
      if (drag.mode === "move") {
        return {
          ...element,
          x: clamp(drag.element.x + dx, -20, 112),
          y: clamp(drag.element.y + dy, -20, 112)
        };
      }

      if (drag.mode === "resize") {
        return {
          ...element,
          width: clamp(drag.element.width + dx, 7, 120),
          height: clamp(drag.element.height + dy, 4, 120)
        };
      }

      return {
        ...element,
        rotation: drag.element.rotation + dx * 1.35
      };
    });
  }

  function startDrag(
    event: PointerEvent<HTMLElement>,
    element: EditorElement,
    mode: DragMode
  ) {
    event.stopPropagation();
    setSelectedId(element.id);
    activeDrag.current = {
      id: element.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      element: { ...element }
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function stopDrag(event: PointerEvent<HTMLElement>) {
    activeDrag.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function deleteSelected() {
    if (!selected) return;
    commit((current) => ({
      ...current,
      elements: current.elements.filter((element) => element.id !== selected.id)
    }));
    setSelectedId("");
  }

  function changeLayer(direction: "front" | "back") {
    if (!selected) return;
    commit((current) => {
      const nextZ =
        direction === "front"
          ? Math.max(...current.elements.map((element) => element.z)) + 1
          : Math.min(...current.elements.map((element) => element.z)) - 1;
      return {
        ...current,
        elements: current.elements.map((element) =>
          element.id === selected.id ? { ...element, z: nextZ } : element
        )
      };
    });
  }

  function randomizeLayout() {
    commit((current) => ({
      ...current,
      elements: current.elements.map((element) => ({
        ...element,
        ...((element.pageIndex ?? 0) === current.activePage
          ? {
              x: clamp(element.x + Math.random() * 28 - 14, -8, 94),
              y: clamp(element.y + Math.random() * 24 - 12, -8, 94),
              rotation: element.rotation + Math.random() * 26 - 13,
              opacity: clamp(element.opacity + Math.random() * 0.28 - 0.12, 0.52, 1)
            }
          : {})
      }))
    }));
    setNotice("Layout randomized. A venture capitalist just felt faint.");
  }

  function makeBootleg() {
    commit((current) => {
      const extraScratches = Array.from({ length: 4 }, () => ({
        id: createId("scratch"),
        type: "scratch" as const,
        x: 5 + Math.random() * 82,
        y: 8 + Math.random() * 78,
        width: 22 + Math.random() * 44,
        height: 1.4 + Math.random() * 2.8,
        rotation: -35 + Math.random() * 70,
        z: current.elements.length + 5 + Math.random(),
        opacity: 0.24 + Math.random() * 0.42,
        pageIndex: current.activePage,
        color: "#ffffff",
        background: "transparent",
        fontSize: 10
      }));

      return {
        ...current,
        effect: ["vhs", "glitch", "scan"][Math.floor(Math.random() * 3)] as EditorState["effect"],
        texture: ["xerox", "zine", "plastic"][Math.floor(Math.random() * 3)] as EditorState["texture"],
        elements: [
          ...current.elements.map((element) => ({
            ...element,
            ...((element.pageIndex ?? 0) === current.activePage
              ? {
                  rotation: element.rotation + Math.random() * 9 - 4.5,
                  x: clamp(element.x + Math.random() * 7 - 3.5, -12, 103),
                  y: clamp(element.y + Math.random() * 7 - 3.5, -12, 103),
                  opacity: clamp(element.opacity - Math.random() * 0.12, 0.46, 1),
                  filter:
                    element.type === "image"
                      ? "contrast(1.35) saturate(0.82) brightness(1.12)"
                      : element.filter
                }
              : {})
          })),
          ...extraScratches
        ]
      };
    });
    setNotice("Made it more bootleg. Print quality is now emotionally authentic.");
  }

  async function exportCover() {
    if (!canvasRef.current) return;
    setNotice("Export unlocked automatically. Revolutionary technology.");
    const dataUrl = await toPng(canvasRef.current, {
      cacheBust: true,
      pixelRatio: 2.5,
      filter: (node) => !(node as HTMLElement).classList?.contains("selection-handle")
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `freecard-${template.key}.png`;
    link.click();
    setNotice("Your bank account survived successfully.");
  }

  function renderElement(element: EditorElement, interactive: boolean) {
    const isSelected = selectedId === element.id && interactive;
    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      transform: `rotate(${element.rotation}deg)`,
      zIndex: Math.round(element.z),
      opacity: element.opacity,
      color: element.color,
      background: element.background,
      fontSize: `${element.fontSize ?? 14}px`,
      fontFamily: element.fontFamily,
      filter: element.filter
    };

    return (
      <div
        key={element.id}
        className={`canvas-element ${element.type} ${isSelected ? "selected" : ""}`}
        style={style}
        onPointerDown={interactive ? (event) => startDrag(event, element, "move") : undefined}
        onPointerUp={interactive ? stopDrag : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `${element.type} layer` : undefined}
      >
        {element.type === "image" && element.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={element.src} alt="Uploaded cover art" draggable={false} />
        ) : null}
        {["text", "sticker", "note", "tracklist"].includes(element.type) ? (
          <span>{element.text}</span>
        ) : null}
        {element.type === "advisory" ? (
          <span className="advisory-box">
            <b>PARENTAL</b>
            <strong>{element.text}</strong>
            <b>NO PAYWALLS</b>
          </span>
        ) : null}
        {element.type === "barcode" ? (
          <span className="barcode-box">
            <i />
            <small>{element.text}</small>
          </span>
        ) : null}
        {element.type === "scratch" ? <span className="scratch-line" /> : null}
        {isSelected ? (
          <>
            <button
              className="selection-handle resize-handle"
              onPointerDown={(event) => startDrag(event, element, "resize")}
              onPointerUp={stopDrag}
              aria-label="Resize selected layer"
            />
            <button
              className="selection-handle rotate-handle"
              onPointerDown={(event) => startDrag(event, element, "rotate")}
              onPointerUp={stopDrag}
              aria-label="Rotate selected layer"
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <section id="editor" className="editor-section editor-page-section" aria-label="FreeCard editor">
      <nav className="editor-nav" aria-label="Editor navigation">
        <Link href="/" className="brand-stamp" aria-label="Back to FreeCard home">
          <Disc3 size={22} aria-hidden="true" />
          FreeCard
        </Link>
        <div className="site-links">
          {siteLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="status-pills">
          <span>Made in Indonesia. Still not a pricing strategy.</span>
          <span>Editor page: unlocked for zero dollars.</span>
        </div>
        {onToggleMode ? (
          <button
            className="chrome-icon-button"
            onClick={onToggleMode}
            aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"}
            title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
          >
            {lightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        ) : null}
      </nav>
      <div className="editor-heading">
        <p className="ransom-label">999999999 free exports remaining</p>
        <h2>Build the cover. Keep your money.</h2>
        <p>
          Drag, resize, rotate, upload, layer, glitch, export. No watermark
          because the app has processed its feelings. Made with AI help, but
          it is free, and nobody should pay $20 just to make J-cards.
        </p>
      </div>

      <div className="editor-shell">
        <aside className="tool-window template-window" aria-label="Templates and tools">
          <div className="window-title">
            <span>TEMPLATES</span>
            <span>FREE</span>
          </div>
          <div className="template-grid">
            {templates.map((item) => (
              <button
                key={item.key}
                className={item.key === template.key ? "active" : ""}
                onClick={() => {
                  setTemplateKey(item.key);
                  commit((current) => ({
                    ...current,
                    pageCount: item.defaultPages,
                    activePage: 0
                  }));
                  setSelectedId("");
                  setNotice(`${item.name} selected. No format surcharge, somehow.`);
                }}
              >
                <span style={{ background: item.accent }} />
                <b>{item.shortName}</b>
                <small>{item.name}</small>
              </button>
            ))}
          </div>

          <div className="sticker-drawer" aria-label="Sticker and label presets">
            <div className="drawer-heading">
              <b>Sticker Drawer</b>
              <span>Labels are free. Alarming.</span>
            </div>
            <div className="sticker-presets">
              {stickerPresets.map((preset) => (
                <button
                  key={preset.id}
                  className={`preset-chip preset-${preset.category.toLowerCase()}`}
                  onClick={() => addPresetSticker(preset)}
                  title={preset.text.replace(/\n/g, " ")}
                >
                  <span>{preset.category}</span>
                  <b>{preset.label}</b>
                </button>
              ))}
            </div>
          </div>

          <div className="tool-group">
            <button className="chrome-button" onClick={() => uploadRef.current?.click()}>
              <Upload size={16} aria-hidden="true" />
              Upload Image
            </button>
            <input
              ref={uploadRef}
              className="hidden-input"
              type="file"
              accept="image/*"
              onChange={onUpload}
              aria-label="Upload image"
            />
            <button className="chrome-button" onClick={() => addText("text")}>
              <TextCursorInput size={16} aria-hidden="true" />
              Add Text
            </button>
            <button className="chrome-button" onClick={addSticker}>
              <Sticker size={16} aria-hidden="true" />
              Random Sticker
            </button>
            <button className="chrome-button" onClick={() => addText("tracklist")}>
              <CassetteTape size={16} aria-hidden="true" />
              Tracklist
            </button>
            <button className="chrome-button" onClick={addAlbumArtBlock}>
              <Layers size={16} aria-hidden="true" />
              Album Cover
            </button>
            <button className="chrome-button" onClick={addSongListBlock}>
              <TextCursorInput size={16} aria-hidden="true" />
              Song List
            </button>
            <button className="chrome-button" onClick={addMediaLayout}>
              <Sparkles size={16} aria-hidden="true" />
              Starter Layout
            </button>
            <button className="chrome-button" onClick={addAdvisory}>
              <SquareDashedMousePointer size={16} aria-hidden="true" />
              Advisory
            </button>
            <button className="chrome-button" onClick={addBarcode}>
              <Layers size={16} aria-hidden="true" />
              Barcode
            </button>
            <button className="chrome-button" onClick={() => addText("note")}>
              <StickyNote size={16} aria-hidden="true" />
              Note
            </button>
            <button className="chrome-button" onClick={addScratch}>
              <Sparkles size={16} aria-hidden="true" />
              Wear
            </button>
          </div>
        </aside>

        <div className="stage-column">
          <div className="free-receipt" role="status">
            {notice}
          </div>
          <div className="stage-toolbar" aria-label="Editing actions">
            <button className="icon-tool" onClick={undo} disabled={!canUndo} title="Undo" aria-label="Undo">
              <RotateCcw size={18} />
            </button>
            <button className="icon-tool" onClick={redo} disabled={!canRedo} title="Redo" aria-label="Redo">
              <RotateCw size={18} />
            </button>
            <button className="icon-tool" onClick={randomizeLayout} title="Randomize layout" aria-label="Randomize layout">
              <Shuffle size={18} />
            </button>
            <button className="bootleg-button" onClick={makeBootleg}>
              <WandSparkles size={18} aria-hidden="true" />
              Make It More Bootleg
            </button>
            <button className="export-button" onClick={exportCover}>
              <Download size={18} aria-hidden="true" />
              Export PNG For Free
            </button>
          </div>

          <div className="page-strip" aria-label="Cover pages">
            <div>
              <b>{template.name} pages</b>
              <span>
                {state.pageCount} / {template.maxPages} panels. Multi-page covers
                are free because counting is not a premium feature.
              </span>
            </div>
            <div className="page-count-controls">
              <button
                className="icon-tool"
                onClick={() => setPageCount(state.pageCount - 1)}
                disabled={state.pageCount <= 1}
                aria-label="Remove page"
              >
                -
              </button>
              <button
                className="icon-tool"
                onClick={() => setPageCount(state.pageCount + 1)}
                disabled={state.pageCount >= template.maxPages}
                aria-label="Add page"
              >
                +
              </button>
            </div>
            <div className="page-tabs">
              {Array.from({ length: state.pageCount }).map((_, index) => (
                <button
                  key={index}
                  className={index === state.activePage ? "active" : ""}
                  onClick={() => setActivePage(index)}
                >
                  {pageLabel(template, index)}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            className="canvas-mat"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div
              ref={canvasRef}
              className={`cover-canvas effect-${state.effect} texture-${state.texture}`}
              style={{
                aspectRatio: `${template.ratio} / 1`,
                ["--template-accent" as string]: template.accent
              }}
              onPointerMove={onCanvasPointerMove}
              onPointerLeave={() => {
                activeDrag.current = undefined;
              }}
              onPointerDown={() => setSelectedId("")}
            >
              <div className="canvas-bg" aria-hidden="true" />
              {template.spine ? <Spine text={state.spineText} template={template} /> : null}
              {[...activeElements].sort((a, b) => a.z - b.z).map((element) => renderElement(element, true))}
              <div className="canvas-overlay" aria-hidden="true" />
            </div>
          </motion.div>
        </div>

        <aside className="tool-window inspector-window" aria-label="Layer inspector">
          <div className="window-title">
            <span>INSPECTOR</span>
            <span>NO UPSALE</span>
          </div>

          <label>
            Spine Text
            <input
              value={state.spineText}
              onChange={(event) =>
                commit((current) => ({ ...current, spineText: event.target.value }))
              }
            />
          </label>

          <label>
            Texture
            <select
              value={state.texture}
              onChange={(event) =>
                commit((current) => ({
                  ...current,
                  texture: event.target.value as EditorState["texture"]
                }))
              }
            >
              <option value="paper">Paper</option>
              <option value="plastic">Glossy Plastic</option>
              <option value="xerox">Xerox</option>
              <option value="zine">Zine Ink</option>
            </select>
          </label>

          <label>
            Effect
            <select
              value={state.effect}
              onChange={(event) =>
                commit((current) => ({
                  ...current,
                  effect: event.target.value as EditorState["effect"]
                }))
              }
            >
              <option value="none">None</option>
              <option value="crt">CRT</option>
              <option value="vhs">VHS</option>
              <option value="glitch">Glitch</option>
              <option value="scan">Scan Artifacts</option>
            </select>
          </label>

          {selected ? (
            <div className="selected-panel">
              <p>
                Selected: <b>{selected.type}</b>
              </p>
              {selected.text !== undefined ? (
                <label>
                  Text
                  <textarea
                    value={selected.text}
                    onChange={(event) =>
                      updateElement(selected.id, (element) => ({
                        ...element,
                        text: event.target.value
                      }))
                    }
                  />
                </label>
              ) : null}
              <div className="mini-controls">
                <label>
                  Color
                  <input
                    type="color"
                    value={selected.color ?? "#111111"}
                    onChange={(event) =>
                      updateElement(selected.id, (element) => ({
                        ...element,
                        color: event.target.value
                      }))
                    }
                  />
                </label>
                <label>
                  Opacity
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.01"
                    value={selected.opacity}
                    onChange={(event) =>
                      updateElement(selected.id, (element) => ({
                        ...element,
                        opacity: Number(event.target.value)
                      }))
                    }
                  />
                </label>
              </div>
              <div className="inspector-actions">
                <button className="chrome-button" onClick={() => changeLayer("front")}>
                  <BringToFront size={15} aria-hidden="true" />
                  Front
                </button>
                <button className="chrome-button" onClick={() => changeLayer("back")}>
                  <Layers size={15} aria-hidden="true" />
                  Back
                </button>
                <button className="danger-button" onClick={deleteSelected}>
                  <Trash2 size={15} aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="empty-inspector">
              Pick a layer. Editing is free due to an obscure loophole called
              &quot;software.&quot;
            </p>
          )}

          <div className="mockup-preview">
            <div className="mockup-label">Preview mockup, also free</div>
            <div className={`mockup-case mockup-${template.key}`}>
              <div
                className={`mockup-art effect-${state.effect} texture-${state.texture}`}
                style={{ aspectRatio: `${template.ratio} / 1` }}
              >
                <div className="canvas-bg" aria-hidden="true" />
                {template.spine ? <Spine text={state.spineText} template={template} /> : null}
                {[...activeElements].sort((a, b) => a.z - b.z).map((element) => renderElement(element, false))}
                <div className="canvas-overlay" aria-hidden="true" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Spine({ text, template }: { text: string; template: CoverTemplate }) {
  return (
    <div className="spine" style={{ borderColor: template.accent }}>
      <span>{text}</span>
    </div>
  );
}
