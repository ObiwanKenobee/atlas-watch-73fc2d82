import { motion } from 'framer-motion';
import { Shield, ToggleLeft, Sliders, Route, FileText, MapPin } from 'lucide-react';

export default function GovernancePage() {
  const controls = [
    { label: 'Enable/Disable Agents', desc: 'Activate or deactivate individual monitoring agents', icon: ToggleLeft },
    { label: 'Sensitivity Thresholds', desc: 'Adjust detection sensitivity and alert trigger levels', icon: Sliders },
    { label: 'Escalation Routing', desc: 'Define how alerts flow to teams, dashboards, and workflows', icon: Route },
    { label: 'Geographic Scope', desc: 'Set regional boundaries for agent monitoring coverage', icon: MapPin },
    { label: 'Human Approval Rules', desc: 'Require human sign-off before escalation or action', icon: Shield },
    { label: 'Audit Trail', desc: 'Full history of agent actions, config changes, and overrides', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Agent Governance</h1>
        <p className="text-sm text-muted-foreground mb-6">Oversight controls for autonomous monitoring agents.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {controls.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="atlas-card p-4 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{c.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
