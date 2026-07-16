# Services (accordion) Specification

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
`src/components/sections/Services.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-2-services-top.png (item 1 open: description + [ LEARN MORE → ], building image bottom-left)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-2-services-bottom.png

## Interaction model
click-driven accordion (exactly one item open; opening one closes the previous). Left image swaps to match the open item.

## Layout (from computed walk @1440)

`<section class="px-15 pt-50 my-grid grid-rows-[repeat(2,auto)] content-start min-h-svh">`
- Vertical rule: `hidden lg:block border-l-1px b-blue col-start-7 col-end-[-1] row-start-1 row-end-3` (spans both rows, 993px tall).
- Title row (row 1, spans grid): `bg-mercury col-span-full text-blue font-pp-neue font-medium fs-80 tracking-[0] leading-none` split in two: "Our" (lg col 1-7) and "Services" (lg col 7-13) — each inside `split-text` > `line-mask` > `reveal-line` (scroll reveal, stagger 0.1/0.2s). 150px tall row.
- Left column (lg col 1-6, row 2, hidden on mobile, height ≈ 663px `relative`): 6 image layers stacked: each `absolute inset-0 flex-center` > `overflow-hidden w-[49%] aspect-[340/240]` > DitheredImage. Only the ACTIVE item's image is visible: opacity 1, others 0 (transition-opacity duration-500). Image order matches accordion item order — asset map (in HTML order of the 6 items):
  1 Construction Expediting → /images/palceholder.jpg
  2 Sign-Offs & Project Closeouts → /images/expertconsultation.jpg
  3 Class 1 Special Inspections → /images/buildinginspection.jpg
  4 Violation Resolution & Building Compliance → /images/commercial-building-nyc.jpg
  5 Job Approvals → /images/maria-davila-perez.jpg
  6 Code & Zoning Consultation → /images/mg-6-.jpg
  (VERIFY order against the embedded HTML img data-src order!)
- Right column (col-span-full mt-50 pb-15 lg:col-start-7 lg:col-span-6 lg:row-start-2 lg:mt-0):
  - `.accordion border-t-1px b-blue`: 6 items, each `border-b-1px b-blue`:
    - Header `<h3>` contains a `<button>`: `text-blue font-normal font-pp-neue fs-30 flex w-full justify-between text-left items-start py-17 pr-3 lg:pr-15 leading-none` (measured height 64px). Right side: PlusIcon `w-18 h-18 mt-6 shrink-0 origin-center` — rotates 45° (becomes ×) when its item is open; `transition-transform duration-500`.
    - Panel: `grid` with `grid-template-rows: 0fr` closed / `1fr` open, `transition:[grid-template-rows] 0.5s` (use inline style gridTemplateRows + transition '[grid-template-rows] we can just use style={{gridTemplateRows: open?'1fr':'0fr', transition:'grid-template-rows .5s cubic-bezier(.4,0,.2,1)'}}). Inner `overflow-hidden min-h-0`. Content (open ≈170px): right-aligned block (≈ half width, ml-auto): `my-text` uppercase description + below `[ LEARN MORE → ]` link: mono fs-12 uppercase text-blue — renders literally as `[ LEARN MORE ` + ArrowIcon (w-14 h-8 inline) + ` ]`, href from HTML. Hover: opacity .6.
  - **View All Services button**: `<a>` `w-full text-center mt-15 relative inline-block overflow-hidden uppercase` mono fs-12; base layer span `block px-46 py-25 bg-blue text-mercury`; hover layer span `block absolute inset-0 px-46 py-25 bg-white text-blue` revealed left→right via clip-path: default `clip-path: inset(0 100% 0 0)`; on hover `inset(0 0 0 0)`; `transition: clip-path .5s cubic-bezier(.4,0,.2,1)`. Text "View All Services".
- First item open by default. Clicking open item's header MAY close it (site behavior: clicking another opens it and closes previous; clicking the open one closes it — showed × icon suggesting closable). Implement toggle-with-single-open.
- Scroll reveal: title lines + accordion fade in (reveal-fade on the accordion container).

All 6 item titles, descriptions and hrefs are in the embedded HTML.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 pt-50 my-grid grid-rows-[repeat(2,auto)] content-start min-h-100svh ipadpro:min-h-auto" data-slice-type="our_services" data-slice-variation="default">
  <!--[-->
  <!--[-->
  <h2 class="sr-only">Our Services</h2>
  <div class="hidden lg:block border-l-1px b-blue col-start-7 col-end--1 row-start-1 row-end-3 ml--1.11vw">
  </div>
  <div class="bg-mercury col-span-full text-blue font-pp-neue font-500 fs-80 tracking-0 lh-1 lg:lh-0.9375 lg:fs-160 lg:mb-110 lg:grid lg:col-span-full lg:row-start-1 lg:grid-cols-subgrid lg:mt-70" aria-hidden="true">
    <div class="lg:col-start-1 lg:col-end-7">Our</div>
    <div class="lg:col-start-7 lg:col-span-6">Services</div>
  </div>
  <!--]-->
  <div class="hidden lg:block lg:col-start-1 lg:col-span-6 lg:row-start-2 lg:relative">
    <!--[-->
    <div class="absolute inset-0 flex-center">
      <div data-dither-image class="overflow-hidden w-49% aspect-340/240">
        <img width="2100" height="1400" data-src="https://images.prismic.io/oci-awards/aYePO90YXLCxVj8W_palceholder.jpg?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.5;" class="invisible">
        <!---->
      </div>
    </div>
    <div class="absolute inset-0 flex-center">
      <div data-dither-image class="overflow-hidden w-49% aspect-340/240">
        <img width="1595" height="1277" data-src="https://images.prismic.io/oci-awards/aYeOzd0YXLCxVj7c_ExpertConsultation.jpg?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.24902114330462;" class="invisible">
        <!---->
      </div>
    </div>
    <div class="absolute inset-0 flex-center">
      <div data-dither-image class="overflow-hidden w-49% aspect-340/240">
        <img width="2100" height="1400" data-src="https://images.prismic.io/oci-awards/aYeOu90YXLCxVj7P_BuildingInspection.jpg?auto=format%2Ccompress&amp;rect=0%2C1241%2C3024%2C2016&amp;w=1000&amp;h=1400&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.5;" class="invisible">
        <!---->
      </div>
    </div>
    <div class="absolute inset-0 flex-center">
      <div data-dither-image class="overflow-hidden w-49% aspect-340/240">
        <img width="2340" height="1400" data-src="https://images.prismic.io/oci-awards/aYeOP90YXLCxVj6Q_Commercial-Building-NYC.jpeg?auto=format%2Ccompress&amp;rect=13%2C0%2C5669%2C3392&amp;w=1000&amp;h=1400&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.6714285714285715;" class="invisible">
        <!---->
      </div>
    </div>
    <div class="absolute inset-0 flex-center">
      <div data-dither-image class="overflow-hidden w-49% aspect-340/240">
        <img width="2100" height="1300" data-src="https://images.prismic.io/oci-awards/aYeO_N0YXLCxVj7x_maria-davila-perez-Yy65fdhVCuk-unsplash.jpg?auto=format%2Ccompress&amp;rect=546%2C812%2C3032%2C1877&amp;w=1000&amp;h=1300&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.6153846153846154;" class="invisible">
        <!---->
      </div>
    </div>
    <div class="absolute inset-0 flex-center">
      <div data-dither-image class="overflow-hidden w-49% aspect-340/240">
        <img width="2880" height="2202" data-src="https://images.prismic.io/oci-awards/aYeO490YXLCxVj7n_mg-6-.png?auto=format%2Ccompress&amp;w=1000&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.3079019073569482;" class="invisible">
        <!---->
      </div>
    </div>
    <!--]-->
  </div>
  <div class="col-span-full mt-50 pb-15 lg:col-start-7 lg:grid-col-span-6 lg:row-start-2 lg:mt-0">
    <div class="accordion border-t-1px b-blue" role="presentation">
      <!--[-->
      <!--[-->
      <div class="border-b-1px b-blue" data-v-d5970cd5>
        <h3 data-v-d5970cd5>
          <button id="accordion-button-0" class="title" aria-expanded="true" aria-controls="accordion-panel-0" data-v-d5970cd5>
            <!--[-->
            <span data-v-d5970cd5-s>Construction Expediting</span>
            <!--]-->
            <svg class="icon w-18 h-18 mt-6 inline-block transform-origin-cc shrink-0 | js-accordion-close" aria-hidden="true" data-v-d5970cd5 data-v-aed543bb>
              <!---->
              <use xlink:href="/sprites/sprite-ui.svg#plus" data-v-aed543bb>
              </use>
            </svg>
          </button>
        </h3>
        <div id="accordion-panel-0" class="grid grid-rows-[0fr]" role="region" aria-labelledby="accordion-button-0" data-v-d5970cd5>
          <div class="content-inner overflow-hidden" data-v-d5970cd5>
            <!--[-->
            <div class="flex flex-col items-start" data-v-d5970cd5-s>
              <!--[-->
              <!--[-->
              <p data-v-d5970cd5-s>
                <!--[-->
                <!--[-->
                <!--[-->
                <!--[-->
                <!---->We accelerate approvals, keep agencies moving, and eliminate delays from start to finish.<!--]-->
                <!--]-->
                <!--]-->
                <!--]-->
              </p>
              <!--]-->
              <!--]-->
              <a href="/services/construction-expediting" class="flex items-center fs-12 font-gta-mono lh-1 ls-0 mt-40 fs-12 lg:mt-30" tabindex="0" data-v-d5970cd5-s> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
              <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
                <!---->
                <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
                </use>
              </svg>
              <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
                <!--[-->
                <!--[--> Learn More <!--]-->
                <!--]-->
              </span>
              <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
                <!---->
                <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
                </use>
              </svg>
            </span> ] </a>
          </div>
          <!--]-->
        </div>
      </div>
    </div>
    <div class="border-b-1px b-blue" data-v-d5970cd5>
      <h3 data-v-d5970cd5>
        <button id="accordion-button-1" class="title" aria-expanded="false" aria-controls="accordion-panel-1" data-v-d5970cd5>
          <!--[-->
          <span data-v-d5970cd5-s>Sign-Offs &amp; Project Closeouts</span>
          <!--]-->
          <svg class="icon w-18 h-18 mt-6 inline-block transform-origin-cc shrink-0 | js-accordion-close" aria-hidden="true" data-v-d5970cd5 data-v-aed543bb>
            <!---->
            <use xlink:href="/sprites/sprite-ui.svg#plus" data-v-aed543bb>
            </use>
          </svg>
        </button>
      </h3>
      <div id="accordion-panel-1" class="grid grid-rows-[0fr]" role="region" aria-labelledby="accordion-button-1" data-v-d5970cd5>
        <div class="content-inner overflow-hidden" data-v-d5970cd5>
          <!--[-->
          <div class="flex flex-col items-start" data-v-d5970cd5-s>
            <!--[-->
            <!--[-->
            <p data-v-d5970cd5-s>
              <!--[-->
              <!--[-->
              <!--[-->
              <!--[-->
              <!---->Lingering open applications can stall your construction project and complicate refinancing. At Outsource Consultants, we prioritize project completion, preparing for closeout even before the DOB issues the permits.<!--]-->
              <!--]-->
              <!--]-->
              <!--]-->
            </p>
            <!--]-->
            <!--]-->
            <a href="/services/sign-offs" class="flex items-center fs-12 font-gta-mono lh-1 ls-0 mt-40 fs-12 lg:mt-30" tabindex="-1" data-v-d5970cd5-s> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
            <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
              <!---->
              <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
              </use>
            </svg>
            <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
              <!--[-->
              <!--[--> Learn More <!--]-->
              <!--]-->
            </span>
            <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
              <!---->
              <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
              </use>
            </svg>
          </span> ] </a>
        </div>
        <!--]-->
      </div>
    </div>
  </div>
  <div class="border-b-1px b-blue" data-v-d5970cd5>
    <h3 data-v-d5970cd5>
      <button id="accordion-button-2" class="title" aria-expanded="false" aria-controls="accordion-panel-2" data-v-d5970cd5>
        <!--[-->
        <span data-v-d5970cd5-s>Class 1 Special Inspections</span>
        <!--]-->
        <svg class="icon w-18 h-18 mt-6 inline-block transform-origin-cc shrink-0 | js-accordion-close" aria-hidden="true" data-v-d5970cd5 data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#plus" data-v-aed543bb>
          </use>
        </svg>
      </button>
    </h3>
    <div id="accordion-panel-2" class="grid grid-rows-[0fr]" role="region" aria-labelledby="accordion-button-2" data-v-d5970cd5>
      <div class="content-inner overflow-hidden" data-v-d5970cd5>
        <!--[-->
        <div class="flex flex-col items-start" data-v-d5970cd5-s>
          <!--[-->
          <!--[-->
          <p data-v-d5970cd5-s>
            <!--[-->
            <!--[-->
            <!--[-->
            <!--[-->
            <!---->Since 2012, Outsource Consultants has provided comprehensive Special Inspection services across New York City’s construction landscape.<!--]-->
            <!--]-->
            <!--]-->
            <!--]-->
          </p>
          <!--]-->
          <!--]-->
          <a href="/services/professional-special-inspections" class="flex items-center fs-12 font-gta-mono lh-1 ls-0 mt-40 fs-12 lg:mt-30" tabindex="-1" data-v-d5970cd5-s> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
          <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
            <!---->
            <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
            </use>
          </svg>
          <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
            <!--[-->
            <!--[--> Learn More <!--]-->
            <!--]-->
          </span>
          <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
            <!---->
            <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
            </use>
          </svg>
        </span> ] </a>
      </div>
      <!--]-->
    </div>
  </div>
</div>
<div class="border-b-1px b-blue" data-v-d5970cd5>
  <h3 data-v-d5970cd5>
    <button id="accordion-button-3" class="title" aria-expanded="false" aria-controls="accordion-panel-3" data-v-d5970cd5>
      <!--[-->
      <span data-v-d5970cd5-s>Violation Resolution &amp; Building Compliance</span>
      <!--]-->
      <svg class="icon w-18 h-18 mt-6 inline-block transform-origin-cc shrink-0 | js-accordion-close" aria-hidden="true" data-v-d5970cd5 data-v-aed543bb>
        <!---->
        <use xlink:href="/sprites/sprite-ui.svg#plus" data-v-aed543bb>
        </use>
      </svg>
    </button>
  </h3>
  <div id="accordion-panel-3" class="grid grid-rows-[0fr]" role="region" aria-labelledby="accordion-button-3" data-v-d5970cd5>
    <div class="content-inner overflow-hidden" data-v-d5970cd5>
      <!--[-->
      <div class="flex flex-col items-start" data-v-d5970cd5-s>
        <!--[-->
        <!--[-->
        <p data-v-d5970cd5-s>
          <!--[-->
          <!--[-->
          <!--[-->
          <!--[-->
          <!---->Fast, effective resolution of violations and proactive compliance to keep your project on track.<!--]-->
          <!--]-->
          <!--]-->
          <!--]-->
        </p>
        <!--]-->
        <!--]-->
        <a href="/services/resolve-violations" class="flex items-center fs-12 font-gta-mono lh-1 ls-0 mt-40 fs-12 lg:mt-30" tabindex="-1" data-v-d5970cd5-s> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
        <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
          </use>
        </svg>
        <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
          <!--[-->
          <!--[--> Learn More <!--]-->
          <!--]-->
        </span>
        <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
          </use>
        </svg>
      </span> ] </a>
    </div>
    <!--]-->
  </div>
</div>
</div>
<div class="border-b-1px b-blue" data-v-d5970cd5>
  <h3 data-v-d5970cd5>
    <button id="accordion-button-4" class="title" aria-expanded="false" aria-controls="accordion-panel-4" data-v-d5970cd5>
      <!--[-->
      <span data-v-d5970cd5-s>Job Approvals</span>
      <!--]-->
      <svg class="icon w-18 h-18 mt-6 inline-block transform-origin-cc shrink-0 | js-accordion-close" aria-hidden="true" data-v-d5970cd5 data-v-aed543bb>
        <!---->
        <use xlink:href="/sprites/sprite-ui.svg#plus" data-v-aed543bb>
        </use>
      </svg>
    </button>
  </h3>
  <div id="accordion-panel-4" class="grid grid-rows-[0fr]" role="region" aria-labelledby="accordion-button-4" data-v-d5970cd5>
    <div class="content-inner overflow-hidden" data-v-d5970cd5>
      <!--[-->
      <div class="flex flex-col items-start" data-v-d5970cd5-s>
        <!--[-->
        <!--[-->
        <p data-v-d5970cd5-s>
          <!--[-->
          <!--[-->
          <!--[-->
          <!--[-->
          <!---->We help New York City projects move faster by efficiently navigating approvals and permits through city agencies. <!--]-->
          <!--]-->
          <!--]-->
          <!--]-->
        </p>
        <!--]-->
        <!--]-->
        <a href="/services/job-approvals" class="flex items-center fs-12 font-gta-mono lh-1 ls-0 mt-40 fs-12 lg:mt-30" tabindex="-1" data-v-d5970cd5-s> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
        <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
          </use>
        </svg>
        <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
          <!--[-->
          <!--[--> Learn More <!--]-->
          <!--]-->
        </span>
        <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
          </use>
        </svg>
      </span> ] </a>
    </div>
    <!--]-->
  </div>
</div>
</div>
<div class="border-b-1px b-blue" data-v-d5970cd5>
  <h3 data-v-d5970cd5>
    <button id="accordion-button-5" class="title" aria-expanded="false" aria-controls="accordion-panel-5" data-v-d5970cd5>
      <!--[-->
      <span data-v-d5970cd5-s>Code &amp; Zoning Consultation</span>
      <!--]-->
      <svg class="icon w-18 h-18 mt-6 inline-block transform-origin-cc shrink-0 | js-accordion-close" aria-hidden="true" data-v-d5970cd5 data-v-aed543bb>
        <!---->
        <use xlink:href="/sprites/sprite-ui.svg#plus" data-v-aed543bb>
        </use>
      </svg>
    </button>
  </h3>
  <div id="accordion-panel-5" class="grid grid-rows-[0fr]" role="region" aria-labelledby="accordion-button-5" data-v-d5970cd5>
    <div class="content-inner overflow-hidden" data-v-d5970cd5>
      <!--[-->
      <div class="flex flex-col items-start" data-v-d5970cd5-s>
        <!--[-->
        <!--[-->
        <p data-v-d5970cd5-s>
          <!--[-->
          <!--[-->
          <!--[-->
          <!--[-->
          <!---->At Outsource Consultants, our in-house team of expert consultants tackles the most complex Building, Zoning, Plumbing, and Mechanical Code challenges in New York City.<!--]-->
          <!--]-->
          <!--]-->
          <!--]-->
        </p>
        <!--]-->
        <!--]-->
        <a href="/services/building-code-needs" class="flex items-center fs-12 font-gta-mono lh-1 ls-0 mt-40 fs-12 lg:mt-30" tabindex="-1" data-v-d5970cd5-s> [ <span class="grid items-center overflow-hidden mx-10 grid-cols-[auto_auto]">
        <svg class="icon col-start-1 row-start-1 w-14 h-8 mr-11 mt--1 text-blue" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
          </use>
        </svg>
        <span class="inline-block row-start-1 justify-self-end text-blue font-gta-mono uppercase">
          <!--[-->
          <!--[--> Learn More <!--]-->
          <!--]-->
        </span>
        <svg class="icon col-start-2 row-start-1 w-14 h-8 mt--1 text-blue ml-11 justify-self-end" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#arrow" data-v-aed543bb>
          </use>
        </svg>
      </span> ] </a>
    </div>
    <!--]-->
  </div>
</div>
</div>
<!--]-->
<!--]-->
</div>
<a href="/services" class="w-full text-center mt-15 relative inline-block overflow-hidden text-center uppercase fs-14 lh-1 tracking-0.02em font-400 font-gta-mono bg-blue text-mercury b-1px b-blue w-full text-center mt-15">
  <span class="block px-46 py-25" style="">
    <!--[-->View All Services<!--]-->
  </span>
  <span class="block absolute inset-0 px-46 py-25 bg-white text-blue" style="">
    <!--[-->View All Services<!--]-->
  </span>
</a>
</div>
<div class="col-span-full border-b-1px b-blue">
</div>
<!--]-->
</section>
```
