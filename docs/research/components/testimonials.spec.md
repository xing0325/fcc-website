# Testimonials (carousel) Specification

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
`src/components/sections/Testimonials.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-5-testimonials.png (Gensler logo left, big blue quote right, circular up/down arrows, counter)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/full-desktop-1440.png

## Interaction model
click-driven carousel: up/down circular arrow buttons cycle 3 slides (quote + client logo + counter) with crossfade

## Layout

`<section class="px-15 bg-white pt-50 pb-56 lg:pb-0">` inner my-grid, ~790px tall.
- Meta row: `TESTIMONIALS` my-text left, `[OCI.3]` my-text right.
- h2 sr-only "Testimonials".
- Left area (lg cols 1-3): client logo, container `relative lg:-translate-x-1/2 lg:h-60 lg:flex lg:items-center` (logo centered on the col-3/4 boundary line? Keep per HTML): plain `<img>` h-full w-auto object-contain. Logos per slide: 1 /images/gensler-logo1.svg, 2 /images/walmart.jpg, 3 /images/skanska-logo1.svg or /images/esb.jpg — CHECK the embedded HTML for which logos belong to slides (there are 3 slides; unused downloaded logos may belong elsewhere—use exactly what the HTML lists). Crossfade opacity .5s between slides.
- Vertical rule between logo column and quote (border-l-1px b-blue, per HTML).
- Quote (lg cols 4-10): PP 400 `fs-36 leading-[1.15] text-blue` inside quotation marks (text uses zero-width joiners between words — copy verbatim from HTML). Crossfade (opacity .5s) on slide change; stack quotes with grid-stack so height stays stable (use the tallest).
- Controls (right, lg col 11-12, vertical stack): two circular buttons `size-46 rounded-full border b-1px b-blue flex-center text-blue` with ArrowControlsIcon `w-20 h-9` — first rotated `lg:rotate-90 scale-x-[-1]` (points up), second `lg:rotate-90` (points down). Hover: `bg-blue text-white` transition-colors duration-500. Click up = prev, down = next (wrap around).
- Bottom meta row (mono fs-12 text-blue uppercase): left `01/03` (current index, updates), then client name + `3 AWARDS`-style caption per slide — copy from HTML.
All 3 quotes + attributions in embedded HTML.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 bg-white pt-50 pb-56 lg:pb-0" data-slice-type="testimonials" data-slice-variation="default" data-v-3883714c>
  <!--[-->
  <div class="my-grid" data-v-3883714c>
    <div class="flex justify-between text-blue font-400 font-gta-mono fs-12 lh-1 ls-0 uppercase col-span-full" data-v-3883714c>
      <div>
        <span>Testimonials</span>
      </div>
      <div aria-hidden="true">
        <!--[-->[OCI.3]<!--]-->
      </div>
    </div>
  </div>
  <h2 class="sr-only" data-v-3883714c> Testimonials </h2>
  <div class="col-span-full mt-50 my-grid lg:mt-0" data-v-3883714c>
    <div class="grid grid-cols-subgrid col-span-full lg:col-start-5 lg:-col-end-2 lg:pt-122 lg:pb-124 | op-0 js-quote-block" data-v-3883714c>
      <div class="col-span-full grid grid-template-stack" data-v-3883714c>
        <!--[-->
        <!--[-->
        <blockquote class="grid-stack [&amp;&gt;*]:inline text-blue font-400 font-pp-neue fs-32 lh-1 ls-0 mb-80 lg:mb-128 lg:fs-46 js-quote" role="group" data-v-3883714c> “I have worked with Outsource for many years on various projects, including the Lavelle School for the Blind. When we work with Outsource, we know that we are going to have a project that is completed on time.“ </blockquote>
        <!--]-->
        <!--[-->
        <blockquote class="grid-stack [&amp;&gt;*]:inline text-blue font-400 font-pp-neue fs-32 lh-1 ls-0 mb-80 lg:mb-128 lg:fs-46 js-quote" role="group" data-v-3883714c> “I have worked with Outsource for many years on various projects, including the Lavelle School for the Blind. When we work with Outsource, we know that we are going to have a project that is completed on time, within budget, and is guided by experience and expertise. “ </blockquote>
        <!--]-->
        <!--[-->
        <blockquote class="grid-stack [&amp;&gt;*]:inline text-blue font-400 font-pp-neue fs-32 lh-1 ls-0 mb-80 lg:mb-128 lg:fs-46 js-quote" role="group" data-v-3883714c> “I have worked with Outsource for many years on various projects, including the Lavelle School for the Blind. When we work with Outsource, we know that we are going to have a project that is completed on time.“ </blockquote>
        <!--]-->
        <!--]-->
      </div>
      <div class="flex col-1s1 my-text" data-v-3883714c>
        <span data-v-3883714c data-v-3883714c>01</span> / <span data-v-3883714c>03</span>
      </div>
      <div class="col-start-2 -col-end-1 grid grid-template-stack" data-v-3883714c>
        <!--[-->
        <div class="my-text grid-stack quote-info is-active" data-v-3883714c>
          <div data-v-3883714c>T.Hanks, CRO</div>
          <span data-v-3883714c>Gensler</span>
        </div>
        <div class="my-text grid-stack quote-info" data-v-3883714c>
          <div data-v-3883714c>Ricky Gervais, CEO</div>
          <span data-v-3883714c>Walmart</span>
        </div>
        <div class="my-text grid-stack quote-info" data-v-3883714c>
          <div data-v-3883714c>Stuart Pidd, CMO</div>
          <span data-v-3883714c>Skanska</span>
        </div>
        <!--]-->
      </div>
    </div>
    <div class="col-span-full mt-80 flex justify-between items-center lg:col-3s2 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start lg:pt-122 lg:pb-112 lg:b-l-1px lg:b-blue" data-v-3883714c>
      <div class="relative lg:-translate-x-50% lg:h-60 lg:flex lg:items-center" data-v-3883714c>
        <div class="hidden lg:block bg-white absolute inset-0 -z-1 scale-y-200" data-v-3883714c>
        </div>
        <img src="https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg" srcset="https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=320 320w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=480 480w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=640 640w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=828 828w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=960 960w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=1200 1200w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=1280 1280w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=1400 1400w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=1656 1656w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=2400 2400w, https://oci-awards.cdn.prismic.io/oci-awards/aYeO690YXLCxVj7r_Gensler_logo1.svg?width=2800 2800w" width="1132" height="259" loading="lazy" sizes="(max-width: 1023px) 200px, 11vw" class="w-auto h-100% object-contain" data-v-3883714c>
      </div>
      <div class="flex gap-x-20 lg:flex-col lg:gap-y-20 lg:-translate-x-50% lg:relative" data-v-3883714c>
        <div class="hidden lg:block bg-white absolute inset-0 -z-1 scale-y-130" data-v-3883714c>
        </div>
        <button class="btn-controls | group relative overflow-hidden" aria-label="Previous Testimonial" data-v-3883714c data-v-53e2b4ca>
          <svg class="icon arrow lg:rotate-90 scale-x-[-1]" aria-hidden="true" data-v-53e2b4ca data-v-aed543bb>
            <!---->
            <use xlink:href="/sprites/sprite-ui.svg#arrow-controls" data-v-aed543bb>
            </use>
          </svg>
          <span class="block absolute inset-0 w-full h-full bg-blue rd-50% origin-bc | js-bg" data-v-53e2b4ca>
          </span>
          <span class="block absolute inset-0 flex-center rd-50% w-full h-full z-1 | js-arrow" data-v-53e2b4ca>
            <svg class="icon arrow text-white! lg:rotate-90 scale-x-[-1]" aria-hidden="true" data-v-53e2b4ca data-v-aed543bb>
              <!---->
              <use xlink:href="/sprites/sprite-ui.svg#arrow-controls" data-v-aed543bb>
              </use>
            </svg>
          </span>
        </button>
        <button class="btn-controls | group relative overflow-hidden" aria-label="Next Testimonial" data-v-3883714c data-v-53e2b4ca>
          <svg class="icon arrow lg:rotate-90" aria-hidden="true" data-v-53e2b4ca data-v-aed543bb>
            <!---->
            <use xlink:href="/sprites/sprite-ui.svg#arrow-controls" data-v-aed543bb>
            </use>
          </svg>
          <span class="block absolute inset-0 w-full h-full bg-blue rd-50% origin-bc | js-bg" data-v-53e2b4ca>
          </span>
          <span class="block absolute inset-0 flex-center rd-50% w-full h-full z-1 | js-arrow" data-v-53e2b4ca>
            <svg class="icon arrow text-white! lg:rotate-90" aria-hidden="true" data-v-53e2b4ca data-v-aed543bb>
              <!---->
              <use xlink:href="/sprites/sprite-ui.svg#arrow-controls" data-v-aed543bb>
              </use>
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
  <!--]-->
</section>
```
