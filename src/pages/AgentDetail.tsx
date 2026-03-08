import { mockAgents } from '@/data/mockData';
import { STATUS_CONFIG, DOMAIN_CONFIG } from '@/types/atlas';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Radio, Shield, Database, Clock, Target, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const agent = mockAgents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="p-6">
        <Link to="/" className="text-primary text-sm flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Back</Link>
        <p className="mt-4 text-muted-foreground">Agent not found.</p>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[agent.status];
  const domainCfg = DOMAIN_CONFIG[agent.domain];

  const mockAuditLog = [
    { time: '14:32', event: 'Detection: Crop stress pattern across 3 counties' },
    { time: '14:15', event: 'Confidence recalibrated from 78% to 81%' },
    { time: '13:45', event: 'Satellite pass confirmed vegetation anomaly' },
    { time: '12:30', event: 'Threshold exceeded: rainfall deficit > 30 days' },
    { time: '11:00', event: 'Routine scan completed — 2 weak signals logged' },
    { time: '09:15', event: 'Agent restarted after config update' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-5xl">
      <Link to="/" className="text-primary text-sm flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" />Back to Command Center
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dotClass}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{statusCfg.label}</span>
            <span className={`text-xs ${domainCfg.color} font-medium`}>· {domainCfg.label}</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">{agent.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{agent.region}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs">Pause Agent</Button>
          <Button size="sm" variant="outline" className="text-xs">Edit Config</Button>
        </div>
      </div>

      <div className="atlas-card p-4 mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mission Summary</h3>
        <p className="text-sm text-foreground">{agent.specialization}</p>
        <p className="text-xs text-muted-foreground mt-2">Escalation target: <span className="text-foreground">{agent.escalationTarget}</span></p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Confidence', value: `${agent.confidence}%`, icon: Target },
          { label: 'Uncertainty', value: `±${agent.uncertainty}%`, icon: AlertTriangle },
          { label: 'Scan Frequency', value: agent.scanFrequency, icon: Clock },
          { label: 'Last Run', value: agent.lastRun, icon: Radio },
          { label: 'Detections', value: String(agent.recentDetections), icon: Eye },
          { label: 'Escalations (24h)', value: String(agent.escalationCount24h), icon: TrendingUp },
          { label: 'FP Rate', value: `${agent.falsePositiveRate}%`, icon: Shield },
          { label: 'Data Sources', value: String(agent.dataSources.length), icon: Database },
        ].map((stat) => (
          <div key={stat.label} className="atlas-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <span className="text-lg font-mono font-bold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="atlas-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Data Sources</h3>
          <ul className="space-y-2">
            {agent.dataSources.map((ds) => (
              <li key={ds} className="flex items-center gap-2 text-sm text-foreground">
                <Database className="w-3 h-3 text-primary" />{ds}
              </li>
            ))}
          </ul>
        </div>

        <div className="atlas-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Confidence Calibration</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Confidence</span><span className="font-mono">{agent.confidence}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${agent.confidence}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Uncertainty Band</span><span className="font-mono">±{agent.uncertainty}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-atlas-warning/60" style={{ width: `${agent.uncertainty * 3}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="atlas-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Audit Log</h3>
        <div className="space-y-2">
          {mockAuditLog.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border last:border-0">
              <span className="text-[10px] font-mono text-muted-foreground w-10 shrink-0 mt-0.5">{entry.time}</span>
              <p className="text-xs text-foreground">{entry.event}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
