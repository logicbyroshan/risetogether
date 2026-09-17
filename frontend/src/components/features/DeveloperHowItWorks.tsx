// frontend/src/components/features/DeveloperHowItWorks.tsx

import React from 'react';
import { Users, GitPullRequest, Rocket, ArrowRight, CheckCircle2, Sparkles, FolderGit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeveloperHowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover & Assemble',
      subtitle: 'Multi-College Squad Matching',
      desc: 'Pick an open-source idea or national hackathon problem. Team up in a 4-person sprint squad with complementary skills (Frontend, Backend, ML, Design).',
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      tag: 'COLLABORATION',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      highlights: ['Matched across 40+ college chapters', 'Shared GitHub repository & Discord room', 'Pre-configured CI/CD templates'],
    },
    {
      num: '02',
      title: 'Ship & Peer Review',
      subtitle: 'Production Git Standards',
      desc: 'Commit code in 4-week structured sprints. Every pull request receives line-by-line architectural critique from senior student leads and alumni engineers.',
      icon: <GitPullRequest className="w-6 h-6 text-orange-400" />,
      tag: 'ENGINEERING',
      tagColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      highlights: ['Real code reviews, zero fluff', 'Strict TypeScript, Docker & Django standards', 'Automated test suites & linting'],
    },
    {
      num: '03',
      title: 'Showcase & Land Offers',
      subtitle: 'National Demo & Direct Referrals',
      desc: 'Pitch your deployed software during National Demo Day. Add verified production contributions to your resume and unlock direct referrals to top tech firms.',
      icon: <Rocket className="w-6 h-6 text-purple-400" />,
      tag: 'CAREER ACCELERATION',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      highlights: ['National Demo Day audience with tech founders', '1-on-1 mock interviews & resume teardowns', 'Direct referral pipeline to tier-1 SWE roles'],
    },
  ];

  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="w-full space-y-10 text-left">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-brand text-[10px]">THE BLUEPRINT</span>
        </div>
        <h2 className="font-rajdhani text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
          HOW WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">ACCELERATE DEVELOPERS.</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-2 leading-relaxed">
          A proven 3-phase progression engineered to transform students into high-caliber software engineers.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            onMouseMove={handleSpotlightMouseMove}
            className="p-6 sm:p-7 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-xl flex flex-col justify-between group transition-all duration-300 hover:border-orange-500/40"
          >
            <div>
              {/* Header with Step Number & Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[4px] bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="font-brand font-extrabold text-3xl text-neutral-700 group-hover:text-orange-500/50 transition-colors">
                  {step.num}
                </span>
              </div>

              <span className={`inline-block px-2 py-0.5 rounded-[2px] text-[10px] font-brand font-bold border ${step.tagColor} mb-2`}>
                {step.tag}
              </span>

              <h3 className="font-rajdhani text-2xl font-bold text-white mb-1">
                {step.title}
              </h3>
              <div className="text-xs text-orange-400 font-mono mb-3">
                {step.subtitle}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-6 font-normal">
                {step.desc}
              </p>

              {/* Highlights List */}
              <div className="space-y-2 border-t border-neutral-800/80 pt-4">
                {step.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-neutral-800/80">
              <Link
                to="/community/projects"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-white transition-colors"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
