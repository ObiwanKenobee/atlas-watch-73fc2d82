import { mockAgents, mockActivity, mockAlerts, mockConvergence } from '@/data/mockData';
import { AgentCard } from '@/components/AgentCard';
import { LiveActivityStream } from '@/components/LiveActivityStream';
import { AlertTriage } from '@/components/AlertTriage';
import { SignalConvergence } from '@/components/SignalConvergence';
import { DOMAIN_CONFIG, STATUS_CONFIG, AgentDomain, AgentStatus } from '@/types/atlas';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Bot, AlertTriangle, Activity, GitBranch } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function CommandCenter() {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<AgentDomain | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');

  const filteredAgents = useMemo(() => {
    return mockAgents.filter((a) => {
      const matchSearch = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.region.toLowerCase().includes(search.toLowerCase()) ||
        a.specialization.toLowerCase().includes(search.toLowerCase());
      const matchDomain = domainFilter === 'all' || a.domain === domainFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchDomain && matchStatus;
    });
  }, [search, domainFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: mockAgents.length,
    active: mockAgents.filter((a) => a.status === 'active').length,
    alerting: mockAgents.filter((a) => a.status === 'alerting' || a.status === 'critical').length,
    criticalAlerts: mockAlerts.filter((a) => a.severity === 'critical').length,
  }), []);

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Agent Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Autonomous monitoring across {stats.total} agents</p>
      </motion.div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Agents', value: stats.total, icon: Bot, color: 'text-primary' },
          { label: 'Active', value: stats.active, icon: Activity, color: 'text-atlas-success' },
          { label: 'Alerting', value: stats.alerting, icon: AlertTriangle, color: 'text-atlas-warning' },
          { label: 'Critical Alerts', value: stats.criticalAlerts, icon: AlertTriangle, color: 'text-atlas-critical' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="atlas-card p-4 flex items-center gap-3"
          >
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <div>
              <div className="text-xl font-mono font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="agents" className="text-xs data-[state=active]:bg-card"><Bot className="w-3.5 h-3.5 mr-1.5" />Agents</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs data-[state=active]:bg-card"><AlertTriangle className="w-3.5 h-3.5 mr-1.5" />Alerts</TabsTrigger>
          <TabsTrigger value="convergence" className="text-xs data-[state=active]:bg-card"><GitBranch className="w-3.5 h-3.5 mr-1.5" />Convergence</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
            <div>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search agents, regions, signals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value as AgentDomain | 'all')}
                  className="h-9 px-3 text-xs bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Domains</option>
                  {Object.entries(DOMAIN_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AgentStatus | 'all')}
                  className="h-9 px-3 text-xs bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              {/* Agent grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredAgents.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </div>
              {filteredAgents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-12">No agents match your filters.</p>
              )}
            </div>

            {/* Activity stream */}
            <div className="hidden lg:block h-[600px]">
              <LiveActivityStream events={mockActivity} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <AlertTriage alerts={mockAlerts} />
        </TabsContent>

        <TabsContent value="convergence">
          <SignalConvergence chains={mockConvergence} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
