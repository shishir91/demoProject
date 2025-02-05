import React, { useState } from "react";
import TextEditor from "./TextEditor";
import { toast } from "sonner";
import config from "../../api/config";

const AfterLogin = (state) => {
  const [subject, setSubject] = useState(state.mailMessage.subject);
  const [message, setMessage] = useState(state.mailMessage.message);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await config.put(
        `/store/configMessage/${state.store._id}`,
        { subject, message, status: state.status },
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
      {/* Subject */}
      <div className="relative">
        <label
          htmlFor="pass"
          className="block text-md font-medium text-gray-200"
        >
          Subject:
        </label>
        <div className="relative">
          <input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
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
        <TextEditor message={message} setMessage={setMessage} />
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

export default AfterLogin;
