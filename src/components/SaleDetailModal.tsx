import { Sale, Installment } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  Building2, 
  Car, 
  Bike, 
  Tractor, 
  Wrench, 
  Calendar, 
  User, 
  Shield, 
  Check, 
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SaleDetailModalProps {
  sale: Sale | null;
  open: boolean;
  onClose: () => void;
  onUpdateInstallment?: (saleId: string, installmentId: string, status: 'paid' | 'pending') => void;
}

export function SaleDetailModal({ sale, open, onClose, onUpdateInstallment }: SaleDetailModalProps) {
  if (!sale) return null;

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

  const ProductIcon = productIcons[sale.product];

  const getStatusConfig = (status: Installment['status']) => {
    switch (status) {
      case 'paid':
        return { 
          icon: Check, 
          label: 'Paga', 
          className: 'bg-success/10 text-success border-success/20' 
        };
      case 'pending':
        return { 
          icon: Clock, 
          label: 'Pendente', 
          className: 'bg-warning/10 text-warning border-warning/20' 
        };
      case 'overdue':
        return { 
          icon: AlertCircle, 
          label: 'Atrasada', 
          className: 'bg-destructive/10 text-destructive border-destructive/20' 
        };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <ProductIcon className="h-5 w-5" />
            </div>
            Detalhes da Venda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sale Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-semibold">{sale.clientName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Consultor</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <p className="font-semibold">{sale.consultantName}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Data da Venda</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold">{formatDate(sale.saleDate)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Produto</p>
              <Badge variant="outline" className="bg-secondary">
                {sale.product}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seguro</p>
              <div className="flex items-center gap-2">
                <Shield className={cn("h-4 w-4", sale.hasInsurance ? "text-success" : "text-muted-foreground")} />
                <p className="font-semibold">{sale.hasInsurance ? 'Sim' : 'Não'}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cotas</p>
              <p className="font-semibold">{sale.quotas}</p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Financial Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-secondary/50 space-y-1">
              <p className="text-sm text-muted-foreground">Valor Base</p>
              <p className="text-lg font-bold">{formatCurrency(sale.baseValue)}</p>
            </div>
            <div className="p-4 rounded-xl bg-success/10 border border-success/20 space-y-1">
              <p className="text-sm text-success/80">Comissão Total</p>
              <p className="text-lg font-bold text-success">{formatCurrency(sale.totalCommission)}</p>
              <p className="text-xs text-success/60">{sale.commissionPercent}%</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 space-y-1">
              <p className="text-sm text-muted-foreground">Valor Unitário</p>
              <p className="text-lg font-bold">{formatCurrency(sale.unitValue)}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
              <p className="text-sm text-primary/80">Crédito Gerado</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(sale.creditGenerated)}</p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Installments */}
          <div>
            <h4 className="font-display font-semibold mb-4">Parcelas da Comissão</h4>
            <div className="grid gap-3">
              {sale.installments.map((installment) => {
                const statusConfig = getStatusConfig(installment.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div 
                    key={installment.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground font-semibold">
                        {installment.number}
                      </div>
                      <div>
                        <p className="font-semibold">{formatCurrency(installment.value)}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {formatDate(installment.dueDate)}
                        </p>
                        {installment.paidDate && (
                          <p className="text-xs text-success">
                            Pago em: {formatDate(installment.paidDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={statusConfig.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      {onUpdateInstallment && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateInstallment(
                            sale.id, 
                            installment.id, 
                            installment.status === 'paid' ? 'pending' : 'paid'
                          )}
                        >
                          {installment.status === 'paid' ? 'Reverter' : 'Marcar Paga'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
