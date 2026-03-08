import { ActivityEvent } from '@/types/atlas';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, GitBranch, ArrowUpRight, CheckCircle, Route } from 'lucide-react';

const typeConfig = {
  detection: { icon: Radio, color: 'text-atlas-info' },
  correlation: { icon: GitBranch, color: 'text-atlas-alerting' },
  escalation: { icon: ArrowUpRight, color: 'text-atlas-warning' },
  confirmation: { icon: CheckCircle, color: 'text-atlas-success' },
  routing: { icon: Route, color: 'text-primary' },
};

interface LiveActivityStreamProps {
  events: ActivityEvent[];
}

export function LiveActivityStream({ events }: LiveActivityStreamProps) {
  return (
    <div className="atlas-card p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-atlas-success animate-pulse-glow" />
        <h3 className="text-sm font-semibold text-foreground">Live Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto atlas-scrollbar space-y-1">
        <AnimatePresence initial={false}>
          {events.map((event, i) => {
            const cfg = typeConfig[event.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 py-2 px-2 rounded hover:bg-muted/50 transition-colors"
              >
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${cfg.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-foreground leading-relaxed">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-muted-foreground">{event.timestamp}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground truncate">{event.agentName}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
