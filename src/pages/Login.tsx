import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ParticleField from '@/components/ParticleField';
import { mockConsultants, ADMIN_PASSWORD } from '@/lib/mockData';

type Step = 'role' | 'consultant-select' | 'password';

interface LoginProps {
  onLogin: (type: 'admin' | 'consultant', consultantId?: string, password?: string) => boolean;
}

const Login = ({ onLogin }: LoginProps) => {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<'admin' | 'consultant' | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const activeConsultants = mockConsultants.filter(c => c.isActive);

  const handleRoleSelect = (selectedRole: 'admin' | 'consultant') => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'admin') {
      setStep('password');
    } else {
      setStep('consultant-select');
    }
  };

  const handleConsultantSelect = (consultantId: string) => {
    setSelectedConsultant(consultantId);
    setError('');
    setStep('password');
  };

  const handleBack = () => {
    setError('');
    setPassword('');
    if (step === 'password') {
      if (role === 'admin') {
        setStep('role');
        setRole(null);
      } else {
        setStep('consultant-select');
      }
    } else if (step === 'consultant-select') {
      setStep('role');
      setRole(null);
      setSelectedConsultant(null);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = onLogin(
      role!,
      role === 'consultant' ? selectedConsultant! : undefined,
      password
    );
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Senha incorreta');
    }
    
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        delay: i * 0.1, 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    })
  };

  const selectedConsultantData = mockConsultants.find(c => c.id === selectedConsultant);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <ParticleField />
      
      {/* Animated glow orbs */}
      <motion.div 
        className="fixed top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[150px] pointer-events-none"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[180px] pointer-events-none"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Glass card with animated border */}
        <div className="relative">
          {/* Animated gradient border */}
          <motion.div 
            className="absolute -inset-[1px] rounded-3xl opacity-70"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(190 80% 50%), hsl(var(--primary)))',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 0', '200% 0'],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative backdrop-blur-2xl bg-card/60 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Inner shimmer effect */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, hsl(var(--primary) / 0.1) 50%, transparent 70%)',
              }}
              animate={{
                backgroundPosition: ['-200% 0', '200% 0'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Logo/Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-purple-400 mb-4 shadow-2xl shadow-primary/50"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      '0 0 40px hsl(var(--primary) / 0.4)',
                      '0 0 80px hsl(var(--primary) / 0.6)',
                      '0 0 40px hsl(var(--primary) / 0.4)',
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 400 }
                  }}
                >
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <motion.h1 
                  className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Comissões Pro
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Sistema de Gestão de Comissões
                </motion.p>
              </motion.div>

              <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {step === 'role' && (
                  <motion.div
                    key="role"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <motion.p 
                      className="text-center text-muted-foreground mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Como você deseja entrar?
                    </motion.p>
                    
                    <motion.button
                      custom={0}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleRoleSelect('admin')}
                      className="w-full group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 hover:border-primary/60 transition-all duration-500"
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Hover glow effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative flex items-center gap-4">
                        <motion.div 
                          className="w-16 h-16 rounded-xl bg-primary/30 flex items-center justify-center group-hover:bg-primary/50 transition-colors duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <Shield className="w-8 h-8 text-primary" />
                        </motion.div>
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">Administrador</h3>
                          <p className="text-sm text-muted-foreground">Acesso completo ao sistema</p>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      </div>
                    </motion.button>

                    <motion.button
                      custom={1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleRoleSelect('consultant')}
                      className="w-full group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-500"
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative flex items-center gap-4">
                        <motion.div 
                          className="w-16 h-16 rounded-xl bg-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/50 transition-colors duration-300"
                          whileHover={{ rotate: -5 }}
                        >
                          <Users className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-xl text-foreground group-hover:text-cyan-400 transition-colors">Consultor</h3>
                          <p className="text-sm text-muted-foreground">Acesso às suas vendas</p>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        >
                          <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                        </motion.div>
                      </div>
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Consultant Selection */}
                {step === 'consultant-select' && (
                  <motion.div
                    key="consultant-select"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.button
                        onClick={handleBack}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                      </motion.button>
                      <div>
                        <h2 className="font-bold text-xl text-foreground">Selecione seu nome</h2>
                        <p className="text-sm text-muted-foreground">Escolha seu perfil para continuar</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
                      {activeConsultants.map((consultant, index) => (
                        <motion.button
                          key={consultant.id}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => handleConsultantSelect(consultant.id)}
                          className="group relative overflow-hidden rounded-xl p-4 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="relative flex flex-col items-center gap-3">
                            <motion.div 
                              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-xl font-bold text-foreground border-2 border-white/20 group-hover:border-primary/50 transition-colors"
                              whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                              {consultant.name.charAt(0)}
                            </motion.div>
                            <span className="font-semibold text-sm text-foreground">{consultant.name}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Password */}
                {step === 'password' && (
                  <motion.div
                    key="password"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.button
                        onClick={handleBack}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                      </motion.button>
                      <div className="flex items-center gap-3 flex-1">
                        {role === 'admin' ? (
                          <>
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center"
                              animate={{ boxShadow: ['0 0 20px hsl(var(--primary) / 0.3)', '0 0 40px hsl(var(--primary) / 0.5)', '0 0 20px hsl(var(--primary) / 0.3)'] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Shield className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div>
                              <h2 className="font-bold text-xl text-foreground">Administrador</h2>
                              <p className="text-sm text-muted-foreground">Digite sua senha</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <motion.div 
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-lg font-bold border-2 border-white/20"
                              animate={{ boxShadow: ['0 0 20px hsl(190 80% 50% / 0.3)', '0 0 40px hsl(190 80% 50% / 0.5)', '0 0 20px hsl(190 80% 50% / 0.3)'] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {selectedConsultantData?.name.charAt(0)}
                            </motion.div>
                            <div>
                              <h2 className="font-bold text-xl text-foreground">{selectedConsultantData?.name}</h2>
                              <p className="text-sm text-muted-foreground">Digite sua senha</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && password && handleLogin()}
                        className="pl-12 pr-12 h-14 text-lg bg-white/5 border-white/20 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleLogin}
                        disabled={!password || isLoading}
                        className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary via-primary to-purple-500 hover:opacity-90 shadow-xl shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isLoading ? (
                          <motion.div
                            className="w-6 h-6 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <motion.div 
                            className="flex items-center gap-2"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Entrar
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center text-xs text-muted-foreground/60"
                    >
                      Demo: {role === 'admin' ? 'admin123' : `${selectedConsultantData?.name.toLowerCase()}123`}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
