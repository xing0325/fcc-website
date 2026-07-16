# Process (sticky title + tilted cards) Specification

## Project context (same for every builder)

You are building ONE section component of a pixel-perfect clone of https://oci.madebybuzzworthy.com/ (Outsource Consultants — bold Swiss-style site, blue #1925aa on mercury #e8e6e0).
Project root: /Users/chichu/ai/claude-codee/skills/clone-website (Next.js 16 App Router + Tailwind v4 + TypeScript).
Create ONLY your target file. Do NOT touch page.tsx, layout.tsx, globals.css, or other sections.

### Already in place
- `--spacing: 1px` → Tailwind numeric spacing = pixels: `px-15` = 15px, `mt-30` = 30px, `gap-x-3.5` = 3.5px. Copy numeric spacing classes from the original HTML verbatim.
- Colors: `bg-blue`/`text-blue` #1925aa, `bg-mercury`/`text-mercury` #e8e6e0, dither light #b7b9d3, `text-error` #c41230.
- Body font is PP Neue Montreal (`font-pp-neue`, weights 400/500); mono is `font-gta-mono` (GT America Mono 400).
- Custom classes in globals.css: `my-grid` (6-col grid mobile / 12-col ≥1024px, column-gap 10/12.5/15px), `my-title` (PP 500, 5rem mobile → 10rem lg, line-height .9375, blue), `text-heading` (PP 500, lh 1, blue), `my-text` (mono uppercase, 14px mobile → 12px lg, blue), `text-mono` (mono uppercase lh 1.2 blue), `page-text` (22px → 30px lg), `fs-10 … fs-160` (font sizes in px: fs-36 = 2.25rem etc.), `b-blue` / `b-mercury` / `b-white` (border-color), `b-1px` / `border-t-1px` / `border-b-1px` / `border-l-1px` / `border-r-1px` (border width + solid style), `flex-center`, `grid-stack-wrap` + `grid-stack` (stack children in one grid cell), `line-mask` (overflow hidden), `line-split`, `split-text`, `.icon` (inline-block), reveal helpers:
  - `.reveal-line`: translateY(110%), transitions to 0 when an ANCESTOR gets class `is-inview` (0.9s expo-out). Use `<span className="line-mask"><span className="reveal-line" style={{transitionDelay:"0.1s"}}>text</span></span>`.
  - `.reveal-fade`: opacity 0 + 20px up-shift → visible when ancestor (or itself) has `is-inview`.
- `import { useReveal } from "@/lib/useReveal"` → `const ref = useReveal<HTMLDivElement>()` adds `is-inview` to that element when scrolled into view (client component only).
- `import DitheredImage from "@/components/DitheredImage"` — a canvas that reproduces the site's blue Bayer-dither photo treatment. It renders `absolute inset-0 w-full h-full` and covers its PARENT, so the parent must be `relative overflow-hidden` with real dimensions (e.g. `aspect-[340/240]` or absolute-fill). Props: `src`, `alt`, optional `dark` (#1925aa), `light` (#b7b9d3), `dotSize` (default 1).
- Icons: `import { LogoIcon, ArrowIcon, ArrowControlsIcon, TopRightArrowIcon, PlusIcon, CloseIcon, PenIcon, ChatIcon, FooterLogo } from "@/components/icons"`. Sprite mapping from original HTML: `#logo`→LogoIcon, `#arrow`→ArrowIcon (15×10), `#arrow-controls`→ArrowControlsIcon (20×9), `#top-right-arrow`→TopRightArrowIcon (38×38), `#plus`→PlusIcon (18×19), `#close`→CloseIcon, `#pen`→PenIcon. Keep the icon's original className (minus `js-*`).

