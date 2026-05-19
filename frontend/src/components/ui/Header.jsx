import React from "react";

function Header({ as: Component = "div", children, className = "", ...props }) {
  return (
    <Component className={`jb-header ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Header;
