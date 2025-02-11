import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Award, FileEdit, Mail, Settings } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../components/emailSettingComponents/TextEditor";
import AfterLogin from "../components/emailSettingComponents/AfterLogin";
import AfterPointEarned from "../components/emailSettingComponents/AfterPointEarned";
import AfterRewardRedeemed from "../components/emailSettingComponents/AfterRewardRedeemed";
import AfterRewardRedeemed_Admin from "../components/emailSettingComponents/AfterRewardRedeemed_Admin";
import { toast } from "sonner";
import config from "../api/config";

const EmailSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = location.state?.store;
  const [loading, setLoading] = useState(false);
  const [mailMessage, setMailMessage] = useState({});
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams(location.search);
  let status = queryParams.get("status");
  !status && (status = "afterLogin");

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const response = await config.get(`/store/getMessage/${store._id}`, {
          headers: { token },
        });
        if (response.data.success) {
          setMailMessage(response.data.mailSMS);
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
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, []);

  return (
    <div className="p-4 sm:ml-60 mt-4 mr-4 min-h-screen bg-stone-800 text-gray-100 rounded rounded-xl">
      {loading && <LoadingSpinner />}
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-2 flex">
          <Mail className="mt-1.5 mr-2" />
          Email Setting <Settings className="mt-1.5 ml-2" />
        </h1>
        <h2 className="text-xl font-bold text-green-300 mb-4">
          STORE: {store.name}
        </h2>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-700 mb-8">
        <button
          onClick={() =>
            navigate(`${location.pathname}?status=afterLogin`, {
              state: { store },
            })
          }
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "afterLogin"
              ? "border-b-2 border-emerald-400 text-emerald-400"
              : ""
          }`}
        >
          <FileEdit size={18} />
          <span>After Login</span>
        </button>
        <button
          onClick={() =>
            navigate(`${location.pathname}?status=afterPointEarned`, {
              state: { store },
            })
          }
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "afterPointEarned"
              ? "border-b-2 border-emerald-400 text-emerald-400"
              : ""
          }`}
        >
          <FileEdit size={18} />
          <span>After Point Earned</span>
        </button>
        <button
          onClick={() =>
            navigate(`${location.pathname}?status=afterRewardRedeemed`, {
              state: { store },
            })
          }
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "afterRewardRedeemed"
              ? "border-b-2 border-emerald-400 text-emerald-400"
              : ""
          }`}
        >
          <FileEdit size={18} />
          <span>After Reward Redeemed</span>
        </button>
        <button
          onClick={() =>
            navigate(`${location.pathname}?status=afterRewardRedeemed_admin`, {
              state: { store },
            })
          }
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "afterRewardRedeemed_admin" &&
            "border-b-2 border-emerald-400 text-emerald-400"
          }`}
        >
          <FileEdit size={18} />
          <span>After Reward Redeemed Admin</span>
        </button>
        <button
          // onClick={() =>
          //   navigate(`${location.pathname}?status=afterRewardRedeemed_admin`, {
          //     state: { store },
          //   })
          // }
          className={`flex items-center gap-2 px-4 py-2 ${
            status === "on_birthday" &&
            "border-b-2 border-emerald-400 text-emerald-400"
          }`}
        >
          <FileEdit size={18} />
          <span>On Birthday</span>
        </button>
      </div>

      <div className="flex justify-between">
        {status === "afterLogin" && mailMessage.messageAfterLogin && (
          <AfterLogin
            store={store}
            status={status}
            mailMessage={mailMessage.messageAfterLogin}
          />
        )}
        {status === "afterPointEarned" && mailMessage.messageAfterLogin && (
          <AfterPointEarned
            store={store}
            status={status}
            mailMessage={mailMessage.messageAfterPointEarned}
          />
        )}
        {status === "afterRewardRedeemed" && mailMessage.messageAfterLogin && (
          <AfterRewardRedeemed
            store={store}
            status={status}
            mailMessage={mailMessage.messageAfterRewardRedeemed}
          />
        )}
        {status === "afterRewardRedeemed_admin" &&
          mailMessage.messageAfterLogin && (
            <AfterRewardRedeemed_Admin
              store={store}
              status={status}
              mailMessage={mailMessage.messageAfterRewardRedeemed_Admin}
            />
          )}

        {/* Short Code Section */}
        <div className="bg-stone-900 text-green-300 p-4 rounded-lg shadow-md h-full">
          <h3 className="text-lg font-semibold mb-3">Short codes</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Points</span> -{" "}
              <code className="text-blue-400">[points_earned]</code>
            </li>
            <li>
              <span className="font-medium">Store Name</span> -{" "}
              <code className="text-blue-400">[store_name]</code>
            </li>
            <li>
              <span className="font-medium">Customer Name</span> -{" "}
              <code className="text-blue-400">[customer_name]</code>
            </li>
            <li>
              <span className="font-medium">Reward Name</span> -{" "}
              <code className="text-blue-400">[reward_name]</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailSetting;
