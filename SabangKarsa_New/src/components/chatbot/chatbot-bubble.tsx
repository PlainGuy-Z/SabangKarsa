import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { DotLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export interface ChatbotMessages {
  user: string[];
  bot: string[];
}

export function UserBubble({ message, save }: { message: string, save: boolean }) {
  useEffect(() => {
    if (save) {
      const localMessages = localStorage.getItem("chatbot") || "{\"user\": [], \"bot\": []}";
      const messages = JSON.parse(localMessages) as ChatbotMessages;

      messages.user = [...messages.user, message];
      localStorage.setItem("chatbot", JSON.stringify(messages));
    }
  }, [message, save]);

  return (
    <div className="flex justify-end mb-2">
      <div className="max-w-[80%] bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-sm">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

export function BotBubble({
  message,
  token,
  runFetch,
}: {
  message: string;
  token: string | undefined | null;
  runFetch: boolean;
}) {
  const [response, setResponse] = useState("");
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    if (runFetch) {
      const localMessages = localStorage.getItem("chatbot") || "{\"user\": [], \"bot\": []}";
      const messages = JSON.parse(localMessages) as ChatbotMessages;

      const fetchReply = async () => {
        try {
          const res = await axios.post(
            "https://api-jaksabang-chatbot.vercel.app/",
            {
              message,
            },
            {
              headers: {
                Authorization: `Bearer ${token || ""}`,
              },
            }
          );
          const response = res.data.response || t("chatbot-err-msg-3");
          setResponse(response);
          messages.bot = [...messages.bot, response];
          localStorage.setItem("chatbot", JSON.stringify(messages));
        } catch (error) {
          const errorObj = error as any;

          console.error(errorObj);

          if (errorObj.response?.status === 401) {
            setResponse(
              t("chatbot-err-msg-1")
            );
          } else {
            setResponse(
              `${errorObj.response?.status || "Error"}: ${
                errorObj.response?.data?.message ||
                errorObj.message ||
                t("chatbot-err-msg-2")
              }`
            );
          }
        }
      };

      fetchReply();
    }
    else {
      setResponse(message);
    }
  }, [message, runFetch, token, t]);

  return (
    <div className="flex justify-start mb-2">
      <div className={`max-w-[80%] ${theme === "light" ? "bg-gray-100 border-gray-200" : "bg-gray-700 border-gray-600"} border px-4 py-3 rounded-2xl rounded-tl-md shadow-sm`}>
        {response ? (
          <div className={`text-sm leading-relaxed ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <DotLoader size={16} color="oklch(0.4771 0.0777 205.67)" />
            <span className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm`}>
              {t("chatbot-loading")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
