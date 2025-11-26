import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Trash2,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RenameModal from './RenameModal';
import { useChatContext } from '@/contexts/ChatContext';
import { Chat } from '@/types';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export default function Sidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat,
  onDeleteChat,
  onRenameChat
}: SidebarProps) {
  const { sidebarOpen: isOpen, setSidebarOpen: setIsOpen } = useChatContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [chatToRename, setChatToRename] = useState<{id: string, title: string} | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const getIconForChat = () => {
    return MessageSquare;
  };

  const handleRenameClick = (chat: Chat) => {
    setChatToRename({ id: chat.id, title: chat.title });
  };

  const handleRenameSubmit = async (newTitle: string) => {
    if (chatToRename) {
      setIsRenaming(true);
      try {
        await onRenameChat(chatToRename.id, newTitle);
        setChatToRename(null);
      } catch (error) {
        console.error('Failed to rename chat:', error);
      } finally {
        setIsRenaming(false);
      }
    }
  };

  const handleRenameClose = () => {
    setChatToRename(null);
    setIsRenaming(false);
  };


  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden h-16 px-4 flex items-center justify-between bg-white border-b border-zinc-200">
        <h1 className="font-sans text-lg font-normal text-zinc-900">Welcome!</h1>
        <motion.button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        className="hidden md:flex h-full bg-white border-r border-zinc-200 flex-shrink-0"
        animate={{
          width: isOpen ? "280px" : "60px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center justify-between h-8">
              <motion.h1
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="font-sans text-lg font-normal text-zinc-900 whitespace-nowrap"
                style={{ display: isOpen ? "block" : "none" }}
              >
                Welcome!
              </motion.h1>
              
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 flex-shrink-0"
              >
                {isOpen ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-hidden p-2">
            <div className="h-8 flex items-center justify-between mb-4 px-2">
              <motion.h2
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-xs font-medium text-zinc-500 uppercase tracking-wide whitespace-nowrap"
                style={{ display: isOpen ? "block" : "none" }}
              >
                Chats
              </motion.h2>
              
              <motion.button
                onClick={onNewChat}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg flex items-center justify-center p-1.5 flex-shrink-0"
              >
                <Plus className="w-3 h-3" />
              </motion.button>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-1">
              {chats.map((chat) => {
                const IconComponent = getIconForChat();
                
                return (
                  <motion.div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer group",
                      currentChatId === chat.id 
                        ? 'bg-zinc-100' 
                        : 'hover:bg-zinc-50'
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                      currentChatId === chat.id
                        ? 'text-zinc-900'
                        : 'text-zinc-500'
                    )}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <motion.div
                      initial={false}
                      animate={{
                        display: isOpen ? "flex" : "none",
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="flex-1 min-w-0 flex items-center justify-between overflow-hidden"
                    >
                      <h3 className={cn(
                        "font-normal truncate text-sm",
                        currentChatId === chat.id ? 'text-zinc-900' : 'text-zinc-700'
                      )}>
                        {chat.title}
                      </h3>
                      
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <motion.button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleRenameClick(chat);
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-400 hover:text-zinc-900"
                          title="Rename"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setChatToDelete(chat.id); 
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
              
              {chats.length === 0 && isOpen && (
                <div className="text-center py-8 px-2">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 text-zinc-300" />
                  <p className="text-sm text-zinc-600">
                    No chats yet
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Click + to start
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-50 flex flex-col md:hidden"
          >
            <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200">
              <h1 className="font-sans text-lg font-normal text-zinc-900">Welcome!</h1>
              <motion.button
                onClick={() => setIsMobileOpen(false)}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="flex-1 overflow-hidden p-4">
              <motion.button
                onClick={() => {
                  onNewChat();
                  setIsMobileOpen(false);
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg flex items-center justify-center gap-2 font-medium mb-6"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </motion.button>
              
              <h2 className="text-xs font-medium text-zinc-500 mb-3 px-1 uppercase tracking-wide">
                Chats
              </h2>
              
              <div className="overflow-y-auto space-y-1">
                {chats.map((chat) => {
                  const IconComponent = getIconForChat();
                  
                  return (
                    <motion.div
                      key={chat.id}
                      onClick={() => {
                        onSelectChat(chat.id);
                        setIsMobileOpen(false);
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer group",
                        currentChatId === chat.id 
                          ? 'bg-zinc-100' 
                          : 'hover:bg-zinc-50'
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8",
                        currentChatId === chat.id
                          ? 'text-zinc-900'
                          : 'text-zinc-500'
                      )}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-normal truncate text-sm",
                          currentChatId === chat.id ? 'text-zinc-900' : 'text-zinc-700'
                        )}>
                          {chat.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-0.5">
                        <motion.button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleRenameClick(chat);
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-zinc-400 hover:text-zinc-900"
                          title="Rename"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setChatToDelete(chat.id); 
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-zinc-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-zinc-900/20 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {chatToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-zinc-900/20 z-50 flex items-center justify-center p-6"
            onClick={() => setChatToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm border border-zinc-200 rounded-xl w-full mx-auto bg-white"
            >
              <div className="flex flex-col p-6">
                <h3 className="font-sans text-lg font-normal text-zinc-900 mb-2">
                  Delete Chat?
                </h3>
                <p className="text-sm text-zinc-600 mb-6">
                  This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setChatToDelete(null)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      onDeleteChat(chatToDelete);
                      setChatToDelete(null);
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <RenameModal
        isOpen={!!chatToRename}
        currentTitle={chatToRename?.title || ''}
        onClose={handleRenameClose}
        onRename={handleRenameSubmit}
        isLoading={isRenaming}
      />
    </>
  );
}