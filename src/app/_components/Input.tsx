import React, { type DetailedHTMLProps, type InputHTMLAttributes } from "react";

type InputProps = {
  label?: string;
  labelPosition?: "top" | "left";
  inputClassName?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export const Input = ({
  label,
  labelPosition = "top",
  className,
  inputClassName,
  ...rest
}: InputProps) => {
  // let defaultFlexDirection = 'max-sm:'
  return (
    <div
      className={`flex gap-1 ${labelPosition === "top" ? "flex-col" : "flex-row"} ${className ?? ""}`}
    >
      {label && <label>{label}</label>}
      <input
        className={`rounded-sm bg-slate-800 p-2 ${inputClassName ?? ""}`}
        {...rest}
      />
    </div>
  );
};
