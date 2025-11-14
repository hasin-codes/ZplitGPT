"use client";

/**
 * @author: @kokonutui
 * @description: AI Prompt Input
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ArrowRight, Paperclip, GitBranch } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import Image from "next/image";
import { FlowModal } from "./FlowModal";

interface AI_PromptProps {
    onMessageSent?: (message: string) => void;
}

export default function AI_Prompt({ onMessageSent }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });

    const handleSend = () => {
        if (!value.trim()) return;
        
        const message = value.trim();
        setValue("");
        adjustHeight(true);
        
        // Call the callback if provided
        if (onMessageSent) {
            onMessageSent(message);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFlowClick = () => {
        setIsFlowModalOpen(true);
    };

    return (
        <div className="w-full sm:w-4/6 py-4 px-2 sm:px-0">
            <div 
                className="backdrop-blur-md rounded-2xl relative" 
                style={{ 
                    background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.5) 100%)',
                    padding: '1.5px',
                    borderRadius: '1rem',
                    boxShadow: `
                        0 0 8px rgba(255, 89, 56, 0.15),
                        0 0 15px rgba(255, 89, 56, 0.1),
                        0 0 23px rgba(255, 209, 226, 0.09),
                        0 0 30px rgba(255, 209, 226, 0.06),
                        0 0 38px rgba(255, 209, 226, 0.03),
                        0 2px 8px rgba(0, 0, 0, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                    filter: 'drop-shadow(0 0 6px rgba(255, 89, 56, 0.12)) drop-shadow(0 0 12px rgba(255, 209, 226, 0.08))'
                }}
            >
                <div 
                    className="rounded-2xl p-1.5 pt-4 relative h-full w-full"
                    style={{
                        background: 'linear-gradient(160deg, #FF5938, #FFD1E2)',
                        borderRadius: 'calc(1rem - 1.5px)',
                    }}
                >
                <div className="flex items-center gap-2 mb-2.5 mx-2">
                    <div className="flex-1 flex items-center gap-2">
                        <Image 
                            src="/ZplitGPT.svg" 
                            alt="ZplitGPT Logo" 
                            width={14} 
                            height={14} 
                            className="h-3.5 w-3.5"
                        />
                        <h3 className="text-[#351817] text-sm font-medium tracking-tight">
                            is under development
                        </h3>
                    </div>
                    <p className="text-[#351817] text-sm font-medium tracking-tight">
                        Demo UI
                    </p>
                </div>
                <div className="relative">
                    {/* <div className="absolute -top-12 left-0 w-full h-full border border-black/10 dark:border-white/10 rounded-2xl p-3  border-b-0">
                        <div className="flex items-center gap-2">
                            <Gift className="h-3.5 w-3.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-black dark:text-white/90 text-sm">
                                    Build for free this weekend
                                </h3>
                            </div>
                        </div>
                    </div> */}
                    <div className="relative flex flex-col">
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "400px" }}
                        >
                            <Textarea
                                id="ai-input-15"
                                value={value}
                                placeholder={"What can I do for you?"}
                                className={cn(
                                    "w-full rounded-xl rounded-b-none px-4 py-3 backdrop-blur-md border-none text-white placeholder:text-gray-400 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "min-h-[72px] text-sm"
                                )}
                                style={{ backgroundColor: '#3d3d3d' }}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                            />
                        </div>

                        <div className="h-14 backdrop-blur-md rounded-b-xl flex items-center" style={{ backgroundColor: '#3d3d3d' }}>
                            <div className="absolute left-3 right-3 bottom-3 flex items-center gap-2 w-[calc(100%-24px)]">
                                {/* Left side: Attachment and Search buttons */}
                                <div className="flex items-center gap-2">
                                    {/* Attachment button */}
                                    <label
                                        className={cn(
                                            "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer flex-shrink-0",
                                            "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                            "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                                        )}
                                        aria-label="Attach file"
                                    >
                                        <input type="file" className="hidden" />
                                        <Paperclip className="w-4 h-4 transition-colors" />
                                    </label>
                                    {/* Flow button */}
                                    <button
                                        type="button"
                                        onClick={handleFlowClick}
                                        className={cn(
                                            "flex items-center gap-1.5 cursor-pointer transition-all duration-300 ease-in-out",
                                            "border-2 border-cyan-500 py-1.5 rounded-full px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                                        )}
                                        aria-label="Flow"
                                    >
                                        <GitBranch className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                        <span className="text-cyan-500 font-medium text-sm whitespace-nowrap">
                                            Flow
                                        </span>
                                    </button>
                                </div>
                                {/* Spacer to push send button to the right */}
                                <div className="flex-1" />
                                {/* Send button on the right */}
                                <button
                                    type="button"
                                    className={cn(
                                        "rounded-lg p-2 bg-black/5 dark:bg-white/5 flex-shrink-0",
                                        "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                        !value.trim() && "cursor-not-allowed opacity-50"
                                    )}
                                    aria-label="Send message"
                                    disabled={!value.trim()}
                                    onClick={handleSend}
                                >
                                    <ArrowRight
                                        className={cn(
                                            "w-4 h-4 dark:text-white transition-opacity duration-200",
                                            value.trim()
                                                ? "opacity-100"
                                                : "opacity-30"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <FlowModal 
                isOpen={isFlowModalOpen} 
                onClose={() => setIsFlowModalOpen(false)} 
            />
        </div>
    );
}
