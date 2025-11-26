'use client';

import { ChartComponentData } from '@/types/components';

interface ChartComponentProps {
  data: ChartComponentData;
}

export default function ChartComponent({ data }: ChartComponentProps) {
  const maxValue = Math.max(...data.data.map(d => d.value));

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
      
      <div className="space-y-4">
        {data.data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-zinc-900">{item.label}</span>
                <span className="text-zinc-600">
                  {new Intl.NumberFormat('en-US').format(item.value)}
                </span>
              </div>
              <div className="h-8 bg-zinc-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-zinc-900 transition-all duration-500 ease-out flex items-center justify-end pr-3"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && (
                    <span className="text-xs font-medium text-white">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {data.xAxisLabel && data.yAxisLabel && (
        <div className="mt-6 flex justify-between text-xs text-zinc-500">
          <span>{data.yAxisLabel}</span>
          <span>{data.xAxisLabel}</span>
        </div>
      )}
    </div>
  );
}
