// src/components/invest/BarChart.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface BarChartData {
    label: string;
    value: number; // percentage width
    displayValue: string;
    colorClass?: string; // For in-bar layout
    badgeClass?: string; // For badge layout
    barClass?: string;   // For badge layout
}

interface CustomBarChartProps {
    data: BarChartData[];
    layout?: 'badge' | 'in-bar';
}

export const CustomBarChart = ({ data, layout = 'in-bar' }: CustomBarChartProps) => {
    if (layout === 'badge') {
        return (
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <Badge className={cn("text-xs", item.badgeClass)}>{item.displayValue}</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                            <div className={cn("h-2.5 rounded-full", item.barClass)} style={{ width: `${item.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default 'in-bar' layout
    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                    <div className="w-28 text-sm text-muted-foreground text-right flex-shrink-0">{item.label}</div>
                    <div className="flex-grow bg-muted rounded-full h-6">
                        <div
                            className={cn("h-6 rounded-full flex items-center px-2", item.colorClass)}
                            style={{ width: `${item.value}%` }}
                        >
                             <span className="text-xs font-bold text-white shadow-sm">{item.displayValue}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
