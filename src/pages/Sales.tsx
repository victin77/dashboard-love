import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SalesTable } from "@/components/SalesTable";
import { SaleDetailModal } from "@/components/SaleDetailModal";
import { sales as allSales, Sale, getConsultants } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Search, FileDown, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SalesProps {
  isAdmin: boolean;
  userName: string;
  consultantId?: string;
  onLogout: () => void;
}

export default function Sales({ isAdmin, userName, consultantId, onLogout }: SalesProps) {
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [consultantFilter, setConsultantFilter] = useState<string>("all");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const consultants = getConsultants();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
    toast.success("Dados atualizados!");
  };

  const filteredSales = useMemo(() => {
    let result = isAdmin ? allSales : allSales.filter(s => s.consultantId === consultantId);

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(s => 
        s.clientName.toLowerCase().includes(searchLower) ||
        s.consultantName.toLowerCase().includes(searchLower)
      );
    }

    if (productFilter !== "all") {
      result = result.filter(s => s.product === productFilter);
    }

    if (consultantFilter !== "all" && isAdmin) {
      result = result.filter(s => s.consultantId === consultantFilter);
    }

    return result;
  }, [search, productFilter, consultantFilter, isAdmin, consultantId]);

  const handleUpdateInstallment = (saleId: string, installmentId: string, status: 'paid' | 'pending') => {
    console.log(`Updating installment ${installmentId} of sale ${saleId} to ${status}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} userName={userName} onLogout={onLogout} />
      
      <main className={cn(
        "transition-all duration-300 p-6 lg:p-8",
        "lg:ml-64"
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pt-12 lg:pt-0">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-display font-bold">Vendas</h1>
              <p className="text-muted-foreground mt-1">
                {isAdmin 
                  ? `${filteredSales.length} vendas encontradas`
                  : `Suas ${filteredSales.length} vendas`
                }
              </p>
            </div>
            <div className="flex gap-3 animate-fade-in">
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
                Exportar
              </Button>
              <Button className="gap-2 gradient-primary hover:opacity-90 glow-primary hover-lift">
                <Plus className="h-4 w-4" />
                Nova Venda
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="glass rounded-2xl p-4 mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou consultor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Imóvel">Imóvel</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                    <SelectItem value="Moto">Moto</SelectItem>
                    <SelectItem value="Agro">Agro</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                  </SelectContent>
                </Select>

                {isAdmin && (
                  <Select value={consultantFilter} onValueChange={setConsultantFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Consultor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {consultants.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <SalesTable 
            sales={filteredSales}
            isAdmin={isAdmin}
            onView={setSelectedSale}
            onEdit={isAdmin ? (sale) => console.log('Edit', sale) : undefined}
            onDelete={isAdmin ? (sale) => console.log('Delete', sale) : undefined}
          />

          {/* Empty state */}
          {filteredSales.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Nenhuma venda encontrada</h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar os filtros ou cadastre uma nova venda
              </p>
              <Button className="gap-2 gradient-primary">
                <Plus className="h-4 w-4" />
                Nova Venda
              </Button>
            </div>
          )}
        </div>
      </main>

      <SaleDetailModal
        sale={selectedSale}
        open={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        onUpdateInstallment={handleUpdateInstallment}
      />
    </div>
  );
}
