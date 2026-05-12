export type TemplateKey =
  | "cd"
  | "cassette"
  | "vhs"
  | "dvd"
  | "ps1"
  | "vinyl"
  | "floppy"
  | "poster"
  | "magazine";

export type CoverTemplate = {
  key: TemplateKey;
  name: string;
  shortName: string;
  ratio: number;
  spine: boolean;
  defaultPages: number;
  maxPages: number;
  accent: string;
  description: string;
};

export const templates: CoverTemplate[] = [
  {
    key: "cd",
    name: "CD Jewel Case",
    shortName: "CD",
    ratio: 1,
    spine: true,
    defaultPages: 2,
    maxPages: 3,
    accent: "#00e5ff",
    description: "Plastic hinge nostalgia, now with zero billing department."
  },
  {
    key: "cassette",
    name: "Cassette Insert",
    shortName: "Tape",
    ratio: 1.72,
    spine: true,
    defaultPages: 3,
    maxPages: 6,
    accent: "#f8ea36",
    description: "For mixes that deserve a handwritten apology."
  },
  {
    key: "vhs",
    name: "VHS Sleeve",
    shortName: "VHS",
    ratio: 0.66,
    spine: true,
    defaultPages: 2,
    maxPages: 3,
    accent: "#ff4da6",
    description: "Big cardboard energy. No monthly cardboard fee."
  },
  {
    key: "dvd",
    name: "DVD Cover",
    shortName: "DVD",
    ratio: 0.7,
    spine: true,
    defaultPages: 2,
    maxPages: 3,
    accent: "#7cff6b",
    description: "Wide enough for cast lists and bad decisions."
  },
  {
    key: "ps1",
    name: "PS1 Cover",
    shortName: "PS1",
    ratio: 0.96,
    spine: true,
    defaultPages: 2,
    maxPages: 3,
    accent: "#b58cff",
    description: "Low-poly drama with extremely free pixels."
  },
  {
    key: "vinyl",
    name: "Vinyl Jacket",
    shortName: "LP",
    ratio: 1,
    spine: false,
    defaultPages: 2,
    maxPages: 4,
    accent: "#ff8b3d",
    description: "Twelve inches of unpaid creative freedom."
  },
  {
    key: "floppy",
    name: "Floppy Label",
    shortName: "Disk",
    ratio: 1.85,
    spine: false,
    defaultPages: 1,
    maxPages: 1,
    accent: "#50ffcf",
    description: "1.44 MB of design swagger, allegedly."
  },
  {
    key: "poster",
    name: "Retro Poster",
    shortName: "Poster",
    ratio: 0.72,
    spine: false,
    defaultPages: 1,
    maxPages: 1,
    accent: "#ffef8a",
    description: "Flyer wall chaos without a printing surcharge."
  },
  {
    key: "magazine",
    name: "Magazine Cover",
    shortName: "Zine",
    ratio: 0.76,
    spine: false,
    defaultPages: 4,
    maxPages: 8,
    accent: "#ff6767",
    description: "Cover lines, attitude, and no growth-hacking funnel."
  }
];

export const templateByKey = Object.fromEntries(
  templates.map((template) => [template.key, template])
) as Record<TemplateKey, CoverTemplate>;
