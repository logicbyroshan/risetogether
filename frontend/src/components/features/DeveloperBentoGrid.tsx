// frontend/src/components/features/DeveloperBentoGrid.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Trophy,
  GitPullRequest,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  Medal,
  ChevronRight,
} from 'lucide-react';

export const DeveloperBentoGrid: React.FC = () => {
  const [squadApplied, setSquadApplied] = useState(false);

  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Section Header */}
      <div className="text-left mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-brand text-[10px]">THE DEVELOPER OS</span>
        </div>
        <h2 className="font-rajdhani text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
          BUILT FOR EVERY PHASE OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">YOUR JOURNEY.</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-2 leading-relaxed">
          From first-year student to lead engineer. Join hackathon squads, contribute production pull requests, receive architecture code reviews, and get placed.
        </p>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* ========================================================================= */}
        {/* CARD 1 (7 COLUMNS): INTERACTIVE SPRINT SQUAD BUILDER                     */}
        {/* ========================================================================= */}
        <div
          onMouseMove={handleSpotlightMouseMove}
          className="md:col-span-12 lg:col-span-7 p-6 sm:p-7 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-2xl flex flex-col justify-between relative overflow-hidden group text-left"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Badge & Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-brand font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>OPEN SOURCE SPRINT SQUADS</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                RECRUITING NOW
              </span>
            </div>

            <h3 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white mb-2">
              Assemble Multi-College Hackathon & Open Source Teams
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-normal">
              Never code alone again. Match with talented designers, backend engineers, and ML researchers from 40+ universities for national hackathons and 4-week build sprints.
            </p>

            {/* Interactive Squad Workspace Card */}
            <div className="p-4 rounded-[4px] bg-black/80 border border-neutral-800/90 shadow-inner space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-brand font-bold text-xs text-white">Squad: CyberSentry SIH 2025</span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">3 of 4 Filled</span>
              </div>

              {/* Role Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-[3px] bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80"
                      alt="Aarav"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">@aarav_ai</div>
                      <div className="text-[10px] text-gray-400">ML Lead • PyTorch</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">FILLED</span>
                </div>

                <div className="p-2.5 rounded-[3px] bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                      alt="Priya"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">@priya_dev</div>
                      <div className="text-[10px] text-gray-400">Frontend • React 19</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">FILLED</span>
                </div>

                <div className="p-2.5 rounded-[3px] bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80"
                      alt="Rohan"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">@rohan_code</div>
                      <div className="text-[10px] text-gray-400">UI/UX • Figma</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">FILLED</span>
                </div>

                <div className="p-2.5 rounded-[3px] bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                      +
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-orange-400">Backend Architect</div>
                      <div className="text-[10px] text-gray-400">Django 5.2 / Redis</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSquadApplied(true)}
                    disabled={squadApplied}
                    className="px-2.5 py-1 rounded-[2px] bg-orange-500 hover:bg-orange-600 text-white font-brand text-[10px] font-bold tracking-wider transition-colors cursor-pointer disabled:bg-emerald-600"
                  >
                    {squadApplied ? '✓ APPLIED' : 'APPLY'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer Link */}
          <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">Sprint 12 • 48H Nonstop</span>
            <Link
              to="/community/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-white transition-colors"
            >
              <span>Explore All Sprint Squads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2 (5 COLUMNS): NATIONAL HACKATHON TROPHY ROOM                        */}
        {/* ========================================================================= */}
        <div
          onMouseMove={handleSpotlightMouseMove}
          className="md:col-span-12 lg:col-span-5 p-6 sm:p-7 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-2xl flex flex-col justify-between relative overflow-hidden group text-left"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Trophy Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-brand font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>TROPHY ROOM & SHOWCASE</span>
              </div>
              <span className="text-amber-400 font-brand font-bold text-xs">25+ WINS</span>
            </div>

            <h3 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white mb-2">
              Smart India Hackathon Grand Champions
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5 font-normal">
              RiseTogether teams compete in tier-1 national hackathons, winning grand cash prizes, national recognition, and founder incubation grants.
            </p>

            {/* Achievement Highlight Strip */}
            <div className="p-3.5 rounded-[4px] bg-black/80 border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[3px] bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Medal className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Smart India Hackathon</div>
                    <div className="text-[10px] text-gray-400">National Grand Finale (1st Place)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-[2px] bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  ₹1,00,000
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] text-gray-400">
                <span>Next Hackathon Sprint:</span>
                <span className="text-orange-400 font-mono font-semibold">Weekend 3 • 40 Colleges</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">Verified Records</span>
            <Link
              to="/community/activities"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-white transition-colors"
            >
              <span>View Trophy Case</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3 (4 COLUMNS): PEER CODE REVIEWS & GIT FLOW                          */}
        {/* ========================================================================= */}
        <div
          onMouseMove={handleSpotlightMouseMove}
          className="md:col-span-6 lg:col-span-4 p-6 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-2xl flex flex-col justify-between relative overflow-hidden group text-left"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-brand font-bold mb-3">
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>PEER CODE REVIEWS</span>
            </div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">
              Production Git Standards
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Get detailed line-by-line PR feedback on architectural patterns, time complexity, and security from senior alumni maintainers.
            </p>

            {/* Code Diff Preview */}
            <div className="p-3 rounded-[3px] bg-black/90 border border-neutral-800 font-fira text-[11px] space-y-1">
              <div className="text-emerald-400">+ const token = await csrf.exchange();</div>
              <div className="text-gray-500">// Approved by @senior_mentor (Microsoft)</div>
              <div className="text-cyan-400 text-[10px] font-mono pt-1">✓ 0 Lint Errors • Staging Ready</div>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono">100% Free Reviews</span>
            <Link to="/community/projects" className="text-cyan-400 hover:text-white flex items-center gap-1">
              <span>View PRs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 4 (4 COLUMNS): ALUMNI PLACEMENT & CAREER ACCELERATOR                 */}
        {/* ========================================================================= */}
        <div
          onMouseMove={handleSpotlightMouseMove}
          className="md:col-span-6 lg:col-span-4 p-6 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-2xl flex flex-col justify-between relative overflow-hidden group text-left"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-brand font-bold mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CAREER ACCELERATOR</span>
            </div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">
              Alumni Direct Placement
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              1-on-1 technical mock interviews, resume teardowns, and verified direct referrals to tier-1 technology companies.
            </p>

            {/* Placement Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Microsoft', 'Google', 'Amazon', 'Razorpay', 'Swiggy', 'Uber'].map((comp) => (
                <span
                  key={comp}
                  className="px-2 py-0.5 rounded-[2px] bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-gray-300"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono">100+ Referrals</span>
            <Link to="/feed" className="text-purple-400 hover:text-white flex items-center gap-1">
              <span>Mock Slots</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5 (4 COLUMNS): SYSTEM ARCHITECTURE MASTERCLASSES                     */}
        {/* ========================================================================= */}
        <div
          onMouseMove={handleSpotlightMouseMove}
          className="md:col-span-12 lg:col-span-4 p-6 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card shadow-2xl flex flex-col justify-between relative overflow-hidden group text-left"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-brand font-bold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>SYSTEM DESIGN LABS</span>
            </div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">
              Production Architecture
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Weekly live workshops covering scalable microservices, Celery job queues, Redis sharding, and PostgreSQL indexing.
            </p>

            {/* Next Workshop Callout */}
            <div className="p-2.5 rounded-[3px] bg-black/90 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Distributed Redis Systems</div>
                <div className="text-[10px] text-gray-400">Sat 18:00 IST • 42/50 Seats</div>
              </div>
              <span className="px-2 py-0.5 rounded-[2px] bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                FREE RSVP
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-mono">Weekly Masterclasses</span>
            <Link to="/community/activities" className="text-emerald-400 hover:text-white flex items-center gap-1">
              <span>View Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
