import React, { type DetailedHTMLProps, type InputHTMLAttributes } from "react";

type SelectProps = {
  label?: string;
  labelPosition?: "top" | "left";
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;
export const Select = ({
  label,
  labelPosition = "top",
  children,
  className,
  ...rest
}: SelectProps) => {
  return (
    <div
      className={`flex gap-1 ${labelPosition === "left" ? "flex-row" : "flex-col"} w-full`}
    >
      <label>{label}</label>
      <select
        className={`rounded-sm bg-slate-800 p-2 leading-normal ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
};
