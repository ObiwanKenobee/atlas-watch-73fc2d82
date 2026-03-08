import { mockAlerts } from '@/data/mockData';
import { AlertTriage } from '@/components/AlertTriage';
import { motion } from 'framer-motion';

export default function AlertsPage() {
  return (
    <div className="p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Active Alerts</h1>
        <p className="text-sm text-muted-foreground mb-6">Triage, inspect, and resolve alerts from monitoring agents.</p>
        <AlertTriage alerts={mockAlerts} />
      </motion.div>
    </div>
  );
}
