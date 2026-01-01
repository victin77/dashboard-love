import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { RankingChart } from "@/components/RankingChart";
import { InstallmentsPieChart } from "@/components/InstallmentsPieChart";
import { sales, calculateDashboardStats, refreshSales } from "@/lib/mockData";
import { 
  ShoppingCart, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CreditCard,
  Wallet,
  FileDown,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardProps {
  isAdmin: boolean;
  userName: string;
  consultantId?: string;
  onLogout: () => void;
}

export default function Dashboard({ isAdmin, userName, consultantId, onLogout }: DashboardProps) {
  const [salesData, setSalesData] = useState(sales);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const stats = calculateDashboardStats(salesData, isAdmin ? undefined : consultantId);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSales = refreshSales();
    setSalesData(newSales);
    setIsRefreshing(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background noise">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />
      
      <Sidebar isAdmin={isAdmin} userName={userName} onLogout={onLogout} />
      
      <main className={cn(
        "relative transition-all duration-300 p-6 lg:p-8",
        "lg:ml-64"
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pt-12 lg:pt-0">
            <div className="animate-blur-in">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight">Visão Geral</h1>
              <p className="text-muted-foreground mt-2">
                {isAdmin 
                  ? 'Acompanhe o desempenho geral de vendas e comissões'
                  : 'Acompanhe suas vendas e comissões'
                }
              </p>
            </div>
            <div className="flex gap-3 animate-blur-in" style={{ animationDelay: '100ms' }}>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover-lift"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
              <Button variant="outline" className="gap-2 hover-lift">
                <FileDown className="h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Vendas Hoje"
              value={stats.salesToday}
              subtitle={`${formatCurrency(stats.commissionToday)} em comissão`}
              icon={ShoppingCart}
              variant="default"
              delay={0}
            />
            <StatCard
              title="Vendas (7 dias)"
              value={stats.salesWeek}
              subtitle="Últimos 7 dias"
              icon={Calendar}
              variant="default"
              delay={100}
            />
            <StatCard
              title="Parcelas Pendentes"
              value={stats.pendingCount}
              subtitle={formatCurrency(stats.totalPending)}
              icon={Clock}
              variant="warning"
              delay={200}
            />
            <StatCard
              title="Parcelas Atrasadas"
              value={stats.overdueCount}
              subtitle={formatCurrency(stats.totalOverdue)}
              icon={AlertCircle}
              variant="destructive"
              delay={300}
            />
          </div>

          {/* Financial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-2xl p-6 animate-slide-up hover-lift interactive-card" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Comissão Total</span>
              </div>
              <p className="text-3xl font-bold font-display">{formatCurrency(stats.totalCommission)}</p>
            </div>

            <div className="glass rounded-2xl p-6 animate-slide-up hover-lift interactive-card" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total Pago</span>
              </div>
              <p className="text-3xl font-bold font-display text-success">{formatCurrency(stats.totalPaid)}</p>
            </div>

            <div className="glass rounded-2xl p-6 animate-slide-up hover-lift interactive-card" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20 text-warning">
                  <DollarSign className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total Pendente</span>
              </div>
              <p className="text-3xl font-bold font-display text-warning">{formatCurrency(stats.totalPending)}</p>
            </div>

            <div className="glass rounded-2xl p-6 animate-slide-up hover-lift interactive-card" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/20 text-chart-5">
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Crédito Gerado</span>
              </div>
              <p className="text-3xl font-bold font-display">{formatCurrency(stats.totalCredit)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isAdmin && <RankingChart />}
            <InstallmentsPieChart 
              paid={stats.installmentStats.paid}
              pending={stats.installmentStats.pending}
              overdue={stats.installmentStats.overdue}
            />
            {!isAdmin && (
              <div className="glass rounded-2xl p-6 animate-slide-up hover-lift" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg">Comissão do Mês</h3>
                    <p className="text-sm text-muted-foreground">Mês atual</p>
                  </div>
                </div>
                <div className="text-center py-8">
                  <p className="text-5xl font-bold font-display text-success mb-2 animate-pulse-glow">
                    {formatCurrency(stats.commissionMonth)}
                  </p>
                  <p className="text-muted-foreground">em comissões este mês</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
