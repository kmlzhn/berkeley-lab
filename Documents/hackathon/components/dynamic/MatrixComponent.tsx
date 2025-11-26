'use client';

import { MatrixComponentData } from '@/types/components';

interface MatrixComponentProps {
  data: MatrixComponentData;
}

export default function MatrixComponent({ data }: MatrixComponentProps) {
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
      
      <div className="relative w-full aspect-square bg-zinc-50 rounded-lg p-8">
        {/* Axis labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-zinc-700">
          {data.yAxis.max}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-zinc-700">
          {data.yAxis.min}
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-700 -rotate-90">
          {data.xAxis.min}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-700 -rotate-90">
          {data.xAxis.max}
        </div>
        
        {/* Quadrant lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-zinc-300"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-zinc-300"></div>
        </div>
        
        {/* Quadrant labels */}
        <div className="absolute top-4 left-4 text-xs font-medium text-zinc-500">
          {data.quadrants.topLeft.label}
        </div>
        <div className="absolute top-4 right-4 text-xs font-medium text-zinc-500">
          {data.quadrants.topRight.label}
        </div>
        <div className="absolute bottom-4 left-4 text-xs font-medium text-zinc-500">
          {data.quadrants.bottomLeft.label}
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-medium text-zinc-500">
          {data.quadrants.bottomRight.label}
        </div>
        
        {/* Plot items */}
        <div className="relative w-full h-full">
          {Object.values(data.quadrants).flatMap(quadrant => 
            quadrant.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="absolute w-3 h-3 bg-zinc-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer group"
                style={{
                  left: `${item.x}%`,
                  top: `${100 - item.y}%`
                }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Axis labels */}
      <div className="mt-4 flex justify-between text-xs text-zinc-600">
        <span>{data.xAxis.label}</span>
        <span>{data.yAxis.label}</span>
      </div>
    </div>
  );
}