"use client";
import React from "react";

const Button = ({
  children,
  variant = "primary",
  className,
  size = "md",
  onClick = () => {},
  disabled,
  ...etc
}) => {
  let variantClassName = "";
  let sizeClassName = "";
  switch (variant) {
    case "primary":
      variantClassName =
        "bg-primary text-white border-primary border-[1.5px] hover:bg-transparent hover:text-primary";
      break;
    case "secondary":
      variantClassName =
        " border-secondary border-[1.5px] bg-secondary text-white hover:bg-transparent hover:text-secondary";
      break;
    case "primary-outline":
      variantClassName =
        "border-[1.5px] border-primary text-primary  hover:bg-primary hover:text-white";
      break;
    case "secondary-outline":
      variantClassName =
        "border-[1.5px] border-secondary text-secondary  hover:bg-secondary hover:text-white";
      break;
  }
  switch (size) {
    case "sm":
      sizeClassName = " px-2 py-1 text-sm rounded-md";
      break;
    case "md":
      sizeClassName = "px-5 py-1.5 rounded-md font-semibold";
      break;
    case "lg":
      sizeClassName = "px-6 py-2 rounded-md font-semibold";
      break;
  }

  return (
    <button
      className={`font-medium duration-300 ${variantClassName} ${sizeClassName} ${className} ${
        disabled && "opacity-60"
      } whitespace-nowrap`}
      onClick={onClick}
      {...etc}
    >
      {children}
    </button>
  );
};

export default Button;
