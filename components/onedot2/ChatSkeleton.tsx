'use client'

import { motion } from 'framer-motion'

export function ChatSkeleton() {
    return (
        <div className="h-full w-full flex gap-3 overflow-hidden p-3 animate-fade-in">
            {[1, 2, 3].map((colIndex) => (
                <div
                    key={`col-${colIndex}`}
                    className="flex-shrink-0 flex flex-col relative rounded-lg overflow-hidden border border-white/5 bg-card/30 backdrop-blur-md h-full w-[85vw] md:w-[calc((100%-24px)/3)]"
                >
                    {/* Column Header */}
                    <div className="bg-[#111111] p-4 border-b-2 border-[#222] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-3 h-3 rounded-full bg-[#222]"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 }}
                            />
                            <motion.div
                                className="h-4 w-24 bg-[#222] rounded"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 }}
                            />
                        </div>
                        <motion.div
                            className="h-7 w-7 bg-[#222] rounded"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 }}
                        />
                    </div>

                    {/* Version Tabs */}
                    <div className="bg-[#0a0a0a] px-4 py-2 border-b border-[#1a1a1a] flex gap-2 shrink-0">
                        <motion.div
                            className="h-6 w-16 bg-[#222] rounded-full"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + 0.1 }}
                        />
                        <motion.div
                            className="h-6 w-16 bg-[#222] rounded-full"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + 0.1 }}
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 space-y-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((line) => (
                            <motion.div
                                key={`line-${colIndex}-${line}`}
                                className={`h-4 bg-[#222] rounded ${line % 2 === 0 ? 'w-3/4' : 'w-full'}`}
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + line * 0.05 }}
                            />
                        ))}
                        <div className="pt-4 space-y-4">
                            <motion.div
                                className="h-32 w-full bg-[#222] rounded"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + 0.3 }}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-[#1a1a1a] flex items-center justify-between shrink-0">
                        <div className="flex gap-2">
                            <motion.div
                                className="h-6 w-12 bg-[#222] rounded"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + 0.4 }}
                            />
                            <motion.div
                                className="h-6 w-12 bg-[#222] rounded"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + 0.4 }}
                            />
                        </div>
                        <motion.div
                            className="h-4 w-24 bg-[#222] rounded"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: colIndex * 0.1 + 0.4 }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
