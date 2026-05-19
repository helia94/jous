import React from "react";

function Button({
  children,
  color,
  basic = false,
  fluid = false,
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    "jb-btn",
    color ? `jb-btn--${color}` : "",
    basic ? "jb-btn--basic" : "",
    fluid ? "jb-btn--fluid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
