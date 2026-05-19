import React from "react";

function Form({ children, className = "", ...props }) {
  return (
    <form className={`jb-form ${className}`.trim()} {...props}>
      {children}
    </form>
  );
}

Form.Input = function FormInput({
  label,
  name,
  value,
  onChange,
  fluid = false,
  className = "",
  ...props
}) {
  const classes = ["jb-form-field", fluid ? "jb-form-field--fluid" : "", className]
    .filter(Boolean)
    .join(" ");

  const handleChange = (event) => {
    onChange?.(event, { name, value: event.target.value });
  };

  return (
    <label className={classes}>
      {label && <span>{label}</span>}
      <input name={name} value={value} onChange={handleChange} {...props} />
    </label>
  );
};

export default Form;
