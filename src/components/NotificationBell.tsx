import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, X, AlertTriangle, Radio, GitBranch, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockActivity } from '@/data/mockData';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'detection' | 'correlation' | 'escalation' | 'confirmation' | 'routing';
  timestamp: string;
  read: boolean;
}

const TYPE_ICONS = {
  detection: AlertTriangle,
  correlation: GitBranch,
  escalation: Radio,
  confirmation: CheckCircle,
  routing: Radio,
};

const TYPE_COLORS = {
  detection: 'text-atlas-warning',
  correlation: 'text-atlas-info',
  escalation: 'text-atlas-critical',
  confirmation: 'text-atlas-success',
  routing: 'text-primary',
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    mockActivity.slice(0, 5).map((ev) => ({
      id: ev.id,
      title: ev.agentName,
      message: ev.message,
      type: ev.type,
      timestamp: ev.timestamp,
      read: false,
    }))
  );
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Simulate incoming notifications
  useEffect(() => {
    const criticalMessages = [
      { agent: 'Disease Outbreak Sentinel', msg: 'New symptom cluster confirmed — escalation triggered' },
      { agent: 'Climate Anomaly Agent', msg: 'Drought threshold breached in new district' },
      { agent: 'Food Price Volatility Agent', msg: 'Price spike exceeding 50% — critical alert' },
    ];

    const interval = setInterval(() => {
      const pick = criticalMessages[Math.floor(Math.random() * criticalMessages.length)];
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: pick.agent,
        message: pick.msg,
        type: 'escalation',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 20));

      toast.error(pick.msg, {
        description: pick.agent,
        duration: 4000,
        className: 'atlas-toast',
      });

      // Play notification sound
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // Audio not available
      }
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => {
          setOpen((v) => !v);
        }}
        className="relative p-1.5 rounded-md hover:bg-muted transition-colors"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-atlas-critical text-[9px] font-bold text-foreground flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 w-80 max-h-96 atlas-card border border-border rounded-lg overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-80 atlas-scrollbar">
              {notifications.length === 0 ? (
                <p className="text-xs text-muted-foreground p-4 text-center">No notifications</p>
              ) : (
                notifications.map((n) => {
                  const Icon = TYPE_ICONS[n.type];
                  const colorClass = TYPE_COLORS[n.type];
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-2 px-3 py-2.5 border-b border-border last:border-0 transition-colors ${
                        n.read ? 'opacity-60' : 'bg-muted/30'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colorClass}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground truncate">{n.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{n.message}</p>
                        <span className="text-[9px] font-mono text-muted-foreground mt-1 block">{n.timestamp}</span>
                      </div>
                      <button onClick={() => dismiss(n.id)} className="p-0.5 hover:bg-muted rounded shrink-0">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
