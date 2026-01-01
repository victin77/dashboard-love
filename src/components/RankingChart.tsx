import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getConsultantRanking } from '@/lib/mockData';
import { Trophy } from 'lucide-react';

export function RankingChart() {
  const ranking = getConsultantRanking();
  
  const data = ranking.map((consultant, index) => ({
    name: consultant.name,
    value: consultant.totalCommission,
    rank: index + 1,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  const colors = [
    'hsl(217, 91%, 60%)',  // Primary blue
    'hsl(217, 91%, 55%)',
    'hsl(217, 91%, 50%)',
    'hsl(217, 91%, 45%)',
    'hsl(217, 91%, 40%)',
    'hsl(217, 91%, 35%)',
  ];

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-warning">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Ranking de Consultores</h3>
          <p className="text-sm text-muted-foreground">Por comissão total</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis 
              type="number" 
              tickFormatter={formatCurrency}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: 'hsl(210, 40%, 98%)', fontSize: 13, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(217, 33%, 17%)',
                borderRadius: '8px',
                padding: '12px',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)', fontWeight: 600 }}
              formatter={(value: number) => [formatCurrency(value), 'Comissão']}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 6, 6, 0]}
              maxBarSize={30}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 highlight */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {ranking.slice(0, 3).map((consultant, index) => (
          <div 
            key={consultant.id}
            className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2"
          >
            <span className={`text-lg font-bold ${
              index === 0 ? 'text-warning' : 
              index === 1 ? 'text-muted-foreground' : 
              'text-warning/60'
            }`}>
              #{index + 1}
            </span>
            <span className="text-sm font-medium truncate">{consultant.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
