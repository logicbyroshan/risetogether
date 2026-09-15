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
  Code2,
  Trophy,
  Rocket,
  BookOpen,
  FolderGit2,
  Calendar,
  Send,
  Star,
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
  Compass,
  CheckCircle2,
  Terminal,
  ExternalLink,
  MessageSquare,
  Clock,
  Layers,
  Zap,
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

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
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
        message: contactMessage,
      });
      toastSuccess(res.message || 'Thank you for reaching out! We will be in touch shortly.');
      setContactName('');
      setContactEmail('');
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

  return (
    <div className="w-full space-y-28 sm:space-y-36 overflow-hidden text-gray-100 font-inter pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (ATMOSPHERIC BACKGROUND IMAGE WITH METRIC CHIPS)           */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="min-h-[88vh] md:min-h-[92vh] flex items-center justify-center relative overflow-hidden pt-8 pb-16"
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-102"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`,
          }}
        />

        {/* DARK OVERLAYS */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#111827]" />
        <div className="hero-gradient absolute inset-0 pointer-events-none" />

        {/* HERO CONTENT */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* TOP ANNOUNCEMENT PILL */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-md text-xs font-medium text-gray-300 mb-6 border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Empowering India's Premier Student Tech Movement</span>
          </div>

          {/* MAIN HEADING */}
          <h1 className="font-rajdhani text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-wide text-white mb-3">
            RISE TOGETHER
          </h1>

          {/* TAGLINE */}
          <p className="text-lg sm:text-2xl font-rajdhani font-bold mb-4 tracking-widest text-orange-400">
            LEARN. BUILD. GROW.
          </p>

          {/* DESCRIPTION */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Join India's most innovative student tech community where future developers, designers, and innovators come together to create extraordinary solutions and build the next generation of technology.
          </p>

          {/* REFINED CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <Link
              to={isAuthenticated ? '/feed' : '/join'}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold tracking-wide bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>{isAuthenticated ? 'Go to Social Feed' : 'Join the Community'}</span>
            </Link>

            <Link
              to="/community/projects"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium text-gray-200 hover:text-white border border-gray-700 hover:border-gray-500 bg-gray-900/80 hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FolderGit2 className="w-4 h-4 text-gray-400" />
              <span>Explore Projects</span>
            </Link>

            <Link
              to="/leaderboard"
              className="w-full sm:w-auto px-5 py-3 rounded-full text-sm font-medium text-gray-300 hover:text-orange-400 border border-gray-800 hover:border-gray-700 bg-gray-900/60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Grind 500 Arena</span>
            </Link>
          </div>

          {/* HERO METRIC CHIPS STRIP */}
          <div className="mt-12 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80 backdrop-blur-md shadow-xl">
            <div className="text-center p-2">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">{stats.membersCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Active Members</div>
            </div>
            <div className="text-center p-2 border-l border-gray-800">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">{stats.sessionsCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Tech Sessions</div>
            </div>
            <div className="text-center p-2 border-t sm:border-t-0 sm:border-l border-gray-800">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">{stats.projectsCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Projects Built</div>
            </div>
            <div className="text-center p-2 border-t sm:border-t-0 border-l border-gray-800">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">25+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-0.5">Hackathon Wins</div>
            </div>
          </div>
        </div>

        {/* SCROLL DOWN INDICATOR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-60">
          <div className="w-5 h-8 border border-gray-500 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-orange-400 rounded-full mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT US SECTION (STORYTELLING + INTERACTIVE TERMINAL CODE MANIFESTO)   */}
      {/* ========================================================================= */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              BUILDING THE FUTURE OF <span className="text-orange-500">STUDENT TECH</span>
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Rise Together is a movement of passionate students who believe in the power of open collaboration, continuous skill enhancement, and real-world engineering. Founded by students for students, we bridge the gap between academic theory and production software engineering.
            </p>

            {/* Checklist Highlights */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free & Open-Source Community with No Paywalls</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hands-on Collaborative Real-World Projects with Git CI/CD</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Senior Student Mentorship, Mock Technical Interviews & Referrals</span>
              </div>
            </div>

            {/* Compact Metric Strip */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-800">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">500+</div>
                <div className="text-[11px] text-gray-400">Students Active</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-800">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">20+</div>
                <div className="text-[11px] text-gray-400">Universities</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-800">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">100%</div>
                <div className="text-[11px] text-gray-400">Free Access</div>
              </div>
            </div>
          </div>

          {/* Right Interactive Code Terminal Window */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden font-mono text-left">
              {/* Terminal Titlebar */}
              <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-400">community.manifest.ts</span>
                <Terminal className="w-4 h-4 text-gray-500" />
              </div>

              {/* Code Snippet */}
              <div className="p-5 text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-gray-300">
                <p><span className="text-purple-400">export const</span> <span className="text-yellow-300">RiseTogether</span>: <span className="text-cyan-400">Community</span> = &#123;</p>
                <p className="pl-4"><span className="text-blue-300">name</span>: <span className="text-emerald-300">'RiseTogether'</span>,</p>
                <p className="pl-4"><span className="text-blue-300">founded</span>: <span className="text-amber-300">2024</span>,</p>
                <p className="pl-4"><span className="text-blue-300">mission</span>: <span className="text-emerald-300">'Learn. Build. Grow.'</span>,</p>
                <p className="pl-4"><span className="text-blue-300">values</span>: [</p>
                <p className="pl-8"><span className="text-emerald-300">'Peer Learning'</span>,</p>
                <p className="pl-8"><span className="text-emerald-300">'Open Source Excellence'</span>,</p>
                <p className="pl-8"><span className="text-emerald-300">'Gamified DSA Problem Solving'</span>,</p>
                <p className="pl-4">],</p>
                <p className="pl-4"><span className="text-blue-300">isFreeForever</span>: <span className="text-orange-400">true</span>,</p>
                <p>&#125;;</p>
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    All Systems Operational
                  </span>
                  <span>v2.0 Production</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR MISSION (3 SIGNATURE PILLARS WITH DISTINCT COLOR THEMES)             */}
      {/* ========================================================================= */}
      <section id="mission" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Three Pillars</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">
            OUR <span className="text-orange-500">MISSION</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            A comprehensive developer flywheel designed to accelerate student developers from their first line of code to top engineering roles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Learn */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-cyan-500/40 transition-all text-left flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Pillar 01 • Learn
              </span>
              <h3 className="font-rajdhani text-2xl font-bold text-white mt-1 mb-2">Master Modern Stacks</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Master modern engineering through structured workshops, interactive DSA problem sessions, and system design masterclasses.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-800">
              <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">DSA Patterns</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Full Stack</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">System Design</span>
            </div>
          </div>

          {/* Pillar 2: Build */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-orange-500/40 transition-all text-left flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400">
                <Hammer className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider font-mono">
                Pillar 02 • Build
              </span>
              <h3 className="font-rajdhani text-2xl font-bold text-white mt-1 mb-2">Ship Real Solutions</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Transform ideas into production software through collaborative open-source repositories, team hackathons, and sprint showcases.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-800">
              <span className="px-2 py-0.5 rounded text-[11px] bg-orange-500/10 text-orange-300 border border-orange-500/20">Open Source</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-orange-500/10 text-orange-300 border border-orange-500/20">Hackathons</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-orange-500/10 text-orange-300 border border-orange-500/20">Portfolio MVPs</span>
            </div>
          </div>

          {/* Pillar 3: Grow */}
          <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-purple-500/40 transition-all text-left flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-400">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider font-mono">
                Pillar 03 • Grow
              </span>
              <h3 className="font-rajdhani text-2xl font-bold text-white mt-1 mb-2">Accelerate Careers</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                Access technical resume reviews, mock interview sessions with senior developers, and direct referral opportunities.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-800">
              <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20">Mock Interviews</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20">Resume Reviews</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-300 border border-purple-500/20">Referrals</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACHIEVEMENTS & HACKATHON SHOWCASE                                      */}
      {/* ========================================================================= */}
      <section id="achievements" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Trophy Room</span>
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            NATIONAL <span className="text-orange-500">ACHIEVEMENTS</span>
          </h2>
        </div>

        {/* MAJOR SPOTLIGHT CARDS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          <div className="p-6 sm:p-7 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-md text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
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
            <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>Date: March 2024</span>
              <span className="text-gray-300 font-medium">Team RiseTogether Alpha</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-md text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
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
            <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>Date: January 2024</span>
              <span className="text-gray-300 font-medium">Award of Excellence</span>
            </div>
          </div>

        </div>

        {/* COUNTER METRICS STRIP */}
        <div className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800/80 shadow-md">
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
      {/* 5. RECENT ACTIVITIES & LIVE SCHEDULE TIMELINE                             */}
      {/* ========================================================================= */}
      <section id="activities" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Community Calendar</span>
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              WEEKLY <span className="text-orange-500">SCHEDULE & EVENTS</span>
            </h2>
          </div>
          <Link
            to="/community/activities"
            className="text-xs font-semibold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>View All Activities</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          
          {/* Schedule Item 1 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center shrink-0 text-orange-400">
                <span className="text-[10px] font-bold uppercase">SAT</span>
                <span className="text-lg font-bold font-rajdhani">18:00</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    LIVE WORKSHOP
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Weekly Series</span>
                </div>
                <h3 className="font-rajdhani text-xl font-bold text-white">Advanced Full-Stack & System Architecture</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xl">
                  Interactive hands-on session on designing scalable microservices, async celery workers, and state hydration.
                </p>
              </div>
            </div>
            <Link
              to="/community/activities"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-orange-500 text-gray-200 hover:text-white transition-colors shrink-0 flex items-center gap-1"
            >
              <span>RSVP Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Schedule Item 2 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center shrink-0 text-purple-400">
                <span className="text-[10px] font-bold uppercase">FRI</span>
                <span className="text-lg font-bold font-rajdhani">19:30</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    DEMO DAY
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Monthly Event</span>
                </div>
                <h3 className="font-rajdhani text-xl font-bold text-white">Monthly Open-Source Project Showcase</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xl">
                  Student teams demo their shipped builds, receive code reviews, and pitch for community project of the month.
                </p>
              </div>
            </div>
            <Link
              to="/community/projects"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-orange-500 text-gray-200 hover:text-white transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Join Showcase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Schedule Item 3 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center shrink-0 text-cyan-400">
                <span className="text-[10px] font-bold uppercase">48H</span>
                <span className="text-lg font-bold font-rajdhani">SPRINT</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    HACKATHON
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Quarterly Sprint</span>
                </div>
                <h3 className="font-rajdhani text-xl font-bold text-white">RiseTogether HackSprint 2026</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xl">
                  48-hour team hackathon building solutions for sustainability, accessibility, and AI developer tooling.
                </p>
              </div>
            </div>
            <Link
              to="/community/activities"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-orange-500 text-gray-200 hover:text-white transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEARNING RESOURCES (RICH MEDIA LIBRARY)                                 */}
      {/* ========================================================================= */}
      <section id="resources" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeResourceCategory === cat.key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
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
              className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between shadow-sm text-left"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
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

              <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
                <span className="text-gray-400 font-mono text-[11px]">{res.meta}</span>
                <a
                  href={res.link}
                  className="px-3 py-1 rounded-md text-xs font-semibold text-orange-400 hover:text-white hover:bg-orange-500/20 transition-colors inline-flex items-center gap-1"
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
      <section id="projects" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
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
          
          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md text-left flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    AI / ML
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    Python
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    TensorFlow
                  </span>
                </div>
                <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Featured</span>
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">
                Smart Study Assistant
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                An AI-powered study companion that personalizes learning experiences, tracks student mastery, and provides automated coding solution recommendations.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-gray-950/60 border-t border-gray-800 flex items-center justify-between text-xs">
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

          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md text-left flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    React Native
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    Firebase
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    Mobile
                  </span>
                </div>
                <span className="text-xs text-purple-400 flex items-center gap-1 font-mono">
                  <Award className="w-3.5 h-3.5" />
                  <span>Winner</span>
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">
                EcoTrack Mobile Platform
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                A sustainability-focused mobile app helping college students calculate carbon footprints and discover eco-friendly transit and dining alternatives.
              </p>
            </div>
            <div className="px-6 py-3.5 bg-gray-950/60 border-t border-gray-800 flex items-center justify-between text-xs">
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
      {/* 8. TESTIMONIALS (COMMUNITY VOICES)                                        */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
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
              avatar:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'The peer mentorship and collaborative project culture are unmatched. Writing blogs and sharing code problem solutions helped me land my first software engineering internship!',
              name: 'Priya Patel',
              role: 'Community Contributor',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'The Grind 500 leaderboard and daily coding streaks keep me consistent with algorithm practice. Best tech community for any aspiring developer.',
              name: 'Rohan Verma',
              role: 'DSA Lead',
              avatar:
                'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between shadow-sm text-left"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-5">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-800 pt-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-700"
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
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
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
                className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden transition-colors"
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
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. DUAL COLUMN LEADERSHIP & CONTACT HUB                                  */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Contact Info Hub */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gray-900/80 border border-gray-800 text-left space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
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

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Email Support</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">contact@risetogether.tech</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Office Hours</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">Mon – Sat • 10:00 AM – 8:00 PM IST</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-mono">Average Response</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">&lt; 2 Hours on Community Discord</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-gray-900/80 border border-gray-800 text-left">
            <h3 className="font-rajdhani text-2xl font-bold uppercase text-white mb-4">
              Send Us a Message
            </h3>
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
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
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
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
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
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submittingContact}
                  className="px-6 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingContact ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};
