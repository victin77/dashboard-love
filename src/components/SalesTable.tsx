import { Sale } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, Edit, Trash2, Building2, Car, Bike, Tractor, Wrench } from "lucide-react";

interface SalesTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onEdit?: (sale: Sale) => void;
  onDelete?: (sale: Sale) => void;
  isAdmin?: boolean;
}

export function SalesTable({ sales, onView, onEdit, onDelete, isAdmin }: SalesTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const productIcons: Record<Sale['product'], typeof Building2> = {
    'Imóvel': Building2,
    'Auto': Car,
    'Moto': Bike,
    'Agro': Tractor,
    'Serviços': Wrench,
  };

  const getInstallmentStats = (sale: Sale) => {
    const paid = sale.installments.filter(i => i.status === 'paid').length;
    const pending = sale.installments.filter(i => i.status === 'pending').length;
    const overdue = sale.installments.filter(i => i.status === 'overdue').length;
    return { paid, pending, overdue };
  };

  return (
    <div className="glass rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold">Cliente</TableHead>
            {isAdmin && <TableHead className="text-muted-foreground font-semibold">Consultor</TableHead>}
            <TableHead className="text-muted-foreground font-semibold">Produto</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Data</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Valor Base</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Comissão</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-center">Parcelas</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale, index) => {
            const ProductIcon = productIcons[sale.product];
            const stats = getInstallmentStats(sale);
            
            return (
              <TableRow 
                key={sale.id} 
                className="border-border hover:bg-accent/50 transition-colors cursor-pointer"
                style={{ animationDelay: `${300 + index * 50}ms` }}
                onClick={() => onView(sale)}
              >
                <TableCell className="font-medium">{sale.clientName}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {sale.consultantName.charAt(0)}
                      </div>
                      <span>{sale.consultantName}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ProductIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{sale.product}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(sale.saleDate)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(sale.baseValue)}</TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-success">{formatCurrency(sale.totalCommission)}</span>
                  <span className="text-xs text-muted-foreground ml-1">({sale.commissionPercent}%)</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {stats.paid > 0 && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                        {stats.paid}
                      </Badge>
                    )}
                    {stats.pending > 0 && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                        {stats.pending}
                      </Badge>
                    )}
                    {stats.overdue > 0 && (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                        {stats.overdue}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(sale)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onEdit && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(sale)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(sale)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
