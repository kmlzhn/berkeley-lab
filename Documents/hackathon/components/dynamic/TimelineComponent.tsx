'use client';

import { TimelineComponentData } from '@/types/components';

interface TimelineComponentProps {
  data: TimelineComponentData;
}

export default function TimelineComponent({ data }: TimelineComponentProps) {
  const getEventIcon = (type?: string) => {
    switch (type) {
      case 'funding': return '💰';
      case 'milestone': return '🎯';
      case 'launch': return '🚀';
      case 'acquisition': return '🤝';
      default: return '•';
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      {data.title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-900">{data.title}</h3>
          {data.description && (
            <p className="text-sm text-zinc-600 mt-1">{data.description}</p>
          )}
        </div>
      )}
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200"></div>
        
        {/* Events */}
        <div className="space-y-6">
          {data.events.map((event, index) => (
            <div key={index} className="relative pl-12">
              {/* Event dot */}
              <div className="absolute left-0 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-sm">
                {getEventIcon(event.type)}
              </div>
              
              {/* Event content */}
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-zinc-900">{event.title}</h4>
                  <span className="text-xs text-zinc-500 whitespace-nowrap ml-4">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-sm text-zinc-600 mb-2">{event.description}</p>
                )}
                
                {event.amount && (
                  <div className="inline-flex items-center px-2 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-md font-medium">
                    {event.amount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}