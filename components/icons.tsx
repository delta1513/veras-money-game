/**
 * Every icon is inline SVG rather than an emoji. The whole interface carries its
 * meaning through these shapes, and emoji glyphs change shape — or fail to a
 * blank box — depending on the device, browser and OS version. Drawing them
 * ourselves means the player sees the same picture everywhere, every time.
 */

type IconProps = { className?: string };

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M3.5 11 12 3.5 20.5 11"
        fill="none"
        stroke="#2b2118"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.8 11.5V20h12.4v-8.5"
        fill="#ffc83d"
        stroke="#2b2118"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 20v-5h4v5" fill="#ffffff" stroke="#2b2118" strokeWidth="2" />
    </svg>
  );
}

/** Circling arrow: "go around again". */
export function RestartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.6-5.9"
        fill="none"
        stroke="#2b2118"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M19.8 2.6v5.2h-5.2Z"
        fill="#2b2118"
        stroke="#2b2118"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="#ffffff" />
      <path
        d="m6.5 12.5 3.8 4 7.2-8.4"
        fill="none"
        stroke="#35b14a"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SadFaceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="#ffd45e"
        stroke="#c98a12"
        strokeWidth="1.2"
      />
      <circle cx="8.6" cy="9.8" r="1.4" fill="#2b2118" />
      <circle cx="15.4" cy="9.8" r="1.4" fill="#2b2118" />
      <path
        d="M7.8 17.2a5.2 5.2 0 0 1 8.4 0"
        fill="none"
        stroke="#2b2118"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* A tear, so the feeling reads even at a glance. */}
      <path d="M8.6 12.4c1.5 2 1.5 3.6 0 3.6s-1.5-1.6 0-3.6Z" fill="#4aa3df" />
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M7 3h10v5.5a5 5 0 0 1-10 0Z"
        fill="#ffd45e"
        stroke="#9c6b08"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 4.5H4.2v1.8A3.4 3.4 0 0 0 7.4 9.7M17 4.5h2.8v1.8a3.4 3.4 0 0 1-3.2 3.4"
        fill="none"
        stroke="#9c6b08"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 13.5V17m-3.5 4h7l-1-4h-5Z"
        fill="#ffd45e"
        stroke="#9c6b08"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A big tick: "pay" / "hand it over". White on the green button. */
export function PayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="m4.5 12.8 4.6 4.7L19.5 6.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HappyFaceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="#ffd45e"
        stroke="#c98a12"
        strokeWidth="1.2"
      />
      <path
        d="M7.2 9.6a1.6 1.6 0 0 1 3 0M13.8 9.6a1.6 1.6 0 0 1 3 0"
        fill="none"
        stroke="#2b2118"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M6.8 13.2h10.4a5.2 5.2 0 0 1-10.4 0Z" fill="#2b2118" />
      <path d="M9 16.4a4 2 0 0 1 6 0 5.2 5.2 0 0 1-6 0Z" fill="#e0585b" />
      <circle cx="6" cy="13" r="1.4" fill="#f59a8b" fillOpacity="0.7" />
      <circle cx="18" cy="13" r="1.4" fill="#f59a8b" fillOpacity="0.7" />
    </svg>
  );
}

export function StarIcon({
  className,
  full = true,
  white = false,
}: IconProps & { full?: boolean; white?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z"
        fill={white ? "#ffffff" : full ? "#ffc83d" : "#ffffff"}
        stroke={white ? "#2b2118" : full ? "#c98a12" : "#c9c2b8"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bin: "empty the tray". */
export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M9 4.5h6M4 7h16"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M6 7h12l-1 13H7Z"
        fill="#ffffff"
        fillOpacity="0.25"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.5v6.5M14 10.5v6.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Shopping trolley: free play. */
export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M2.5 4h2.6l2.4 11h10.3l2.2-8H6.2"
        fill="none"
        stroke="#2b2118"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.6 8h12.6l-1.6 5.8H7.9Z" fill="#ffffff" />
      <circle cx="9" cy="19.2" r="1.8" fill="#2b2118" />
      <circle cx="16.6" cy="19.2" r="1.8" fill="#2b2118" />
    </svg>
  );
}

/** The bill to be paid. Shown next to the target amount. */
export function ReceiptIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5 2.5h14v19l-2.3-1.6-2.4 1.6-2.3-1.6-2.3 1.6-2.4-1.6L5 21.5Z"
        fill="#ffffff"
        stroke="#2b2118"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 7h8M8 10.5h8M8 14h5"
        stroke="#9aa3ad"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="14.6" r="1.6" fill="#35b14a" />
    </svg>
  );
}
