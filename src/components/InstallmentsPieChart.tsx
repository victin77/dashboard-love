import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface InstallmentsPieChartProps {
  paid: number;
  pending: number;
  overdue: number;
}

export function InstallmentsPieChart({ paid, pending, overdue }: InstallmentsPieChartProps) {
  const data = [
    { name: 'Pagas', value: paid, color: 'hsl(142, 76%, 45%)' },
    { name: 'Pendentes', value: pending, color: 'hsl(38, 92%, 50%)' },
    { name: 'Atrasadas', value: overdue, color: 'hsl(0, 84%, 60%)' },
  ];

  const total = paid + pending + overdue;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="glass rounded-lg px-4 py-2 border border-border">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {item.value} parcelas ({((item.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <PieChartIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Status das Parcelas</h3>
          <p className="text-sm text-muted-foreground">{total} parcelas no total</p>
        </div>
      </div>

      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: '-20px' }}>
          <div className="text-center">
            <p className="text-3xl font-bold font-display">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* Stats below */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 rounded-lg bg-success/10 border border-success/20">
          <p className="text-2xl font-bold text-success">{paid}</p>
          <p className="text-xs text-success/80">Pagas</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-2xl font-bold text-warning">{pending}</p>
          <p className="text-xs text-warning/80">Pendentes</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-2xl font-bold text-destructive">{overdue}</p>
          <p className="text-xs text-destructive/80">Atrasadas</p>
        </div>
      </div>
    </div>
  );
}
