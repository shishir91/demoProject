export default function PinInput({
  pin,
  handleChange,
  handleKeyDown,
  handleSubmit,
  inputRefs,
}) {
  return (
    <div className="p-8 bg-slate-800 text-center flex flex-col items-center">
      <h2 className="text-white text-lg mb-4">Enter Your 4-Digit PIN</h2>
      <div className="flex gap-3">
        {pin.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength="1"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 text-center text-xl font-bold text-white bg-slate-700 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 text-white bg-emerald-500 rounded-lg font-semibold text-lg shadow-md hover:bg-emerald-600 transition duration-300"
      >
        Submit
      </button>{" "}
    </div>
  );
}
