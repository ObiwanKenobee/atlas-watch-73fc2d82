export type AgentStatus = 'active' | 'idle' | 'alerting' | 'degraded' | 'critical';
export type AlertSeverity = 'informational' | 'watch' | 'warning' | 'critical';
export type AgentDomain = 'climate' | 'financial' | 'health' | 'ecosystem' | 'infrastructure' | 'governance' | 'migration' | 'food';

export interface MonitoringAgent {
  id: string;
  name: string;
  domain: AgentDomain;
  specialization: string;
  region: string;
  status: AgentStatus;
  confidence: number;
  uncertainty: number;
  scanFrequency: string;
  dataSources: string[];
  lastRun: string;
  recentDetections: number;
  escalationCount24h: number;
  falsePositiveRate: number;
  lastFinding: string;
  escalationTarget: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  message: string;
  type: 'detection' | 'correlation' | 'escalation' | 'confirmation' | 'routing';
}

export interface Alert {
  id: string;
  title: string;
  severity: AlertSeverity;
  description: string;
  contributingAgents: string[];
  confidence: number;
  uncertainty: string;
  affectedPopulation: string;
  geography: string;
  detectedAt: string;
  persistenceDays: number;
  evidenceSources: string[];
  recommendedActions: string[];
  status: 'new' | 'investigating' | 'resolved' | 'suppressed';
  downstreamConsequences: string[];
}

export interface ConvergenceChain {
  id: string;
  title: string;
  severity: AlertSeverity;
  signals: {
    agentName: string;
    domain: AgentDomain;
    finding: string;
    confidence: number;
    timestamp: string;
  }[];
}

export const DOMAIN_CONFIG: Record<AgentDomain, { label: string; color: string }> = {
  climate: { label: 'Climate', color: 'text-atlas-info' },
  financial: { label: 'Financial', color: 'text-atlas-warning' },
  health: { label: 'Health', color: 'text-atlas-critical' },
  ecosystem: { label: 'Ecosystem', color: 'text-atlas-success' },
  infrastructure: { label: 'Infrastructure', color: 'text-atlas-alerting' },
  governance: { label: 'Governance', color: 'text-muted-foreground' },
  migration: { label: 'Migration', color: 'text-atlas-warning' },
  food: { label: 'Food Systems', color: 'text-atlas-success' },
};

export const STATUS_CONFIG: Record<AgentStatus, { label: string; dotClass: string; cardGlow: string }> = {
  active: { label: 'Active', dotClass: 'bg-atlas-success', cardGlow: '' },
  idle: { label: 'Idle', dotClass: 'bg-atlas-idle', cardGlow: '' },
  alerting: { label: 'Alerting', dotClass: 'bg-atlas-warning animate-pulse-glow', cardGlow: 'atlas-card-glow-warning' },
  degraded: { label: 'Degraded', dotClass: 'bg-atlas-alerting', cardGlow: '' },
  critical: { label: 'Critical', dotClass: 'bg-atlas-critical animate-pulse-glow', cardGlow: 'atlas-card-glow-critical' },
};

export const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; bgClass: string; textClass: string }> = {
  informational: { label: 'Info', bgClass: 'bg-atlas-info/15', textClass: 'text-atlas-info' },
  watch: { label: 'Watch', bgClass: 'bg-atlas-idle/15', textClass: 'text-atlas-idle' },
  warning: { label: 'Warning', bgClass: 'bg-atlas-warning/15', textClass: 'text-atlas-warning' },
  critical: { label: 'Critical', bgClass: 'bg-atlas-critical/15', textClass: 'text-atlas-critical' },
};
