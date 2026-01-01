import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Save,
  Mail
} from "lucide-react";

interface SettingsProps {
  onLogout: () => void;
}

export default function Settings({ onLogout }: SettingsProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={true} userName="Admin" onLogout={onLogout} />
      
      <main className={cn(
        "transition-all duration-300 p-6 lg:p-8",
        "lg:ml-64"
      )}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 pt-12 lg:pt-0 animate-fade-in">
            <h1 className="text-3xl font-display font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as configurações do sistema
            </p>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <div className="glass rounded-xl p-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <SettingsIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Configurações Gerais</h3>
                  <p className="text-sm text-muted-foreground">Ajustes básicos do sistema</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da Empresa</Label>
                  <Input id="company" defaultValue="Consórcio Comissões" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contato</Label>
                  <Input id="email" type="email" defaultValue="contato@comissoes.com" />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-warning">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Notificações</h3>
                  <p className="text-sm text-muted-foreground">Configure alertas e avisos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de parcelas atrasadas</p>
                    <p className="text-sm text-muted-foreground">Receba notificações quando parcelas vencerem</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Resumo semanal</p>
                    <p className="text-sm text-muted-foreground">Enviar relatório por email semanalmente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Novas vendas</p>
                    <p className="text-sm text-muted-foreground">Notificar quando uma nova venda for registrada</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20 text-success">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Segurança</h3>
                  <p className="text-sm text-muted-foreground">Configurações de acesso e autenticação</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação de dois fatores</p>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Expiração de sessão</p>
                    <p className="text-sm text-muted-foreground">Desconectar após 30 minutos de inatividade</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            {/* Database Info */}
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-5/20 text-chart-5">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Banco de Dados</h3>
                  <p className="text-sm text-muted-foreground">Informações do sistema</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Vendas</p>
                  <p className="text-2xl font-bold font-display">156</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Consultores</p>
                  <p className="text-2xl font-bold font-display">6</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Parcelas</p>
                  <p className="text-2xl font-bold font-display">936</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="text-lg font-bold font-display">Agora</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Button size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
