import React from "react";

function Container({ children, textAlign, className = "", ...props }) {
  const classes = ["jb-container", textAlign ? `jb-text-${textAlign}` : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Container;
