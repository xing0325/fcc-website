# Footer Specification

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
`src/components/sections/Footer.tsx`

## Reference screenshots (Read these!)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-7-footer-top.png
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/sec-7-footer-bottom.png (giant crosshair logo; link columns with thin rules; MADE BY BUZZWORTHY)
- /Users/chichu/ai/claude-codee/skills/clone-website/docs/design-references/full-desktop-1440.png (bottom)

## Interaction model
scroll reveal with text-scramble: link texts animate from "_" underscores to final text when footer enters view

## Layout

`<footer class="px-15 my-grid bg-blue pt-50 pb-20 lg:pt-20 lg:pb-26">` ~675px tall, text mercury.
- Left (lg cols 1-6): FooterLogo component `size-[71.6vw] lg:size-[29vw]` (mercury crosshair+rings), roughly vertically centered.
- Right (lg cols 7-12): nav grid `footer-text col-span-full grid grid-cols-subgrid mt-50 gap-y-30 lg:col-span-6 lg:gap-y-0 lg:mt-0` — several groups separated by thin vertical mercury rules (`border-l-1px b-mercury` with low opacity — check HTML classes e.g. b-mercury/30):
  Groups (from HTML; typical): page links (About/Services/Projects/Clients…), company links (Culture & Careers/Blog/Contact), social links, STAY IN TOUCH / contact info, newsletter subscription (label `EMAIL ADDRESS FOR NEWSLETTER SUBSCRIPTION` + input with underline + arrow), legal (privacy/terms), and bottom-right `MADE BY BUZZWORTHY` (external link) + copyright.
- All footer link/label text: mono uppercase mercury `my-text text-mercury!` fs-12.
- **Scramble reveal**: when the footer enters the viewport (useReveal on footer, once), each link's text animates: start as "_" repeated (~1 char), then characters resolve left→right to the real text over ~0.9s with 30-60ms/char, staggered per link 40ms. Implement a small `Scramble` inner component: useEffect + interval; before reveal show "_". (Matches original: pre-reveal the links render as underscores.)
- Newsletter input: transparent bg, `border-b-1px b-mercury`, mercury placeholder, ArrowIcon submit (no real submit — preventDefault).
- Hover on links: opacity .6 transition-colors duration-500.
Follow embedded HTML for exact groups, order, hrefs, rules, and the bottom legal row.

## ORIGINAL HTML (ground truth for structure, classes, and text)

