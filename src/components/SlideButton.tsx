/**
 * Blue pill button with the original's vertical-slide hover: the blue face
 * slides up and out while a white face slides up from below (starting slightly
 * pinched horizontally, expanding to full width).
 */
export default function SlideButton({
  label,
  href = "#",
  fullWidth = false,
  className = "",
}: {
  label: string;
  href?: string;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`relative overflow-hidden text-center uppercase font-gta-mono fs-12 group ${
        fullWidth ? "block w-full" : "inline-block"
      } ${className}`}
    >
      <span className="block px-46 py-25 bg-blue text-mercury transition-transform duration-[0.5s] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block px-46 py-25 bg-white text-blue origin-bottom translate-y-full scale-x-50 transition-transform duration-[0.5s] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0 group-hover:scale-x-100"
      >
        {label}
      </span>
    </a>
  );
}
