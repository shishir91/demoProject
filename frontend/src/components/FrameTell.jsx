import PropTypes from "prop-types";

const FrameTell = ({ className = "", onClose }) => {
  return (
    <div
      className={`w-[305px] relative h-[389px] max-w-full max-h-full overflow-auto ${className}`}
    >
      <img
        className="absolute top-[0px] left-[0px] rounded-xl w-[305px] h-[389px] object-cover"
        alt=""
        src="/rectangle-2@2x.png"
      />
      <img
        className="absolute top-[0px] left-[0px] rounded-xl w-[305px] h-[389px] object-cover"
        alt=""
        src="/rectangle-2@2x.png"
      />
    </div>
  );
};

FrameTell.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default FrameTell;
