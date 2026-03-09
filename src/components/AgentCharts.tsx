import { useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { MonitoringAgent } from '@/types/atlas';

function generateTimeSeriesData(agent: MonitoringAgent) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, '0') + ':00';
    return h;
  });

  const baseConfidence = agent.confidence;
  const baseUncertainty = agent.uncertainty;
  const baseFP = agent.falsePositiveRate;
  const baseDetections = agent.recentDetections;

  return hours.map((hour, i) => {
    const drift = Math.sin(i * 0.5) * 6 + (Math.random() - 0.5) * 4;
    const conf = Math.max(40, Math.min(99, baseConfidence + drift - (23 - i) * 0.3));
    const unc = Math.max(2, Math.min(35, baseUncertainty + Math.sin(i * 0.3) * 4 + (Math.random() - 0.5) * 3));
    const fp = Math.max(0, Math.min(30, baseFP + Math.sin(i * 0.7) * 3 + (Math.random() - 0.5) * 2));
    const det = Math.max(0, Math.floor(baseDetections * 0.15 + Math.random() * 2.5 + (i > 18 ? 1.5 : 0)));

    return {
      hour,
      confidence: Math.round(conf * 10) / 10,
      uncertainty: Math.round(unc * 10) / 10,
      falsePositiveRate: Math.round(fp * 10) / 10,
      detections: det,
    };
  });
}

const chartTooltipStyle = {
  contentStyle: {
    background: 'hsl(222 41% 9%)',
    border: '1px solid hsl(222 30% 16%)',
    borderRadius: '8px',
    fontSize: '11px',
    color: 'hsl(210 20% 90%)',
  },
  itemStyle: { color: 'hsl(210 20% 70%)' },
  labelStyle: { color: 'hsl(210 20% 50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' },
};

export function ConfidenceChart({ agent }: { agent: MonitoringAgent }) {
  const data = useMemo(() => generateTimeSeriesData(agent), [agent.id]);

  return (
    <div className="atlas-card p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Confidence & Uncertainty — 24h
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(173 80% 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(173 80% 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="uncGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(38 92% 55%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(38 92% 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} tickLine={false} axisLine={false} interval={5} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} tickLine={false} axisLine={false} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="confidence" stroke="hsl(173 80% 45%)" fill="url(#confGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="uncertainty" stroke="hsl(38 92% 55%)" fill="url(#uncGrad)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-3 h-0.5 bg-primary rounded" /> Confidence
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-3 h-0.5 bg-atlas-warning rounded opacity-70" style={{ borderTop: '1px dashed' }} /> Uncertainty
        </span>
      </div>
    </div>
  );
}

export function DetectionFrequencyChart({ agent }: { agent: MonitoringAgent }) {
  const data = useMemo(() => generateTimeSeriesData(agent), [agent.id]);

  return (
    <div className="atlas-card p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Detection Frequency — 24h
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="detections" fill="hsl(173 80% 45%)" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FalsePositiveChart({ agent }: { agent: MonitoringAgent }) {
  const data = useMemo(() => generateTimeSeriesData(agent), [agent.id]);

  return (
    <div className="atlas-card p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        False Positive Rate — 24h
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} tickLine={false} axisLine={false} interval={5} />
            <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="falsePositiveRate" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={false} name="FP Rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
