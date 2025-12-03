'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  onRangeChange?: (range: string) => void;
}

export default function DateRangeSelector({ onRangeChange }: DateRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState('24M');

  const ranges = [
    { label: '6 Months', value: '6M' },
    { label: '12 Months', value: '12M' },
    { label: '24 Months', value: '24M' },
    { label: '36 Months', value: '36M' },
    { label: 'All Time', value: 'ALL' },
  ];

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-slate-400" />
      <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1 border border-slate-600">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              selectedRange === range.value
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-600'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}

