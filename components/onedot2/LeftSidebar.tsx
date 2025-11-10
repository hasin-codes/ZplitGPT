'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FolderOpen, MessageSquare, Plus, HelpCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProfileDropdown from '@/components/kokonutui/profile-dropdown'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface LeftSidebarProps {
  collapsed: boolean
  onToggle: () => void
  onHoverChange?: (isHovered: boolean) => void
  projects?: Project[]
  chats?: ChatHistory[]
  selectedProject?: string
  selectedChat?: string
  onProjectSelect?: (projectId: string) => void
  onChatSelect?: (chatId: string) => void
  onProjectCreate?: (name: string) => void
  onChatCreate?: () => void
  onProjectRename?: (projectId: string, name: string) => void
  onChatRename?: (chatId: string, name: string) => void
}

export interface Project {
  id: string
  name: string
  lastModified: string
}

export interface ChatHistory {
  id: string
  title: string
  timestamp: string
}

export function LeftSidebar({ 
  collapsed, 
  onToggle, 
  onHoverChange,
  projects: propsProjects,
  chats: propsChats,
  selectedProject: propsSelectedProject,
  selectedChat: propsSelectedChat,
  onProjectSelect: propsOnProjectSelect,
  onChatSelect: propsOnChatSelect,
  onProjectCreate,
  onChatCreate,
  onProjectRename,
  onChatRename
}: LeftSidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const isExpanded = isHovered || isProfileDropdownOpen // Expand on hover or when dropdown is open
  const [projectsExpanded, setProjectsExpanded] = useState(false)

  // Use props if provided, otherwise use default internal state
  const projects: Project[] = propsProjects || [
    { id: 'default', name: 'Default Workspace', lastModified: '2 hours ago' },
    { id: 'quantum-computing', name: 'Quantum Computing', lastModified: '1 day ago' },
    { id: 'api-design', name: 'API Design', lastModified: '3 days ago' },
    { id: 'code-review', name: 'Code Review', lastModified: '1 week ago' }
  ]

  const chatHistory: ChatHistory[] = propsChats || [
    { id: 'chat-1', title: 'Quantum computing basics', timestamp: '10:30 AM' },
    { id: 'chat-2', title: 'React hooks optimization', timestamp: '9:45 AM' },
    { id: 'chat-3', title: 'Database schema design', timestamp: 'Yesterday' },
    { id: 'chat-4', title: 'TypeScript best practices', timestamp: 'Yesterday' },
    { id: 'chat-5', title: 'API authentication patterns', timestamp: '2 days ago' },
    { id: 'chat-6', title: 'Performance optimization', timestamp: '3 days ago' }
  ]

  const selectedProject = propsSelectedProject ?? 'default'
  const selectedChat = propsSelectedChat ?? 'chat-1'

  const setSelectedProject = propsOnProjectSelect || (() => {})
  const setSelectedChat = propsOnChatSelect || (() => {})

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverChange?.(true)
  }

  const handleMouseLeave = () => {
    // Don't collapse if profile dropdown is open
    if (!isProfileDropdownOpen) {
      setIsHovered(false)
      onHoverChange?.(false)
    }
  }

  const handleProfileDropdownOpenChange = (open: boolean) => {
    setIsProfileDropdownOpen(open)
    if (open) {
      setIsHovered(true)
      onHoverChange?.(true)
    } else {
      // Only collapse if not hovering
      if (!isHovered) {
        onHoverChange?.(false)
      }
    }
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="icon"
        className={cn(
          "h-full bg-[#0a0a0a] border-r border-[#1a1a1a] transition-all duration-300 ease-in-out",
          !isHovered && "w-16",
          isHovered && "w-64"
        )}
        style={{
          width: !isHovered ? '64px' : '256px',
          transition: 'width 300ms ease-in-out'
        }}
      >
      <SidebarHeader className="p-4 border-b border-[#1a1a1a] relative w-full">
        <div className="flex items-center relative h-8">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" 
            style={{ transition: 'none', position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <Image 
              src="/ZplitGPT.svg" 
              alt="ZplitGPT Logo" 
              width={32} 
              height={32} 
              className="w-full h-full object-contain"
              style={{ transition: 'none', position: 'relative' }}
            />
          </div>
          <span 
            className="text-[#f5f5f5] font-bold text-2xl whitespace-nowrap overflow-hidden inline-block"
            style={{
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out',
              marginLeft: '56px',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          >
            ZplitGPT
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto relative">
        {/* Projects Section */}
        <SidebarGroup
          onMouseLeave={() => {
            // Auto-collapse when mouse leaves the block
            setProjectsExpanded(false)
          }}
        >
          <div className="flex items-center justify-between px-2 mb-2 relative">
            <SidebarGroupLabel className="text-[#f5f5f5] flex items-center gap-2 font-semibold text-sm relative">
              <FolderOpen 
                className="w-5 h-5 flex-shrink-0 cursor-pointer hover:text-[#ff4f2b]" 
                style={{ transition: 'none', position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setProjectsExpanded(!projectsExpanded)}
              />
              <span 
                className="whitespace-nowrap overflow-hidden inline-block"
                style={{
                  clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 300ms ease-in-out',
                  marginLeft: '28px'
                }}
              >
                Projects
              </span>
            </SidebarGroupLabel>
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#151515] p-1 h-auto flex-shrink-0"
                style={{ transition: 'none', position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onProjectCreate?.('New Project')
                }}
              >
                <Plus className="w-3 h-3 flex-shrink-0" style={{ transition: 'none', position: 'relative' }} />
              </Button>
            )}
          </div>
          <SidebarGroupContent 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              projectsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedProject(project.id)}
                    isActive={selectedProject === project.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative group",
                      selectedProject === project.id
                        ? cn(
                            'bg-[#1a1a1a] border border-transparent transition-opacity duration-300 ease-in-out',
                            isExpanded ? 'opacity-100' : 'opacity-0'
                          )
                        : 'bg-[#0a0a0a] border border-transparent'
                    )}
                  >
                    {selectedProject === project.id ? (
                      <>
                        <div 
                          className={cn(
                            "absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-[#ff4f2b] z-0 transition-opacity duration-300 ease-in-out",
                            isExpanded ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div 
                          className={cn(
                            "absolute right-1 top-0 bottom-0 rounded-l-lg z-0 transition-opacity duration-300 ease-in-out",
                            isExpanded ? "opacity-50" : "opacity-0"
                          )}
                          style={{
                            width: '40%',
                            background: 'linear-gradient(to left, #ff4f2b, transparent)',
                            maskImage: 'linear-gradient(to left, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-[#151515] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
                        />
                        <div 
                          className="absolute right-1 top-0 bottom-0 rounded-l-lg opacity-0 group-hover:opacity-50 transition-opacity duration-200 z-0"
                          style={{
                            width: '40%',
                            background: 'linear-gradient(to left, #151515, transparent)',
                            maskImage: 'linear-gradient(to left, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                          }}
                        />
                      </>
                    )}
                    <div className="flex flex-col w-full relative z-10">
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-[#f5f5f5] text-sm font-medium truncate overflow-hidden inline-block"
                          style={{
                            clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                            transition: 'clip-path 300ms ease-in-out'
                          }}
                        >
                          {project.name}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-[#1a1a1a]" />

        {/* Chat History Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2 relative">
            <SidebarGroupLabel className="text-[#f5f5f5] flex items-center gap-2 font-semibold text-sm relative">
              <MessageSquare 
                className="w-5 h-5 flex-shrink-0" 
                style={{ transition: 'none', position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <span 
                className="whitespace-nowrap overflow-hidden inline-block"
                style={{
                  clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 300ms ease-in-out',
                  marginLeft: '28px'
                }}
              >
                Chat History
              </span>
            </SidebarGroupLabel>
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#151515] p-1 h-auto flex-shrink-0"
                style={{ transition: 'none', position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onChatCreate?.()
                }}
              >
                <Plus className="w-3 h-3 flex-shrink-0" style={{ transition: 'none', position: 'relative' }} />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedChat(chat.id)}
                    isActive={selectedChat === chat.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative group",
                      selectedChat === chat.id
                        ? cn(
                            'bg-[#1a1a1a] border border-transparent transition-opacity duration-300 ease-in-out',
                            isExpanded ? 'opacity-100' : 'opacity-0'
                          )
                        : 'bg-[#0a0a0a] border border-transparent'
                    )}
                  >
                    {selectedChat === chat.id ? (
                      <>
                        <div 
                          className={cn(
                            "absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-[#ff4f2b] z-0 transition-opacity duration-300 ease-in-out",
                            isExpanded ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div 
                          className={cn(
                            "absolute right-1 top-0 bottom-0 rounded-l-lg z-0 transition-opacity duration-300 ease-in-out",
                            isExpanded ? "opacity-50" : "opacity-0"
                          )}
                          style={{
                            width: '40%',
                            background: 'linear-gradient(to left, #ff4f2b, transparent)',
                            maskImage: 'linear-gradient(to left, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-[#151515] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
                        />
                        <div 
                          className="absolute right-1 top-0 bottom-0 rounded-l-lg opacity-0 group-hover:opacity-50 transition-opacity duration-200 z-0"
                          style={{
                            width: '40%',
                            background: 'linear-gradient(to left, #151515, transparent)',
                            maskImage: 'linear-gradient(to left, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                          }}
                        />
                      </>
                    )}
                    <div className="flex flex-col w-full relative z-10">
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-[#f5f5f5] text-sm font-medium truncate overflow-hidden inline-block"
                          style={{
                            clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                            transition: 'clip-path 300ms ease-in-out'
                          }}
                        >
                          {chat.title}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Help Icon */}
      <div className="px-4 py-2 border-t border-[#1a1a1a]">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-3 h-auto relative"
        >
          <HelpCircle 
            className="w-5 h-5 flex-shrink-0" 
            style={{ transition: 'none', position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <span
            className="whitespace-nowrap overflow-hidden inline-block"
            style={{
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out',
              marginLeft: '24px'
            }}
          >
            Help
          </span>
        </Button>
      </div>

      {/* Settings Icon */}
      <div className="px-4 py-2 border-t border-[#1a1a1a]">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-3 h-auto relative"
        >
          <Settings 
            className="w-5 h-5 flex-shrink-0" 
            style={{ transition: 'none', position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <span
            className="whitespace-nowrap overflow-hidden inline-block"
            style={{
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out',
              marginLeft: '24px'
            }}
          >
            Settings
          </span>
        </Button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-2 border-t border-[#1a1a1a]">
        {isExpanded ? (
          <div
            style={{
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out'
            }}
          >
            <ProfileDropdown 
              className="w-full" 
              onOpenChange={handleProfileDropdownOpenChange}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <ProfileDropdown 
              className="w-auto"
              collapsed={true}
              onOpenChange={handleProfileDropdownOpenChange}
              data={{
                name: "Eugene An",
                email: "eugene@kokonutui.com",
                avatar: "/Demo avatar/Avatar.webP",
                subscription: "PRO",
                model: "Gemini 2.0 Flash"
              }}
            />
          </div>
        )}
      </div>
    </Sidebar>
    </div>
  )
}