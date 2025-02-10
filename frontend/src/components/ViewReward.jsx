import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Info } from "lucide-react";
import InstallationGuide from "./InstallationGuide";

const ViewReward = ({
  className = "",
  location,
  group1410103762,
  vector,
  color,
}) => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  return (
    <div
      className={`self-stretch flex flex-row items-center justify-center py-2 px-0 text-left text-xs-41 text-black font-poppins lg1:pl-0 lg1:pr-0 lg1:box-border ${className}`}
    >
      <InstallationGuide showGuide={showGuide} setShowGuide={setShowGuide} />
      <div className="flex-1 h-[46px]" />
      <div className="flex-1 flex flex-col items-center justify-center gap-[8px]">
        <div className="h-[74px] flex flex-col items-center justify-center">
          <img
            className="w-auto relative h-[70px]"
            alt=""
            src={group1410103762}
          />
        </div>
        <div className="relative tracking-[0.01em] font-medium">{location}</div>
      </div>
      <div className="flex-1 flex flex-col items-end justify-center">
        <div
          style={{ backgroundColor: color }}
          className="w-[70px] rounded-tl-3xs1 rounded-tr-none rounded-br-none rounded-bl-3xs1 
    border-whitesmoke-100 border-[1px] border-solid box-border flex flex-row 
    items-center justify-center py-[9px] px-0 cursor-pointer lg1:gap-2.5 
    animate-glow transition-all duration-300 hover:scale-110"
          onClick={() => setShowGuide(true)} // Opens guide
        >
          <Info className="w-7 h-7 text-white animate-pulse hover:animate-spin transition-all duration-500 ease-in-out drop-shadow-neon" />
        </div>

        {/* <img className="w-5 relative h-5" alt="" src={vector} /> */}
      </div>
    </div>
  );
};

ViewReward.propTypes = {
  className: PropTypes.string,
  group1410103762: PropTypes.string,
  vector: PropTypes.string,
};

export default ViewReward;