### Translating the original (Nuxt + UnoCSS) markup — the embedded HTML below is your styling ground truth
- Keep: numeric spacing, `col-span-*`, `row-start-*`, `inset-0`, `relative/absolute/fixed`, `overflow-hidden`, responsive prefixes `lg:` `md:`, `uppercase`, `w-full` …
- Convert: `fs-N` → keep (classes exist) | `lh-1`→`leading-none`, `lh-1.2`→`leading-[1.2]`, `lh-1.33`→`leading-[1.33]` | `ls-0`→`tracking-[0]` | `font-400`→`font-normal`, `font-500`→`font-medium` | `h-100svh`→`h-svh`, `min-h-100svh`→`min-h-svh`, `min-h-100vh`→`min-h-screen` | `w-49%`→`w-[49%]`, `h-100%`→`h-full`, `size-71.6vw`→`size-[71.6vw]`, `lg:size-29vw`→`lg:size-[29vw]` | `aspect-385/260`→`aspect-[385/260]` | `col-end--1`→`col-end-[-1]`, `grid-col-span-6`→`col-span-6`, `grid-col-start-3`→`col-start-3`, `grid-row-start-2`→`row-start-2`, `grid-area-[x]`→`[grid-area:x]` | `mt--1`→`-mt-1`, `ml--8`→`-ml-8` | `-translate-x-50%`→`-translate-x-1/2`, `translate-y-100%`→`translate-y-full` | `transform-origin-cc`/`origin-c`→`origin-center` | `z-1000`→`z-[1000]` | `rd-3`→`rounded-[3px]`, `rd-full`→`rounded-full` | `transition-color-500`→`transition-colors duration-500`, `transition-transform-500`→`transition-transform duration-500` | `h-45!`→`h-45!` (Tailwind v4 supports trailing !) | `text-white!`→`text-white!`
- Strip: `data-v-*` attrs, `js-*` classes (they are GSAP hooks — you re-create the behavior in React), `|` separators inside class strings, `<!--…-->` comments, `data-dither-image`, `data-canvas-id`, `invisible` class on images.
- `<img>` pointing at images.prismic.io → replace with `<DitheredImage src="/images/…" />` (see the asset map in the spec) inside the sized wrapper div. SVG logo `<img>`s (cdn.prismic.io *.svg) stay plain `<img>` with the local path.
- `<a href="/…">` internal links: keep as plain `<a>` with the same href (the routes don't exist — visual only).
- `sr-only` headings stay.

### Deliverable
- File: the target path in the spec. TypeScript, default export. `"use client"` only if you need state/effects/useReveal.
- Content (all text verbatim from the embedded HTML), layout, colors, type sizes, borders, hover states and scroll reveals must match.
- When done run: `cd /Users/chichu/ai/claude-codee/skills/clone-website && npx tsc --noEmit` — it MUST pass. Do NOT run npm run dev/build. Do NOT git commit.
- Final message: 1-2 lines — status + file path + anything you had to guess.


## Target file
`src/components/sections/Process.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-3-process-top.png
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-3-process-bottom.png (Communication/Navigation/Results cards along center line)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/full-desktop-1440.png (whole section in context)

## Interaction model
scroll-driven: left title block is position:sticky while the card column scrolls; cards reveal (fade + settle rotation) as they enter the viewport

## Layout

`<section class="px-15 relative overflow-hidden z-1 pt-18 pb-60 lg:pb-160">` with inner my-grid.
- Top meta row: `PROCESS` (my-text) far left; `[OCI.2]` (my-text) far right — full-width flex justify-between (or grid col 1 / col 12).
- Left block (lg cols 1-6) `js-sticky` → `lg:sticky lg:top-100 self-start`:
  - Huge heading "Here at every step" — text-heading `fs-100` (three lines: Here / at every / step), each line in line-mask/reveal-line stagger.
  - Below (mt-30, indented col ~2): mono paragraph `my-text` 4 lines: "NAVIGATING REGULATORY AGENCIES CAN SEEM LIKE AN INSURMOUNTABLE TASK FOR ARCHITECTS, ENGINEERS, OWNERS AND CONTRACTORS." max-w-270.
- Right column (lg cols 7-12, relative, min-height driven by cards):
  - Center vertical line: `absolute left-1/2 top-0 bottom-0 w-1px bg-blue` (visible between cards).
  - 4 cards (js-card), alternating left/right of the center line, big vertical gaps (~150-220px): each `bg-white text-blue p-20 w-[420px] max-w-full shadow-none` rotated: card1 "Strategy 01" rotate ≈ -18° (top, hangs left of line, overlapping right edge), card2 "Communication 02" ≈ -3.5° (left of line), card3 "Navigation 03" ≈ -3.8° (right, slightly), card4 "Results 04" ≈ -4.5°. USE the rotation/offset hints in the embedded HTML if present (inline styles/classes); otherwise: [-14, -4, 3, -5] degrees and offsets alternating (card1 right-aligned overhanging, card2 left, card3 right, card4 center-right) to match the screenshots.
  - Card internals: header row flex justify-between items-start: title PP 400 `fs-36` ("Strategy") + number mono fs-22 ("01"); `border-b-1px b-blue` under header (full card width); description `my-text` uppercase mt-20 (3 lines); another `border-b-1px b-blue` at bottom (mt-40).
  - Reveal: each card fades up + rotates from (rotation + 6°) to final as it enters viewport (useReveal per card, CSS transition transform .8s/opacity .6s).
Mobile: cards stack full-width with same rotations scaled down; sticky disabled (plain flow), heading fs-52.
All card texts are in the embedded HTML.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 relative overflow-hidden z-1 pt-18 pb-60 lg:pb-160" data-slice-type="home_process" data-slice-variation="default">
  <!--[-->
  <div class="absolute -z-1 inset-0 my-grid">
    <div class="hidden col-start-5 col-end-[span_4] row-span-full b-x b-blue lg:block">
    </div>
  </div>
  <div class="flex justify-between text-blue font-400 font-gta-mono fs-12 lh-1 ls-0 uppercase">
    <div>
      <span>PROCESS</span>
    </div>
    <div aria-hidden="true">
      <!--[-->[OCI.2]<!--]-->
    </div>
  </div>
  <div class="my-grid mt-50 lg:mt-90">
    <div class="col-span-full lg:col-span-6 grid grid-cols-subgrid content-start">
      <div class="col-span-full my-title relative lg:col-span-6">
        <div class="relative | js-sticky">
          <div class="bg-mercury h-1/2 w-full center-y -z-1">
          </div>
          <div>
            <!--[-->
            <!--[-->
            <h2>
              <!--[-->
              <!--[-->
              <!--[-->
              <!--[-->
              <!---->Here <!--]-->
              <!--[-->
              <br>at every <!--]-->
              <!--[-->
              <br>step<!--]-->
              <!--]-->
              <!--]-->
              <!--]-->
            </h2>
            <!--]-->
            <!--]-->
          </div>
        </div>
      </div>
      <div class="mt-80 col-start-2 col-end--1 my-text lg:fs-14 lg:col-start-2 lg:col-span-3 lg:pr-55 lg:mt-46">
        <div class="js-sticky">
          <!--[-->
          <!--[-->
          <p>
          <!--[-->
          <!--[-->
          <!--[-->
          <!--[-->
          <!---->Navigating regulatory agencies can seem like an insurmountable task for architects, engineers, owners and contractors.<!--]-->
          <!--]-->
          <!--]-->
          <!--]-->
        </p>
        <!--]-->
        <!--]-->
      </div>
    </div>
  </div>
  <div class="content-start col-span-full grid grid-cols-subgrid mt-66 space-y-[1.25em] lg:col-start-7 lg:col-span-6 lg:mt-0 lg:space-y-[2em]">
    <!--[-->
    <div class="col-span-full bg-white text-blue pt-10 pb-20 px-16 lg:col-span-4 lg:pb-22 lg:px-22 | js-card">
      <div class="flex justify-between items-center font-pp-neue font-400 text-blue lh-1 ls-0 fs-24 lg:fs-30">
        <h3>Strategy</h3>
        <div class="mr-8">01</div>
      </div>
      <hr class="mt-8 lg:mt-10">
      <div class="mt-20 lg:mt-26">
        <p class="my-text pr-60 lg:pr-150">Experts in Building and Zoning Code, guiding your project with confidence.</p>
      </div>
      <hr class="mt-28 lg:mt-46">
    </div>
    <div class="col-span-full bg-white text-blue pt-10 pb-20 px-16 lg:col-span-4 lg:pb-22 lg:px-22 | js-card">
      <div class="flex justify-between items-center font-pp-neue font-400 text-blue lh-1 ls-0 fs-24 lg:fs-30">
        <h3>Communication</h3>
        <div class="mr-8">02</div>
      </div>
      <hr class="mt-8 lg:mt-10">
      <div class="mt-20 lg:mt-26">
        <p class="my-text pr-60 lg:pr-150">Trustworthy, quick, accountable, and fluent in all things related to the Department of Buildings.</p>
      </div>
      <hr class="mt-28 lg:mt-46">
    </div>
    <div class="col-span-full bg-white text-blue pt-10 pb-20 px-16 lg:col-span-4 lg:pb-22 lg:px-22 | js-card">
      <div class="flex justify-between items-center font-pp-neue font-400 text-blue lh-1 ls-0 fs-24 lg:fs-30">
        <h3>Navigation</h3>
        <div class="mr-8">03</div>
      </div>
      <hr class="mt-8 lg:mt-10">
      <div class="mt-20 lg:mt-26">
        <p class="my-text pr-60 lg:pr-150">Turning city agency hurdles into on-time project milestones.</p>
      </div>
      <hr class="mt-28 lg:mt-46">
    </div>
    <div class="col-span-full bg-white text-blue pt-10 pb-20 px-16 lg:col-span-4 lg:pb-22 lg:px-22 | js-card">
      <div class="flex justify-between items-center font-pp-neue font-400 text-blue lh-1 ls-0 fs-24 lg:fs-30">
        <h3>Results</h3>
        <div class="mr-8">04</div>
      </div>
      <hr class="mt-8 lg:mt-10">
      <div class="mt-20 lg:mt-26">
        <p class="my-text pr-60 lg:pr-150">Fast, compliant, and precise—powered by our proprietary technologies</p>
      </div>
      <hr class="mt-28 lg:mt-46">
    </div>
    <!--]-->
  </div>
</div>
<!--]-->
</section>
```
