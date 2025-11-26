import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Message } from '@/types';
import FileAttachment from './FileAttachment';
import DynamicComponent from './DynamicComponent';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'USER';
  const content = message.content;

  // Debug logging for component data
  if (!isUser && message.componentData) {
    console.log('🎨 ChatMessage rendering component:', {
      type: message.componentData.type,
      title: message.componentData.title,
      cards: message.componentData.cards?.length || 0,
      rows: message.componentData.rows?.length || 0
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="py-6 bg-white"
    >
      <div className="max-w-3xl mx-auto px-4">
        {isUser ? (
          // User message - minimal flat design
          <div className="flex justify-end mb-4">
            <div className="max-w-sm lg:max-w-lg xl:max-w-xl">
              <div className="border border-zinc-200 rounded-lg bg-zinc-50 px-4 py-3">
                <div className="prose prose-sm max-w-none text-zinc-900">
                  <ReactMarkdown>
                    {content}
                  </ReactMarkdown>
                </div>
                
                {/* File Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((file) => (
                        <FileAttachment key={file.id} file={file} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // AI message - minimal flat design
          <div className="flex justify-start mb-4">
            <div className="max-w-full">
              {/* Tool Usage Indicator - Minimal */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                  className="mb-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                >
                  <div className="flex items-center gap-2 text-sm text-zinc-700 mb-2">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Used real-time data from Crustdata</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.toolCalls.map((call, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25,
                          delay: 0.15 + (index * 0.05)
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md text-xs text-zinc-600 border border-zinc-200"
                      >
                        <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {call.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div className="prose max-w-none text-zinc-900">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
              
              {/* Render dynamic component if present */}
              {message.componentData && (
                <div className="mt-4">
                  <DynamicComponent data={message.componentData} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
