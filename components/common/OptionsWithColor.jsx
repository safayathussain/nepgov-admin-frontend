import React from "react";

const OptionsWithColor = ({ options }) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {options.map((item) => (
        <div key={item?._id} className="flex items-center gap-2">
          <div
            className={`size-4 bg-[${item.color}]`}
            style={{ backgroundColor: item?.color }}
          ></div>
          <p className="text-sm font-medium">{item.content}</p>
        </div>
      ))}
    </div>
  );
};

export default OptionsWithColor;
