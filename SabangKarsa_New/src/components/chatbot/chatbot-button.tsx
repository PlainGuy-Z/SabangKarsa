import { useCopy } from "@/components/experience/use-copy";
import { MessageCircle } from "lucide-react"
import { ChatbotOverlay } from "./chatbot-overlay"
import { useState, useRef, useEffect, type RefObject } from "react"

export function ChatbotButton({ navbar }: { navbar: RefObject<HTMLElement | null> }) {
    const copy = useCopy();
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
            
            <button ref={buttonRef} onClick={visibilityToggle} className="sk-chat-trigger" aria-label={copy("Buka asisten AI SabangKarsa", "Open SabangKarsa AI assistant")} aria-expanded={visibility}>
                <MessageCircle size={19} /><span>{copy("Asisten perjalanan", "Travel assistant")}</span>
            </button>
        </>
    );
}