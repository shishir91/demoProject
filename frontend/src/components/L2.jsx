import { Coffee, Smile, ThumbsUp } from "lucide-react";
import React from "react";

const L2 = ({
  points = 3,
  totalShapes = 9,
  stampColor = "#22C55E",
  cardColor = "#016e49",
  textColor = "#000",
  stamp = "coffee",
  customStamp = null,
}) => {
  const availableIcons = {
    thumbsUp: <ThumbsUp className="w-5 h-5" />,
    smile: <Smile className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
  };
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
      className={` shadow-[0px_25px_58px_rgba(1,_110,_73,_0.5)] rounded-3xs1 h-[360px] flex flex-col items-center justify-center py-1 px-2.5 box-border text-[10px] text-white md1:flex-col sm1:flex-wrap`}
    >
      <div
        className={`w-60 rounded-3xs1 h-[340px] flex flex-col items-center justify-center px-2.5 gap-1.5 text-[10px] text-white md1:flex-col sm1:flex-wrap`}
      >
        <div className="self-stretch rounded-xl1 h-[301px] overflow-hidden shrink-0 flex flex-row items-center justify-center flex-wrap content-center py-[33px] px-[11px] box-border gap-x-[27px] gap-y-[62px]">
          {Array.from({ length: totalShapes }).map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full flex items-center justify-center`}
              style={{
                border: "1px solid",
                backgroundColor: index < points ? stampColor : "transparent",
                borderColor: textColor,
              }}
            >
              <div className="relative z-10 flex items-center justify-center">
                {customStamp ? (
                  <img
                    src={customStamp}
                    alt="Custom Icon"
                    className={`w-5 h-5 ${
                      index < points
                        ? "text-green-100"
                        : "text-gray-100 opacity-50"
                    }`}
                  />
                ) : (
                  <div
                    style={{ color: textColor }}
                    className={`${index >= points && "opacity-50"}`}
                  >
                    {availableIcons[stamp]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ color: textColor }}
        className="relative tracking-[0.01em] font-medium text-sm1 mb-2"
      >
        Points: {points}
      </div>
    </div>
  );
};

export default L2;
