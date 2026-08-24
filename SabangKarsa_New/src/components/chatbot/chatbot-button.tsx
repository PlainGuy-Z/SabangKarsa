import { Bot } from "lucide-react"
import { ChatbotOverlay } from "./chatbot-overlay"
import { useState, useRef, useEffect, type RefObject } from "react"

export function ChatbotButton({ navbar }: { navbar: RefObject<HTMLElement | null> }) {
    const [visibility, setVisibility] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const visibilityToggle = () => setVisibility(prev => !prev);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) setVisibility(false);
        }

        if (visibility) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [visibility]);

    return (
        <>
            <ChatbotOverlay showOverlay={visibility} ref={overlayRef} navbar={navbar} button={buttonRef} />
            
            <button ref={buttonRef} onClick={visibilityToggle} className="bg-emerald-500 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-900/20 text-white z-50 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer fixed right-8 bottom-8 p-4 rounded-full">
                <Bot className="w-6 h-6" />
            </button>
        </>
    );
}