import { mockAgents } from '@/data/mockData';
import { DOMAIN_CONFIG, STATUS_CONFIG } from '@/types/atlas';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function RegistryPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return mockAgents;
    const q = search.toLowerCase();
    return mockAgents.filter((a) =>
      a.name.toLowerCase().includes(q) || a.region.toLowerCase().includes(q) || a.domain.includes(q)
    );
  }, [search]);

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Agent Registry</h1>
        <p className="text-sm text-muted-foreground mb-6">Searchable catalog of all monitoring agents.</p>

        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text" placeholder="Search registry..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="atlas-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['Status', 'Name', 'Domain', 'Region', 'Confidence', 'Scan Freq', 'Sources', 'Escalation Target'].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const sCfg = STATUS_CONFIG[a.status];
                  const dCfg = DOMAIN_CONFIG[a.domain];
                  return (
                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5"><span className={`w-2 h-2 rounded-full inline-block ${sCfg.dotClass}`} /></td>
                      <td className="px-3 py-2.5"><Link to={`/agents/${a.id}`} className="text-foreground hover:text-primary font-medium">{a.name}</Link></td>
                      <td className={`px-3 py-2.5 ${dCfg.color}`}>{dCfg.label}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{a.region}</td>
                      <td className="px-3 py-2.5 font-mono">{a.confidence}%</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{a.scanFrequency}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{a.dataSources.length}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{a.escalationTarget}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
