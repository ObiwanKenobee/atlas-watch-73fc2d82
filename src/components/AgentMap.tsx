import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MonitoringAgent, Alert, STATUS_CONFIG, DOMAIN_CONFIG } from '@/types/atlas';

interface AgentMapProps {
  agents: MonitoringAgent[];
  alerts: Alert[];
  selectedAgentId?: string;
  onAgentClick?: (agentId: string) => void;
}

const AGENT_COORDINATES: Record<string, [number, number]> = {
  'ag-001': [1.5, 36.5],      // East Africa Rift
  'ag-002': [5.0, 20.0],      // Sub-Saharan Africa
  'ag-003': [12.0, 8.5],      // West Africa Corridor
  'ag-004': [-1.0, 22.0],     // Congo Basin
  'ag-005': [23.0, 78.0],     // South Asia Grid
  'ag-006': [8.0, 42.0],      // Horn of Africa
  'ag-007': [14.5, 0.0],      // Sahel Region
  'ag-008': [48.0, 2.0],      // Global — Multi-lateral
};

const ALERT_COORDINATES: Record<string, [number, number]> = {
  'alt-001': [0.5, 37.0],
  'alt-002': [12.0, 8.5],
  'alt-003': [6.5, 3.4],
  'alt-004': [1.0, 21.0],
};

const ANOMALY_HEATMAP_POINTS: [number, number, number][] = [
  [1.0, 36.0, 0.9], [1.5, 37.0, 0.8], [0.5, 36.5, 0.7],
  [2.0, 36.8, 0.6], [1.2, 37.5, 0.5],
  [12.5, 8.0, 0.85], [12.0, 9.0, 0.75], [11.5, 8.5, 0.65],
  [13.0, 7.5, 0.55],
  [-0.5, 22.5, 0.4], [-1.5, 21.5, 0.3], [0.0, 23.0, 0.35],
  [14.0, -1.0, 0.5], [15.0, 0.5, 0.45], [13.5, 1.0, 0.4],
  [8.5, 42.5, 0.6], [7.5, 41.5, 0.55], [9.0, 43.0, 0.5],
];

const STATUS_COLORS: Record<string, string> = {
  active: '#2dd4a0',
  idle: '#6b7280',
  alerting: '#f5a623',
  degraded: '#a855f7',
  critical: '#ef4444',
};

const SEVERITY_COLORS: Record<string, string> = {
  informational: '#3b82f6',
  watch: '#6b7280',
  warning: '#f5a623',
  critical: '#ef4444',
};

export function AgentMap({ agents, alerts, selectedAgentId, onAgentClick }: AgentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [8, 25],
      zoom: 3,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Draw anomaly heatmap circles
    ANOMALY_HEATMAP_POINTS.forEach(([lat, lng, intensity]) => {
      const radius = 40000 + intensity * 80000;
      L.circle([lat, lng], {
        radius,
        color: 'transparent',
        fillColor: `hsl(${38 - intensity * 38}, 92%, 55%)`,
        fillOpacity: intensity * 0.25,
        interactive: false,
      }).addTo(map);
    });

    // Draw agent monitoring regions
    agents.forEach((agent) => {
      const coords = AGENT_COORDINATES[agent.id];
      if (!coords) return;

      // Monitoring region circle
      const regionRadius = agent.status === 'critical' ? 200000 : agent.status === 'alerting' ? 150000 : 100000;
      L.circle(coords, {
        radius: regionRadius,
        color: STATUS_COLORS[agent.status] || '#6b7280',
        weight: 1,
        fillColor: STATUS_COLORS[agent.status] || '#6b7280',
        fillOpacity: 0.08,
        dashArray: '4 6',
        interactive: false,
      }).addTo(map);

      // Agent marker
      const isSelected = agent.id === selectedAgentId;
      const color = STATUS_COLORS[agent.status] || '#6b7280';
      const size = isSelected ? 16 : 10;
      const statusLabel = STATUS_CONFIG[agent.status]?.label || agent.status;
      const domainLabel = DOMAIN_CONFIG[agent.domain]?.label || agent.domain;

      const icon = L.divIcon({
        className: 'atlas-map-marker',
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid ${isSelected ? '#fff' : color};
          border-radius: 50%;
          box-shadow: 0 0 ${isSelected ? 12 : 6}px ${color}80;
          cursor: pointer;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker(coords, { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Space Grotesk', sans-serif; min-width: 200px; color: #e2e8f0; background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; margin: -14px -20px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">${statusLabel}</span>
            <span style="font-size: 10px; color: #64748b;">· ${domainLabel}</span>
          </div>
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">${agent.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">${agent.region}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; color: #94a3b8;">
            <div>Confidence: <strong style="color: #e2e8f0;">${agent.confidence}%</strong></div>
            <div>Detections: <strong style="color: #e2e8f0;">${agent.recentDetections}</strong></div>
            <div>Uncertainty: <strong style="color: #e2e8f0;">±${agent.uncertainty}%</strong></div>
            <div>FP Rate: <strong style="color: #e2e8f0;">${agent.falsePositiveRate}%</strong></div>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; font-style: italic; border-top: 1px solid #1e293b; padding-top: 6px;">"${agent.lastFinding}"</div>
        </div>
      `, { className: 'atlas-popup' });

      marker.on('click', () => onAgentClick?.(agent.id));
    });

    // Draw alert overlays
    alerts.forEach((alert) => {
      const coords = ALERT_COORDINATES[alert.id];
      if (!coords) return;

      const color = SEVERITY_COLORS[alert.severity] || '#f5a623';

      // Pulsing alert ring
      L.circle(coords, {
        radius: 80000,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.12,
        interactive: true,
      }).addTo(map).bindPopup(`
        <div style="font-family: 'Space Grotesk', sans-serif; min-width: 220px; color: #e2e8f0; background: #111827; border: 1px solid ${color}40; border-radius: 8px; padding: 12px; margin: -14px -20px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${color}25; color: ${color};">${alert.severity}</span>
          </div>
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">${alert.title}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">${alert.geography}</div>
          <div style="font-size: 10px; color: #94a3b8;">
            Confidence: <strong style="color: #e2e8f0;">${alert.confidence}%</strong> · 
            Population: <strong style="color: #e2e8f0;">${alert.affectedPopulation}</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 6px;">
            ${alert.contributingAgents.length} contributing agents
          </div>
        </div>
      `, { className: 'atlas-popup' });

      // Inner pulsing dot for critical
      if (alert.severity === 'critical') {
        const pulseIcon = L.divIcon({
          className: 'atlas-alert-pulse',
          html: `<div style="
            width: 12px; height: 12px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 16px ${color}aa;
            animation: pulse-glow 2s ease-in-out infinite;
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker(coords, { icon: pulseIcon, interactive: false }).addTo(map);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [agents, alerts, selectedAgentId, onAgentClick]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden border border-border" />
  );
}
