import { useState } from "react";
import CircularProgressBar from "./CircularProgressBar";

const L1 = ({
  points = 39,
  cardColor = "#016e49",
  textColor = "#fff",
  stamp = "coffee",
  customStamp = null,
}) => {
  const progress = (points / 100) * 100;
  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };
  return (
    <div
      style={{
        backgroundColor: cardColor,
        boxShadow: `2px 10px 50px ${hexToRgba(cardColor)}`,
      }}
      className="w-60 rounded-3xs1 h-[340px] flex flex-col items-center justify-center py-1 px-2.5 box-border gap-1.5 text-left text-base1 text-white md1:flex-col sm1:flex-wrap"
    >
      {" "}
      {/* Applied new borderRadius "rounded-3xs1", fontSize "text-base1", and screen breakpoints md1, sm1 */}
      <CircularProgressBar
        progress={progress}
        stamp={stamp}
        color={textColor}
        customStamp={customStamp}
      />
      <div className="w-[200px] flex flex-col items-center justify-start lg1:w-full">
        {" "}
        {/* Applied lg1 breakpoint */}
        <div
          className="self-stretch flex flex-col items-center justify-center"
          style={{ color: textColor }}
        >
          <div className="relative">Points</div>

          {/* Applied new font size "text-11xl1" */}
          <div className="flex items-center space-x-2 px-3 py-1">
            <div className="flex items-center justify-center">
              <b className="text-2xl text-gray-200">{points}</b>
              <img
                className="w-6 h-6 mb-1"
                alt="star icon"
                src="/interface--star.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default L1;
