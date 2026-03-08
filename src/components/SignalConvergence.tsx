import { ConvergenceChain, DOMAIN_CONFIG, SEVERITY_CONFIG } from '@/types/atlas';
import { motion } from 'framer-motion';

interface SignalConvergenceProps {
  chains: ConvergenceChain[];
}

export function SignalConvergence({ chains }: SignalConvergenceProps) {
  return (
    <div className="space-y-4">
      {chains.map((chain) => {
        const sevCfg = SEVERITY_CONFIG[chain.severity];
        return (
          <div key={chain.id} className="atlas-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${sevCfg.bgClass} ${sevCfg.textClass}`}>
                {sevCfg.label}
              </span>
              <h4 className="text-sm font-semibold text-foreground">{chain.title}</h4>
              <span className="text-[10px] text-muted-foreground ml-auto">{chain.signals.length} signals</span>
            </div>

            <div className="relative pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {chain.signals.map((signal, i) => {
                const domCfg = DOMAIN_CONFIG[signal.domain];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex items-start gap-3 pb-4 last:pb-0"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-background bg-muted shrink-0 z-10 mt-0.5 flex items-center justify-center`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${i === chain.signals.length - 1 ? 'bg-atlas-critical animate-pulse-glow' : 'bg-primary'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-medium ${domCfg.color}`}>{signal.agentName}</span>
                        <span className="text-[10px] text-muted-foreground">· {signal.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{signal.finding}</p>
                      <span className="text-[10px] font-mono text-muted-foreground">Conf: {signal.confidence}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
