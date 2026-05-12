import type { EditorElementType } from "./types";

export type SitePage = {
  href: string;
  eyebrow: string;
  title: string;
  dek: string;
  panels: Array<{
    title: string;
    body: string;
  }>;
  scraps: string[];
};

export const siteLinks = [
  { href: "/about", label: "About" },
  { href: "/formats", label: "Formats" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/sticker-lab", label: "Sticker Lab" }
];

export const sitePages: Record<string, SitePage> = {
  about: {
    href: "/about",
    eyebrow: "No investor deck was harmed",
    title: "FreeCard exists because covers should not require a pricing page.",
    dek: "Made in Indonesia, FreeCard is a browser-based cover maker for people who still believe art can be printed, folded, taped, scratched, photocopied, and shared without a subscription concierge standing nearby with a clipboard.",
    panels: [
      {
        title: "Made In Indonesia",
        body: "Built from Indonesia with physical-media brain, internet-cafe patience, and sincere confusion that anyone would charge monthly rent for a J-card."
      },
      {
        title: "Physical Media Brain",
        body: "CD jewel cases, cassette inserts, VHS sleeves, game cases, floppy labels, record jackets, posters, and magazine covers all get their own proportions and personality."
      },
      {
        title: "Free Means Free",
        body: "No export cap, no watermark, no unlock modal, no pretend scarcity economy. Your PNG leaves the building without requesting a meeting with billing."
      },
      {
        title: "AI Disclaimer",
        body: "Yes, this tool was made with AI help. Also yes, it is free. Would a user pay $20 just to make J-cards? Exactly. Case closed, please rewind."
      }
    ],
    scraps: ["MADE IN INDONESIA", "NO LOGIN", "AI HELPED, PRICE DIDN'T", "PNG LIBERATION FRONT"]
  },
  formats: {
    href: "/formats",
    eyebrow: "Many rectangles, zero format fees",
    title: "Every format gets the dignity of being weirdly specific.",
    dek: "FreeCard treats physical formats like objects, not generic social-media squares wearing fake mustaches. Built in Indonesia, where apparently we can still tell the difference between a cover and a content funnel.",
    panels: [
      {
        title: "Music Stuff",
        body: "CDs, cassettes, vinyl jackets, burned mixtapes, album art blocks, tracklists, warning labels, spine text, price stickers, store tags, and handwritten notes."
      },
      {
        title: "Video And Games",
        body: "VHS sleeves, DVD covers, and PS1 cases get taller, wider, or jewel-box energy depending on the format. The rectangles have opinions."
      },
      {
        title: "Paper Chaos",
        body: "Retro posters, floppy labels, and magazine covers are built for cutout headlines, fake barcodes, issue numbers, and zine-table drama."
      }
    ],
    scraps: ["SIDE A", "PLEASE REWIND", "LONGBOX ENERGY", "1.44 MB OF ATTITUDE"]
  },
  manifesto: {
    href: "/manifesto",
    eyebrow: "A tiny manifesto, tragically unmonetized",
    title: "Creativity survived before credits. It will survive after them.",
    dek: "Modern tools keep rediscovering vending machines. FreeCard is more interested in the table covered with scissors, tape, paper, and one suspiciously warm printer.",
    panels: [
      {
        title: "Against Fake Scarcity",
        body: "A sticker should not cost a token. A download button should not have a velvet rope. A watermark should not be a hostage note."
      },
      {
        title: "For Messy Making",
        body: "The best covers look touched: tilted, photocopied, overexposed, stickered, scribbled on, scanned badly, and loved anyway."
      },
      {
        title: "For Local Fun",
        body: "The editor runs in your browser and was made in Indonesia. The joke is that this used to be normal. The better joke is that it still can be."
      },
      {
        title: "AI Disclosure, Calmly",
        body: "AI helped make the tool. The moral panic costs extra elsewhere, but not here. You are making J-cards, not refinancing a submarine."
      }
    ],
    scraps: ["EXPORTS ARE NOT DLC", "NO PREMIUM PLAN", "GENEROSITY PATCH INSTALLED", "FREEWARE ENERGY"]
  },
  "sticker-lab": {
    href: "/sticker-lab",
    eyebrow: "The label drawer is open",
    title: "A pile of stickers for unpaid artistic nonsense.",
    dek: "Drop warnings, shop tags, format labels, tape notes, fake ratings, price blobs, zine bursts, Indonesian-made pride, and bootleg badges straight onto your cover.",
    panels: [
      {
        title: "Labels With Attitude",
        body: "Use labels like NO WATERMARK, SIDE B, EXPORTS REMAINING, PLEASE REWIND, and FREE CONTENT to make the cover look like it escaped a thrift store."
      },
      {
        title: "Useful Details",
        body: "Parental advisory blocks, barcodes, tracklists, handwritten notes, spine text, scratches, tape wear, and CRT effects all sit inside the editor."
      },
      {
        title: "More Is Correct",
        body: "When in doubt, add tape, tilt something, stamp FREE over it, and press Make It More Bootleg. Design education is complicated."
      }
    ],
    scraps: ["STICKER DEBT: $0", "ADHESIVE DEMOCRACY", "LABELS UNLOCKED", "PLEASE PEEL RESPONSIBLY"]
  }
};

export type StickerPreset = {
  id: string;
  label: string;
  category: "Free" | "Media" | "Warning" | "Shop" | "Zine";
  type?: EditorElementType;
  text: string;
  color: string;
  background: string;
  width: number;
  height: number;
  fontSize: number;
  fontFamily?: string;
  rotation?: number;
};

export const stickerPresets: StickerPreset[] = [
  {
    id: "free-exports",
    label: "Free Exports",
    category: "Free",
    text: "999999999 FREE EXPORTS",
    color: "#111111",
    background: "#f8ea36",
    width: 32,
    height: 9,
    fontSize: 11,
    fontFamily: "var(--font-display)",
    rotation: -6
  },
  {
    id: "no-watermark",
    label: "No Watermark",
    category: "Free",
    text: "NO WATERMARK\nEMOTIONALLY STABLE",
    color: "#111111",
    background: "#f3efe0",
    width: 34,
    height: 12,
    fontSize: 11,
    fontFamily: "var(--font-marker)",
    rotation: 5
  },
  {
    id: "zero-credits",
    label: "0 Credits",
    category: "Free",
    text: "0 CREDITS USED",
    color: "#111111",
    background: "#00e5ff",
    width: 25,
    height: 9,
    fontSize: 12,
    fontFamily: "var(--font-display)",
    rotation: -8
  },
  {
    id: "free-feature",
    label: "Feature Notice",
    category: "Free",
    text: "FEATURE FREE DUE TO GENEROSITY",
    color: "#ffffff",
    background: "#11111c",
    width: 34,
    height: 10,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: 4
  },
  {
    id: "side-a",
    label: "Side A",
    category: "Media",
    text: "SIDE A",
    color: "#111111",
    background: "#ffc4dd",
    width: 18,
    height: 8,
    fontSize: 13,
    fontFamily: "var(--font-display)",
    rotation: -3
  },
  {
    id: "side-b",
    label: "Side B",
    category: "Media",
    text: "SIDE B",
    color: "#111111",
    background: "#c5f8ff",
    width: 18,
    height: 8,
    fontSize: 13,
    fontFamily: "var(--font-display)",
    rotation: 3
  },
  {
    id: "please-rewind",
    label: "Rewind",
    category: "Media",
    text: "PLEASE REWIND\nWE ARE BEGGING",
    color: "#111111",
    background: "#ffffff",
    width: 31,
    height: 12,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: -2
  },
  {
    id: "dolby-ish",
    label: "Dolby-ish",
    category: "Media",
    text: "DOLBY-ISH\nNOISE REDUCED MAYBE",
    color: "#ffffff",
    background: "#2d67ff",
    width: 30,
    height: 11,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: 2
  },
  {
    id: "warning-free",
    label: "Free Warning",
    category: "Warning",
    text: "WARNING:\nCONTAINS FREE FEATURES",
    color: "#111111",
    background: "#ff8b3d",
    width: 35,
    height: 13,
    fontSize: 11,
    fontFamily: "var(--font-display)",
    rotation: -5
  },
  {
    id: "parental-advisory",
    label: "Advisory",
    category: "Warning",
    type: "advisory",
    text: "FREE CONTENT",
    color: "#ffffff",
    background: "#000000",
    width: 29,
    height: 13,
    fontSize: 12,
    rotation: 1
  },
  {
    id: "void-warranty",
    label: "Void Warranty",
    category: "Warning",
    text: "VOID WARRANTY\nGAIN PERSONALITY",
    color: "#ffffff",
    background: "#ff4da6",
    width: 30,
    height: 12,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: 8
  },
  {
    id: "scan-copy",
    label: "Scan Artifact",
    category: "Warning",
    text: "SCANNED BADLY\nON PURPOSE",
    color: "#111111",
    background: "#7cff6b",
    width: 29,
    height: 11,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: -9
  },
  {
    id: "price-free",
    label: "Price Tag",
    category: "Shop",
    text: "$0.00\nMANAGER SPECIAL",
    color: "#111111",
    background: "#fff3cf",
    width: 23,
    height: 12,
    fontSize: 11,
    fontFamily: "var(--font-display)",
    rotation: 5
  },
  {
    id: "rental-return",
    label: "Rental",
    category: "Shop",
    text: "RETURN BY NEVER\nNO LATE FEES",
    color: "#111111",
    background: "#ffffff",
    width: 31,
    height: 12,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: -4
  },
  {
    id: "used-bin",
    label: "Used Bin",
    category: "Shop",
    text: "USED BIN ROYALTY",
    color: "#111111",
    background: "#f8ea36",
    width: 26,
    height: 8,
    fontSize: 11,
    fontFamily: "var(--font-display)",
    rotation: 7
  },
  {
    id: "barcode-free",
    label: "Barcode",
    category: "Shop",
    type: "barcode",
    text: "0 FREE 000 00",
    color: "#000000",
    background: "#ffffff",
    width: 29,
    height: 10,
    fontSize: 8
  },
  {
    id: "zine-issue",
    label: "Issue No.",
    category: "Zine",
    text: "ISSUE 00\nTHE FREE ONE",
    color: "#111111",
    background: "#c5f8ff",
    width: 25,
    height: 13,
    fontSize: 11,
    fontFamily: "var(--font-marker)",
    rotation: -5
  },
  {
    id: "photocopy",
    label: "Photocopy",
    category: "Zine",
    text: "PHOTOCOPIED\nAT WORK",
    color: "#111111",
    background: "#f3efe0",
    width: 27,
    height: 12,
    fontSize: 11,
    fontFamily: "var(--font-marker)",
    rotation: 6
  },
  {
    id: "scene-approved",
    label: "Scene Approved",
    category: "Zine",
    text: "SCENE APPROVED\nCFO CONFUSED",
    color: "#ffffff",
    background: "#111111",
    width: 31,
    height: 12,
    fontSize: 10,
    fontFamily: "var(--font-display)",
    rotation: -3
  },
  {
    id: "handmade",
    label: "Handmade",
    category: "Zine",
    text: "HANDMADE\nNO SAAS RESIDUE",
    color: "#111111",
    background: "#ffc4dd",
    width: 30,
    height: 12,
    fontSize: 10,
    fontFamily: "var(--font-marker)",
    rotation: 4
  }
];
