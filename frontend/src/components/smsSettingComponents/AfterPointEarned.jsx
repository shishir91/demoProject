import React, { useState } from "react";
import TextEditor from "../emailSettingComponents/TextEditor";
import { toast } from "sonner";
import config from "../../api/config";

const AfterPointEarned = (state) => {
  console.log(state);

  const [from, setFrom] = useState(state.smsMessage.from);
  const [message, setMessage] = useState(state.smsMessage.message);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await config.put(
        `/store/configSMSMessage/${state.store._id}`,
        { from, message, status: state.status },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
        });
      } else {
        toast.error(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
      });
    }
  };
  return (
    <form className="mx-20" onSubmit={handleSubmit}>
      {/* From */}
      <div className="relative">
        <label
          htmlFor="from"
          className="block text-md font-medium text-gray-200"
        >
          From:
        </label>
        <div className="relative">
          <input
            id="from"
            name="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="my-2 block w-full px-4 py-2 bg-stone-900 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 pr-10"
          />
        </div>
      </div>
      <label
        htmlFor="textEditor"
        className="block text-md font-medium text-gray-200"
      >
        Message:
      </label>
      <div className="my-2">
        <textarea
          className="my-2 block w-full px-4 py-2 bg-stone-900 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 pr-10"
          rows={10}
          cols={75}
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>{" "}
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Submit
      </button>
    </form>
  );
};

export default AfterPointEarned;
