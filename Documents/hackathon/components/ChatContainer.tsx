import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';
import { useChatContext } from '@/contexts/ChatContext';
import { motion } from 'framer-motion';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isWorkflowDropdownOpen } = useChatContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div 
      className="flex-1 overflow-y-auto bg-white"
      animate={{ 
        paddingBottom: isWorkflowDropdownOpen ? 450 : 128 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-md">
            <p className="text-lg text-zinc-500 mb-6">
              Welcome to ConsultGPT! Select a WorkStream or start a conversation to begin.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="py-6 bg-white"
            >
              <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                  <span className="text-sm text-zinc-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </motion.div>
  );
}
