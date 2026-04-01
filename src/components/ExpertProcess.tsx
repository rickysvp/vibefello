import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Search, CheckCircle2, Sparkles, User, ShieldCheck, Zap } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Problem Received",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "bg-secondary",
    text: "User: How do I handle this tax audit?",
  },
  {
    id: 2,
    title: "Expert Analysis",
    icon: <Search className="w-6 h-6" />,
    color: "bg-tertiary",
    text: "Expert: Analyzing your financial records...",
  },
  {
    id: 3,
    title: "Strategy Formed",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-accent",
    text: "Expert: Here is your 3-step action plan.",
  },
  {
    id: 4,
    title: "Success Achieved",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "bg-green-400",
    text: "User: Audit cleared! Thank you!",
  }
];

export const ExpertProcess = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square bg-white border-4 border-foreground rounded-3xl shadow-pop overflow-hidden p-8 flex flex-col justify-between">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Header: Status */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="h-2 w-12 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent"
              animate={{ width: `${(activeStep + 1) * 25}%` }}
            />
          </div>
          <div className="w-10 h-10 bg-accent border-2 border-foreground rounded-full flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="w-6 h-6 text-foreground" />
          </div>
        </div>
        <div className="px-3 py-1 bg-foreground text-white text-[10px] font-black uppercase tracking-widest rounded-full">
          Live Session
        </div>
      </div>

      {/* Main Content: Dynamic Step */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="w-full max-w-xs"
          >
            <div className={`p-6 border-4 border-foreground rounded-2xl shadow-pop ${steps[activeStep].color} relative`}>
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-white border-4 border-foreground rounded-xl flex items-center justify-center shadow-pop">
                {steps[activeStep].icon}
              </div>
              
              <h3 className="font-display text-xl font-black mb-2 mt-2">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm font-bold opacity-80 italic">
                "{steps[activeStep].text}"
              </p>

              {activeStep === 1 && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -right-4 w-10 h-10 bg-white border-2 border-foreground rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Connecting Lines (Visual) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full opacity-10">
            <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="50%" cy="50%" r="120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>

      {/* Footer: Progress Dots */}
      <div className="relative z-10 flex justify-center gap-2 mt-8">
        {steps.map((_, idx) => (
          <motion.div
            key={idx}
            className={`h-3 rounded-full border-2 border-foreground ${idx === activeStep ? 'w-8 bg-accent' : 'w-3 bg-white'}`}
            animate={{ scale: idx === activeStep ? 1.2 : 1 }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 right-10 p-2 bg-secondary border-2 border-foreground rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] text-[10px] font-black"
      >
        EXPERT MATCHED
      </motion.div>
      
      <motion.div 
        animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 left-10 p-2 bg-tertiary border-2 border-foreground rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] text-[10px] font-black"
      >
        DATA SECURED
      </motion.div>

      {/* Chat Bubble Animation */}
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          opacity: activeStep === 1 ? [0, 1, 1, 0] : 0
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 p-3 bg-white border-2 border-foreground rounded-2xl rounded-bl-none shadow-pop z-30 pointer-events-none"
      >
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </motion.div>
    </div>
  );
};
