"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FC } from 'react'; // Import FC for functional component type

interface ResultDataPoint {
  name: string;
  score: number;
  date: string;
}

interface ResultsChartProps {
  data: ResultDataPoint[];
}

export const ResultsChart: FC<ResultsChartProps> = ({ data }) => {
  // const [isClient, setIsClient] = useState(false);
  // useEffect(() => { setIsClient(true); }, []);
  // if (!isClient) return <div className="h-[300px] bg-muted rounded-lg animate-pulse" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
        />
        <Legend wrapperStyle={{ fontSize: 14, paddingTop: '10px' }} />
        <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Score (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};
