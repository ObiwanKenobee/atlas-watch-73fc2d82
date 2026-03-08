import { mockConvergence } from '@/data/mockData';
import { SignalConvergence } from '@/components/SignalConvergence';
import { motion } from 'framer-motion';

export default function ConvergencePage() {
  return (
    <div className="p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Signal Convergence</h1>
        <p className="text-sm text-muted-foreground mb-6">Multi-agent correlation chains showing converging risk signals.</p>
        <SignalConvergence chains={mockConvergence} />
      </motion.div>
    </div>
  );
}
