# Projects Specification

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
`src/components/sections/Projects.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-4-projects-top.png (giant centered title)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-4-projects-bottom.png (3 columns with dithered images + rules)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/state-project-hover.png (hover: arrow appears over image)

## Interaction model
static layout + hover states on project cards + scroll reveals

## Layout

`<section class="px-15 pb-15">` with h2 title + my-grid content.
- Title: "Most Recent Projects" — `my-title` (10rem lg) text-blue, centered (`text-center`), wraps to 2 lines ("Most Recent" / "Projects"), each line reveal-line. mt-50-ish per HTML.
- 3 project columns (lg: each col-span-4; mobile stacked): each column:
  - Vertical rule left: `border-l-1px b-blue` (the rules visibly extend ABOVE the header row ~130px and BELOW under the image — per screenshot the rule runs the full column height; column content has pl-10-ish).
  - Header row (flex justify-between, my-text): left = category (RETAIL / RETAIL / HOTELS) — right = index (01 / 02 / 03). NOTE from screenshot: column 1 shows category right-aligned toward center gap and 02's category on its left… follow the embedded HTML exactly.
  - Title: `text-blue font-normal font-pp-neue fs-36 leading-none tracking-[0]` e.g. "Dolce & Gabbana Boutique" (2 lines) — mt varies to create the stagger: col1 title at ~y+175, col2 ~y+203, col3 ~y+185 (screenshot) — the HTML mt classes are ground truth.
  - Image: wrapper `overflow-hidden relative group w-full mt-24 aspect-[385/260]` > DitheredImage: col1 /images/1920x1080.jpg, col2 /images/2025-lmfifthave-cs-concierge.jpg, col3 /images/nycdm-p0068-exterior.16x9.jpg. The three images sit at staggered vertical offsets (col2 lower, col3 mid — via differing title/label spacing in HTML).
  - Whole card is an `<a>` (href from HTML) with `group`; hover: white circle appears centered over the image: `absolute inset-0 flex-center` > `bg-white rounded-full size-90 flex-center scale-0 group-hover:scale-100 transition-transform duration-500` > TopRightArrowIcon `size-[53%] text-blue`. (js-arrow originally scale-0 origin-center.)
- Bottom: **[ VIEW ALL PROJECTS ]** sweep button centered (mx-auto inline-block mt-100-ish): same construction as services' View All button but inline-width: base span `block px-46 py-25 bg-blue text-mercury` mono fs-12 uppercase "View All Projects", hover layer `absolute inset-0 bg-white text-blue` clip-path sweep left→right .5s.
- Reveal: columns fade-up staggered on scroll.
Text/labels/hrefs verbatim from embedded HTML.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 pb-15" data-slice-type="projects" data-slice-variation="default">
  <!--[-->
  <div class="b-t-1px b-blue pt-50 lg:pt-100">
  </div>
  <div class="my-grid">
    <div class="my-title text-center col-span-full lg:col-start-3 lg:-col-end-3">
      <!--[-->
      <!--[-->
      <h2>
        <!--[-->
        <!--[-->
        <!--[-->
        <!--[-->
        <!---->Most Recent Projects<!--]-->
        <!--]-->
        <!--]-->
        <!--]-->
      </h2>
      <!--]-->
      <!--]-->
    </div>
  </div>
  <div class="my-grid relative mt-130 gap-y-60 lg:pb-40">
    <div class="hidden absolute top-0 left-0 w-full h-full my-grid lg:grid">
      <!--[-->
      <div class="absolute top-0 left-0 b-blue pointer-events-none w-1px b-l-1px h-full translate-x-[0.5px] col-span-4 static!">
      </div>
      <div class="absolute top-0 left-0 b-blue pointer-events-none w-1px b-l-1px h-full translate-x-[0.5px] col-span-4 static!">
      </div>
      <div class="absolute top-0 left-0 b-blue pointer-events-none w-1px b-l-1px h-full translate-x-[0.5px] col-span-4 static!">
      </div>
      <!--]-->
    </div>
    <!--[-->
    <div class="col-span-full lg:col-span-4 lg:pl-15 lg:pr-65 lg:pb-20vh" data-project-index="0">
      <div class="flex justify-between text-blue font-400 font-gta-mono fs-12 lh-1 ls-0 uppercase lg:pr-12">
        <div>
          <span>01</span>
        </div>
        <div aria-hidden="true">
          <!--[-->Retail<!--]-->
        </div>
      </div>
      <div class="mt-44 relative z-1 | js-project">
        <div class="bg-mercury absolute w-2vw h-full top-0 right-100% -z-1">
        </div>
        <h3 class="text-blue font-400 font-pp-neue fs-36 lh-1 ls-0">Dolce &amp; Gabbana Boutique</h3>
        <div class="relative">
          <div data-dither-image class="overflow-hidden relative group w-full mt-24 aspect-385/260">
            <img width="1920" height="1080" data-src="https://images.prismic.io/oci-awards/aYeNgt0YXLCxVj4H_1920x1080.jpg?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.7777777777777777;" class="invisible">
            <div class="bg-white b-0.5px b-blue absolute bottom-0 right-0 flex-center scale-0 origin-br will-change-transform | js-btn" style="width: 3.75rem; height: 3.75rem;">
              <svg class="icon size-53% text-blue scale-0 origin-c | js-arrow" aria-hidden="true" data-v-aed543bb>
                <!---->
                <use xlink:href="/sprites/sprite-ui.svg#top-right-arrow" data-v-aed543bb>
                </use>
              </svg>
            </div>
          </div>
          <a href="/projects/dg-boutique" class="absolute inset-0" aria-label="View project: Dolce &amp; Gabbana Boutique">
          </a>
        </div>
      </div>
    </div>
    <div class="col-span-full lg:col-span-4 lg:pl-15 lg:pr-65 lg:pb-20vh" data-project-index="1">
      <div class="flex justify-between text-blue font-400 font-gta-mono fs-12 lh-1 ls-0 uppercase lg:pr-12">
        <div>
          <span>02</span>
        </div>
        <div aria-hidden="true">
          <!--[-->Retail<!--]-->
        </div>
      </div>
      <div class="mt-44 relative z-1 | js-project">
        <div class="bg-mercury absolute w-2vw h-full top-0 right-100% -z-1">
        </div>
        <h3 class="text-blue font-400 font-pp-neue fs-36 lh-1 ls-0">Tiffany Flagship</h3>
        <div class="relative">
          <div data-dither-image class="overflow-hidden relative group w-full mt-24 aspect-385/260">
            <img width="1280" height="1280" data-src="https://images.prismic.io/oci-awards/aYeNht0YXLCxVj4M_2025_LMFIFTHAVE_CS_CONCIERGE.jpg?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1;" class="invisible">
            <div class="bg-white b-0.5px b-blue absolute bottom-0 right-0 flex-center scale-0 origin-br will-change-transform | js-btn" style="width: 3.75rem; height: 3.75rem;">
              <svg class="icon size-53% text-blue scale-0 origin-c | js-arrow" aria-hidden="true" data-v-aed543bb>
                <!---->
                <use xlink:href="/sprites/sprite-ui.svg#top-right-arrow" data-v-aed543bb>
                </use>
              </svg>
            </div>
          </div>
          <a href="/projects/tiffany-flagship" class="absolute inset-0" aria-label="View project: Tiffany Flagship">
          </a>
        </div>
      </div>
    </div>
    <div class="col-span-full lg:col-span-4 lg:pl-15 lg:pr-65 lg:pb-20vh" data-project-index="2">
      <div class="flex justify-between text-blue font-400 font-gta-mono fs-12 lh-1 ls-0 uppercase lg:pr-12">
        <div>
          <span>03</span>
        </div>
        <div aria-hidden="true">
          <!--[-->Hotels<!--]-->
        </div>
      </div>
      <div class="mt-44 relative z-1 | js-project">
        <div class="bg-mercury absolute w-2vw h-full top-0 right-100% -z-1">
        </div>
        <h3 class="text-blue font-400 font-pp-neue fs-36 lh-1 ls-0">Dream Hotel</h3>
        <div class="relative">
          <div data-dither-image class="overflow-hidden relative group w-full mt-24 aspect-385/260">
            <img width="2560" height="1440" data-src="https://images.prismic.io/oci-awards/aYeNet0YXLCxVj4C_NYCDM-P0068-Exterior.16x9.png?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.7777777777777777;" class="invisible">
            <div class="bg-white b-0.5px b-blue absolute bottom-0 right-0 flex-center scale-0 origin-br will-change-transform | js-btn" style="width: 3.75rem; height: 3.75rem;">
              <svg class="icon size-53% text-blue scale-0 origin-c | js-arrow" aria-hidden="true" data-v-aed543bb>
                <!---->
                <use xlink:href="/sprites/sprite-ui.svg#top-right-arrow" data-v-aed543bb>
                </use>
              </svg>
            </div>
          </div>
          <a href="/projects/dream-hotel" class="absolute inset-0" aria-label="View project: Dream Hotel">
          </a>
        </div>
      </div>
    </div>
    <!--]-->
    <div class="relative z-1 col-span-full mt-100 lg:col-start-5 lg:col-end-[span_3] lg:justify-self-start">
      <div class="hidden lg:block bg-mercury absolute right-0 w-105% h-full -z-1">
      </div>
      <a href="/projects" class="w-full lg:w-248 lg:ml-15 relative inline-block overflow-hidden text-center uppercase fs-14 lh-1 tracking-0.02em font-400 font-gta-mono bg-blue text-mercury b-1px b-blue w-full lg:w-248 lg:ml-15">
        <span class="block px-46 py-25" style="">
          <!--[-->View All Projects<!--]-->
        </span>
        <span class="block absolute inset-0 px-46 py-25 bg-white text-blue" style="">
          <!--[-->View All Projects<!--]-->
        </span>
      </a>
    </div>
  </div>
  <!--]-->
</section>
```
