"use client";
import React, { useState } from "react";

const NavbarLanguageSelectInput = ({
  name,
  placeholder,
  options,
  value = null,
  setValue = () => {},
  className,
}) => {
  return (
    <div className={`w-min font-semibold ${className}`}>
      <div className="block">
        <label htmlFor="select">{placeholder}</label>
      </div>
      <select
        id="select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-placeholder={placeholder}
        className="!border-0 !outline-none focus:!ring-0 focus:!outline-0 hover:border-0 font-sans"
      >
        {options?.map((item, i) => (
          <option key={i} value={item?.value}>
            {item?.name === "English" ? "English(Change)" : item?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NavbarLanguageSelectInput;
