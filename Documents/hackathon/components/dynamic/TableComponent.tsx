'use client';

import { TableComponentData } from '@/types/components';
import { useState } from 'react';

interface TableComponentProps {
  data: TableComponentData;
}

export default function TableComponent({ data }: TableComponentProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedRows = data.sortable && sortColumn
    ? [...data.rows].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * modifier;
        }
        return String(aVal).localeCompare(String(bVal)) * modifier;
      })
    : data.rows;

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return String(value);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {data.title && (
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <h3 className="text-lg font-semibold text-zinc-900">{data.title}</h3>
          {data.description && (
            <p className="text-sm text-zinc-600 mt-1">{data.description}</p>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {data.columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-zinc-700 uppercase tracking-wider ${
                    data.sortable ? 'cursor-pointer hover:bg-zinc-100' : ''
                  }`}
                  onClick={() => data.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {data.sortable && sortColumn === column.key && (
                      <span className="text-zinc-900">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sortedRows.map((row, index) => (
              <tr key={index} className="hover:bg-zinc-50 transition-colors">
                {data.columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-zinc-900">
                    {formatValue(row[column.key], column.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedRows.length === 0 && (
        <div className="px-6 py-12 text-center text-zinc-500">
          No data available
        </div>
      )}
    </div>
  );
}
