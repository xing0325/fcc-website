# SiteHeader (fixed header + full menu overlay) Specification

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
`src/components/sections/SiteHeader.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/state-header-top.png (scrollY=0: logo pill + two link columns, NO menu button visible)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/state-header-scrolled.png (scrolled: link columns gone, white MENU pill next to blue pen square)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/state-menu-open.png (menu overlay open)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-0-hero.png (header over hero)

## Interaction model
scroll-driven header collapse + click-driven menu overlay

## Layout & states

**Bar (always fixed):** `fixed left-0 top-15 w-full px-15 z-[1000] pointer-events-none max-h-screen` — children re-enable `pointer-events-auto`.
Inner nav is a grid `grid-cols-[60vw_1fr] gap-x-3.5 lg:grid-cols-12 lg:gap-x-15` (mercury text).

1. **Logo pill** (lg: col-span-6 justify-self-start): `bg-blue` border `b-1px b-mercury`-ish (border color mercury), height 50px, flex items-center, contains LogoIcon (25px, text-mercury, inside px-12) + "Outsource Consultants Inc." in `my-text text-mercury!` uppercase mono 12px, padding right ~30px. Links to "/".
2. **Nav link columns** (visible ONLY near scrollY=0; lg only): two `<section>` groups occupying lg cols 7-9 and 10-12: column 1: ABOUT / SERVICES / PROJECTS / CLIENTS; column 2: CULTURE & CAREERS / BLOG / CONTACT. Links: `my-text text-mercury!` (12px mono uppercase, white/mercury), stacked with `gap-y-1px`, hover: opacity ~0.6 (transition-colors duration-500). Each link in a `line-mask`; on scroll > ~30px the whole columns fade/slide out (links translateY(110%) staggered 30ms + column opacity 0, 0.4s ease); reverse when back at ≤30px. Track scrollY with a `useEffect` scroll listener (threshold 30).
3. **MENU pill**: absolute right side (sits right of the nav grid, aligned to top), `bg-white text-blue` mono uppercase fs-12, w-78 h-46, flex-center. At scrollY≤30 it is hidden BEHIND the pen square (translate-x so its left edge aligns with the pen: translateX(81px) + opacity 0); at scrollY>30 slides to its resting spot (translateX(0), left of pen, gap ~2px), transition transform 0.5s + opacity. Click → opens overlay.
4. **Pen square**: `bg-blue` 46×46 (w-46 h-46) flex-center, PenIcon `h-25 w-17 text-white transition-colors duration-500`, absolute top-right (right-15). It's an `<a href="/contact">`. Hover: icon text-mercury.

**Menu overlay (open state):** fixed inset-0 z-[999] (below the bar so pill/CLOSE stay visible… easier: include the top band INSIDE the overlay). Structure per screenshot:
- Backdrop: full-screen `bg-blue/40` fading in (the page shows through, dimmed blue). Click backdrop closes.
- Top band: the same two nav-link columns (white text on the blue backdrop band above the panel) — reuse the bar's link columns; when the overlay is open they must be visible regardless of scroll position (white, cols 7-9/10-12).
- Right panel: `absolute right-0 top-0 h-full w-1/2` (min ~727px→50vw) `bg-white`, slides in from right (translate-x-full → 0, 0.6s cubic-bezier(0.22,1,0.36,1)); content `px-24 pt-80` grid:
  - Big links: About / Services / Projects / Clients — PP 500 `fs-52 leading-[1.05]` text-blue, block, staggered reveal-line on open; hover: opacity 0.6.
  - Divider `border-t-1px b-blue` then row: `COMPANY` label (my-text) left col, right col links: Culture & Careers / Blog / Contact (PP 400 fs-16 text-blue, lh 1.4).
  - Divider row: `STAY IN TOUCH` label left; right: phone `1-212-732-0555` and email `contact@outsourceconsultants.com` (each underlined, block, fs-16), then address two lines: `237 West 35th Street, Suite 12A` / `New York, New York 10001`.
  - Bottom: newsletter form: `border b-1px b-blue rounded-[3px] h-60 flex items-center justify-between px-20` — placeholder text "Email address" (PP 400 fs-16 text-blue/70) + ArrowIcon (w-20 text-blue). Input functional-looking but no submit logic (preventDefault).
- CLOSE button replaces MENU pill (same geometry, `bg-mercury text-blue`, label CLOSE). The pen square stays.
- While open: lock scroll (`document.documentElement.style.overflow='hidden'`; restore on close).
- ESC closes.

Use React state for `open`, scroll listener for `collapsed`. All text/hrefs are in the embedded HTML below (header.html includes both nav sections and the overlay markup with all links).

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<header class="fixed left-0 top-15 w-full px-15 z-1000 max-h-screen pointer-events-none" data-v-4c085579>
  <nav aria-label="Main" class="text-mercury grid grid-cols-[60vw_1fr] gap-y-1px gap-x-3.5 content-start lg:grid-cols-12 lg:gap-x-15" data-v-4c085579>
    <div class="b-blue b-1px lg:w-auto lg:col-span-6 lg:justify-self-start will-change-transform" data-v-4c085579>
      <a aria-current="page" href="/" class="router-link-active router-link-exact-active relative w-full pointer-events-auto flex items-center flex-shrink-0 py-9.45 pl-19 | js-header-home-link" data-v-4c085579>
        <span class="sr-only" data-v-4c085579>Outsource Consultants, Inc. home page</span>
        <span class="size-29 block | js-header-logo-container" data-v-4c085579>
        </span>
        <span class="flex-1 flex justify-center | js-header-text-container" data-v-4c085579>
        </span>
      </a>
    </div>
    <div class="relative pointer-events-auto pt-15 pl-15 col-span-3 hidden lg:block" data-v-4c085579>
      <div class="hidden bg-mercury w-1 absolute top-0 left-0 h-151 -mt-15 | js-line" data-v-4c085579>
      </div>
      <ul role="menu" class="absolute" data-v-4c085579>
        <!--[-->
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/about" class="link | js-primary-links" role="menuitem" data-v-4c085579>
              <!--[-->About<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/services" class="link | js-primary-links" role="menuitem" data-v-4c085579>
              <!--[-->Services<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/projects" class="link | js-primary-links" role="menuitem" data-v-4c085579>
              <!--[-->Projects<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/clients" class="link | js-primary-links" role="menuitem" data-v-4c085579>
              <!--[-->Clients<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <!--]-->
      </ul>
    </div>
    <div class="relative pointer-events-auto col-span-2 pt-15 pl-15 hidden lg:block" data-v-4c085579>
      <div class="hidden bg-mercury w-1 absolute top-0 left-0 h-151 -mt-15 | js-line" data-v-4c085579>
      </div>
      <ul role="menu" class="absolute" data-v-4c085579>
        <!--[-->
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/culture-and-careers" class="link | js-secondary-links" role="menuitem" data-v-4c085579>
              <!--[-->Culture &amp; Careers<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/blog" class="link | js-secondary-links" role="menuitem" data-v-4c085579>
              <!--[-->Blog<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <li class="overflow-hidden" role="none" data-v-4c085579>
          <span data-v-4c085579>
            <!--[-->
            <a href="/contact" class="link | js-secondary-links" role="menuitem" data-v-4c085579>
              <!--[-->Contact<!--]-->
            </a>
            <!--]-->
          </span>
        </li>
        <!--]-->
      </ul>
    </div>
    <div class="pointer-events-auto flex gap-x-3.5 lg:justify-end lg:gap-x-0" data-v-4c085579>
      <div class="relative overflow-hidden flex-1 lg:w-80 lg:h-48 lg:flex-none lg:flex-shrink-0 | js-header-menu" data-v-4c085579>
        <div class="b-1px b-transparent overflow-hidden h-full w-full | js-menu">
          <button class="relative z-1 text-blue font-400 h-full w-full bg-white flex-center uppercase font-gta-mono fs-10" aria-expanded="false" aria-label="open menu">
            <span class="absolute inset-0 bg-mercury -z-1">
            </span>
            <span>Menu</span>
          </button>
        </div>
      </div>
      <a href="/contact" class="relative z-1 block overflow-hidden transition-background-color-500 flex-1 bg-blue b-1px b-blue flex-center lg:w-48 lg:h-48 lg:flex-none lg:flex-shrink-0 | js-contact-link bg-blue" aria-label="Go to contact page" data-v-4c085579>
        <span class="absolute inset-0 -z-1 transition-background-color-500 bg-[#0d1355]">
        </span>
        <svg class="icon h-25 w-17 transition-color-500 text-white" aria-hidden="true" data-v-aed543bb>
          <!---->
          <use xlink:href="/sprites/sprite-ui.svg#pen" data-v-aed543bb>
          </use>
        </svg>
      </a>
    </div>
    <div class="col-span-full overflow-x-hidden hidden pointer-events-auto lg:col-span-6 lg:-col-end-1" data-v-4c085579 data-v-36f30419>
      <div class="w-full pt-50 px-24 pb-26 bg-white" data-lenis-prevent data-v-36f30419>
        <ul class="text-blue flex flex-col items-start" role="menubar" data-v-36f30419>
          <!--[-->
          <li class="overflow-hidden flex flex-col relative pr-20" role="none" data-v-36f30419>
            <span class="block relative | js-menu-primary-links" data-v-36f30419>
              <span class="bg-blue size-6 absolute rounded-50% center-y opacity-50 | js-circle" style="transform:scale(0);" data-v-36f30419>
              </span>
              <a href="/about" class="block text-blue op-100 font-pp-neue font-400 fs-36 lh-1.2 ls-0 lg:fs-46 | js-link" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->About<!--]-->
              </a>
            </span>
          </li>
          <li class="overflow-hidden flex flex-col relative pr-20" role="none" data-v-36f30419>
            <span class="block relative | js-menu-primary-links" data-v-36f30419>
              <span class="bg-blue size-6 absolute rounded-50% center-y opacity-50 | js-circle" style="transform:scale(0);" data-v-36f30419>
              </span>
              <a href="/services" class="block text-blue op-100 font-pp-neue font-400 fs-36 lh-1.2 ls-0 lg:fs-46 | js-link" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->Services<!--]-->
              </a>
            </span>
          </li>
          <li class="overflow-hidden flex flex-col relative pr-20" role="none" data-v-36f30419>
            <span class="block relative | js-menu-primary-links" data-v-36f30419>
              <span class="bg-blue size-6 absolute rounded-50% center-y opacity-50 | js-circle" style="transform:scale(0);" data-v-36f30419>
              </span>
              <a href="/projects" class="block text-blue op-100 font-pp-neue font-400 fs-36 lh-1.2 ls-0 lg:fs-46 | js-link" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->Projects<!--]-->
              </a>
            </span>
          </li>
          <li class="overflow-hidden flex flex-col relative pr-20" role="none" data-v-36f30419>
            <span class="block relative | js-menu-primary-links" data-v-36f30419>
              <span class="bg-blue size-6 absolute rounded-50% center-y opacity-50 | js-circle" style="transform:scale(0);" data-v-36f30419>
              </span>
              <a href="/clients" class="block text-blue op-100 font-pp-neue font-400 fs-36 lh-1.2 ls-0 lg:fs-46 | js-link" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->Clients<!--]-->
              </a>
            </span>
          </li>
          <!--]-->
        </ul>
        <hr class="mt-74 b-blue lg:mt-160 | js-menu-line" data-v-36f30419>
        <section class="mt-30 lg:flex lg:mt-15" data-v-36f30419>
          <div class="lg:w-1/1" data-v-36f30419>
            <h2 class="my-text fs-12 lg:fs-12 | js-company-title" data-v-36f30419> Company </h2>
          </div>
          <ul class="text-blue mt-30 lg:mt-0 lg:w-1/1" role="menubar" data-v-36f30419>
            <!--[-->
            <li class="overflow-hidden flex flex-col" role="none" data-v-36f30419>
              <a href="/culture-and-careers" class="text op-100 lh-1.3! | js-menu-secondary-links" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->Culture &amp; Careers<!--]-->
              </a>
            </li>
            <li class="overflow-hidden flex flex-col" role="none" data-v-36f30419>
              <a href="/blog" class="text op-100 lh-1.3! | js-menu-secondary-links" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->Blog<!--]-->
              </a>
            </li>
            <li class="overflow-hidden flex flex-col" role="none" data-v-36f30419>
              <a href="/contact" class="text op-100 lh-1.3! | js-menu-secondary-links" data-active="false" role="menuitem" tabindex="-1" data-v-36f30419>
                <!--[-->Contact<!--]-->
              </a>
            </li>
            <!--]-->
          </ul>
        </section>
        <hr class="mt-50 b-blue lg:mt-38 | js-menu-line" data-v-36f30419>
        <section class="mt-30 lg:flex lg:mt-15" data-v-36f30419>
          <div class="lg:w-1/2" data-v-36f30419>
            <h2 class="my-text fs-12 mb-30 | js-contact-title" data-v-36f30419> Stay in touch </h2>
          </div>
          <div class="flex flex-col items-start lg:w-1/2" data-v-36f30419>
            <div class="overflow-hidden" data-v-36f30419>
              <a class="text b-b-1px b-blue pb-4 | js-contact" href="tel:+12127320555" tabindex="-1" aria-label="Call us at {{ settings.data.phone_number }}" data-v-36f30419>1-212-732-0555</a>
            </div>
            <div class="overflow-hidden" data-v-36f30419>
              <a class="text b-b-1px b-blue pb-4 mt-10 | js-contact" href="mailto:contact@outsourceconsultants.com" tabindex="-1" aria-label="Email us at {{ settings.data.email }}" data-v-36f30419>contact@outsourceconsultants.com</a>
            </div>
            <div class="overflow-hidden mt-30" data-v-36f30419>
              <address class="text not-italic | js-contact" data-v-36f30419>
                <!--[-->
                <!--[-->
                <p>
                <!--[-->
                <!--[-->
                <!--[-->
                <!--[-->
                <!---->237 West 35th Street, Suite 12A<!--]-->
                <!--[-->
                <br>New York, New York 10001<!--]-->
                <!--]-->
                <!--]-->
                <!--]-->
              </p>
              <!--]-->
              <!--]-->
            </address>
          </div>
        </div>
      </section>
      <hr class="b-blue hidden lg:block lg:mt-54 | js-menu-line" data-v-36f30419>
      <div class="overflow-hidden mt-72 lg:mt-20 | js-menu-newsletter" data-v-36f30419>
        <form method="post" aria-label="Newsletter subscription" data-v-36f30419 data-v-1bf88511>
          <div class="b-blue text-blue b-1px pl-20 flex justify-between items-center" data-v-1bf88511>
            <label for="newsletter-email" class="block w-full h-full flex-1" data-v-1bf88511>
              <input id="newsletter-email" value="" type="email" placeholder="Email address" required aria-describedby="newsletter-error newsletter-success" class="text-blue placeholder-blue  fs-18 lg:fs-14 font-pp-neue ls-0 lh-1 h-full w-full outline-none" data-v-1bf88511>
              <span class="sr-only" data-v-1bf88511>Email address for newsletter subscription</span>
            </label>
            <button type="submit" aria-label="Subscribe to newsletter" class="h-55 px-15" data-v-1bf88511>
              <svg class="icon w-20 h-9 -mt-[0.3em] text-blue" aria-hidden="true" data-v-1bf88511 data-v-aed543bb>
                <!---->
                <use xlink:href="/sprites/sprite-ui.svg#arrow-controls" data-v-aed543bb>
                </use>
              </svg>
            </button>
          </div>
          <!---->
        </form>
      </div>
    </div>
  </div>
</nav>
</header>
```
