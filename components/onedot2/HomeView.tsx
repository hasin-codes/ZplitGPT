'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AI_Prompt from '@/components/kokonutui/ai-prompt'
import { ArrowRight, Lightbulb, Code, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HomeViewProps {
    onMessageSent: (message: string) => void
}

export function HomeView({ onMessageSent }: HomeViewProps) {
    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good morning')
        else if (hour < 18) setGreeting('Good afternoon')
        else setGreeting('Good evening')
    }, [])

    const promptStarters = [
        {
            icon: <Lightbulb className="w-4 h-4" />,
            text: "Explain quantum computing",
            prompt: "Explain quantum computing in simple terms"
        },
        {
            icon: <Code className="w-4 h-4" />,
            text: "Write a React component",
            prompt: "Write a React functional component with TypeScript"
        },
        {
            icon: <FileText className="w-4 h-4" />,
            text: "Summarize this article",
            prompt: "Summarize the key points of this text"
        },
        {
            icon: <ImageIcon className="w-4 h-4" />,
            text: "Generate an image prompt",
            prompt: "Create a detailed prompt for an AI image generator"
        }
    ]

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden bg-background">
            {/* Main Content Container */}
            <div className="w-full max-w-3xl px-6 flex flex-col items-center gap-8 z-10 -mt-20">

                {/* Greeting / Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                        {greeting}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        How can I help you today?
                    </p>
                </motion.div>

                {/* Input Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="w-full flex justify-center"
                >
                    <div className="w-full">
                        <AI_Prompt onMessageSent={onMessageSent} className="w-full md:w-full px-0" />
                    </div>
                </motion.div>

                {/* Prompt Starters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-4"
                >
                    {promptStarters.map((starter, index) => (
                        <button
                            key={index}
                            onClick={() => onMessageSent(starter.prompt)}
                            className={cn(
                                "flex flex-col items-start p-4 gap-2 rounded-xl",
                                "bg-secondary/30 hover:bg-secondary/60 border border-border/50 hover:border-border",
                                "transition-all duration-200 group text-left"
                            )}
                        >
                            <div className="p-2 rounded-lg bg-background/50 text-foreground/70 group-hover:text-foreground transition-colors">
                                {starter.icon}
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                                {starter.text}
                            </span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Footer / Disclaimer (Optional, adds to premium feel) */}
            <div className="absolute bottom-6 text-xs text-muted-foreground/50">
                AI can make mistakes. Check important info.
            </div>
        </div>
    )
}
