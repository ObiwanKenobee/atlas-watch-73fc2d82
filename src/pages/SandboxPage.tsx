import { motion } from 'framer-motion';
import { FlaskConical, Play, Clock, CloudOff, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SandboxPage() {
  const scenarios = [
    { label: 'Historical Replay', desc: 'Replay agent behavior against past events (drought, flood, market shock)', icon: Clock },
    { label: 'Noisy Data Conditions', desc: 'Test agent performance with degraded or unreliable data inputs', icon: Shuffle },
    { label: 'Missing Data Simulation', desc: 'Simulate sensor gaps and missing coverage areas', icon: CloudOff },
    { label: 'Threshold Tuning', desc: 'Adjust detection thresholds and observe impact on alert generation', icon: FlaskConical },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Simulation Sandbox</h1>
        <p className="text-sm text-muted-foreground mb-6">Test agent behavior before deploying to production.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="atlas-card p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{s.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs w-full">
                <Play className="w-3 h-3 mr-1.5" />Run Simulation
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
