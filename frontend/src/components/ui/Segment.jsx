import React from "react";

function Segment({ children, padded, className = "", ...props }) {
  const classes = [
    "jb-segment",
    padded ? "jb-segment--padded" : "",
    padded === "very" ? "jb-segment--padded-very" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Segment;
