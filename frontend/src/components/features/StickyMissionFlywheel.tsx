// frontend/src/components/features/StickyMissionFlywheel.tsx

import React from 'react';
import { Layers, BookOpen, Hammer, Rocket, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StickyMissionFlywheel: React.FC = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const stages = [
    {
      id: 'stage-01',
      stageNum: 'STAGE 01',
      title: 'Learn & Master Modern Systems',
      subtitle: 'System Design & Engineering Fundamentals',
      description:
        'Master modern engineering through structured workshops, scalable backend architectures in Django & FastAPI, and full-stack system design masterclasses led by industry mentors.',
      accentColor: 'cyan',
      gradient: 'from-cyan-500 to-blue-500',
      tagColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      benefits: [
        'Interactive system design masterclasses (Redis, Celery, PostgreSQL)',
        'Full-stack architecture patterns (React 19, TypeScript, Clean APIs)',
        'Weekly live tech workshops with interactive code challenges',
      ],
      link: '/community/resources',
      actionText: 'Explore Knowledge Base',
    },
    {
      id: 'stage-02',
      stageNum: 'STAGE 02',
      title: 'Build Production-Grade Software',
      subtitle: 'Collaborative Open Source & Sprints',
      description:
        'Transform concepts into production software. Team up in 48-hour hack sprints, contribute feature pull requests to community repositories, and practice rigorous Git code reviews.',
      accentColor: 'orange',
      gradient: 'from-orange-500 to-amber-500',
      tagColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      icon: <Hammer className="w-5 h-5 text-orange-400" />,
      benefits: [
        'Multi-college open source repository squads',
        '48-Hour HackSprint competitions with cash prize pools',
        'Real CI/CD, TypeScript, and Django production environments',
      ],
      link: '/community/projects',
      actionText: 'Browse Active Repos',
    },
    {
      id: 'stage-03',
      stageNum: 'STAGE 03',
      title: 'Grow Engineering Careers',
      subtitle: 'Mentorship, Mock Interviews & Referrals',
      description:
        'Accelerate placement into top tech firms. Benefit from 1-on-1 mock technical interviews, alumni resume teardowns, and verified direct referrals to leading software companies.',
      accentColor: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      tagColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      icon: <Rocket className="w-5 h-5 text-purple-400" />,
      benefits: [
        'Alumni 1-on-1 technical mock interviews & system design review',
        'Verified direct job referral pipeline to top product companies',
        'National Demo Day showcase pitching directly to tech founders',
      ],
      link: '/community/activities',
      actionText: 'Join Career Sprints',
    },
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
      
      {/* Left Column: Framer Sticky Pin Header */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-brand text-[10px]">MISSION FLYWHEEL</span>
          </div>

          <h2 className="font-rajdhani text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            HOW DEVELOPERS <span className="text-orange-500">THRIVE.</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-4 max-w-md">
            A battle-tested 3-stage progression taking student developers from raw code syntax to shipping production systems and landing tier-1 engineering careers.
          </p>
        </div>

        {/* Stage Navigation Indicators */}
        <div className="space-y-2.5 pt-2 hidden sm:block">
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-3 rounded-[3px] bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] font-brand font-bold text-gray-300 flex items-center justify-center">
                  0{idx + 1}
                </span>
                <span className="text-xs font-rajdhani font-bold text-gray-200 uppercase tracking-wide">
                  {stage.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-orange-400/80">Active</span>
            </div>
          ))}
        </div>

        {/* Stats Callout */}
        <div className="p-4 rounded-[4px] bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs">
          <div>
            <div className="text-orange-400 font-brand font-bold text-lg">100% FREE</div>
            <div className="text-gray-400 text-[11px]">No Paywalls or Gatekeeping</div>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div>
            <div className="text-cyan-400 font-brand font-bold text-lg">40+ COLLEGES</div>
            <div className="text-gray-400 text-[11px]">Unified Developer Network</div>
          </div>
        </div>
      </div>

      {/* Right Column: Scrolling Stage Cards */}
      <div className="lg:col-span-7 space-y-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            onMouseMove={handleMouseMove}
            className="p-6 sm:p-8 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card text-left flex flex-col justify-between relative overflow-hidden group shadow-lg"
          >
            {/* Top Glowing Color Line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stage.gradient}`} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[3px] bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  {stage.icon}
                </div>
                <span className={`px-2.5 py-1 rounded-[2px] text-[10px] font-brand font-bold border ${stage.tagColor}`}>
                  {stage.stageNum}
                </span>
              </div>

              <div>
                <h3 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stage.title}
                </h3>
                <span className="text-xs text-orange-400 font-mono font-medium">
                  {stage.subtitle}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                {stage.description}
              </p>

              {/* Benefits Checklist */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-800/80">
                {stage.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Link */}
            <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-mono">RiseTogether Framework</span>
              <Link
                to={stage.link}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-white transition-colors"
              >
                <span>{stage.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
