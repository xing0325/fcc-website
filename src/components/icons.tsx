import type { ImgHTMLAttributes, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** FCC brand mark (white on transparent) — used in the pill, loader & footer */
export function LogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/fcc-logo.png"
      alt=""
      {...props}
      style={{ objectFit: "contain", ...props.style }}
    />
  );
}

/** Small inline arrow (→) used in [ LEARN MORE → ] style links */
export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 15 10" {...props}>
      <path d="m10.23 1.325 3.77 4m0 0-3.77 4m3.77-4H0" stroke="currentColor" />
    </svg>
  );
}

/** Longer arrow used by carousel controls */
export function ArrowControlsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 9" {...props}>
      <path
        d="M19.223 4.188a.5.5 0 0 1 0 .707l-3.182 3.182a.5.5 0 1 1-.707-.707l2.829-2.829-2.829-2.828a.5.5 0 1 1 .707-.707l3.182 3.182ZM-.01 4.542v-.5h18.88v1H-.01v-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Diagonal ↗ arrow (project card hover) */
export function TopRightArrowIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 38 38" {...props}>
      <path fill="currentColor" d="M6.596 31.887 32.044 6.439l-.707-.707L5.889 31.18z" />
      <path fill="currentColor" d="M32.193 16.67V5.587h-1V16.67z" />
      <path fill="currentColor" d="M21.106 5.583h11.081v1H21.106z" />
    </svg>
  );
}

/** Plus (accordion closed state; rotates 45deg to become an X when open) */
export function PlusIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 18 19" {...props}>
      <path d="M8.13.882h1.75V18.87H8.13V.882Z" fill="currentColor" />
      <path d="M18 9v1.75H.012V9H18Z" fill="currentColor" />
    </svg>
  );
}

/** X close icon */
export function CloseIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 33 32" {...props}>
      <path d="m32.16.687-30 30M.923.687l30 30" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

/** Pen icon (header square button) */
export function PenIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 20 27" {...props}>
      <path d="m14.02 7.314 2.598 1.5-4.516 7.822" stroke="currentColor" strokeWidth="1.5" />
      <rect
        x="11.117"
        y="3.611"
        width="4.8"
        height="16.675"
        rx="1"
        transform="rotate(30 11.117 3.61)"
        fill="currentColor"
      />
      <path
        fill="currentColor"
        d="m11.813 2.407 4.157 2.4 1.389-2.406L13.202 0zM1.303 20.609l.776 3.456L5.46 23.01l.782-1.354-4.158-2.4-.781 1.354Z"
      />
    </svg>
  );
}

/** Chat bubble icon */
export function ChatIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 14 18" {...props}>
      <path
        d="M.338 4.838c0-.207.168-.375.375-.375h12.574c.207 0 .375.168.375.375v9.634a.375.375 0 0 1-.375.375H.713a.375.375 0 0 1-.375-.375V4.838Z"
        fill="currentColor"
      />
      <path
        d="M7.824 14.095a.375.375 0 0 1 .294-.607h2.911c.207 0 .375.168.375.375v3.684a.375.375 0 0 1-.669.233l-2.911-3.685ZM.338.077h13.324v.958H.338V.077Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Large footer logo: crosshair + double ring, masked so the shapes never overlap.
 * Original renders at size-71.6vw (mobile) / size-29vw (lg).
 */
export function FooterLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 421 420" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <rect id="fl-plusV" x="205" width="11" height="420" />
        <rect id="fl-plusH" x="420.5" y="204.5" width="11" height="420" transform="rotate(90 420.5 204.5)" />
        <path
          id="fl-circle"
          d="M210.756 34.2979C309.804 34.2979 390.098 114.592 390.098 213.64C390.098 312.688 309.804 392.981 210.756 392.981C111.708 392.981 31.4141 312.687 31.4141 213.64C31.4141 114.592 111.708 34.2979 210.756 34.2979ZM210.75 78.9922C136.385 78.9924 76.1008 139.277 76.1006 213.642C76.1006 288.007 136.385 348.292 210.75 348.292C285.115 348.292 345.4 288.007 345.4 213.642C345.4 139.277 285.115 78.9922 210.75 78.9922Z"
        />
        <mask id="fl-maskForPlusV" maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="white" />
          <use href="#fl-circle" fill="black" />
        </mask>
        <mask id="fl-maskForPlusH" maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="white" />
          <use href="#fl-circle" fill="black" />
        </mask>
        <mask id="fl-maskForCircle" maskUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="white" />
          <use href="#fl-plusV" fill="black" />
          <use href="#fl-plusH" fill="black" />
        </mask>
      </defs>
      <use href="#fl-plusV" fill="#E8E6E0" mask="url(#fl-maskForPlusV)" />
      <use href="#fl-plusH" fill="#E8E6E0" mask="url(#fl-maskForPlusH)" />
      <use href="#fl-circle" fill="#E8E6E0" mask="url(#fl-maskForCircle)" />
    </svg>
  );
}
