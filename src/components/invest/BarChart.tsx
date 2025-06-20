// src/components/invest/BarChart.tsx
import React from 'react';

interface BarChartData {
    label: string;
    value: number; // percentage width
    displayValue: string;
    colorClass: string;
}

interface CustomBarChartProps {
    data: BarChartData[];
}

export const CustomBarChart = ({ data }: CustomBarChartProps) => (
    <div className="space-y-3">
        {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
                <div className="w-28 text-sm text-muted-foreground text-right flex-shrink-0">{item.label}</div>
                <div className="flex-grow bg-muted rounded-full h-6">
                    <div
                        className={`h-6 rounded-full ${item.colorClass} flex items-center px-2`}
                        style={{ width: `${item.value}%` }}
                    >
                         <span className="text-xs font-bold text-white shadow-sm">{item.displayValue}</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
