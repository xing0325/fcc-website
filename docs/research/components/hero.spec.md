# Hero Specification

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
`src/components/sections/Hero.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-0-hero.png (desktop)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/mob-2-services.png IGNORE name — shows mobile hero
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/full-mobile-390.png (top = mobile hero)

## Interaction model
static + load-in animation (no scroll dependency)

## Layout

`<section class="px-15 relative h-svh">`
- Full-bleed dithered photo: wrapper `overflow-hidden absolute h-full w-full inset-0` containing `<DitheredImage src="/images/adrien-olichon--uun-2ixjva-unsplash.jpg" />`.
- `h1.sr-only` = "Outsource Consultants, Inc."
- Content grid `.hero`: `relative my-grid h-full place-content-end font-pp-neue text-white pb-62 lg:grid-cols-4 lg:pb-0` PLUS at lg these named areas (add via inline style or arbitrary classes):
  grid-template-areas: ". . line1 line2" ". . line1 tagline" "title1 title1 title1 line3" "title2 title2 title2 title2" ". . line4 line5"; grid-template-rows: 1fr auto.
  (Use a `<style jsx>`-free approach: `lg:[grid-template-areas:'._._line1_line2'_'._._line1_tagline'...]` is fiddly — simplest is `style={{}}` on lg via a wrapper class defined with arbitrary property: `lg:[grid-template:...]`. You may hardcode with a small `<style>` tag inside the component: `.hero-grid{...}` inside `@media (min-width:1024px)`.)
- **Titles**: `.title` = PP 500, letter-spacing 0; base 3.25rem lh 1.2; at lg 10rem lh .9375 ml-15.
  - Mobile (<lg): single span rows both words: "Outsource Consultants, Inc." col-span-full row-start-2.
  - lg: two spans: "Outsource" area title1 mt-[-0.05em]; "Consultants, Inc." area title2 mb-10!.
  - Each rendered inside line-mask/reveal-line, animating up on mount (add is-inview on mount with slight delay: title1 0.1s, title2 0.2s).
- **Tagline** (area tagline at lg; mobile col-start-3 col-end-[-1] mb-100): `font-normal fs-24 leading-none tracking-normal lg:-ml-8 lg:mb-0`, text: "Answering all of<br/>your building codes<br/>needs." — reveal-fade delay 0.4s.
- **White vertical lines** (lg only, aria-hidden): five 1px `bg-white` lines in areas line1..line5, each inside `relative overflow-hidden` wrapper; heights: line1 100% top-0; line2 calc(100%-50px) top-0; line3 calc(100%-60px) bottom-0; line4+line5 wrappers have `h-45!`, line 100% top-0. On mount they grow (scaleY 0→1, origin top for top-anchored / bottom for line3, 1.2s expo-out staggered).

The lines sit in grid columns 3/4 (the grid is 4 columns at lg) — matching the two vertical rules visible at x≈727 and x≈1084 in the screenshot, extending from the very top of the section down (line1/line2), plus short stubs near the bottom (line4/line5).

Colors: all text is white/mercury on the dithered blue photo.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 relative h-100svh" data-v-b568fc17>
  <!--[-->
  <div data-dither-image class="overflow-hidden absolute h-full w-full inset-0" data-v-b568fc17>
    <img width="2500" height="1400" data-src="https://images.prismic.io/oci-awards/aYePB90YXLCxVj72_adrien-olichon-_UuN_2ixJvA-unsplash.jpg?auto=format%2Ccompress&amp;rect=784%2C783%2C4918%2C2754&amp;w=1000&amp;h=1400&amp;q=80" data-canvas-id="" style="aspect-ratio: 1.7857142857142858;" class="invisible">
    <!---->
  </div>
  <h1 class="sr-only" data-v-b568fc17>Outsource
  Consultants, Inc.</h1>
  <div class="hero relative my-grid h-full place-content-end font-pp-neue text-white pb-62 lg:grid-cols-4 lg:pb-0" data-v-b568fc17>
    <div class="hidden relative overflow-hidden lg:block grid-area-[line1]" aria-hidden="true" data-v-b568fc17>
      <div class="bg-white h-60% w-1px absolute left-0 | js-home-intro-line" style="height:100%;top:0;">
      </div>
    </div>
    <div class="hidden relative overflow-hidden lg:block grid-area-[line2]" aria-hidden="true" data-v-b568fc17>
      <div class="bg-white h-60% w-1px absolute left-0 | js-home-intro-line" style="height:calc(100% - 50px);top:0;">
      </div>
    </div>
    <div class="hidden relative overflow-hidden lg:block grid-area-[line3]" aria-hidden="true" data-v-b568fc17>
      <div class="bg-white h-60% w-1px absolute left-0 | js-home-intro-line" style="height:calc(100% - 60px);bottom:0;">
      </div>
    </div>
    <div class="hidden relative overflow-hidden lg:block h-45! grid-area-[line4]" aria-hidden="true" data-v-b568fc17>
      <div class="bg-white h-60% w-1px absolute left-0 | js-home-intro-line" style="height:100%;top:0;">
      </div>
    </div>
    <div class="hidden relative overflow-hidden lg:block h-45! grid-area-[line5]" aria-hidden="true" data-v-b568fc17>
      <div class="bg-white h-60% w-1px absolute left-0 | js-home-intro-line" style="height:100%;top:0;">
      </div>
    </div>
    <!--[-->
    <span class="title grid-col-span-full grid-row-start-2 md:fs-120 md:grid-col-end--3 lg:hidden" data-v-b568fc17>Outsource
    Consultants, Inc.</span>
    <span class="title hidden grid-area-[title1] mt-[-0.05em] lg:block" aria-hidden="true" data-v-b568fc17>Outsource</span>
    <span class="title hidden grid-area-[title2] mb-10! lg:block" aria-hidden="true" data-v-b568fc17>Consultants, Inc.</span>
    <!--]-->
    <div class="grid-col-start-3 grid-col-end--1 mb-100 text-400 fs-24 lh-1 tracking-normal md:grid-col-start--4 lg:ml--8 lg:mb-0 lg:grid-area-[tagline]" data-v-b568fc17>
      <!--[-->
      <!--[-->
      <p>
      <!--[-->
      <!--[-->
      <!--[-->
      <!--[-->
      <!---->Answering all of<!--]-->
      <!--[-->
      <br>your building codes<!--]-->
      <!--[-->
      <br>needs.<!--]-->
      <!--]-->
      <!--]-->
      <!--]-->
    </p>
    <!--]-->
    <!--]-->
  </div>
</div>
<!--]-->
</section>
```
