import { MonitoringAgent, STATUS_CONFIG, DOMAIN_CONFIG } from '@/types/atlas';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowUpRight, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgentCardProps {
  agent: MonitoringAgent;
  index: number;
}

export function AgentCard({ agent, index }: AgentCardProps) {
  const statusCfg = STATUS_CONFIG[agent.status];
  const domainCfg = DOMAIN_CONFIG[agent.domain];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/agents/${agent.id}`}
        className={`atlas-card ${statusCfg.cardGlow} block p-4 hover:border-primary/30 transition-all duration-300 group`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${statusCfg.dotClass}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
              {statusCfg.label}
            </span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-1 leading-tight">{agent.name}</h3>
        <p className={`text-xs ${domainCfg.color} font-medium mb-2`}>{agent.region}</p>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{agent.specialization}</p>

        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-mono font-medium text-foreground">{agent.confidence}%</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${agent.confidence}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-mono font-semibold text-foreground">{agent.recentDetections}</div>
            <div className="text-muted-foreground">Detections</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-foreground">{agent.escalationCount24h}</div>
            <div className="text-muted-foreground">Escalations</div>
          </div>
          <div className="text-center">
            <div className="font-mono font-semibold text-foreground">{agent.falsePositiveRate}%</div>
            <div className="text-muted-foreground">FP Rate</div>
          </div>
        </div>

        {agent.lastFinding && agent.status !== 'idle' && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground italic line-clamp-2">"{agent.lastFinding}"</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