```html
<footer class="px-15 my-grid bg-blue pt-50 pb-20 lg:pt-20 lg:pb-26 js-footer" data-v-36d22ecd>
  <!--[-->
  <div class="col-span-full flex justify-center items-center lg:col-1s6 lg:row-start-1 lg:row-end-2" data-v-36d22ecd>
    <svg viewbox="0 0 421 420" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-71.6vw lg:size-29vw | js-footer-logo" data-v-36d22ecd>
      <defs>
        <rect id="plusV" x="205" width="11" height="420" class="js-plus">
        </rect>
        <rect id="plusH" x="420.5" y="204.5" width="11" height="420" class="js-plus" transform="rotate(90 420.5 204.5)">
        </rect>
        <path id="plus" d="M216 204.5H420.5V215.5H216V420H205V215.5H0.5V204.5H205V0H216V204.5Z">
        </path>
        <path id="circle" class="js-circle" d="M210.756 34.2979C309.804 34.2979 390.098 114.592 390.098 213.64C390.098 312.688 309.804 392.981 210.756 392.981C111.708 392.981 31.4141 312.687 31.4141 213.64C31.4141 114.592 111.708 34.2979 210.756 34.2979ZM210.75 78.9922C136.385 78.9924 76.1008 139.277 76.1006 213.642C76.1006 288.007 136.385 348.292 210.75 348.292C285.115 348.292 345.4 288.007 345.4 213.642C345.4 139.277 285.115 78.9922 210.75 78.9922Z">
        </path>
        <mask id="maskForPlusV" maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="white">
          </rect>
          <use href="#circle" fill="black">
          </use>
        </mask>
        <mask id="maskForPlusH" maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="white">
          </rect>
          <use href="#circle" fill="black">
          </use>
        </mask>
        <mask id="maskForCircle" maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="white">
          </rect>
          <use href="#plusV" fill="black">
          </use>
          <use href="#plusH" fill="black">
          </use>
        </mask>
      </defs>
      <use href="#plusV" fill="#E8E6E0" mask="url(#maskForPlusV)">
      </use>
      <use href="#plusH" fill="#E8E6E0" mask="url(#maskForPlusH)">
      </use>
      <use href="#circle" fill="#E8E6E0" mask="url(#maskForCircle)">
      </use>
    </svg>
  </div>
  <hr class="b-mercury col-span-full mt-50 lg:hidden" data-v-36d22ecd>
  <nav aria-label="Footer Navigation" class="footer-text | col-span-full grid grid-cols-subgrid mt-50 gap-y-30 lg:col-span-6 lg:gap-y-0 lg:mt-0 lg:content-start" data-v-36d22ecd>
    <ul role="menu" class="footer-list | col-span-full flex flex-col items-start lg:col-span-3 lg:b-l-1px lg:b-mercury lg:pl-12 lg:pt-15 lg:h-285" data-v-36d22ecd>
      <!--[-->
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/about" class="" role="menuitem">
            <!--[-->About<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/services" class="" role="menuitem">
            <!--[-->Services<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/projects" class="" role="menuitem">
            <!--[-->Projects<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/clients" class="" role="menuitem">
            <!--[-->Clients<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <!--]-->
      <!---->
    </ul>
    <ul role="menu" class="footer-list | col-span-full flex flex-col items-start lg:col-span-3 lg:b-l-1px lg:b-mercury lg:pl-12 lg:pt-15 lg:h-285" data-v-36d22ecd>
      <!--[-->
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/culture-and-careers" class="" role="menuitem">
            <!--[-->Culture &amp; Careers<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/blog" class="" role="menuitem">
            <!--[-->Blog<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/contact" class="" role="menuitem">
            <!--[-->Contact<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <!--]-->
      <!---->
    </ul>
    <ul role="menu" class="footer-list | col-span-full flex flex-col items-start lg:col-span-3 lg:b-l-1px lg:b-mercury lg:pl-12 lg:b-l-none lg:mt-32" data-v-36d22ecd>
      <!--[-->
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/faq" class="" role="menuitem">
            <!--[-->FAQ<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <!--]-->
      <!---->
    </ul>
    <ul class="col-span-full lg:col-span-3 lg:order-1 lg:b-l-1px lg:b-mercury lg:pl-12 lg:h-185 lg:flex lg:flex-col lg:justify-end" data-v-36d22ecd>
      <li data-v-36d22ecd>
        <span data-v-36d22ecd>
          <!--[-->
          <a href="https://www.facebook.com/outsourcenyc" target="_blank" data-v-36d22ecd>Facebook</a>
          <!--]-->
        </span>
      </li>
      <li data-v-36d22ecd>
        <span data-v-36d22ecd>
          <!--[-->
          <a href="https://www.instagram.com/outsource_consultants/" target="_blank" data-v-36d22ecd>Instagram</a>
          <!--]-->
        </span>
      </li>
      <li data-v-36d22ecd>
        <span data-v-36d22ecd>
          <!--[-->
          <a href="https://www.linkedin.com/company/outsource-consultants-inc." target="_blank" data-v-36d22ecd>LinkedIn</a>
          <!--]-->
        </span>
      </li>
      <li data-v-36d22ecd>
        <span data-v-36d22ecd>
          <!--[-->
          <a href="https://x.com/outsourcenyc" target="_blank" data-v-36d22ecd>X</a>
          <!--]-->
        </span>
      </li>
    </ul>
    <ul role="menu" class="footer-list | col-span-full flex flex-col items-start lg:col-span-3 lg:b-l-1px lg:b-mercury lg:pl-12 lg:order-1 lg:h-185 lg:flex lg:flex-col lg:justify-end" data-v-36d22ecd>
      <!--[-->
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/privacy-policy" class="" role="menuitem">
            <!--[-->Privacy Policy<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <li class="overflow-hidden" role="none">
        <span>
          <!--[-->
          <a href="/terms-and-conditions" class="" role="menuitem">
            <!--[-->Terms and Conditions<!--]-->
          </a>
          <!--]-->
        </span>
      </li>
      <!--]-->
      <li role="none">
        <!--[-->
        <span class="hidden lg:mt-20 lg:block" data-v-36d22ecd>
          <!--[-->
          <a href="https://buzzworthystudio.com/" target="_blank" rel="noopener" role="menuitem" data-v-36d22ecd>Made by buzzworthy</a>
          <!--]-->
        </span>
        <!--]-->
      </li>
    </ul>
    <div class="col-span-full lg:col-span-3 lg:order-0 lg:mt-32 lg:mb-34 lg:ml-12" data-v-36d22ecd>
      <div class="w-full flex" data-v-36d22ecd>
        <span data-v-36d22ecd>Stay In Touch</span>
        <span class="mx-22 lg:mx-16" data-v-36d22ecd>|</span>
        <span data-v-36d22ecd>
          <!--[-->
          <a href="tel:+12127320555" data-v-36d22ecd>1-212-732-0555</a>
          <!--]-->
        </span>
      </div>
      <form method="post" aria-label="Newsletter subscription" class="w-full mt-20" data-v-36d22ecd data-v-1bf88511>
        <div class="b-mercury bg-blue text-mercury lg:w-17.36vw b-1px pl-20 flex justify-between items-center" data-v-1bf88511>
          <label for="newsletter-email" class="block w-full h-full flex-1" data-v-1bf88511>
            <input id="newsletter-email" value="" type="email" placeholder="Your email..." required aria-describedby="newsletter-error newsletter-success" class="text-mercury placeholder-mercury  fs-14 lg:fs-12 font-pp-neue ls-0 lh-1 h-full w-full outline-none" data-v-1bf88511>
            <span class="sr-only" data-v-1bf88511>Email address for newsletter subscription</span>
          </label>
          <button type="submit" aria-label="Subscribe to newsletter" class="h-55 px-15" data-v-1bf88511>
            <svg class="icon w-20 h-9 -mt-[0.3em] text-mercury" aria-hidden="true" data-v-1bf88511 data-v-aed543bb>
              <!---->
              <use xlink:href="/sprites/sprite-ui.svg#arrow-controls" data-v-aed543bb>
              </use>
            </svg>
          </button>
        </div>
        <!---->
      </form>
    </div>
  </nav>
  <div class="col-span-full footer-text mt-20 lg:hidden" data-v-36d22ecd>
    <span data-v-36d22ecd>
      <!--[-->
      <a href="https://buzzworthystudio.com/" target="_blank" rel="noopener" data-v-36d22ecd>Made by buzzworthy</a>
      <!--]-->
    </span>
  </div>
  <div class="footer-text | col-span-full mt-26 lg:col-1s6 lg:row-start-1 lg:row-end-2 lg:self-end lg:pl-15" data-v-36d22ecd> © 2026.<br class="lg:hidden" data-v-36d22ecd> Outsource Consultants, Inc. All Rights Reserved. </div>
  <!--]-->
</footer>
```
