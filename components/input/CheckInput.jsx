"use client";
import React, { useId, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
const CheckInput = ({
  label,
  id,
  name,
  type = "text",
  className,
  boxClassName,
  placeholder,
  value = false,
  setValue = () => {},
  ...etc
}) => {
if(!id){
  id = useId()
}
  return (
    <PrimeReactProvider>
      <div className={`${className}`}>
        <div className="flex gap-3 items-center">
          <Checkbox
            checked={value}
            onChange={(e) => setValue(e.checked)}
            placeholder={placeholder}
            id={id}
            name={name}
            spellCheck="false"
            className={`outline outline-[2px]  outline-secondary size-4 rounded-full ${boxClassName} `}
            {...etc}
          />
          <label onClick={() => setValue(!value)} htmlFor={id} className="block text-black text-sm">
            {label}
          </label>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default CheckInput;
