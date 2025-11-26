'use client';

import ChatInput from './ChatInput';

interface WelcomeScreenProps {
  onSendMessage: (message: string, fileUrls?: string[], workflowId?: string) => void;
  isLoading: boolean;
}

export default function WelcomeScreen({ onSendMessage, isLoading }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-2xl w-full text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-zinc-900 mb-3 tracking-tight">
          AI Agents for Consulting
        </h1>
        <p className="text-base text-zinc-500 leading-relaxed">
          Ask questions, analyze data, or select a workflow to get started
        </p>
      </div>
      
      <div className="w-full max-w-3xl">
        <ChatInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
