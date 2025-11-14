'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FolderOpen, MessageSquare, Plus, HelpCircle, Settings, X, MoreVertical, Pin, Edit2, Copy, Archive, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
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
import { useIsMobile } from '@/hooks/use-mobile'
import { deleteChat, cloneChat, getChatHistory } from '@/lib/chat-storage'

interface LeftSidebarProps {
  collapsed: boolean
  onToggle: () => void
  onHoverChange?: (isHovered: boolean) => void
  projects?: Project[]
  chats?: ChatHistory[]
  selectedProject?: string
  selectedChat?: string | null
  onProjectSelect?: (projectId: string) => void
  onChatSelect?: (chatId: string | null) => void
  onProjectCreate?: (name: string) => void
  onChatCreate?: () => void
  onProjectRename?: (projectId: string, name: string) => void
  onChatRename?: (chatId: string, name: string) => void
  onProjectDelete?: (projectId: string) => void
  onProjectClone?: (projectId: string) => void
  onChatDelete?: (chatId: string) => void
  onChatClone?: (chatId: string) => void
  onChatsUpdate?: () => void
  onSettingsClick?: () => void
  disableHoverBehavior?: boolean
  disableNewChat?: boolean
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
  onChatRename,
  onProjectDelete,
  onProjectClone,
  onChatDelete,
  onChatClone,
  onChatsUpdate,
  onSettingsClick,
  disableHoverBehavior = false,
  disableNewChat = false
}: LeftSidebarProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isHovered, setIsHovered] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  
  // On mobile: always expanded when open (not collapsed)
  // On desktop: expanded on hover or when dropdown is open (unless hover behavior is disabled)
  // When hover behavior is disabled, only use collapsed state
  const isExpanded = isMobile 
    ? !collapsed 
    : (disableHoverBehavior ? !collapsed : (isHovered || isProfileDropdownOpen || !collapsed))
  
  const [projectsExpanded, setProjectsExpanded] = useState(false)

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, collapsed])

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
  const selectedChat = propsSelectedChat ?? null

  const setSelectedProject = propsOnProjectSelect || (() => {})
  const setSelectedChat = propsOnChatSelect || (() => {})

  const handleMouseEnter = () => {
    if (!isMobile && !disableHoverBehavior) {
      setIsHovered(true)
      onHoverChange?.(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile && !disableHoverBehavior) {
      // Don't collapse if profile dropdown or any menu dropdown is open
      if (!isProfileDropdownOpen && !openDropdownId) {
        setIsHovered(false)
        onHoverChange?.(false)
      }
    }
  }

  const handleProfileDropdownOpenChange = (open: boolean) => {
    setIsProfileDropdownOpen(open)
    if (!isMobile) {
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
  }

  // Render sidebar content (shared between mobile and desktop)
  const renderSidebarContent = () => (
    <>
      <SidebarHeader className="p-4 border-b border-[#1a1a1a] relative w-full">
        <div className="flex items-center justify-between relative h-8">
          <div className="flex items-center relative flex-1">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" 
              style={{ transition: 'none', position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
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
              className={cn(
                "text-[#f5f5f5] font-bold text-2xl whitespace-nowrap overflow-hidden inline-block",
                isMobile ? "ml-10" : ""
              )}
              style={!isMobile ? {
                clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                transition: 'clip-path 300ms ease-in-out',
                marginLeft: '40px',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10
              } : {
                marginLeft: '40px',
                position: 'relative',
                top: 'auto',
                transform: 'none',
                zIndex: 10
              }}
            >
              ZplitGPT
            </span>
          </div>
          {/* Close button on mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] flex-shrink-0 ml-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto relative">
        {/* Projects Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2 relative">
            <SidebarGroupLabel className="text-[#f5f5f5] flex items-center gap-2 font-semibold text-sm relative">
              <FolderOpen 
                className="w-5 h-5 flex-shrink-0 cursor-pointer hover:text-[#ff4f2b]" 
                style={{ transition: 'none', position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setProjectsExpanded(!projectsExpanded)}
              />
              <span 
                className="whitespace-nowrap overflow-hidden inline-block"
                style={!isMobile ? {
                  clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 300ms ease-in-out',
                  marginLeft: '28px'
                } : {
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
                    onClick={(e) => {
                      // Don't select if clicking on the dropdown menu area
                      if ((e.target as HTMLElement).closest('[role="menu"]') || (e.target as HTMLElement).closest('button[class*="opacity-0"]')) {
                        return
                      }
                      setSelectedProject(project.id)
                      // Close sidebar on mobile when selecting a project
                      if (isMobile) {
                        onToggle()
                      }
                    }}
                    isActive={selectedProject === project.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative group",
                      selectedProject === project.id
                        ? 'bg-[#1a1a1a] border border-transparent'
                        : 'bg-[#0a0a0a] border border-transparent'
                    )}
                  >
                    {selectedProject === project.id && (
                      <>
                        <div className="absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-[#ff4f2b] z-0" />
                        <div 
                          className="absolute right-1 top-0 bottom-0 rounded-l-lg z-0 opacity-50"
                          style={{
                            width: '40%',
                            background: 'linear-gradient(to left, #ff4f2b, transparent)',
                            maskImage: 'linear-gradient(to left, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                          }}
                        />
                      </>
                    )}
                    <div className="flex flex-col w-full relative z-10">
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          className="text-[#f5f5f5] text-sm font-medium truncate overflow-hidden inline-block flex-1 text-left"
                          style={!isMobile ? {
                            clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                            transition: 'clip-path 300ms ease-in-out'
                          } : {}}
                        >
                          {project.name}
                        </span>
                        {isExpanded && (
                          <DropdownMenu onOpenChange={(open) => {
                            if (open) {
                              setOpenDropdownId(`project-${project.id}`)
                              if (!isMobile && !disableHoverBehavior) {
                                setIsHovered(true)
                                onHoverChange?.(true)
                              }
                            } else {
                              setOpenDropdownId(null)
                            }
                          }}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-[#666666] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              className="bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] rounded-lg z-[10000] shadow-lg min-w-[160px]"
                              align="end"
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuItem className="hover:bg-[#1a1a1a] rounded-md cursor-pointer">
                                <Pin className="w-4 h-4 mr-2" />
                                Pin
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:bg-[#1a1a1a] rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const newName = prompt('Enter new project name:', project.name)
                                  if (newName && newName.trim()) {
                                    onProjectRename?.(project.id, newName.trim())
                                  }
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:bg-[#1a1a1a] rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProjectClone?.(project.id)
                                }}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Clone
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-[#1a1a1a] rounded-md cursor-pointer">
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#1a1a1a]" />
                              <DropdownMenuItem 
                                className="hover:bg-[#1a1a1a] rounded-md cursor-pointer text-[#ff4f2b] hover:text-[#ff6b4a]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                                    onProjectDelete?.(project.id)
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-[#1a1a1a] rounded-md cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
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
                style={!isMobile ? {
                  clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                  transition: 'clip-path 300ms ease-in-out',
                  marginLeft: '28px'
                } : {
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
                className={cn(
                  "text-[#b3b3b3] hover:text-[#ff4f2b] hover:bg-[#151515] p-1 h-auto flex-shrink-0",
                  disableNewChat && "opacity-50 cursor-not-allowed hover:text-[#b3b3b3] hover:bg-transparent"
                )}
                style={{ transition: 'none', position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disableNewChat) {
                    onChatCreate?.()
                  }
                }}
                disabled={disableNewChat}
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
                    onClick={(e) => {
                      // Don't navigate if clicking on the dropdown menu area
                      if ((e.target as HTMLElement).closest('[role="menu"]') || (e.target as HTMLElement).closest('button[class*="opacity-0"]')) {
                        return
                      }
                      // Use router to navigate to chat page
                      if (propsOnChatSelect) {
                        propsOnChatSelect(chat.id)
                      } else {
                        router.push(`/chat/${chat.id}`)
                      }
                      // Close sidebar on mobile when selecting a chat
                      if (isMobile) {
                        onToggle()
                      }
                    }}
                    isActive={selectedChat === chat.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative group",
                      selectedChat === chat.id
                        ? 'bg-[#1a1a1a] border border-transparent'
                        : 'bg-[#0a0a0a] border border-transparent'
                    )}
                  >
                    {selectedChat === chat.id && (
                      <>
                        <div className="absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-[#ff4f2b] z-0" />
                        <div 
                          className="absolute right-1 top-0 bottom-0 rounded-l-lg z-0 opacity-50"
                          style={{
                            width: '40%',
                            background: 'linear-gradient(to left, #ff4f2b, transparent)',
                            maskImage: 'linear-gradient(to left, black, transparent)',
                            WebkitMaskImage: 'linear-gradient(to left, black, transparent)'
                          }}
                        />
                      </>
                    )}
                    <div className="flex flex-col w-full relative z-10">
                      <div className="flex items-center justify-between gap-2">
                        <span 
                          className="text-[#f5f5f5] text-sm font-medium truncate overflow-hidden inline-block flex-1 text-left"
                          style={!isMobile ? {
                            clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
                            transition: 'clip-path 300ms ease-in-out'
                          } : {}}
                        >
                          {chat.title}
                        </span>
                        {isExpanded && (
                          <DropdownMenu onOpenChange={(open) => {
                            if (open) {
                              setOpenDropdownId(`chat-${chat.id}`)
                              if (!isMobile && !disableHoverBehavior) {
                                setIsHovered(true)
                                onHoverChange?.(true)
                              }
                            } else {
                              setOpenDropdownId(null)
                            }
                          }}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-[#666666] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              className="bg-[#0a0a0a] border-[#1a1a1a] text-[#f5f5f5] rounded-lg z-[10000] shadow-lg min-w-[160px]"
                              align="end"
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuItem className="hover:bg-[#1a1a1a] rounded-md cursor-pointer">
                                <Pin className="w-4 h-4 mr-2" />
                                Pin
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:bg-[#1a1a1a] rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const newName = prompt('Enter new chat name:', chat.title)
                                  if (newName && newName.trim()) {
                                    onChatRename?.(chat.id, newName.trim())
                                  }
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:bg-[#1a1a1a] rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const clonedChat = cloneChat(chat.id)
                                  if (clonedChat) {
                                    onChatClone?.(chat.id)
                                    onChatsUpdate?.()
                                    // Navigate to the cloned chat
                                    if (propsOnChatSelect) {
                                      propsOnChatSelect(clonedChat.id)
                                    } else {
                                      router.push(`/chat/${clonedChat.id}`)
                                    }
                                  }
                                }}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Clone
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-[#1a1a1a] rounded-md cursor-pointer">
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#1a1a1a]" />
                              <DropdownMenuItem 
                                className="hover:bg-[#1a1a1a] rounded-md cursor-pointer text-[#ff4f2b] hover:text-[#ff6b4a]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm(`Are you sure you want to delete "${chat.title}"?`)) {
                                    deleteChat(chat.id)
                                    onChatDelete?.(chat.id)
                                    onChatsUpdate?.()
                                    // If deleted chat was selected, navigate to home
                                    if (selectedChat === chat.id) {
                                      if (propsOnChatSelect) {
                                        propsOnChatSelect(null)
                                      } else {
                                        router.push('/')
                                      }
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-[#1a1a1a] rounded-md cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
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
            style={!isMobile ? {
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out',
              marginLeft: '24px'
            } : {
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
          onClick={() => {
            onSettingsClick?.()
            // Close sidebar on mobile when opening settings
            if (isMobile) {
              onToggle()
            }
          }}
          className="w-full justify-start text-[#b3b3b3] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] p-3 h-auto relative"
        >
          <Settings
            className="w-5 h-5 flex-shrink-0"
            style={{ transition: 'none', position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <span
            className="whitespace-nowrap overflow-hidden inline-block"
            style={!isMobile ? {
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out',
              marginLeft: '24px'
            } : {
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
            style={!isMobile ? {
              clipPath: isExpanded ? 'inset(0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 300ms ease-in-out'
            } : {}}
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
    </>
  )

  // Mobile sidebar: Fixed overlay that slides in from left
  if (isMobile) {
    return (
      <>
        {/* Overlay - only visible when sidebar is open */}
        {!collapsed && (
          <div
            className="fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ease-in-out"
            onClick={onToggle}
            onTouchEnd={onToggle}
            aria-hidden="true"
          />
        )}
        
        {/* Sidebar - always render but hide when collapsed for smooth animations */}
        <div
          className={cn(
            "fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-[#0a0a0a] border-r border-[#1a1a1a] z-[70]",
            "flex flex-col h-screen transition-transform duration-300 ease-in-out",
            "shadow-2xl",
            collapsed ? "-translate-x-full" : "translate-x-0",
            collapsed && "pointer-events-none"
          )}
          onClick={(e) => {
            // Prevent clicks inside sidebar from closing it
            e.stopPropagation()
          }}
          onTouchStart={(e) => {
            // Prevent touch events from closing sidebar
            e.stopPropagation()
          }}
          aria-hidden={collapsed}
        >
          {renderSidebarContent()}
        </div>
      </>
    )
  }

  // Desktop sidebar: Collapsible with hover behavior (unless disabled)
  return (
    <div
      onMouseEnter={disableHoverBehavior ? undefined : handleMouseEnter}
      onMouseLeave={disableHoverBehavior ? undefined : handleMouseLeave}
      className="h-full"
    >
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="icon"
        className={cn(
          "h-full bg-[#0a0a0a] border-r border-[#1a1a1a] transition-all duration-300 ease-in-out",
          !collapsed && "w-64",
          collapsed && !isHovered && "w-16",
          collapsed && isHovered && !disableHoverBehavior && "w-64"
        )}
        style={{
          width: disableHoverBehavior
            ? (collapsed ? '64px' : '256px')
            : (collapsed 
                ? (isHovered ? '256px' : '64px') 
                : '256px'),
          transition: 'width 300ms ease-in-out'
        }}
      >
        {renderSidebarContent()}
      </Sidebar>
    </div>
  )
}