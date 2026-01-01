export type UserRole = 'admin' | 'consultant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Consultant {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  isActive: boolean;
  totalSales: number;
  totalCommission: number;
  avatar?: string;
}

export interface Sale {
  id: string;
  consultantId: string;
  consultantName: string;
  clientName: string;
  product: 'Imóvel' | 'Auto' | 'Moto' | 'Agro' | 'Serviços';
  saleDate: string;
  baseValue: number;
  commissionPercent: number;
  totalCommission: number;
  quotas: number;
  unitValue: number;
  creditGenerated: number;
  hasInsurance: boolean;
  installments: Installment[];
}

export interface Installment {
  id: string;
  saleId: string;
  number: number;
  value: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

// Initial consultants with passwords
export const initialConsultants: Consultant[] = [
  { id: '1', name: 'Graziele', email: 'graziele@comissoes.com', password: 'graziele123', active: true, isActive: true, totalSales: 45, totalCommission: 125000 },
  { id: '2', name: 'Gustavo', email: 'gustavo@comissoes.com', password: 'gustavo123', active: true, isActive: true, totalSales: 38, totalCommission: 98000 },
  { id: '3', name: 'Pedro', email: 'pedro@comissoes.com', password: 'pedro123', active: true, isActive: true, totalSales: 52, totalCommission: 145000 },
  { id: '4', name: 'Poli', email: 'poli@comissoes.com', password: 'poli123', active: true, isActive: true, totalSales: 29, totalCommission: 78000 },
  { id: '5', name: 'Marcelo', email: 'marcelo@comissoes.com', password: 'marcelo123', active: true, isActive: true, totalSales: 41, totalCommission: 112000 },
  { id: '6', name: 'Victor', email: 'victor@comissoes.com', password: 'victor123', active: true, isActive: true, totalSales: 35, totalCommission: 89000 },
];

// Admin password
export const ADMIN_PASSWORD = 'admin123';

// Mutable consultants array for managing add/remove
let consultants: Consultant[] = [...initialConsultants];

// Export for new Login component
export const mockConsultants = consultants;

export const getConsultants = () => consultants;

export const addConsultant = (name: string, password: string): Consultant => {
  const newConsultant: Consultant = {
    id: String(Date.now()),
    name,
    email: `${name.toLowerCase().replace(/\s/g, '')}@comissoes.com`,
    password,
    active: true,
    isActive: true,
    totalSales: 0,
    totalCommission: 0,
  };
  consultants = [...consultants, newConsultant];
  return newConsultant;
};

export const removeConsultant = (id: string): boolean => {
  const index = consultants.findIndex(c => c.id === id);
  if (index > -1) {
    consultants = consultants.filter(c => c.id !== id);
    return true;
  }
  return false;
};

export const updateConsultantPassword = (id: string, newPassword: string): boolean => {
  const consultant = consultants.find(c => c.id === id);
  if (consultant) {
    consultant.password = newPassword;
    return true;
  }
  return false;
};

export const toggleConsultantStatus = (id: string): boolean => {
  const consultant = consultants.find(c => c.id === id);
  if (consultant) {
    consultant.active = !consultant.active;
    consultant.isActive = consultant.active;
    return true;
  }
  return false;
};

const generateInstallments = (saleId: string, totalCommission: number, saleDate: string): Installment[] => {
  const installmentValue = totalCommission / 6;
  const baseDateObj = new Date(saleDate);
  
  return Array.from({ length: 6 }, (_, i) => {
    const dueDate = new Date(baseDateObj);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    const today = new Date();
    const isPast = dueDate < today;
    const isPaid = Math.random() > 0.5;
    
    return {
      id: `${saleId}-inst-${i + 1}`,
      saleId,
      number: i + 1,
      value: installmentValue,
      dueDate: dueDate.toISOString().split('T')[0],
      status: isPaid ? 'paid' : (isPast ? 'overdue' : 'pending'),
      paidDate: isPaid ? new Date(dueDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    };
  });
};

const products: Sale['product'][] = ['Imóvel', 'Auto', 'Moto', 'Agro', 'Serviços'];
const clientNames = [
  'João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Paulo Ferreira',
  'Lucia Almeida', 'Roberto Souza', 'Fernanda Lima', 'Marcos Pereira', 'Juliana Rocha',
  'André Mendes', 'Camila Ribeiro', 'Ricardo Gomes', 'Patricia Martins', 'Bruno Carvalho'
];

export const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  const currentConsultants = getConsultants();
  
  currentConsultants.forEach(consultant => {
    const numSales = Math.floor(Math.random() * 8) + 3;
    
    for (let i = 0; i < numSales; i++) {
      const baseValue = Math.floor(Math.random() * 200000) + 50000;
      const commissionPercent = Math.floor(Math.random() * 5) + 3;
      const totalCommission = (baseValue * commissionPercent) / 100;
      const quotas = Math.floor(Math.random() * 10) + 1;
      
      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 180));
      const saleDateStr = saleDate.toISOString().split('T')[0];
      
      const saleId = `sale-${consultant.id}-${i}`;
      
      sales.push({
        id: saleId,
        consultantId: consultant.id,
        consultantName: consultant.name,
        clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
        product: products[Math.floor(Math.random() * products.length)],
        saleDate: saleDateStr,
        baseValue,
        commissionPercent,
        totalCommission,
        quotas,
        unitValue: baseValue / quotas,
        creditGenerated: baseValue * 0.8,
        hasInsurance: Math.random() > 0.5,
        installments: generateInstallments(saleId, totalCommission, saleDateStr),
      });
    }
  });
  
  return sales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
};

export let sales = generateSales();

export const refreshSales = () => {
  sales = generateSales();
  return sales;
};

export const calculateDashboardStats = (salesData: Sale[], consultantId?: string) => {
  const filteredSales = consultantId 
    ? salesData.filter(s => s.consultantId === consultantId)
    : salesData;
  
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const salesToday = filteredSales.filter(s => s.saleDate === today);
  const salesWeek = filteredSales.filter(s => s.saleDate >= weekAgo);
  const salesMonth = filteredSales.filter(s => s.saleDate >= monthStart);
  
  const allInstallments = filteredSales.flatMap(s => s.installments);
  const paidInstallments = allInstallments.filter(i => i.status === 'paid');
  const pendingInstallments = allInstallments.filter(i => i.status === 'pending');
  const overdueInstallments = allInstallments.filter(i => i.status === 'overdue');
  
  return {
    salesToday: salesToday.length,
    commissionToday: salesToday.reduce((sum, s) => sum + s.totalCommission, 0),
    salesWeek: salesWeek.length,
    commissionMonth: salesMonth.reduce((sum, s) => sum + s.totalCommission, 0),
    pendingCount: pendingInstallments.length,
    overdueCount: overdueInstallments.length,
    totalCommission: filteredSales.reduce((sum, s) => sum + s.totalCommission, 0),
    totalPaid: paidInstallments.reduce((sum, i) => sum + i.value, 0),
    totalPending: pendingInstallments.reduce((sum, i) => sum + i.value, 0),
    totalOverdue: overdueInstallments.reduce((sum, i) => sum + i.value, 0),
    totalCredit: filteredSales.reduce((sum, s) => sum + s.creditGenerated, 0),
    installmentStats: {
      paid: paidInstallments.length,
      pending: pendingInstallments.length,
      overdue: overdueInstallments.length,
    },
  };
};

export const getConsultantRanking = () => {
  return [...getConsultants()].filter(c => c.active).sort((a, b) => b.totalCommission - a.totalCommission);
};
