import React, { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { format } from "date-fns";

const DateTimePickerComponent = ({
  label,
  id,
  name,
  className,
  placeholder,
  value,
  onChange,
  ...etc
}) => {
  const handleDateChange = (newValue) => {
    // Format the date into the desired format
    const formattedDate = format(newValue, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    onChange(formattedDate);
  };

  if (!id) {
    id = `datetime-picker-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convert the string value to a Date object
  const defaultValue = value ? new Date(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={className}>
        <label htmlFor={id} className="block text-black text-[15px]">
          {label}
        </label>
        <div className="mt-0.5">
          <DateTimePicker
            id={id}
            className="w-full border-primary"
            value={defaultValue}
            onChange={handleDateChange}
            {...etc}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
