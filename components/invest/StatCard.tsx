// src/components/invest/StatCard.tsx
import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    value: string;
    label: string;
}

export const StatCard = ({ icon, value, label }: StatCardProps) => (
    <div className="flex items-center gap-4 rounded-lg bg-primary/10 p-4 border border-primary/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    </div>
);
