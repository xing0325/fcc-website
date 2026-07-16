# News grid Specification

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
`src/components/sections/News.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-6-news-top.png (big dithered image left; 2×2 cards right; first card = blue featured w/ light text)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-6-news-bottom.png

## Interaction model
static + hover (non-featured cards reveal their image block on hover; featured card has full-bleed image + light text)

## Layout

`<section class="px-15 my-grid overflow-hidden pt-50 pb-64 lg:pb-100">`
- Header row spanning all: `LATEST NEWS` my-text left; right: `[ VIEW ALL NEWS → ]` my-text link (brackets + ArrowIcon w-14 h-8 inline before the closing bracket); `border-b-1px b-blue` full-width line under this row (or on the row).
- Left feature (lg cols 1-6): tall dithered image wrapper `relative overflow-hidden w-full h-full` (≈713×697, roughly aspect-square, image /images/people-building-bg.jpg) — it is an `<a>` (link to a post) — no visible text per screenshot.
- Right (lg cols 7-12): 2×2 card grid: vertical rule between the two columns and `border-b-1px b-blue` separating rows (check HTML for exact rule elements).
  Each card = `<a class="group relative">` with grid content:
  - date `fs-22` PP 400 top ("02.12" / "02.08" …) — featured card: text-mercury; others text-blue.
  - image block `overflow-hidden relative w-full mt-24 aspect-[385/260]` — **Card 1 (featured, "Building Inclusivity…")**: the image (/images/expertconsultation.jpg) fills the ENTIRE card as background `absolute inset-0` (DitheredImage) with content (date, category, title) overlaid in `text-mercury`. **Cards 2-4**: reserve the image space; DitheredImage (cards 3-4: /images/leadpipes.jpg, /images/ebike.jpg; card 2 image if present in HTML) hidden by default (opacity-0), revealed `group-hover:opacity-100 transition-opacity duration-500`. If a card has NO image in the HTML (card 2 appears imageless), it just keeps empty space.
  - bottom: category `my-text` ("CONTRACTORS" / "ARCHITECTS" / "BUILDING OWNERS") then title `fs-22 leading-[1.1] font-pp-neue font-normal` 2-3 lines (featured: text-mercury; others text-blue). Hover (non-featured): title underline or opacity — use opacity .7.
- Follow the embedded HTML for the exact card grid classes, rules, hrefs, dates, categories, titles.
- Reveal: cards fade-up staggered.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 my-grid overflow-hidden pt-50 pb-64 lg:pb-100" data-slice-type="latest_news" data-slice-variation="default" data-v-6de12d2a>
  <!--[-->
  <div class="flex justify-between text-blue font-400 font-gta-mono fs-12 lh-1 ls-0 uppercase col-span-full b-t-1px b-blue pt-18" data-v-6de12d2a>
    <div>
      <span>Latest News</span>
    </div>
    <div>
      <!--[-->
      <a href="/blog" class="flex items-center fs-12 font-gta-mono lh-1 ls-0" data-v-6de12d2a> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
      <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
        <!---->
        <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
        </use>
      </svg>
      <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
        <!--[-->
        <!--[-->
        <span class="block js-latest-news-link" data-v-6de12d2a>View All News</span>
        <!--]-->
        <!--]-->
      </span>
      <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
        <!---->
        <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
        </use>
      </svg>
    </span> ] </a>
    <!--]-->
  </div>
</div>
<div class="col-span-full grid grid-template-stack mt-50 aspect-ratio-1/1 lg:col-1s6" data-v-6de12d2a>
  <!--[-->
  <div data-dither-image class="overflow-hidden w-full h-full grid-stack" data-v-6de12d2a>
    <img width="2000" height="1333" data-src="https://images.prismic.io/oci-awards/aYePMN0YXLCxVj8Q_people-building-bg.jpg?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.5003750937734435;" class="invisible">
    <!---->
  </div>
  <div data-dither-image class="overflow-hidden w-full h-full grid-stack" data-v-6de12d2a>
    <img width="1595" height="1277" data-src="https://images.prismic.io/oci-awards/aYeOzd0YXLCxVj7c_ExpertConsultation.jpg?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.24902114330462;" class="invisible">
    <!---->
  </div>
  <div data-dither-image class="overflow-hidden w-full h-full grid-stack" data-v-6de12d2a>
    <img width="2100" height="1400" data-src="https://images.prismic.io/oci-awards/aYeOs90YXLCxVj7L_leadpipes.jpg?auto=format%2Ccompress&amp;rect=443%2C0%2C2692%2C1795&amp;w=1000&amp;h=1400&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.5;" class="invisible">
    <!---->
  </div>
  <div data-dither-image class="overflow-hidden w-full h-full grid-stack" data-v-6de12d2a>
    <img width="2100" height="1400" data-src="https://images.prismic.io/oci-awards/aYeOud0YXLCxVj7N_ebike.jpg?auto=format%2Ccompress&amp;w=1000&amp;h=1400&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.5;" class="invisible">
    <!---->
  </div>
  <!--]-->
</div>
<div class="col-span-full mt-15 flex flex-nowrap gap-x-10 lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:mt-50 lg:gap-x-0" data-v-6de12d2a>
  <!--[-->
  <article class="post | relative text-blue font-pp-neue font-400 fs-18 ls-0 lh-1 relative w-76.94vw min-h-280 b-y-1px b-blue flex-shrink-0 pr-55 pl-28 pt-18 pb-28 flex flex-col justify-between lg:col-span-3 lg:w-auto lg:aspect-ratio-1/1 | js-post lg:b-y-none" data-v-6de12d2a>
    <div class="bg-blue absolute -z-1 inset-0 | js-bg" data-v-6de12d2a>
      <div class="size-85 bg-mercury b-0.5px b-blue absolute top-0 right-0 flex-center origin-tr lg:size-90 will-change-transform | js-btn" data-v-6de12d2a>
        <svg class="icon size-40% text-blue origin-c will-change-transform | js-arrow" aria-hidden="true" data-v-6de12d2a data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#top-right-arrow" data-v-aed543bb>
          </use>
        </svg>
      </div>
    </div>
    <time datetime="2026-02-12" data-v-6de12d2a>02.12</time>
    <div class="mt-24" data-v-6de12d2a>
      <span class="font-gta-mono uppercase fs-10" data-v-6de12d2a>Contractors</span>
      <h3 class="mt-22" data-v-6de12d2a>Building Inclusivity: Celebrating Black History in Construction, Architecture, &amp; Engineering</h3>
    </div>
    <a href="/blog/dupe" class="absolute inset-0 outline-none" aria-label="Read article: Building Inclusivity: Celebrating Black History in Construction, Architecture, &amp; Engineering" data-v-6de12d2a>
    </a>
  </article>
  <article class="post | relative text-blue font-pp-neue font-400 fs-18 ls-0 lh-1 relative w-76.94vw min-h-280 b-y-1px b-blue flex-shrink-0 pr-55 pl-28 pt-18 pb-28 flex flex-col justify-between lg:col-span-3 lg:w-auto lg:aspect-ratio-1/1 | js-post lg:b-y-none" data-v-6de12d2a>
    <!---->
    <time datetime="2026-02-07" data-v-6de12d2a>02.07</time>
    <div class="mt-24" data-v-6de12d2a>
      <span class="font-gta-mono uppercase fs-10" data-v-6de12d2a>Architects</span>
      <h3 class="mt-22" data-v-6de12d2a>Outsource Consultants Inc becomes SCA Certified MBE</h3>
    </div>
    <a href="/blog/outsource-consultants-inc-becomes-sca-certified-mbe" class="absolute inset-0 outline-none" aria-label="Read article: Outsource Consultants Inc becomes SCA Certified MBE" data-v-6de12d2a>
    </a>
  </article>
  <article class="post | relative text-blue font-pp-neue font-400 fs-18 ls-0 lh-1 relative w-76.94vw min-h-280 b-y-1px b-blue flex-shrink-0 pr-55 pl-28 pt-18 pb-28 flex flex-col justify-between lg:col-span-3 lg:w-auto lg:aspect-ratio-1/1 | js-post lg:b-y-1px" data-v-6de12d2a>
    <!---->
    <time datetime="2026-02-07" data-v-6de12d2a>02.07</time>
    <div class="mt-24" data-v-6de12d2a>
      <span class="font-gta-mono uppercase fs-10" data-v-6de12d2a>Building Owners</span>
      <h3 class="mt-22" data-v-6de12d2a>Leaving Lead Behind: How NYC Plans to Replace Lead Pipes</h3>
    </div>
    <a href="/blog/leaving-lead-behind-how-nyc-plans-to-replace-lead-pipes" class="absolute inset-0 outline-none" aria-label="Read article: Leaving Lead Behind: How NYC Plans to Replace Lead Pipes" data-v-6de12d2a>
    </a>
  </article>
  <article class="post | relative text-blue font-pp-neue font-400 fs-18 ls-0 lh-1 relative w-76.94vw min-h-280 b-y-1px b-blue flex-shrink-0 pr-55 pl-28 pt-18 pb-28 flex flex-col justify-between lg:col-span-3 lg:w-auto lg:aspect-ratio-1/1 | js-post lg:b-y-1px" data-v-6de12d2a>
    <!---->
    <time datetime="2026-02-07" data-v-6de12d2a>02.07</time>
    <div class="mt-24" data-v-6de12d2a>
      <span class="font-gta-mono uppercase fs-10" data-v-6de12d2a>Building Owners</span>
      <h3 class="mt-22" data-v-6de12d2a>Powering Up: Applications Open for E-Bike Charging Cabinets</h3>
    </div>
    <a href="/blog/powering-up-applications-open-for-e-bike-charging-cabinets" class="absolute inset-0 outline-none" aria-label="Read article: Powering Up: Applications Open for E-Bike Charging Cabinets" data-v-6de12d2a>
    </a>
  </article>
  <!--]-->
</div>
<!--]-->
</section>
```
