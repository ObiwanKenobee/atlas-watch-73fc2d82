import { Alert, SEVERITY_CONFIG } from '@/types/atlas';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, MapPin, Clock, ChevronRight, Shield, Eye, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AlertCardProps {
  alert: Alert;
  index: number;
}

function AlertCard({ alert, index }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const severityCfg = SEVERITY_CONFIG[alert.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="atlas-card overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${severityCfg.bgClass} ${severityCfg.textClass}`}>
                {severityCfg.label}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">{alert.status}</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{alert.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{alert.affectedPopulation}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.geography}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.persistenceDays}d</span>
          <span className="font-mono">Conf: {alert.confidence}%</span>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-border px-4 pb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-primary" /> Contributing Agents
              </h5>
              <ul className="space-y-1">
                {alert.contributingAgents.map((a) => (
                  <li key={a} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-primary" /> Evidence Sources
              </h5>
              <ul className="space-y-1">
                {alert.evidenceSources.map((s) => (
                  <li key={s} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-atlas-info shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-xs font-semibold text-foreground mb-2">Uncertainty</h5>
            <p className="text-xs text-atlas-warning italic">{alert.uncertainty}</p>
          </div>

          <div className="mt-4">
            <h5 className="text-xs font-semibold text-foreground mb-2">Downstream Consequences</h5>
            <div className="flex flex-wrap gap-1.5">
              {alert.downstreamConsequences.map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-atlas-success" /> Recommended Actions
            </h5>
            <ul className="space-y-1.5">
              {alert.recommendedActions.map((a, i) => (
                <li key={a} className="text-xs text-foreground flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}.</span>{a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="text-xs">Suppress</Button>
            <Button size="sm" variant="outline" className="text-xs">Investigate</Button>
            <Button size="sm" className="text-xs">Escalate</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface AlertTriageProps {
  alerts: Alert[];
}

export function AlertTriage({ alerts }: AlertTriageProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <AlertCard key={alert.id} alert={alert} index={i} />
      ))}
    </div>
  );
}
