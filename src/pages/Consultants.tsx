import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getConsultants, addConsultant, removeConsultant, updateConsultantPassword, toggleConsultantStatus, Consultant } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Mail, TrendingUp, ShoppingCart, MoreVertical, UserPlus, Trash2, Key, RefreshCw, X, Check, UserX, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ConsultantsProps {
  onLogout: () => void;
}

export default function Consultants({ onLogout }: ConsultantsProps) {
  const [consultants, setConsultants] = useState<Consultant[]>(getConsultants());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Add consultant modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [changePassword, setChangePassword] = useState("");
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState<Consultant | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setConsultants([...getConsultants()]);
    setIsRefreshing(false);
    toast.success("Dados atualizados!");
  };

  const handleAddConsultant = () => {
    if (!newName.trim() || !newPassword.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    const consultant = addConsultant(newName, newPassword);
    setConsultants([...getConsultants()]);
    setShowAddModal(false);
    setNewName("");
    setNewPassword("");
    toast.success(`Consultor ${consultant.name} adicionado!`);
  };

  const handleChangePassword = () => {
    if (!changePassword.trim() || !selectedConsultant) {
      toast.error("Digite a nova senha");
      return;
    }
    
    updateConsultantPassword(selectedConsultant.id, changePassword);
    setConsultants([...getConsultants()]);
    setShowPasswordModal(false);
    setSelectedConsultant(null);
    setChangePassword("");
    toast.success("Senha alterada com sucesso!");
  };

  const handleDeleteConsultant = () => {
    if (!consultantToDelete) return;
    
    removeConsultant(consultantToDelete.id);
    setConsultants([...getConsultants()]);
    setShowDeleteModal(false);
    setConsultantToDelete(null);
    toast.success("Consultor removido!");
  };

  const handleToggleStatus = (consultant: Consultant) => {
    toggleConsultantStatus(consultant.id);
    setConsultants([...getConsultants()]);
    toast.success(consultant.active ? "Consultor desativado" : "Consultor ativado");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={true} userName="Admin" onLogout={onLogout} />
      
      <main className={cn(
        "transition-all duration-300 p-6 lg:p-8",
        "lg:ml-64"
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pt-12 lg:pt-0">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-display font-bold">Consultores</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie os consultores do sistema
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
              <Button 
                className="gap-2 gradient-primary hover:opacity-90 glow-primary hover-lift"
                onClick={() => setShowAddModal(true)}
              >
                <UserPlus className="h-4 w-4" />
                Novo Consultor
              </Button>
            </div>
          </div>

          {/* Consultants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((consultant, index) => (
              <div 
                key={consultant.id}
                className="glass rounded-2xl p-6 animate-slide-up interactive-card"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-chart-5/30 text-foreground text-xl font-bold font-display">
                      {consultant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg">{consultant.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {consultant.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass border-border">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedConsultant(consultant);
                          setShowPasswordModal(true);
                        }}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Alterar Senha
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(consultant)}>
                        {consultant.active ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setConsultantToDelete(consultant);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      consultant.active 
                        ? "bg-success/10 text-success border-success/20" 
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    )}
                  >
                    {consultant.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-xs">Vendas</span>
                    </div>
                    <p className="text-xl font-bold font-display">{consultant.totalSales}</p>
                  </div>
                  <div className="bg-success/10 rounded-xl p-3 border border-success/20">
                    <div className="flex items-center gap-2 text-success/80 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Comissão</span>
                    </div>
                    <p className="text-xl font-bold font-display text-success">
                      {formatCurrency(consultant.totalCommission)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Consultant Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="glass-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Novo Consultor</DialogTitle>
            <DialogDescription>
              Adicione um novo consultor ao sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Nome do consultor"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha de acesso"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddConsultant} className="gradient-primary">
              <Check className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="glass-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Alterar Senha</DialogTitle>
            <DialogDescription>
              Nova senha para {selectedConsultant?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite a nova senha"
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} className="gradient-primary">
              <Key className="h-4 w-4 mr-2" />
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="glass-strong border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-destructive">Excluir Consultor</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {consultantToDelete?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConsultant}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
