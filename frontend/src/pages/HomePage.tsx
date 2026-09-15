// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { publicApi } from '../api/public';
import { communityApi } from '../api/community';
import { Blog, Project, Activity } from '../types/community';
import { SiteContentResponse } from '../types/public';
import {
  Sparkles,
  ArrowRight,
  Users,
  Trophy,
  Rocket,
  BookOpen,
  FolderGit2,
  Calendar,
  Send,
  ChevronDown,
  Hammer,
  Medal,
  Award,
  BookMarked,
  Video,
  FileText,
  FileCode,
  Wrench,
  ChevronRight,
  CheckCircle2,
  Terminal,
  MessageSquare,
  Clock,
  Layers,
  Zap,
  Code2,
  GitBranch,
  Cpu,
  Monitor,
  Check,
  ShieldCheck,
  Briefcase,
  Target,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [siteData, setSiteData] = useState<SiteContentResponse | null>(null);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);
  const [activeResourceCategory, setActiveResourceCategory] = useState<string>('all');
  const [activeQuarterMonth, setActiveQuarterMonth] = useState<number>(1);
  const [activeWorkstationTab, setActiveWorkstationTab] = useState<'manifest' | 'engine' | 'matrix'>('manifest');

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  useEffect(() => {
    publicApi.getSiteContent().then(setSiteData).catch(console.error);
    communityApi.getBlogs({ page: 1 }).then((res) => setFeaturedBlogs(res.results.slice(0, 3))).catch(console.error);
    communityApi.getProjects({ page: 1 }).then((res) => setFeaturedProjects(res.results.slice(0, 3))).catch(console.error);
    communityApi.getActivities({ page: 1 }).then((res) => setFeaturedActivities(res.results.slice(0, 3))).catch(console.error);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    try {
      setSubmittingContact(true);
      const res = await publicApi.submitContact({
        name: contactName,
        email: contactEmail,
        message: `[${contactSubject}] ${contactMessage}`,
      });
      toastSuccess(res.message || 'Thank you for reaching out! We will be in touch shortly.');
      setContactName('');
      setContactEmail('');
      setContactSubject('General Inquiry');
      setContactMessage('');
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to submit contact message.');
    } finally {
      setSubmittingContact(false);
    }
  };

  const stats = siteData?.stats || {
    membersCount: 150,
    sessionsCount: 75,
    projectsCount: 25,
    blogsCount: 18,
    activitiesCount: 12,
  };

  const faqs = siteData?.faqs || [
    {
      id: 1,
      question: 'What is RiseTogether?',
      answer: 'Rise Together is an open-source student tech community where future developers, designers, and innovators come together to learn, build collaborative projects, and grow their careers.',
    },
    {
      id: 2,
      question: 'How do I join the community?',
      answer: 'Joining is 100% free! Simply click "Join the Community" to create an account, access learning workshops, join project teams, and start sharing your journey.',
    },
    {
      id: 3,
      question: 'What is Grind 500 and the Leaderboard?',
      answer: 'Grind 500 is our gamified algorithm problem-solving arena. You can post problem solutions, earn activity points based on problem difficulty and time complexity, build daily streaks, and compete on the overall, daily, weekly, and monthly leaderboards.',
    },
    {
      id: 4,
      question: 'Can I showcase my own projects and write blogs?',
      answer: 'Yes! Registered members can publish technical guides to the blog index, showcase GitHub repositories with live links, and share code snippets directly on the social feed.',
    },
  ];

  const resources = [
    {
      id: 1,
      title: 'Full Stack Development Course',
      category: 'videos',
      categoryLabel: 'Video Series',
      description: 'Complete MERN & Django stack development tutorial series covering React, TypeScript, APIs, and PostgreSQL.',
      meta: '45 hours',
      icon: <Video className="w-5 h-5 text-red-400" />,
      link: 'https://youtube.com',
      actionText: 'Watch Course',
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms Handbook',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Comprehensive guide covering all essential DSA patterns with solved visual problems and complexity breakdowns.',
      meta: '250 pages',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      link: '#',
      actionText: 'Download PDF',
    },
    {
      id: 3,
      title: 'AI & Machine Learning Fundamentals',
      category: 'articles',
      categoryLabel: 'Article Series',
      description: 'In-depth articles explaining neural networks, transformer architectures, and practical ML deployment.',
      meta: '12 articles',
      icon: <BookMarked className="w-5 h-5 text-emerald-400" />,
      link: '/community/blogs',
      actionText: 'Read Articles',
    },
    {
      id: 4,
      title: 'Mobile App Engineering Masterclass',
      category: 'videos',
      categoryLabel: 'Video Workshop',
      description: 'Cross-platform mobile development using React Native, native device APIs, and state management.',
      meta: '8 hours',
      icon: <Video className="w-5 h-5 text-purple-400" />,
      link: 'https://youtube.com',
      actionText: 'Watch Workshop',
    },
    {
      id: 5,
      title: 'Essential Developer Toolkit',
      category: 'tools',
      categoryLabel: 'Dev Tools',
      description: 'Curated list of 50+ developer utilities, IDE setups, debuggers, and terminal workflows.',
      meta: '50+ tools',
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      link: '/community/resources',
      actionText: 'Explore Tools',
    },
    {
      id: 6,
      title: 'System Design & Scalability Guide',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Complete architecture handbook covering caching, database sharding, microservices, and high availability.',
      meta: '180 pages',
      icon: <FileCode className="w-5 h-5 text-cyan-400" />,
      link: '#',
      actionText: 'Download PDF',
    },
  ];

  const filteredResources =
    activeResourceCategory === 'all'
      ? resources
      : resources.filter((r) => r.category === activeResourceCategory);

  // 3-Month Quarterly Schedule Data
  const quarterlyRoadmap = [
    {
      monthIndex: 1,
      monthName: 'Month 01',
      monthTitle: 'Foundation & Algorithmic Sprint',
      period: 'Weeks 1 – 4',
      events: [
        {
          id: 'q1-e1',
          tag: 'LIVE WORKSHOP',
          tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          title: 'Advanced DSA Patterns & Complexity Analysis',
          description: 'Master sliding windows, two pointers, dynamic programming memos, and tree traversals for high-frequency interview patterns.',
          timing: 'Every Saturday • 18:00 IST',
          lead: 'DSA Lead • Grind 500 Core',
          link: '/community/activities',
          actionText: 'RSVP Workshop',
        },
        {
          id: 'q1-e2',
          tag: 'HACK SPRINT',
          tagColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          title: '24-Hour Beginner Open-Source Hackathon',
          description: 'First-time contributor sprint fixing issues, authoring documentation, and shipping feature PRs across community repos.',
          timing: 'Weekend 3 • 48H Nonstop',
          lead: 'Open Source Mentors',
          link: '/community/projects',
          actionText: 'Join Sprint',
        },
      ],
    },
    {
      monthIndex: 2,
      monthName: 'Month 02',
      monthTitle: 'Production Systems & Full Stack Mastery',
      period: 'Weeks 5 – 8',
      events: [
        {
          id: 'q2-e1',
          tag: 'SYSTEM DESIGN',
          tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          title: 'Scalable Microservices, Redis Caching & Celery',
          description: 'Hands-on architectural masterclass on rate limiters, message brokers, caching strategies, and database sharding.',
          timing: 'Alternate Thursdays • 19:30 IST',
          lead: 'Backend Architect',
          link: '/community/activities',
          actionText: 'Register Free',
        },
        {
          id: 'q2-e2',
          tag: 'COMMUNITY DEMO',
          tagColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          title: 'Mid-Quarter Full-Stack Project Milestone Reviews',
          description: 'Live code review and architecture evaluations for student teams building AI tools, developer utilities, and web apps.',
          timing: 'Week 8 Sunday • 16:00 IST',
          lead: 'Student Project Leads',
          link: '/community/projects',
          actionText: 'Submit Project',
        },
      ],
    },
    {
      monthIndex: 3,
      monthName: 'Month 03',
      monthTitle: 'National Demo Day & Career Placement Summit',
      period: 'Weeks 9 – 12',
      events: [
        {
          id: 'q3-e1',
          tag: 'NATIONAL SUMMIT',
          tagColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          title: 'RiseTogether National Demo Day & Tech Summit',
          description: 'Top student teams pitch their software to industry leaders, alumni SWEs, and founders with cash prizes & trophy awards.',
          timing: 'Week 11 Finale • All-Day Event',
          lead: 'RiseTogether Leadership',
          link: '/community/activities',
          actionText: 'Attend Summit',
        },
        {
          id: 'q3-e2',
          tag: 'CAREER ACCELERATOR',
          tagColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          title: 'Senior SWE Mock Interviews & Referral Drive',
          description: '1-on-1 technical mock interviews, resume teardowns, and direct referral distribution to top tech companies.',
          timing: 'Week 12 • Scheduled Slots',
          lead: 'Alumni Network',
          link: '/feed',
          actionText: 'Book Slot',
        },
      ],
    },
  ];

  const currentMonthData = quarterlyRoadmap.find((m) => m.monthIndex === activeQuarterMonth) || quarterlyRoadmap[0];

  return (
    <div className="w-full space-y-28 sm:space-y-36 overflow-hidden text-gray-100 font-inter pb-24 bg-black">
      
      {/* ========================================================================= */}
      {/* 1. HERO COMMAND CENTER (100VH / 100VW WITH LIVE RADAR & HUD)             */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="w-full h-screen min-h-[100dvh] flex flex-col justify-between pt-20 sm:pt-24 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden bg-black"
      >
        {/* BACKGROUND ACCENTS & GRID PATTERN */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

        {/* HERO TOP & CENTER CONTENT GRID */}
        <div className="relative z-10 w-full flex-1 flex items-center">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Column: Command & Vision */}
            <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5">
              
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[3px] bg-neutral-950 border border-neutral-800 text-xs font-mono text-gray-300 shadow-sm">
                <span className="w-2 h-2 rounded-[1px] bg-emerald-500 animate-ping" />
                <span className="text-emerald-400 font-semibold">● SYSTEM ONLINE</span>
                <span className="text-neutral-600">|</span>
                <span className="text-gray-400">500+ Devs Active</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="font-rajdhani text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
                  RISE <span className="text-orange-500">TOGETHER</span>
                </h1>
                <p className="text-base sm:text-xl lg:text-2xl font-rajdhani font-bold mt-2 tracking-wider text-gray-300">
                  LEARN. <span className="text-orange-400">BUILD.</span> GROW.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm lg:text-base text-gray-300 max-w-xl leading-relaxed font-normal">
                India's premier student developer ecosystem. Master algorithmic problem solving in Grind 500, architect production software in collaborative sprints, and launch your engineering career.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={isAuthenticated ? '/feed' : '/join'}
                  className="h-11 px-6 rounded-[3px] text-xs sm:text-sm font-semibold tracking-wide bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>{isAuthenticated ? 'Enter Community Feed' : 'Join Community Free'}</span>
                </Link>

                <Link
                  to="/leaderboard"
                  className="h-11 px-5 rounded-[3px] text-xs sm:text-sm font-semibold text-gray-200 hover:text-white border border-neutral-800 hover:border-neutral-700 bg-neutral-950 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Grind 500 Arena</span>
                </Link>

                <Link
                  to="/community/projects"
                  className="h-11 px-4 rounded-[3px] text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-200 border border-neutral-800 hover:border-neutral-700 bg-black transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Live Developer Radar & Code Stream */}
            <div className="lg:col-span-5 hidden md:block">
              <div className="rounded-[3px] bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden font-mono text-left">
                {/* Radar Header */}
                <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-[1px] bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-[1px] bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500" />
                    <span className="text-xs text-gray-300 ml-2 font-semibold">live-radar.log</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-[2px] border border-emerald-500/20">
                    REALTIME STREAM
                  </span>
                </div>

                {/* Radar Body Stream */}
                <div className="p-4 space-y-2.5 text-xs text-gray-300 bg-black/90">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pb-1 border-b border-neutral-900">
                    <span>TIMESTAMP</span>
                    <span>ACTIVITY DISPATCH</span>
                    <span>STATUS</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] hover:bg-neutral-900/40 p-1 rounded-[2px] transition-colors">
                    <span className="text-gray-500">14:32:10</span>
                    <span className="text-white"><span className="text-orange-400">@aarav</span> solved "LRU Cache"</span>
                    <span className="text-emerald-400 font-semibold">+45 pts</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] hover:bg-neutral-900/40 p-1 rounded-[2px] transition-colors">
                    <span className="text-gray-500">14:30:45</span>
                    <span className="text-white"><span className="text-purple-400">@team_alpha</span> merged PR #32</span>
                    <span className="text-cyan-400 font-semibold">React 19</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] hover:bg-neutral-900/40 p-1 rounded-[2px] transition-colors">
                    <span className="text-gray-500">14:28:12</span>
                    <span className="text-white"><span className="text-orange-400">@priya</span> solved "Two Sum"</span>
                    <span className="text-emerald-400 font-semibold">0ms (100%)</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] hover:bg-neutral-900/40 p-1 rounded-[2px] transition-colors">
                    <span className="text-gray-500">14:24:00</span>
                    <span className="text-white"><span className="text-amber-400">@rohan</span> unlocked 30d Streak</span>
                    <span className="text-amber-400 font-semibold">🔥 Diamond</span>
                  </div>

                  {/* System Metrics Strip */}
                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Cpu className="w-3 h-3" /> Latency: 4ms
                    </span>
                    <span>Memory: 14.2 MB</span>
                    <span>Uptime: 99.99%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* HERO ANCHORED HUD METRICS STRIP (FITS WITHIN 100VH) */}
        <div className="relative z-10 w-full mt-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-3.5 rounded-[3px] bg-neutral-950/90 border border-neutral-800 backdrop-blur-md shadow-2xl">
            <div className="text-center p-1.5">
              <div className="text-xl sm:text-2xl font-bold text-orange-500 font-rajdhani">{stats.membersCount}+</div>
              <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider font-medium">Active Members</div>
            </div>
            <div className="text-center p-1.5 border-l border-neutral-800">
              <div className="text-xl sm:text-2xl font-bold text-orange-500 font-rajdhani">{stats.sessionsCount}+</div>
              <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider font-medium">Tech Sessions</div>
            </div>
            <div className="text-center p-1.5 border-t sm:border-t-0 sm:border-l border-neutral-800">
              <div className="text-xl sm:text-2xl font-bold text-orange-500 font-rajdhani">{stats.projectsCount}+</div>
              <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider font-medium">Projects Built</div>
            </div>
            <div className="text-center p-1.5 border-t sm:border-t-0 border-l border-neutral-800">
              <div className="text-xl sm:text-2xl font-bold text-orange-500 font-rajdhani">25+</div>
              <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider font-medium">Hackathon Wins</div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. WHO WE ARE (EQUAL HEIGHT + REALISTIC IDE WORKSTATION DISPLAY)          */}
      {/* ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-[3px] bg-neutral-950/80 border border-neutral-800 text-left flex flex-col justify-between h-full shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Who We Are</span>
              </div>
              <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-3">
                BUILDING THE FUTURE OF <span className="text-orange-500">STUDENT TECH</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Rise Together is a student-founded engineering movement engineered to eliminate the gap between textbook theory and modern production software development. We provide free collaborative environments, algorithmic rigor, and peer review standards.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Free & Open-Source Community with No Hidden Paywalls</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Collaborative Real-World Engineering with Git Pull Requests</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Senior Student Mentorship, Resume Reviews & Referral Directs</span>
                </div>
              </div>
            </div>

            {/* Bottom Metric Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800">
              <div className="p-3 rounded-[3px] bg-black border border-neutral-800">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">500+</div>
                <div className="text-[11px] text-gray-400">Students Active</div>
              </div>
              <div className="p-3 rounded-[3px] bg-black border border-neutral-800">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">20+</div>
                <div className="text-[11px] text-gray-400">Universities</div>
              </div>
              <div className="p-3 rounded-[3px] bg-black border border-neutral-800">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">100%</div>
                <div className="text-[11px] text-gray-400">Open Access</div>
              </div>
            </div>
          </div>

          {/* Right Workstation IDE Display Container (Equal Height) */}
          <div className="lg:col-span-6 flex flex-col h-full rounded-[3px] bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden font-mono text-left">
            
            {/* Monitor / Bezel Titlebar with Tabs */}
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-green-500/80" />
                </div>
                {/* Tabs */}
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => setActiveWorkstationTab('manifest')}
                    className={`px-3 py-1 rounded-[2px] text-xs font-mono transition-colors cursor-pointer ${
                      activeWorkstationTab === 'manifest'
                        ? 'bg-black text-orange-400 border border-neutral-800'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    manifest.ts
                  </button>
                  <button
                    onClick={() => setActiveWorkstationTab('engine')}
                    className={`px-3 py-1 rounded-[2px] text-xs font-mono transition-colors cursor-pointer ${
                      activeWorkstationTab === 'engine'
                        ? 'bg-black text-orange-400 border border-neutral-800'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    dsa_engine.py
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <Monitor className="w-3.5 h-3.5 text-gray-400" />
                <span>DISPLAY // 60Hz</span>
              </div>
            </div>

            {/* Code Editor Pane */}
            <div className="flex-1 p-5 text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-gray-300 bg-black/95 flex flex-col justify-between">
              {activeWorkstationTab === 'manifest' ? (
                <div className="space-y-1">
                  <p><span className="text-purple-400">export const</span> <span className="text-yellow-300">RiseTogether</span>: <span className="text-cyan-400">Community</span> = &#123;</p>
                  <p className="pl-4"><span className="text-blue-300">name</span>: <span className="text-emerald-300">'RiseTogether Ecosystem'</span>,</p>
                  <p className="pl-4"><span className="text-blue-300">established</span>: <span className="text-amber-300">2024</span>,</p>
                  <p className="pl-4"><span className="text-blue-300">corePillars</span>: [<span className="text-emerald-300">'Learn'</span>, <span className="text-emerald-300">'Build'</span>, <span className="text-emerald-300">'Grow'</span>],</p>
                  <p className="pl-4"><span className="text-blue-300">features</span>: &#123;</p>
                  <p className="pl-8"><span className="text-blue-300">dsaGrindArena</span>: <span className="text-orange-400">true</span>,</p>
                  <p className="pl-8"><span className="text-blue-300">collaborativeProjects</span>: <span className="text-orange-400">true</span>,</p>
                  <p className="pl-8"><span className="text-blue-300">careerAccelerators</span>: <span className="text-orange-400">true</span>,</p>
                  <p className="pl-4">&#125;,</p>
                  <p className="pl-4"><span className="text-blue-300">isOpenSource</span>: <span className="text-orange-400">true</span>,</p>
                  <p>&#125;;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p><span className="text-purple-400">class</span> <span className="text-yellow-300">Grind500Engine</span>:</p>
                  <p className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-300">calculate_score</span>(self, difficulty, complexity, streak):</p>
                  <p className="pl-8">base_pts = &#123;<span className="text-emerald-300">'Easy'</span>: 10, <span className="text-emerald-300">'Medium'</span>: 25, <span className="text-emerald-300">'Hard'</span>: 50&#125;[difficulty]</p>
                  <p className="pl-8">streak_mult = 1.5 <span className="text-purple-400">if</span> streak &gt; 7 <span className="text-purple-400">else</span> 1.0</p>
                  <p className="pl-8"><span className="text-purple-400">return</span> int(base_pts * streak_mult)</p>
                </div>
              )}

              {/* Status Console Footer */}
              <div className="mt-6 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-gray-400">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Build Succeeded (0 errors)
                </span>
                <span className="text-gray-500 font-mono">UTF-8 • TSX/Py</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR MISSION (INTERACTIVE 3-STAGE MISSION PIPELINE)                      */}
      {/* ========================================================================= */}
      <section id="mission" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Mission Blueprint</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">
            OUR <span className="text-orange-500">MISSION</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            A structured developer flywheel accelerating students from fundamental code syntax to high-impact production engineering roles.
          </p>
        </div>

        {/* 3-Stage Pipeline Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Stage 01: LEARN */}
          <div className="p-6 rounded-[3px] bg-neutral-950/80 border border-neutral-800 hover:border-cyan-500/40 transition-all text-left flex flex-col justify-between relative overflow-hidden group shadow-md">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[3px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-[2px] text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  STAGE 01
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">Learn with Rigor</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Master modern engineering through structured workshops, interactive DSA problem-solving sessions, and system design fundamentals.
              </p>
            </div>
            <div className="space-y-2 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>DSA Patterns & Grind 500 Daily Streaks</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full-Stack Architecture Masterclasses</span>
              </div>
            </div>
          </div>

          {/* Stage 02: BUILD */}
          <div className="p-6 rounded-[3px] bg-neutral-950/80 border border-neutral-800 hover:border-orange-500/40 transition-all text-left flex flex-col justify-between relative overflow-hidden group shadow-md">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[3px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Hammer className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-[2px] text-[10px] font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  STAGE 02
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">Build Production Systems</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Transform ideas into software through collaborative open-source repositories, team hackathons, and sprint-based project deployments.
              </p>
            </div>
            <div className="space-y-2 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-orange-400" />
                <span>Collaborative Open-Source Repositories</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-orange-400" />
                <span>48-Hour HackSprint Competitions</span>
              </div>
            </div>
          </div>

          {/* Stage 03: GROW */}
          <div className="p-6 rounded-[3px] bg-neutral-950/80 border border-neutral-800 hover:border-purple-500/40 transition-all text-left flex flex-col justify-between relative overflow-hidden group shadow-md">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-[3px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-[2px] text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  STAGE 03
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">Grow Engineering Careers</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Unlock career placement via 1-on-1 technical mock interviews, verified resume reviews, and direct referral opportunities from alumni.
              </p>
            </div>
            <div className="space-y-2 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>Alumni 1-on-1 Technical Mock Interviews</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>Direct Job Referrals & Tech Summit</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACHIEVEMENTS & HACKATHON SHOWCASE                                      */}
      {/* ========================================================================= */}
      <section id="achievements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Trophy Room</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            NATIONAL <span className="text-orange-500">ACHIEVEMENTS</span>
          </h2>
        </div>

        {/* MAJOR SPOTLIGHT CARDS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          <div className="p-6 sm:p-7 rounded-[3px] bg-neutral-950/80 border border-neutral-800 shadow-md text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-[3px] flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-[3px] text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5" />
                  <span>1st Place Champions</span>
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-1">
                Smart India Hackathon 2024
              </h3>
              <p className="text-orange-400 font-medium text-xs mb-3">
                National Grand Finale Winners
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                Our student team secured 1st place in Smart India Hackathon with an innovative AI-powered education platform, competing against 10,000+ teams nationwide.
              </p>
            </div>
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-gray-400">
              <span>Date: March 2024</span>
              <span className="text-gray-300 font-medium">Team RiseTogether Alpha</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-[3px] bg-neutral-950/80 border border-neutral-800 shadow-md text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-[3px] flex items-center justify-center text-purple-400">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-[3px] text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Community Award</span>
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-1">
                Best Student Tech Movement 2024
              </h3>
              <p className="text-orange-400 font-medium text-xs mb-3">
                Tech Innovation Awards India
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                Recognized for outstanding contributions to student open-source adoption, algorithm problem solving consistency, and student employment rate.
              </p>
            </div>
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-gray-400">
              <span>Date: January 2024</span>
              <span className="text-gray-300 font-medium">Award of Excellence</span>
            </div>
          </div>

        </div>

        {/* COUNTER METRICS STRIP */}
        <div className="p-5 rounded-[3px] bg-neutral-950/80 border border-neutral-800 shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">25+</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Awards Won</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">50+</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Competitions</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">15+</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Press Features</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">20+</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Partnerships</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">500+</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Mentored</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. QUARTERLY SCHEDULE & ROADMAP (3-MONTH COMMUNITY CALENDAR)              */}
      {/* ========================================================================= */}
      <section id="activities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Quarterly Roadmap</span>
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              QUARTERLY <span className="text-orange-500">SCHEDULE & EVENTS</span>
            </h2>
          </div>

          {/* 3-Month Quarter Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-[3px] border border-neutral-800">
            {quarterlyRoadmap.map((month) => (
              <button
                key={month.monthIndex}
                type="button"
                onClick={() => setActiveQuarterMonth(month.monthIndex)}
                className={`h-8 px-3.5 rounded-[2px] text-xs font-semibold transition-all cursor-pointer ${
                  activeQuarterMonth === month.monthIndex
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {month.monthName}
              </button>
            ))}
          </div>
        </div>

        {/* Current Month Banner */}
        <div className="p-4 mb-6 rounded-[3px] bg-neutral-950 border border-neutral-800 flex items-center justify-between text-left">
          <div>
            <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">{currentMonthData.period}</span>
            <h3 className="font-rajdhani text-xl font-bold text-white mt-0.5">{currentMonthData.monthTitle}</h3>
          </div>
          <Link
            to="/community/activities"
            className="text-xs font-semibold text-gray-400 hover:text-orange-400 flex items-center gap-1"
          >
            <span>All Activities</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          {currentMonthData.events.map((ev) => (
            <div
              key={ev.id}
              className="p-5 sm:p-6 rounded-[3px] bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[3px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-semibold border ${ev.tagColor}`}>
                      {ev.tag}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{ev.timing}</span>
                  </div>
                  <h3 className="font-rajdhani text-xl font-bold text-white">{ev.title}</h3>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl">
                    {ev.description}
                  </p>
                  <div className="mt-2 text-[11px] text-gray-400">
                    Lead: <span className="text-gray-200">{ev.lead}</span>
                  </div>
                </div>
              </div>
              <Link
                to={ev.link}
                className="h-10 px-5 rounded-[3px] text-xs font-semibold bg-neutral-900 hover:bg-orange-500 text-gray-200 hover:text-white transition-colors shrink-0 flex items-center gap-1.5 border border-neutral-800"
              >
                <span>{ev.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEARNING RESOURCES (RICH MEDIA LIBRARY)                                 */}
      {/* ========================================================================= */}
      <section id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Knowledge Base</span>
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              LEARNING <span className="text-orange-500">RESOURCES</span>
            </h2>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'all', label: 'All (6)' },
              { key: 'videos', label: 'Videos (2)' },
              { key: 'pdfs', label: 'PDF Guides (2)' },
              { key: 'articles', label: 'Articles (1)' },
              { key: 'tools', label: 'Tools (1)' },
            ].map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveResourceCategory(cat.key)}
                className={`h-8 px-3.5 rounded-[3px] text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                  activeResourceCategory === cat.key
                    ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold shadow-sm'
                    : 'bg-black text-gray-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-[3px] bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-sm text-left"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[3px] bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    {res.icon}
                  </div>
                  <div>
                    <h3 className="font-rajdhani text-base font-bold text-white line-clamp-1">
                      {res.title}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {res.categoryLabel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {res.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                <span className="text-gray-400 font-mono text-[11px]">{res.meta}</span>
                <a
                  href={res.link}
                  className="px-3 py-1 rounded-[3px] text-xs font-semibold text-orange-400 hover:text-white hover:bg-orange-500/20 transition-colors inline-flex items-center gap-1"
                >
                  <span>{res.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROJECT HIGHLIGHTS (STUDENT PORTFOLIO SHOWCASE)                         */}
      {/* ========================================================================= */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Project Showcase</span>
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              COMMUNITY <span className="text-orange-500">PROJECTS</span>
            </h2>
          </div>
          <Link
            to="/community/projects"
            className="text-xs font-semibold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>Browse All Projects</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          <div className="rounded-[3px] bg-neutral-950/80 border border-neutral-800 overflow-hidden shadow-md text-left flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-neutral-900 text-gray-300 border border-neutral-800">
                    AI / ML
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-neutral-900 text-gray-300 border border-neutral-800">
                    Python
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-neutral-900 text-gray-300 border border-neutral-800">
                    TensorFlow
                  </span>
                </div>
                <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                  <Medal className="w-3.5 h-3.5" />
                  <span>Featured Project</span>
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">
                Smart Study Assistant
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                An AI-powered study companion that personalizes learning experiences, tracks student mastery, and provides automated coding solution recommendations.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-gray-400">By Community Core Team</span>
              <Link
                to="/community/projects"
                className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-[3px] bg-neutral-950/80 border border-neutral-800 overflow-hidden shadow-md text-left flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-neutral-900 text-gray-300 border border-neutral-800">
                    React Native
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-neutral-900 text-gray-300 border border-neutral-800">
                    Firebase
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-medium bg-neutral-900 text-gray-300 border border-neutral-800">
                    Mobile
                  </span>
                </div>
                <span className="text-xs text-purple-400 flex items-center gap-1 font-mono">
                  <Award className="w-3.5 h-3.5" />
                  <span>Hackathon Winner</span>
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">
                EcoTrack Mobile Platform
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                A sustainability-focused mobile app helping college students calculate carbon footprints and discover eco-friendly transit and dining alternatives.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-gray-400">By Student Contributors</span>
              <Link
                to="/community/projects"
                className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. STUDENT STORIES (VERIFIED DEVELOPER EXPERIENCES WITHOUT STARS)          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Student Stories</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            WHAT <span className="text-orange-500">MEMBERS SAY</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              quote:
                'Rise Together completely transformed my college experience. I went from knowing basic C++ to building full-stack web apps and winning hackathons with my team.',
              name: 'Aarav Sharma',
              role: 'Full Stack Member',
              badge: 'Cohort of \'24',
              placement: 'Placed @ Microsoft',
              avatar:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'The peer mentorship and collaborative project culture are unmatched. Writing blogs and sharing code problem solutions helped me land my first software engineering internship!',
              name: 'Priya Patel',
              role: 'Community Contributor',
              badge: 'Top Contributor',
              placement: 'SWE Intern',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'The Grind 500 leaderboard and daily coding streaks keep me consistent with algorithm practice. Best tech community for any aspiring developer.',
              name: 'Rohan Verma',
              role: 'DSA Lead',
              badge: 'Top 1% Grind 500',
              placement: 'Lead Mentor',
              avatar:
                'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[3px] bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between shadow-sm text-left relative overflow-hidden"
            >
              <div>
                {/* Verified Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-[2px] border border-emerald-500/20 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.badge}</span>
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono font-medium">
                    {t.placement}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-neutral-800 pt-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-[3px] object-cover border border-neutral-700"
                />
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FAQ ACCORDION SECTION                                                  */}
      {/* ========================================================================= */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FAQ Hub</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            FREQUENTLY ASKED <span className="text-orange-500">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaqIdx === idx;
            return (
              <div
                key={faq.id}
                className="rounded-[3px] border border-neutral-800 bg-neutral-950/80 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-rajdhani font-semibold text-base text-white hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. EQUAL-HEIGHT CONTACT HUB & MESSAGE FORM                               */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Contact Info Hub */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[3px] bg-neutral-950/80 border border-neutral-800 text-left flex flex-col justify-between h-full shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
                <Send className="w-3.5 h-3.5" />
                <span>Contact Hub</span>
              </div>
              <h2 className="font-rajdhani text-2xl sm:text-3xl font-bold uppercase text-white">
                TALK TO OUR <span className="text-orange-500">LEAD TEAM</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Have questions about organizing a workshop, college partnerships, or becoming a core contributor? Reach out directly.
              </p>
            </div>

            <div className="space-y-3 py-6">
              <div className="p-3.5 rounded-[3px] bg-black border border-neutral-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[3px] bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Email Support</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">contact@risetogether.tech</div>
                </div>
              </div>

              <div className="p-3.5 rounded-[3px] bg-black border border-neutral-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[3px] bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Office Hours</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">Mon – Sat • 10:00 AM – 8:00 PM IST</div>
                </div>
              </div>

              <div className="p-3.5 rounded-[3px] bg-black border border-neutral-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[3px] bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Average Response</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">&lt; 2 Hours on Community Discord</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Community Discord: <span className="text-orange-400">discord.gg/risetogether</span></span>
            </div>
          </div>

          {/* Right Form Card (Equal Height) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[3px] bg-neutral-950/80 border border-neutral-800 text-left flex flex-col justify-between h-full shadow-md">
            <div>
              <h3 className="font-rajdhani text-2xl font-bold uppercase text-white mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill in the details below and our leadership team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      required
                      className="w-full h-10 px-3.5 bg-black border border-neutral-800 rounded-[3px] text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@example.com"
                      required
                      className="w-full h-10 px-3.5 bg-black border border-neutral-800 rounded-[3px] text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Topic / Category
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full h-10 px-3.5 bg-black border border-neutral-800 rounded-[3px] text-sm text-gray-100 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="General Inquiry">General Community Inquiry</option>
                    <option value="Workshop Collaboration">Workshop / Event Collaboration</option>
                    <option value="Campus Ambassador">Campus Ambassador Program</option>
                    <option value="Grind 500 Feedback">Grind 500 & DSA Feedback</option>
                    <option value="Partnership">University / Industry Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help or collaborate with you?"
                    required
                    className="w-full p-3.5 bg-black border border-neutral-800 rounded-[3px] text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="h-11 px-7 rounded-[3px] font-semibold text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingContact ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

