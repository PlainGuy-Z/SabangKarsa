import { Send, Bot } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider";
import React, { useRef, useState, forwardRef, useEffect, type RefObject } from "react"
import { BotBubble, UserBubble } from "./chatbot-bubble";
import { useTranslation } from "react-i18next";
import type { ChatbotMessages } from "./chatbot-bubble";
import "../../i18n/i18n"

export const ChatbotOverlay = forwardRef<HTMLDivElement, { showOverlay: boolean, navbar: RefObject<HTMLElement | null>, button: RefObject<HTMLButtonElement | null> }>(({ showOverlay, navbar, button }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const outputRef = useRef<HTMLDivElement | null>(null);
    const [overlayHeight, setOverlayHeight] = useState<number>(0);
    const [overlayWidth, setOverlayWidth] = useState<number>(580);
    const localMessages = localStorage.getItem("chatbot") || "{\"user\": [], \"bot\": []}";
    const messages = JSON.parse(localMessages) as ChatbotMessages;
    const tempElements: React.ReactNode[] = [];
    const token = localStorage.getItem("token") || "";

    for (let index = 0; index < messages.bot.length; index++) {
        tempElements.push(<UserBubble key={`user-${index}`} message={messages.user[index]} save={false} />);
        tempElements.push(<BotBubble key={`bot-${index}`} message={messages.bot[index]} token={token} runFetch={false} />)
    }

    const [elements, setElements] = useState<React.ReactNode[]>(tempElements);
    const { theme } = useTheme();
    const { t } = useTranslation();

    const callbot = () => {
        const inputValue = inputRef.current?.value.trim();
        
        if (inputValue) {
            setElements(prev => [...prev, <UserBubble key={`user-${prev.length}`} message={inputValue} save={true} />]);
            setElements(prev => [...prev, <BotBubble key={`bot-${prev.length}`} message={inputValue} token={token} runFetch={true} />]);
            
            // Clear input after sending
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.style.height = 'auto';
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            callbot();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    useEffect(() => {
        const el = outputRef.current;

        if (el) el.scrollTop = el.scrollHeight;
    }, [elements]);

    useEffect(() => {
        const updateOverlayHeight = () => {
            const navbarHeight = navbar.current?.clientHeight || 64; // fallback to 64px
            const windowHeight = window.innerHeight;
            const buttonEl = button.current;
            const buttonRect = buttonEl?.getBoundingClientRect();
        
            if (buttonRect) {
                const buttonPosY = window.innerHeight - buttonRect.bottom;
                const buttonStyle = window.getComputedStyle(buttonEl as Element);
                const buttonPT = Number(buttonStyle.getPropertyValue("padding-top").replace("px", "")) || 16;
                const height = Math.max(400, windowHeight - navbarHeight - buttonRect.height - buttonPosY - (buttonPT * 2) - 32); // Added margin and minimum height
                
                setOverlayHeight(height);
            } else {
                // Fallback when button rect is not available
                setOverlayHeight(500);
            }
        }

        updateOverlayHeight();

        window.addEventListener("resize", updateOverlayHeight);

        return () => window.removeEventListener("resize", updateOverlayHeight);
    }, [navbar, button, showOverlay]); // Added showOverlay as dependency

    useEffect(() => {
        const updateOverlayWidth = () => {
            const currentWidth = window.innerWidth;

            if (currentWidth < 640) {
                // For mobile, use most of the screen width with some padding
                const padding = 32; // 16px on each side
                setOverlayWidth(currentWidth - padding);
            } else {
                // For desktop, use fixed width
                setOverlayWidth(580);
            }
        }

        updateOverlayWidth();

        window.addEventListener("resize", updateOverlayWidth);

        return () => window.removeEventListener("resize", updateOverlayWidth);
    }, []) // Removed dependency on windowWidth to prevent infinite loop

    return (
        <div 
            ref={ref} 
            className={`${theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"} overflow-hidden rounded-2xl shadow-xl border fixed z-40 transition-all duration-500 ease-in-out ${
                showOverlay 
                    ? 'translate-x-0 opacity-100 visible scale-100' 
                    : 'translate-x-full opacity-0 invisible scale-95'
            }`} 
            style={{ 
                height: overlayHeight > 0 ? `${overlayHeight}px` : '500px', 
                width: `${overlayWidth}px`,
                right: '24px',
                bottom: '96px' // 6rem = 96px for bottom-24
            }}
        >
            <div className="flex flex-col w-full h-full">
                {/* Header */}
                <div className={`bg-gradient-to-r ${theme === "light" ? "bg-emerald-500" : "bg-emerald-500"} p-4 rounded-t-2xl`}>
                    <h1 className="font-bold text-lg text-white flex items-center gap-2">
                        <Bot className="w-6 h-6" />
                        {t("chatbot-header")}
                    </h1>
                    <p className="text-emerald-100 text-sm mt-1">{t("chatbot-tagline")}</p>
                </div>
                
                {/* Chat Area */}
                <div ref={outputRef} className={`flex flex-col gap-3 w-full overflow-y-auto scroll-smooth grow p-4 ${theme === "light" ? "bg-gray-50" : "bg-gray-900"}`}>
                    {elements.length !== 0 ? elements.map((el, index) => ( 
                        <div key={index}>{el}</div> 
                    )) : ( 
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className={`w-16 h-16 ${theme === "light" ? "bg-emerald-200" : "bg-emerald-200"} rounded-full flex items-center justify-center mb-4`}>
                                <Bot className={`w-8 h-8 ${theme === "light" ? "text-emerald-800" : "text-emerald-800"}`} />
                            </div>
                            <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-lg font-medium`}>{t("chatbot-hello")}</p>
                            <p className={`${theme === "light" ? "text-gray-400" : "text-gray-500"} text-sm mt-1`}>{t("chatbot-question")}</p>
                        </div> 
                    )}
                </div>
                
                {/* Input Area */}
                <div className={`${theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"} p-4 border-t`}>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex-1 relative flex items-center justify-end">
                            <textarea 
                                ref={inputRef} 
                                onKeyDown={handleKeyDown}
                                onChange={handleInputChange}
                                className={`w-full border-2 focus:outline-none p-3 resize-none rounded-lg transition-colors duration-200 min-h-[44px]
                                    ${theme === "light" ? "bg-gray-100 border-gray-200 focus:[border-color:var(--primary)] text-gray-800 placeholder-gray-500" 

                                        : "bg-gray-700 border-gray-600 focus:[border-color:oklch(0.4771_0.0777_205.67)] text-gray-200 placeholder-gray-400"}`} 

                                placeholder={t("chatbot-placeholder")}
                                rows={1}
                            />
                            <div className="absolute px-4 text-xs text-gray-500">
                                Enter ↵
                            </div>
                        </div>
                        <button 
                            onClick={callbot} 
                            className={`cursor-pointer text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg 

                                ${theme === "light" ? "bg-emerald-500 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-900/50"}`}
>
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
})