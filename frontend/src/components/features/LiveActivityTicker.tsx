// frontend/src/components/features/LiveActivityTicker.tsx

import React from 'react';
import { GitPullRequest, Users, Code2, FolderGit2, CheckCircle2 } from 'lucide-react';

interface TickerItem {
  id: string;
  icon: React.ReactNode;
  user: string;
  action: string;
  target: string;
  badge: string;
  badgeColor: string;
  time: string;
}

export const LiveActivityTicker: React.FC = () => {
  const tickerEvents: TickerItem[] = [
    {
      id: 't-1',
      icon: <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />,
      user: '@aarav_ai',
      action: 'merged PR #42 in',
      target: 'SmartStudy-AI / vector-search',
      badge: 'OPEN SOURCE',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      time: '2m ago',
    },
    {
      id: 't-2',
      icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
      user: '@priya_dev',
      action: 'formed Squad for',
      target: 'CyberSentry SIH 2025 (4/4 members)',
      badge: 'HACKATHON',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      time: '7m ago',
    },
    {
      id: 't-3',
      icon: <Code2 className="w-3.5 h-3.5 text-purple-400" />,
      user: '@vikram_sys',
      action: 'published tech guide',
      target: 'Distributed Redis Caching in Django',
      badge: 'TECH GUIDE',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      time: '14m ago',
    },
    {
      id: 't-4',
      icon: <FolderGit2 className="w-3.5 h-3.5 text-orange-400" />,
      user: '@sneha_algo',
      action: 'launched open repo',
      target: 'AlgoVisualizer-3D / v1.0',
      badge: 'NEW REPO',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      time: '20m ago',
    },
    {
      id: 't-5',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />,
      user: '@rohan_code',
      action: 'reviewed PR #19 on',
      target: 'DevPulse-Dashboard / metrics',
      badge: 'CODE REVIEW',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      time: '28m ago',
    },
  ];

  // Double items for seamless infinite scroll
  const items = [...tickerEvents, ...tickerEvents];

  return (
    <div className="w-full bg-neutral-950/90 border-y border-neutral-800/80 backdrop-blur-md overflow-hidden relative py-2.5 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        
        {/* Live Indicator Pill */}
        <div className="shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-gray-300 font-semibold z-20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-brand text-[10px] text-emerald-400 font-bold tracking-wider">LIVE TELEMETRY</span>
        </div>

        {/* Scrolling Event Ticker */}
        <div className="overflow-hidden relative w-full flex-1 mask-linear-fade">
          <div className="animate-ticker flex items-center gap-8 text-xs text-gray-300 whitespace-nowrap">
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default"
              >
                <span className="p-1 rounded-[2px] bg-neutral-900 border border-neutral-800">
                  {item.icon}
                </span>
                <span className="font-semibold text-white font-fira text-[11px]">{item.user}</span>
                <span className="text-gray-400">{item.action}</span>
                <span className="text-orange-400/90 font-medium font-fira text-[11px]">{item.target}</span>
                <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-brand font-semibold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">• {item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

