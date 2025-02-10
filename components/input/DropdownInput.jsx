"use client";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
const DropdownInput = ({
  name,
  placeholder,
  label,
  options = [],
  value = null,
  setValue = () => {},
  className,
}) => {
  return (
    <div>
      <style>
        {
          `
          .p-inputtext{
          padding: 9px
          }
          `
        }
      </style>
      <label className="block text-black text-[15px]">{label}</label>
      <div className="mt-0.5">
        <Dropdown
          value={value}
          onChange={(e) => setValue(e.value)}
          options={options}
          name={name}
          placeholder={placeholder}
          className={`w-full border shadow-none ${className}`}
          optionLabel="name"
          optionValue="value"
        />
      </div>
    </div>
  );
};

export default DropdownInput;
