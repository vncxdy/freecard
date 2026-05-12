export type EditorElementType =
  | "image"
  | "text"
  | "sticker"
  | "barcode"
  | "advisory"
  | "scratch"
  | "note"
  | "tracklist";

export type EditorElement = {
  id: string;
  type: EditorElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  z: number;
  opacity: number;
  pageIndex?: number;
  text?: string;
  src?: string;
  color?: string;
  background?: string;
  fontSize?: number;
  fontFamily?: string;
  filter?: string;
};

export type EditorState = {
  elements: EditorElement[];
  activePage: number;
  pageCount: number;
  spineText: string;
  effect: "none" | "crt" | "vhs" | "glitch" | "scan";
  texture: "paper" | "plastic" | "xerox" | "zine";
};
