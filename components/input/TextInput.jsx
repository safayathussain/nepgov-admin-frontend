import React, { useId } from "react";

const TextInput = ({
  label,
  id  ,
  name,
  type = "text",
  className,
  placeholder,
  ...etc
}) => {
    if(!id){
        id = useId()
      }
  return (
    <div>
      <div>
        <label htmlFor={id} className="block text-black text-[15px]">
          {label}
        </label>
        <div className="mt-0.5">
          <input
            placeholder={placeholder}
            id={id}
            type={type}
            name={name}
            spellCheck="false"
            className={`block w-full bg-white placeholder:text-sm md:placeholder:text-base rounded-md p-2 px-3 border-[1.5px] border-gray-200 focus:border-gray-300 focus:outline-none focus:border-[1.5px] focus:ring-0 ${className}`}
            {...etc}
          />
        </div>
      </div>
    </div>
  );
};

export default TextInput;
