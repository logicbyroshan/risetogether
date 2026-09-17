// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { publicApi } from '../api/public';
import { communityApi } from '../api/community';
import { Project } from '../types/community';
import { SiteContentResponse } from '../types/public';
import { DeveloperBackgroundCanvas } from '../components/common/DeveloperBackgroundCanvas';
import { LiveActivityTicker } from '../components/features/LiveActivityTicker';
import { DevInteractiveTerminal } from '../components/features/DevInteractiveTerminal';
import { DeveloperBentoGrid } from '../components/features/DeveloperBentoGrid';
import { ProjectShowcaseExplorer } from '../components/features/ProjectShowcaseExplorer';
import { DeveloperHowItWorks } from '../components/features/DeveloperHowItWorks';
import {
  Sparkles,
  ArrowRight,
  Users,
  FolderGit2,
  Calendar,
  Send,
  ChevronDown,
  BookMarked,
  Video,
  FileText,
  FileCode,
  Wrench,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [siteData, setSiteData] = useState<SiteContentResponse | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);
  const [activeResourceCategory, setActiveResourceCategory] = useState<string>('all');

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  useEffect(() => {
    publicApi.getSiteContent().then(setSiteData).catch(console.error);
    communityApi.getProjects({ page: 1 }).then((res) => setFeaturedProjects(res.results.slice(0, 6))).catch(console.error);
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
    membersCount: 500,
    sessionsCount: 75,
    projectsCount: 35,
    blogsCount: 28,
    activitiesCount: 18,
  };

  const defaultFaqs = [
    {
      id: 1,
      question: 'What is RiseTogether?',
      answer: 'RiseTogether is an open-source student tech community where future developers, designers, and innovators assemble to learn modern system design, build production-grade software, and accelerate their careers.',
    },
    {
      id: 2,
      question: 'How do I join the community?',
      answer: 'Joining is 100% free! Simply click "Join Community Free" to create an account, access learning workshops, join project sprint teams, and connect on the community social feed.',
    },
    {
      id: 3,
      question: 'How do Community Projects & Hackathon Squads work?',
      answer: 'RiseTogether organizes student-led sprint squads for national hackathons and open-source software. You can join an existing project squad, propose your own idea, submit pull requests, and get architectural code reviews from senior student mentors.',
    },
    {
      id: 4,
      question: 'Can I showcase my own projects and write blogs?',
      answer: 'Yes! Registered members can publish technical guides to the blog index, showcase GitHub repositories with live demo links, and share code snippets directly on the social feed.',
    },
    {
      id: 5,
      question: 'Are there peer mentorship and campus collaboration programs?',
      answer: 'Absolutely! RiseTogether connects senior students and industry alumni with beginners through weekly code reviews, mock technical interviews, and collaborative hackathon squads across 40+ engineering colleges.',
    },
    {
      id: 6,
      question: 'How do project sprint milestones work?',
      answer: 'Community project squads form around open-source ideas, commit to 4-week build sprints, receive architectural guidance from community maintainers, and showcase their applications during National Demo Day.',
    },
  ];

  const faqs = (siteData?.faqs && siteData.faqs.length > 0) ? siteData.faqs : defaultFaqs;

  const fallbackProjects: Project[] = [
    {
      id: 1,
      title: 'Smart Study Assistant',
      description: 'An AI-powered study companion that personalizes learning experiences, tracks student mastery, and provides automated coding solution recommendations.',
      details: 'Full ML recommendation engine with vector search and interactive flashcards.',
      category: { id: 1, name: 'AI & Machine Learning' },
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      skills: [
        { id: 1, name: 'Python', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 2, name: 'PyTorch', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 3, name: 'FastAPI', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 4, name: 'React', icon_type: 'icon', icon_class: null, icon_image: null },
      ],
      project_type: 'team',
      project_type_display: 'Team Sprint',
      leader: {
        id: 101,
        username: 'aarav_ai',
        email: 'aarav@risetogether.dev',
        role: 'member',
        role_display: 'Core Member',
        profile_pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        activity_score: 420,
        date_joined: '2024-01-01',
      },
      members: [],
      special_highlight: 'Featured Project',
      github_link: 'https://github.com',
      live_link: 'https://example.com',
      created_at: '2025-01-15T10:00:00Z',
      images: [],
    },
    {
      id: 2,
      title: 'EcoTrack Mobile Platform',
      description: 'A sustainability-focused mobile app helping college students calculate carbon footprints and discover eco-friendly transit and dining alternatives.',
      details: 'Cross platform mobile application with real-time location mapping and student challenges.',
      category: { id: 2, name: 'Mobile Engineering' },
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      skills: [
        { id: 5, name: 'React Native', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 6, name: 'Expo', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 7, name: 'Firebase', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 8, name: 'TailwindCSS', icon_type: 'icon', icon_class: null, icon_image: null },
      ],
      project_type: 'team',
      project_type_display: 'Hackathon Sprint',
      leader: {
        id: 102,
        username: 'priya_dev',
        email: 'priya@risetogether.dev',
        role: 'member',
        role_display: 'Core Member',
        profile_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        activity_score: 380,
        date_joined: '2024-01-15',
      },
      members: [],
      special_highlight: 'Hackathon Winner',
      github_link: 'https://github.com',
      live_link: 'https://example.com',
      created_at: '2025-02-01T14:30:00Z',
      images: [],
    },
    {
      id: 3,
      title: 'DevPulse Open-Source Dashboard',
      description: 'A unified developer metrics and contribution tracking dashboard designed to monitor GitHub sprint activities and developer scores.',
      details: 'High-performance developer portal integrated with GitHub Webhooks and real-time activity timelines.',
      category: { id: 3, name: 'Web Applications' },
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      skills: [
        { id: 9, name: 'React 19', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 10, name: 'TypeScript', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 11, name: 'Django', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 12, name: 'PostgreSQL', icon_type: 'icon', icon_class: null, icon_image: null },
      ],
      project_type: 'team',
      project_type_display: 'Open Source',
      leader: {
        id: 103,
        username: 'rohan_code',
        email: 'rohan@risetogether.dev',
        role: 'member',
        role_display: 'Core Member',
        profile_pic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        activity_score: 510,
        date_joined: '2023-11-20',
      },
      members: [],
      special_highlight: 'Open Source',
      github_link: 'https://github.com',
      live_link: 'https://example.com',
      created_at: '2025-02-15T09:15:00Z',
      images: [],
    },
    {
      id: 4,
      title: 'AlgoVisualizer 3D Platform',
      description: 'Interactive canvas tool visualizing complex graph traversals, dynamic programming recursion trees, and sorting mechanics step-by-step.',
      details: 'Educational open-source tool built by student developers to visually deconstruct difficult algorithmic patterns.',
      category: { id: 4, name: 'Educational Tech' },
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
      skills: [
        { id: 13, name: 'Canvas API', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 14, name: 'Algorithms', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 15, name: 'TypeScript', icon_type: 'icon', icon_class: null, icon_image: null },
        { id: 16, name: 'TailwindCSS', icon_type: 'icon', icon_class: null, icon_image: null },
      ],
      project_type: 'individual',
      project_type_display: 'Individual Build',
      leader: {
        id: 104,
        username: 'sneha_algo',
        email: 'sneha@risetogether.dev',
        role: 'member',
        role_display: 'Core Member',
        profile_pic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        activity_score: 470,
        date_joined: '2024-02-10',
      },
      members: [],
      special_highlight: 'Community Spotlight',
      github_link: 'https://github.com',
      live_link: 'https://example.com',
      created_at: '2025-02-28T16:45:00Z',
      images: [],
    },
  ];

  const displayProjects = featuredProjects.length >= 4
    ? featuredProjects.slice(0, 4)
    : [...featuredProjects, ...fallbackProjects.slice(featuredProjects.length, 4)];

  const resources = [
    {
      id: 1,
      title: 'Full Stack Development Masterclass',
      category: 'videos',
      categoryLabel: 'Video Series',
      description: 'Complete Django REST Framework & React 19 architecture series covering typed APIs, PostgreSQL, and token auth.',
      meta: '45 hours',
      icon: <Video className="w-5 h-5 text-red-400" />,
      link: 'https://youtube.com',
      actionText: 'Watch Series',
    },
    {
      id: 2,
      title: 'Production System Design Blueprint',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Comprehensive guide covering caching with Redis, message brokers with Celery, and database indexing strategies.',
      meta: '180 pages',
      icon: <FileCode className="w-5 h-5 text-cyan-400" />,
      link: '#',
      actionText: 'Download PDF',
    },
    {
      id: 3,
      title: 'AI & Transformers Engineering Handbook',
      category: 'articles',
      categoryLabel: 'Article Series',
      description: 'In-depth articles explaining vector embeddings, RAG architectures, and deploying ML models with FastAPI.',
      meta: '12 articles',
      icon: <BookMarked className="w-5 h-5 text-emerald-400" />,
      link: '/community/blogs',
      actionText: 'Read Articles',
    },
    {
      id: 4,
      title: 'Mobile Engineering Masterclass',
      category: 'videos',
      categoryLabel: 'Video Workshop',
      description: 'Cross-platform mobile development using React Native, native device APIs, and offline-first state management.',
      meta: '8 hours',
      icon: <Video className="w-5 h-5 text-purple-400" />,
      link: 'https://youtube.com',
      actionText: 'Watch Workshop',
    },
    {
      id: 5,
      title: 'Developer Utilities & Tooling Index',
      category: 'tools',
      categoryLabel: 'Dev Tools',
      description: 'Curated repository of 50+ developer utilities, IDE shortcuts, debuggers, and terminal workflows.',
      meta: '50+ tools',
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      link: '/community/resources',
      actionText: 'Explore Tools',
    },
    {
      id: 6,
      title: 'Open Source Contributor Manual',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Essential guide on authoring GitHub pull requests, writing clear commit messages, and managing CI/CD pipelines.',
      meta: '95 pages',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      link: '#',
      actionText: 'Download PDF',
    },
  ];

  const filteredResources =
    activeResourceCategory === 'all'
      ? resources
      : resources.filter((r) => r.category === activeResourceCategory);

  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="w-full space-y-28 sm:space-y-36 overflow-hidden text-gray-100 font-inter pb-24 bg-black relative">
      
      {/* 0. INTERACTIVE GPU-ACCELERATED BACKGROUND CONSTELLATION CANVAS */}
      <DeveloperBackgroundCanvas />

      {/* ========================================================================= */}
      {/* 1. COMMUNITY HERO SHOWCASE (CLEAN, PROMINENT & HIGH-CONVERTING)           */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="w-full min-h-[85vh] flex flex-col justify-center items-center text-center pt-24 sm:pt-32 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10"
      >
        {/* Kicker Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-orange-500/25 text-xs font-semibold text-orange-400 shadow-xl backdrop-blur-md mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-brand text-[10px] sm:text-[11px] font-bold tracking-wider">OPEN-SOURCE STUDENT DEVELOPER ECOSYSTEM</span>
          <span className="text-orange-500/40">•</span>
          <span className="text-gray-300 font-mono text-[11px]">500+ BUILDERS</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-rajdhani text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.95] max-w-5xl mx-auto">
          BUILD AT THE SPEED <br className="hidden sm:inline" />
          OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">OPEN SOURCE.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
          India's premier student-led developer network. Team up for national hackathons, ship real-world open-source software, collaborate in sprint squads, and get peer mentorship from alumni developers.
        </p>

        {/* Clean Action CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Link
            to={isAuthenticated ? '/feed' : '/join'}
            className="h-12 px-8 rounded-[4px] text-xs sm:text-sm font-semibold tracking-wide bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02]"
          >
            <Users className="w-4 h-4" />
            <span>{isAuthenticated ? 'Enter Community Feed' : 'Join Community Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/community/projects"
            className="h-12 px-7 rounded-[4px] text-xs sm:text-sm font-medium text-gray-200 hover:text-white border border-neutral-800 hover:border-orange-500/50 bg-neutral-950/90 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-900"
          >
            <FolderGit2 className="w-4 h-4 text-orange-400" />
            <span>Explore Projects</span>
          </Link>
        </div>

        {/* Centered Interactive Developer Terminal Sandbox */}
        <div className="w-full max-w-5xl mx-auto mt-12 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-cyan-500/15 to-orange-500/20 rounded-[6px] blur-xl opacity-60 pointer-events-none" />
          <div className="relative z-10">
            <DevInteractiveTerminal />
          </div>
        </div>

        {/* HERO ANCHORED COMMUNITY METRICS STRIP */}
        <div className="w-full max-w-5xl mx-auto mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 backdrop-blur-md shadow-2xl">
            <div className="text-center p-2">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-brand">{stats.membersCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Active Members</div>
            </div>
            <div className="text-center p-2 border-l border-neutral-800">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-brand">{stats.sessionsCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Tech Sessions</div>
            </div>
            <div className="text-center p-2 border-t sm:border-t-0 sm:border-l border-neutral-800">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-brand">{stats.projectsCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Projects Built</div>
            </div>
            <div className="text-center p-2 border-t sm:border-t-0 border-l border-neutral-800">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-brand">25+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Hackathon Wins</div>
            </div>
          </div>
        </div>

      </section>

      {/* LIVE COMMUNITY ACTIVITY TELEMETRY STRIP */}
      <LiveActivityTicker />

      {/* ========================================================================= */}
      {/* 2. THE DEVELOPER OS (MODERN BENTO GRID ARCHITECTURE)                      */}
      {/* ========================================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DeveloperBentoGrid />
      </section>

      {/* ========================================================================= */}
      {/* 3. COMMUNITY PROJECTS EXPLORER (FILTERABLE GRID)                          */}
      {/* ========================================================================= */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectShowcaseExplorer projects={displayProjects} />
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW WE ACCELERATE DEVELOPERS (3-STEP BLUEPRINT)                        */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DeveloperHowItWorks />
      </section>

      {/* ========================================================================= */}
      {/* 5. WHO WE ARE & CAMPUS COLLABORATION (REAL PHOTOGRAPHY)                   */}
      {/* ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Narrative Column */}
          <div
            onMouseMove={handleSpotlightMouseMove}
            className="lg:col-span-6 p-6 sm:p-8 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card text-left flex flex-col justify-between h-full shadow-lg"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-brand text-[10px]">CAMPUS MOVEMENT</span>
              </div>
              <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-3">
                BUILDING THE FUTURE OF <span className="text-orange-500">STUDENT TECH</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Rise Together is a student-founded engineering movement engineered to eliminate the gap between textbook theory and modern production software development. We provide free collaborative environments, open-source repositories, and peer code review standards.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Free & Open-Source Community with Zero Paywalls</span>
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
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80">
              <div className="p-3 rounded-[3px] bg-black/80 border border-neutral-800/80">
                <div className="text-2xl font-bold text-orange-500 font-brand">500+</div>
                <div className="text-[11px] text-gray-400">Students Active</div>
              </div>
              <div className="p-3 rounded-[3px] bg-black/80 border border-neutral-800/80">
                <div className="text-2xl font-bold text-orange-500 font-brand">40+</div>
                <div className="text-[11px] text-gray-400">Universities</div>
              </div>
              <div className="p-3 rounded-[3px] bg-black/80 border border-neutral-800/80">
                <div className="text-2xl font-bold text-orange-500 font-brand">100%</div>
                <div className="text-[11px] text-gray-400">Open Access</div>
              </div>
            </div>
          </div>

          {/* Right Column: Real Community Collaboration Photography Frame */}
          <div
            onMouseMove={handleSpotlightMouseMove}
            className="lg:col-span-6 flex flex-col h-full rounded-[4px] bg-neutral-950 border border-neutral-800/90 spotlight-card shadow-2xl overflow-hidden relative group text-left"
          >
            {/* Image Container */}
            <div className="relative w-full h-full min-h-[380px] bg-neutral-900 overflow-hidden flex items-center justify-center">
              <img
                src="/assets/images/community_real_photo.jpg"
                alt="RiseTogether Community Hackathon and Collaboration"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-[3px] text-xs font-semibold bg-black/80 backdrop-blur-md border border-neutral-700 text-white flex items-center gap-1.5 shadow-lg">
                  <Users className="w-3.5 h-3.5 text-orange-400" />
                  <span>Campus Hackathon & Peer Sprint</span>
                </span>
                <span className="px-2.5 py-1 rounded-[3px] text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  In-Person & Online
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-[3px] bg-black/85 backdrop-blur-md border border-neutral-800 text-left shadow-xl pointer-events-none">
                <h4 className="font-rajdhani font-bold text-lg text-white mb-1">
                  Collaborative Coding, Zero Gatekeeping
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Real students solving real problems together. From first-year beginners to national hackathon champions, everyone builds and learns side by side.
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-800 text-[11px] text-gray-400">
                  <span className="font-medium text-gray-300">40+ College Chapters</span>
                  <span className="text-emerald-400 font-mono">Weekly Hack Sprints</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEARNING RESOURCES (RICH KNOWLEDGE BASE)                               */}
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
      {/* 7. STUDENT STORIES (VERIFIED TESTIMONIAL CARDS)                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span className="font-brand text-[10px]">STUDENT SPOTLIGHT</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white">
            WHAT <span className="text-orange-500">MEMBERS SAY</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'Rise Together completely transformed my college experience. I went from knowing basic C++ to building full-stack web apps and winning hackathons with my squad.',
              name: 'Aarav Sharma',
              role: 'Full Stack Member',
              badge: 'Cohort of \'24',
              placement: 'Placed @ Microsoft',
              avatar:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'The peer mentorship and collaborative project culture are unmatched. Writing technical blogs and sharing open-source repos helped me land my first SWE internship!',
              name: 'Priya Patel',
              role: 'Community Contributor',
              badge: 'Top Contributor',
              placement: 'SWE Intern @ Razorpay',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'The collaborative code reviews and sprint squads helped me master git flow, CI/CD, and system design faster than any traditional university coursework.',
              name: 'Rohan Verma',
              role: 'Full Stack Contributor',
              badge: 'Lead Contributor',
              placement: 'Placed @ Swiggy',
              avatar:
                'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              onMouseMove={handleSpotlightMouseMove}
              className="p-6 sm:p-7 rounded-[4px] bg-neutral-950/90 border border-neutral-800/90 spotlight-card flex flex-col justify-between shadow-lg text-left relative overflow-hidden"
            >
              <div>
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

              <div className="flex items-center gap-3 border-t border-neutral-800/80 pt-4">
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
      {/* 8. FAQ ACCORDION SECTION                                                  */}
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
                className={`rounded-[3px] border transition-all duration-200 ${
                  isOpen
                    ? 'border-neutral-700 bg-neutral-900/90 shadow-lg'
                    : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700'
                } overflow-hidden`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-rajdhani font-bold text-base sm:text-lg text-white hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-neutral-800/80 pt-3.5 bg-neutral-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. EQUAL-HEIGHT CONTACT HUB & MESSAGE FORM                                */}
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
                    <option value="Project Showcase">Project Showcase & Open Source</option>
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
