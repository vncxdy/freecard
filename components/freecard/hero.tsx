"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BatteryCharging,
  Disc3,
  Moon,
  MousePointer2,
  Radio,
  Sparkles,
  Sun
} from "lucide-react";
import { siteLinks } from "./site-pages";

const bootLines = [
  "FREECARD BIOS v0.00.00",
  "Checking wallet... untouched",
  "Loading retro media assets...",
  "Mounting sticker drawer...",
  "Locale stamp: made in Indonesia",
  "Disabling watermark gobbledygook...",
  "PNG export module: free because PNG exists",
  "Ready. No premium plan detected."
];

const stickers = [
  { text: "NO CREDITS", x: "8%", y: "22%", rotate: -11 },
  { text: "FREE FREE FREE", x: "78%", y: "18%", rotate: 8 },
  { text: "NO LOGIN", x: "10%", y: "88%", rotate: 7 },
  { text: "999999999 EXPORTS", x: "70%", y: "72%", rotate: -6 }
];

export function Hero({
  lightMode,
  onToggleMode
}: {
  lightMode: boolean;
  onToggleMode: () => void;
}) {
  return (
    <section className="hero-section" aria-label="FreeCard landing page">
      <div className="crt-overlay" aria-hidden="true" />
      <div className="vhs-noise" aria-hidden="true" />

      <nav className="top-bar" aria-label="FreeCard navigation">
        <Link href="/editor" className="brand-stamp" aria-label="Open FreeCard editor">
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
          <span>0 credits used because this is not a mobile game.</span>
          <span>Made in Indonesia. Bank account: alive</span>
        </div>
        <button
          className="chrome-icon-button"
          onClick={onToggleMode}
          aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"}
          title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
        >
          {lightMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>

      {stickers.map((sticker) => (
        <motion.button
          key={sticker.text}
          className="hero-sticker"
          drag
          dragMomentum={false}
          style={{
            left: sticker.x,
            top: sticker.y,
            rotate: `${sticker.rotate}deg`
          }}
          whileHover={{ scale: 1.08, rotate: sticker.rotate + 4 }}
          whileTap={{ cursor: "grabbing", scale: 0.98 }}
          aria-label={`Draggable sticker: ${sticker.text}`}
        >
          <MousePointer2 size={14} aria-hidden="true" />
          {sticker.text}
        </motion.button>
      ))}

      <div className="floating-scrap scrap-one" aria-hidden="true">
        TRACKLIST.TXT
      </div>
      <div className="floating-scrap scrap-two" aria-hidden="true">
        NO WATERMARK BECAUSE WE ARE EMOTIONALLY STABLE
      </div>
      <div className="pixel-sky" aria-hidden="true">
        {Array.from({ length: 38 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="hero-grid">
        <motion.div className="hero-copy" initial={false} animate={{ y: 0 }}>
          <div className="boot-window">
            <div className="window-title">
              <span>freecard.exe</span>
              <span>_ [] X</span>
            </div>
            <div className="boot-lines">
              {bootLines.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.18 }}
                >
                  &gt; {line}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="headline-wrap">
            <p className="ransom-label">Physical media cover generator</p>
            <h1>Make retro covers for free.</h1>
            <p className="hero-subcopy">
              CD cases, tapes, VHS sleeves, PS1 covers, vinyl jackets, floppy
              labels, posters, and magazine chaos. Unlimited exports. We
              checked. PNGs are still free. Built with AI help, which would be
              controversial if we were charging you $20 to make a J-card.
            </p>
          </div>

          <div className="hero-actions">
            <Link href="/editor" className="mega-cta">
              START MAKING COVERS FOR FREE
            </Link>
            <span className="tiny-receipt">
              Export unlocked automatically. Revolutionary technology.
            </span>
          </div>
        </motion.div>

        <motion.div
          className="media-shrine"
          initial={false}
          animate={{ scale: 1, rotate: 0 }}
          aria-label="Animated cassette player"
        >
          <div className="battery">
            <BatteryCharging size={15} aria-hidden="true" />
            FREE
          </div>
          <div className="player-window">
            <div className="walkman">
              <div className="walkman-top">
                <span>FREECARD PORTABLE COVER DECK</span>
                <Radio size={16} aria-hidden="true" />
              </div>
              <div className="cassette">
                <div className="reel left-reel">
                  <span />
                </div>
                <div className="tape-label">
                  <strong>NO SUBSCRIPTION MIX</strong>
                  <small>Side A: generosity</small>
                </div>
                <div className="reel right-reel">
                  <span />
                </div>
              </div>
              <div className="equalizer" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div className="media-controls">
                <button aria-label="Previous track">|&lt;</button>
                <button aria-label="Play">PLAY</button>
                <button aria-label="Next track">&gt;|</button>
                <button aria-label="Record">REC</button>
              </div>
            </div>
            <div className="cd-reflection" aria-hidden="true" />
          </div>

          <div className="popup-stack" aria-hidden="true">
            <div className="mini-window blue-window">
              <b>FREE FEATURE NOTICE</b>
              <span>This feature is free due to the invention of generosity.</span>
            </div>
            <div className="mini-window pink-window">
              <b>EXPORTS REMAINING</b>
              <span>999999999. Try to stay calm.</span>
            </div>
          </div>

          <Sparkles className="sparkle-a" size={34} aria-hidden="true" />
          <Sparkles className="sparkle-b" size={24} aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
