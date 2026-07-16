# IntroBlue Specification

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
`src/components/sections/IntroBlue.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-1-intro-blue.png

## Interaction model
static + scroll reveal

## Layout

`<section class="px-15 relative my-grid min-h-screen content-start bg-blue text-mercury pt-60 pb-76 lg:pt-80 lg:pb-112">` (+ ipadpro min-h-auto — skip).
- Big paragraph: `page-text` (30px at lg) text-mercury, PP 400, lg col-span-9-ish (check embedded HTML classes), lh ~1.16. Reveal: fade-up on scroll (useReveal + reveal-fade). Text (verbatim, incl. the "50 in-house consultants…" sentence) is in the HTML.
- Two mono columns lower right (lg col 7-9 and 10-12, mt-~150): `my-text text-mercury!` uppercase 12px, ~5 lines each. reveal-fade staggered.
- **Stairs decoration** (js-stairs): rows of stepped mercury blocks at the section bottom — each `.stair` element: `grid-column-end:-1; width:var(--stair-width-mobile)` and at lg `grid-column-end:var(--grid-column-end); width:var(--stair-width)`; the HTML carries inline `style="--stair-width:…;--grid-column-end:…"` per stair. Add the `.stair` rules locally in the component (a `<style>` tag is acceptable) or convert each stair to arbitrary classes. They render as thin mercury horizontal bars stacked like a staircase (aria-hidden). If heights aren't in the HTML, each stair row is h-1px bg-mercury with mt spacing per HTML classes.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<section class="px-15 relative my-grid min-h-100vh content-start bg-blue text-mercury pt-60 pb-76 lg:pt-80 lg:pb-112 ipadpro:min-h-auto" data-slice-type="home_intro" data-slice-variation="default">
  <!--[-->
  <div class="absolute bottom--1 px-15 my-grid left-0 w-full pointer-events-none" data-v-66eea311>
    <!--[-->
    <div class="stair | h-130 lg:h-140 bg-mercury col-start-1 pointer-events-auto -ml-15 | js-stairs" style="--grid-column-end:7;--stair-width-mobile:calc(0.3333333333333333 * 100% + 1.875rem);--stair-width:calc(0.3333333333333333 * 100% + 0.9375rem );" data-v-66eea311>
    </div>
    <div class="stair | h-130 lg:h-140 bg-mercury col-start-1 pointer-events-auto -ml-15 | js-stairs" style="--grid-column-end:7;--stair-width-mobile:calc(0.6666666666666666 * 100% + 1.875rem);--stair-width:calc(0.6666666666666666 * 100% + 0.9375rem );" data-v-66eea311>
    </div>
    <div class="stair | h-130 lg:h-140 bg-mercury col-start-1 pointer-events-auto -ml-15 | js-stairs" style="--grid-column-end:7;--stair-width-mobile:calc(1 * 100% + 1.875rem);--stair-width:calc(1 * 100% + 0.9375rem );" data-v-66eea311>
    </div>
    <!--]-->
  </div>
  <div class="grid-col-span-full tracking-0 lh-1 font-pp-neue font-400 fs-26 w-99% lg:grid-col-start-1 lg:grid-col-end--3 lg:fs-46 lg:w-full">
    <!--[-->
    <!--[-->
    <p>
    <!--[-->
    <!--[-->
    <!--[-->
    <!--[-->
    <!---->Our team of over 50 in-house consultants in New York City helps clients navigate even the toughest building code and zoning challenges. With 33 years of experience across construction regulations, our team supports feasibility reviews, CCD1s, amendments, fire safety, land use matters, landmark coordination, violation resolution, and all the permits, approvals, and sign-offs your project needs.<!--]-->
    <!--]-->
    <!--]-->
    <!--]-->
  </p>
  <!--]-->
  <!--]-->
</div>
<div class="grid-col-start-3 grid-col-end--1 mt-68 lg:grid-col-start-7 lg:grid-col-span-5 lg:mt-80">
  <ul class="flex flex-col space-y-50 lg:grid lg:gap-x-65.6 lg:grid-cols-[auto_auto]">
    <!--[-->
    <li class="font-400 font-gta-mono uppercase lh-1.2 tracking-0 fs-14 lg:fs-12 lg:w-280 lg:lh-1.33">
      <!--[-->
      <!--[-->
      <p>
      <!--[-->
      <!--[-->
      <!--[-->
      <!--[-->
      <!---->From the first idea to sign-off, Outsource is by your side—helping you navigate code, construction, compliance, and whatever else your project needs.<!--]-->
      <!--]-->
      <!--]-->
      <!--]-->
    </p>
    <!--]-->
    <!--]-->
  </li>
  <li class="font-400 font-gta-mono uppercase lh-1.2 tracking-0 fs-14 lg:fs-12 lg:w-280 lg:lh-1.33">
    <!--[-->
    <!--[-->
    <p>
    <!--[-->
    <!--[-->
    <!--[-->
    <!--[-->
    <!---->Partnering with Outsource Special Inspections, Inc., we deliver a streamlined, start-to-finish approach—from permits and approvals to inspections and sign-offs.<!--]-->
    <!--]-->
    <!--]-->
    <!--]-->
  </p>
  <!--]-->
  <!--]-->
</li>
<!--]-->
</ul>
</div>
<!--]-->
</section>
```
