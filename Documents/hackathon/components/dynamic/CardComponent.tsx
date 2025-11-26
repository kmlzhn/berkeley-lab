'use client';

import { CardComponentData } from '@/types/components';

interface CardComponentProps {
  data: CardComponentData;
}

export default function CardComponent({ data }: CardComponentProps) {
  const isGrid = data.layout === 'grid' || !data.layout;
  
  return (
    <div className="space-y-4">
      {data.title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-zinc-900">{data.title}</h3>
          {data.description && (
            <p className="text-sm text-zinc-600 mt-1">{data.description}</p>
          )}
        </div>
      )}
      
      <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {data.cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 transition-colors"
          >
            {card.image && (
              <div className="w-16 h-16 rounded-lg bg-zinc-900 mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {card.title.charAt(0)}
              </div>
            )}
            
            <h4 className="font-semibold text-zinc-900 mb-1">{card.title}</h4>
            {card.subtitle && (
              <p className="text-sm text-zinc-600 mb-3">{card.subtitle}</p>
            )}
            
            {card.metrics && card.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {card.metrics.map((metric, index) => (
                  <div key={index} className="">
                    <div className="text-xs text-zinc-500">{metric.label}</div>
                    <div className="text-lg font-semibold text-zinc-900 flex items-center gap-1">
                      {metric.value}
                      {metric.trend && (
                        <span className="text-xs text-zinc-500">
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {card.description && (
              <p className="text-sm text-zinc-600 line-clamp-2">{card.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}