// frontend/src/components/features/DevInteractiveTerminal.tsx

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  GitBranch,
  GitPullRequest,
  Layers,
  Copy,
  Check,
  Code2,
  Cpu,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';

type TerminalTab = 'cli' | 'git' | 'code' | 'radar';

export const DevInteractiveTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TerminalTab>('cli');
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'risetogether --status',
  ]);
  const [activeOutput, setActiveOutput] = useState<string>('status');
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunCommand = (cmdKey: string, cmdStr: string) => {
    if (isExecuting) return;
    setIsExecuting(true);
    setCommandHistory((prev) => [...prev.slice(-3), cmdStr]);
    setActiveOutput('running');

    setTimeout(() => {
      setActiveOutput(cmdKey);
      setIsExecuting(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('npm create risetogether-app@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-[4px] bg-neutral-950/95 border border-neutral-800 shadow-2xl backdrop-blur-xl overflow-hidden text-left relative group">
      
      {/* 1. Terminal Top Bar */}
      <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Traffic Light Window Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
          
          <div className="h-3.5 w-px bg-neutral-800 mx-1" />

          {/* Terminal Title & Branch */}
          <div className="flex items-center gap-2">
            <span className="font-brand text-[11px] font-bold text-white tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              DEV_ENVIRONMENT // v2.4
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-neutral-800 text-[10px] font-mono text-gray-400 border border-neutral-700/60">
              <GitBranch className="w-2.5 h-2.5 text-emerald-400" />
              main*
            </span>
          </div>
        </div>

        {/* Live Network Pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-brand font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            REALTIME_SYNC
          </span>
        </div>
      </div>

      {/* 2. Interactive Terminal Tab Selector */}
      <div className="flex items-center border-b border-neutral-800/80 bg-neutral-950/90 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cli')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cli'
              ? 'border-orange-500 text-orange-400 bg-neutral-900/50'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Terminal className="w-3 h-3" />
          <span>bash:~/risetogether</span>
        </button>

        <button
          onClick={() => setActiveTab('git')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'git'
              ? 'border-orange-500 text-orange-400 bg-neutral-900/50'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <GitPullRequest className="w-3 h-3 text-cyan-400" />
          <span>sprint_prs.log</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'code'
              ? 'border-orange-500 text-orange-400 bg-neutral-900/50'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Code2 className="w-3 h-3 text-amber-400" />
          <span>App.tsx</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'radar'
              ? 'border-orange-500 text-orange-400 bg-neutral-900/50'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Layers className="w-3 h-3 text-purple-400" />
          <span>architecture.spec</span>
        </button>
      </div>

      {/* 3. Terminal Content Viewport */}
      <div className="p-4 sm:p-5 font-fira text-xs min-h-[300px] max-h-[360px] overflow-y-auto bg-black/90 selection:bg-orange-500/30 selection:text-white">
        
        {/* TAB 1: BASH CLI INTERACTIVE SIMULATOR */}
        {activeTab === 'cli' && (
          <div className="space-y-4">
            
            {/* Command Trigger Chips */}
            <div className="p-2.5 rounded-[3px] bg-neutral-900/70 border border-neutral-800">
              <div className="text-[10px] text-gray-400 font-brand uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Quick Execute Commands:</span>
                <span className="text-orange-400 font-normal">Click to execute</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleRunCommand('status', 'risetogether --status')}
                  className="px-2 py-1 rounded-[2px] bg-black/80 hover:bg-neutral-800 border border-neutral-700/80 text-orange-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>risetogether --status</span>
                </button>
                <button
                  onClick={() => handleRunCommand('sprints', 'git fetch --sprints')}
                  className="px-2 py-1 rounded-[2px] bg-black/80 hover:bg-neutral-800 border border-neutral-700/80 text-cyan-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>git fetch --sprints</span>
                </button>
                <button
                  onClick={() => handleRunCommand('build', 'npm run build:prod')}
                  className="px-2 py-1 rounded-[2px] bg-black/80 hover:bg-neutral-800 border border-neutral-700/80 text-amber-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>npm run build:prod</span>
                </button>
                <button
                  onClick={() => handleRunCommand('squad', 'squad init --hackathon SIH')}
                  className="px-2 py-1 rounded-[2px] bg-black/80 hover:bg-neutral-800 border border-neutral-700/80 text-emerald-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>squad init SIH</span>
                </button>
              </div>
            </div>

            {/* Prompt & Output */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-emerald-400 font-semibold font-brand">user@risetogether</span>
                <span className="text-gray-600">:</span>
                <span className="text-cyan-400">~/community</span>
                <span className="text-orange-500 font-bold">$</span>
                <span className="text-white font-mono">{commandHistory[commandHistory.length - 1]}</span>
              </div>

              {isExecuting ? (
                <div className="flex items-center gap-2 text-orange-400 py-3">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing cluster query...</span>
                </div>
              ) : activeOutput === 'status' ? (
                <div className="text-gray-300 space-y-1.5 pl-2 border-l-2 border-orange-500/40 py-1">
                  <div className="text-emerald-400 font-semibold font-brand text-[11px] flex items-center gap-1.5">
                    <Check className="w-3 h-3" />
                    <span>SYSTEM ONLINE // CLUSTER STATUS: OPTIMAL</span>
                  </div>
                  <div className="text-gray-400 text-[11px] space-y-0.5">
                    <div>├── <span className="text-white font-semibold">500+</span> Active Builders across 40+ Colleges</div>
                    <div>├── <span className="text-cyan-400">34</span> Open-Source Repositories (React 19 / Django / PyTorch)</div>
                    <div>├── <span className="text-amber-400">120+</span> Merged Production Pull Requests this month</div>
                    <div>└── <span className="text-emerald-400">100%</span> Free Peer Mentorship & Code Review Pipeline</div>
                  </div>
                </div>
              ) : activeOutput === 'sprints' ? (
                <div className="text-gray-300 space-y-1.5 pl-2 border-l-2 border-cyan-500/40 py-1">
                  <div className="text-cyan-400 font-brand font-semibold text-[11px]">
                    ACTIVE COMMITS // 4 SPRINT STREAMS
                  </div>
                  <div className="text-gray-400 text-[11px] space-y-1">
                    <div><span className="text-emerald-400">● [feat/rag-vector]</span> smart-study-ai: Vector search embeddings added</div>
                    <div><span className="text-orange-400">● [fix/auth-csrf]</span> risetogether-core: HttpOnly CSRF session hardening</div>
                    <div><span className="text-purple-400">● [feat/dashboard]</span> devpulse-app: Real-time contribution timeline shipped</div>
                  </div>
                </div>
              ) : activeOutput === 'build' ? (
                <div className="text-gray-300 space-y-1.5 pl-2 border-l-2 border-amber-500/40 py-1">
                  <div className="text-amber-400 font-brand font-semibold text-[11px]">
                    VITE PRODUCTION COMPILATION // 0 ERRORS
                  </div>
                  <div className="text-gray-400 text-[11px] space-y-0.5">
                    <div>✓ built in <span className="text-white font-semibold">412ms</span></div>
                    <div>dist/index.html                   <span className="text-emerald-400">0.82 kB</span> │ gzip: 0.44 kB</div>
                    <div>dist/assets/index-D7h.css         <span className="text-cyan-400">24.16 kB</span> │ gzip: 5.12 kB</div>
                    <div>dist/assets/index-C8k.js         <span className="text-purple-400">324.50 kB</span> │ gzip: 98.40 kB</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-300 space-y-1.5 pl-2 border-l-2 border-emerald-500/40 py-1">
                  <div className="text-emerald-400 font-brand font-semibold text-[11px]">
                    HACKATHON SQUAD INITIALIZED
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    Repository workspace created for Smart India Hackathon. Squad members invited: [Frontend, ML Lead, Backend, UI/UX].
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GIT SPRINT LOGS */}
        {activeTab === 'git' && (
          <div className="space-y-3">
            <div className="text-gray-400 text-[11px] font-brand tracking-wide text-cyan-400 mb-2">
              COMMUNITY SPRINT LOGS // git log --oneline
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-[3px] bg-neutral-900/60 border border-neutral-800 text-gray-300">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-emerald-400 font-mono font-semibold">commit 8f3c92a</span>
                  <span className="text-gray-400">10m ago</span>
                </div>
                <div className="text-white font-medium text-xs">feat: Implement vector similarity search for student notes</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                  <span>Author: @aarav_ai</span>
                  <span className="text-emerald-400">+142</span>
                  <span className="text-red-400">-12</span>
                </div>
              </div>

              <div className="p-2.5 rounded-[3px] bg-neutral-900/60 border border-neutral-800 text-gray-300">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-cyan-400 font-mono font-semibold">commit 4a7b11d</span>
                  <span className="text-gray-400">1h ago</span>
                </div>
                <div className="text-white font-medium text-xs">refactor: Optimize PostgreSQL queries with select_related for feeds</div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                  <span>Author: @rohan_code</span>
                  <span className="text-emerald-400">+68</span>
                  <span className="text-red-400">-44</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REACT 19 CODE PREVIEW */}
        {activeTab === 'code' && (
          <div className="space-y-2 text-gray-300">
            <div className="text-gray-400 text-[11px] font-brand tracking-wide text-amber-400 mb-2">
              REACT 19 + TYPESCRIPT COMPONENT
            </div>
            <pre className="text-gray-300 text-[11px] font-mono leading-relaxed bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
              <span className="text-purple-400">export const</span> <span className="text-cyan-400">CommunityFeed</span>: <span className="text-amber-400">React.FC</span> = () =&gt; &#123;{'\n'}
              {'  '}<span className="text-purple-400">const</span> &#123; data: posts, isLoading &#125; = <span className="text-cyan-400">useFeedQuery</span>();{'\n'}
              {'  '}<span className="text-purple-400">if</span> (isLoading) <span className="text-purple-400">return</span> &lt;<span className="text-orange-400">LoadingState</span> /&gt;;{'\n'}
              {'\n'}
              {'  '}<span className="text-purple-400">return</span> ({'\n'}
              {'    '}&lt;<span className="text-orange-400">div</span> <span className="text-cyan-400">className</span>=<span className="text-emerald-400">"space-y-4 max-w-2xl mx-auto"</span>&gt;{'\n'}
              {'      '}&#123;posts.map((post) =&gt; (&lt;<span className="text-orange-400">FeedPostCard</span> <span className="text-cyan-400">key</span>=&#123;post.id&#125; <span className="text-cyan-400">post</span>=&#123;post&#125; /&gt;))&#125;{'\n'}
              {'    '}&lt;/<span className="text-orange-400">div</span>&gt;{'\n'}
              {'  '});{'\n'}
              &#125;;
            </pre>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center justify-between">
              <span>✓ Typecheck Passed (TypeScript 5.8, Strict Null Checks)</span>
              <span className="font-brand font-bold">READY</span>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHITECTURE RADAR */}
        {activeTab === 'radar' && (
          <div className="space-y-3">
            <div className="text-gray-400 text-[11px] font-brand tracking-wide text-purple-400 mb-2">
              COMMUNITY ARCHITECTURE SPECIFICATION
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-orange-400 font-brand font-semibold text-[10px]">BACKEND DOMAIN</div>
                <div className="text-gray-200 mt-1 font-mono">Django 5.2 + DRF</div>
                <div className="text-gray-400 text-[10px]">Modular Monolith & PostgreSQL</div>
              </div>
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-cyan-400 font-brand font-semibold text-[10px]">CLIENT LAYER</div>
                <div className="text-gray-200 mt-1 font-mono">React 19 + TypeScript</div>
                <div className="text-gray-400 text-[10px]">Vite SPA & Glassmorphism</div>
              </div>
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-emerald-400 font-brand font-semibold text-[10px]">PROJECT SQUADS</div>
                <div className="text-gray-200 mt-1 font-mono">Git Flow & PRs</div>
                <div className="text-gray-400 text-[10px]">Multi-College Sprint Teams</div>
              </div>
              <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="text-purple-400 font-brand font-semibold text-[10px]">COLLABORATION</div>
                <div className="text-gray-200 mt-1 font-mono">Peer Reviews & Mentors</div>
                <div className="text-gray-400 text-[10px]">1-on-1 Alumni Engineering Guidance</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Terminal Bottom Quick Launch */}
      <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-900 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 font-mono">$</span>
          <span className="text-gray-300 font-mono">npm create risetogether-app@latest</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-white px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

    </div>
  );
};

