import { mockAgents, mockAlerts } from '@/data/mockData';
import { AgentMap } from '@/components/AgentMap';
import { STATUS_CONFIG, DOMAIN_CONFIG } from '@/types/atlas';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Layers, AlertTriangle } from 'lucide-react';

export default function MapPage() {
  const navigate = useNavigate();

  const activeAlerts = mockAlerts.filter(a => a.severity === 'critical' || a.severity === 'warning');
  const alertingAgents = mockAgents.filter(a => a.status === 'alerting' || a.status === 'critical');

  return (
    <div className="p-6 h-[calc(100vh-44px)] flex flex-col">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
        <h1 className="text-2xl font-bold text-foreground mb-1">Global Monitoring Map</h1>
        <p className="text-sm text-muted-foreground">Agent regions, anomaly heatmaps, and geographic alert overlays.</p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 min-h-0">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[400px]">
          <AgentMap
            agents={mockAgents}
            alerts={mockAlerts}
            onAgentClick={(id) => navigate(`/agents/${id}`)}
          />
        </motion.div>

        <div className="flex flex-col gap-3 overflow-y-auto atlas-scrollbar">
          {/* Legend */}
          <div className="atlas-card p-3">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Map Legend
            </h3>
            <div className="space-y-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Agent Status</div>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass}`} />
                  <span className="text-foreground">{cfg.label}</span>
                </div>
              ))}
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-3 mb-1">Overlays</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-atlas-warning/50" />
                <span className="text-foreground">Anomaly Heatmap</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full border border-atlas-critical bg-atlas-critical/20" />
                <span className="text-foreground">Alert Zone</span>
              </div>
            </div>
          </div>

          {/* Active alerts */}
          <div className="atlas-card p-3">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Active Alerts ({activeAlerts.length})
            </h3>
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-2 rounded bg-muted/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      alert.severity === 'critical' ? 'bg-atlas-critical/15 text-atlas-critical' : 'bg-atlas-warning/15 text-atlas-warning'
                    }`}>{alert.severity}</span>
                  </div>
                  <p className="text-xs text-foreground font-medium">{alert.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{alert.geography}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerting agents */}
          <div className="atlas-card p-3">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Alerting Agents ({alertingAgents.length})
            </h3>
            <div className="space-y-2">
              {alertingAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-2 rounded bg-muted/50 border border-border cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => navigate(`/agents/${agent.id}`)}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[agent.status].dotClass}`} />
                    <span className="text-[10px] text-muted-foreground uppercase">{STATUS_CONFIG[agent.status].label}</span>
                    <span className={`text-[10px] ${DOMAIN_CONFIG[agent.domain].color}`}>· {DOMAIN_CONFIG[agent.domain].label}</span>
                  </div>
                  <p className="text-xs text-foreground font-medium">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground">{agent.region}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
