import React from "react";

const paths = {
  random: (
    <>
      <path d="M16 3h5v5" />
      <path d="M4 20l17-17" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </>
  ),
  language: (
    <>
      <path d="M5 8h9" />
      <path d="M9 4v4c0 5-3 8-5 9" />
      <path d="M7 13c2 2 4 3 7 4" />
      <path d="M14 20l4-9 4 9" />
      <path d="M16 16h4" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </>
  ),
  bars: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  lemon: (
    <path d="M17.7 6.3c3.4 3.4 3.2 8.8-.5 12.5s-9.1 3.9-12.5.5-3.2-8.8.5-12.5 9.1-3.9 12.5-.5z" />
  ),
  user: (
    <>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  bug: (
    <>
      <path d="M8 2l1.8 2.7" />
      <path d="M16 2l-1.8 2.7" />
      <rect x="7" y="6" width="10" height="14" rx="5" />
      <path d="M4 13h3" />
      <path d="M17 13h3" />
      <path d="M5 19l3-2" />
      <path d="M19 19l-3-2" />
      <path d="M9 10h6" />
    </>
  ),
  "telegram plane": <path d="M21.5 3.5L18 20.3c-.3 1.2-1 1.5-2 .9l-5.5-4-2.7 2.6c-.3.3-.6.6-1.2.6l.4-5.8L17.6 5c.5-.4-.1-.7-.7-.3L4 12.8l-5.5-1.7c-1.2-.4-1.2-1.2.3-1.8L20.2 1c1-.4 1.8.2 1.3 2.5z" />,
  "question circle outline": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 1 1 5.6 1.5c-.8 1.2-2.2 1.5-2.5 3" />
      <path d="M12 17h.01" />
    </>
  ),
  "share alternate": (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5l6.8-4" />
      <path d="M8.6 13.5l6.8 4" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  ),
  reply: (
    <>
      <path d="M9 17l-5-5 5-5" />
      <path d="M4 12h11a5 5 0 0 1 5 5v1" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  "user secret": (
    <>
      <path d="M4 9h16" />
      <path d="M7 9l1.5-5h7L17 9" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
      <path d="M9 19c2 1 4 1 6 0" />
      <path d="M6 21a6 6 0 0 1 12 0" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
  close: (
    <>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
};

function Icon({ name, size, color, outline = false, className = "", style }) {
  const classes = [
    "jb-icon",
    size ? `jb-icon--${size}` : "",
    color ? `jb-icon--${color}` : "",
    outline ? "jb-icon--outline" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={classes}
      style={style}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.bars}
    </svg>
  );
}

export default Icon;
