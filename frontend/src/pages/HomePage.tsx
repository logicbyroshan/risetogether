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
      description: 'Complete MERN stack development tutorial series covering React, Node.js, MongoDB, and Express.',
      meta: '45 hours',
      icon: <Video className="w-5 h-5 text-red-400" />,
      link: 'https://youtube.com',
      actionText: 'Watch Course',
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Comprehensive guide covering all important DSA concepts with examples and practice problems.',
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
      description: 'In-depth articles explaining machine learning concepts from basics to advanced neural architectures.',
      meta: '12 articles',
      icon: <BookMarked className="w-5 h-5 text-emerald-400" />,
      link: '/community/blogs',
      actionText: 'Read Articles',
    },
    {
      id: 4,
      title: 'Mobile App Engineering',
      category: 'videos',
      categoryLabel: 'Video Workshop',
      description: 'React Native workshop covering cross-platform mobile app development from scratch.',
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
      description: 'Curated list of essential development tools, IDE configurations, and productivity extensions.',
      meta: '50+ tools',
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      link: '/community/resources',
      actionText: 'Explore Tools',
    },
    {
      id: 6,
      title: 'System Design Handbook',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Complete system design handbook covering scalability, database partitioning, and microservices.',
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
    <div className="w-full space-y-24 sm:space-y-28 overflow-hidden text-gray-100 font-inter pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (ATMOSPHERIC BACKGROUND IMAGE & REFINED CTA GROUP)         */}
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

        {/* FLOATING PARTICLES */}
        <div className="absolute w-2 h-2 rounded-full bg-orange-400/40 blur-xs top-[20%] left-[12%] animate-pulse-slow" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-400/30 blur-xs top-[65%] left-[85%] animate-pulse-slow delay-700" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/30 blur-xs top-[30%] left-[75%] animate-pulse-slow delay-1000" />

        {/* HERO CONTENT */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* TOP ANNOUNCEMENT PILL */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-md text-xs font-medium text-gray-300 mb-6 border border-white/10 shadow-sm animate-float">
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

          {/* HERO LIVE STATS STRIP */}
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
      {/* 2. ABOUT US SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Who We Are
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            ABOUT <span className="text-orange-500">US</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Rise Together is more than just a tech community—we're a movement of passionate students who believe in the power of collaboration, innovation, and continuous learning. Founded by students, for students, we create an ecosystem where ideas flourish and dreams become reality.
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              From beginner coders to seasoned developers, from creative designers to strategic thinkers, we welcome everyone who shares our vision of building a better tomorrow through technology.
            </p>

            {/* LIVE STATS */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-left">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">
                  {stats.membersCount}+
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Members</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-left">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">
                  {stats.sessionsCount}+
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Sessions</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-left">
                <div className="text-2xl font-bold text-orange-500 font-rajdhani">
                  {stats.projectsCount}+
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Projects</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="p-2 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-lg relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                alt="Community Workshop"
                className="rounded-xl w-full h-64 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-gray-950/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-400" />
                <span>500+ Students Empowered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR MISSION SECTION                                                    */}
      {/* ========================================================================= */}
      <section id="mission" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Core Values
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">
            OUR <span className="text-orange-500">MISSION</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            Empowering the next generation of tech leaders through collaborative learning, innovative projects, and career growth opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Learn Together</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Master cutting-edge technologies through interactive workshops, peer-to-peer learning, and mentorship from industry experts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400">
              <Hammer className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Build Projects</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Transform ideas into reality through collaborative open-source projects, hackathons, and real-world problem-solving initiatives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Grow Careers</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Build your professional network, develop leadership skills, and access exclusive internship, referral, and job opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACHIEVEMENTS & AWARDS SECTION                                          */}
      {/* ========================================================================= */}
      <section id="achievements" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Recognition
          </div>
          <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            OUR <span className="text-orange-500">ACHIEVEMENTS</span>
          </h2>
        </div>

        {/* MAJOR ACHIEVEMENTS CARDS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          <div className="p-6 sm:p-7 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-md">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0 text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-rajdhani text-xl font-bold text-white mb-0.5">
                  National Hackathon Winners
                </h3>
                <p className="text-orange-400 font-medium text-xs mb-2">
                  Smart India Hackathon 2024
                </p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Our student team secured 1st place in Smart India Hackathon with an innovative AI-powered education platform, competing against 10,000+ participants nationwide.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 text-xs text-gray-400">
              <span>March 2024</span>
              <div className="flex items-center text-amber-400 font-semibold gap-1">
                <Medal className="w-4 h-4" />
                <span>1st Place Champions</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-md">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center shrink-0 text-purple-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-rajdhani text-xl font-bold text-white mb-0.5">
                  Best Student Tech Community
                </h3>
                <p className="text-orange-400 font-medium text-xs mb-2">
                  Tech Innovation Awards 2024
                </p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Recognized as the "Best Student Tech Community" for outstanding contribution to collaborative student skill development and open-source project initiatives.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 text-xs text-gray-400">
              <span>January 2024</span>
              <div className="flex items-center text-purple-400 font-semibold gap-1">
                <Award className="w-4 h-4" />
                <span>Community Winner</span>
              </div>
            </div>
          </div>

        </div>

        {/* COUNTER METRICS */}
        <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/80 shadow-md">
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
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Media Features</div>
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
      {/* 5. RECENT ACTIVITIES & SESSIONS                                            */}
      {/* ========================================================================= */}
      <section id="activities" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              Community Calendar
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              RECENT <span className="text-orange-500">ACTIVITIES</span>
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md hover:border-gray-700 transition-all text-left">
            <div className="h-32 bg-gray-800/80 flex items-center justify-center border-b border-gray-800">
              <Code2 className="w-10 h-10 text-orange-400" />
            </div>
            <div className="p-5">
              <h3 className="font-rajdhani text-lg font-bold text-white mb-1.5">Weekly Coding Classes</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Interactive hands-on programming sessions covering Web Development, DSA, and System Architecture.
              </p>
              <div className="flex items-center text-xs text-gray-400 gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>Every Saturday at 6:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md hover:border-gray-700 transition-all text-left">
            <div className="h-32 bg-gray-800/80 flex items-center justify-center border-b border-gray-800">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <div className="p-5">
              <h3 className="font-rajdhani text-lg font-bold text-white mb-1.5">Project Showcases</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Monthly presentations where student teams demo innovative production builds and receive senior review.
              </p>
              <div className="flex items-center text-xs text-gray-400 gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-400" />
                <span>Monthly Event (Last Friday)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md hover:border-gray-700 transition-all text-left">
            <div className="h-32 bg-gray-800/80 flex items-center justify-center border-b border-gray-800">
              <Sparkles className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="p-5">
              <h3 className="font-rajdhani text-lg font-bold text-white mb-1.5">Hackathon Sprints</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Rapid 24-48 hour collaborative hack sprints solving community challenges with modern tech stacks.
              </p>
              <div className="flex items-center text-xs text-gray-400 gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-orange-400" />
                <span>Quarterly Community Sprint</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEARNING RESOURCES SECTION                                             */}
      {/* ========================================================================= */}
      <section id="resources" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              Knowledge Base
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              LEARNING <span className="text-orange-500">RESOURCES</span>
            </h2>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'all', label: 'All' },
              { key: 'videos', label: 'Videos' },
              { key: 'pdfs', label: 'PDF Guides' },
              { key: 'articles', label: 'Articles' },
              { key: 'tools', label: 'Tools' },
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
                  <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
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
      {/* 7. PROJECT HIGHLIGHTS SECTION                                             */}
      {/* ========================================================================= */}
      <section id="projects" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              Portfolio
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              PROJECT <span className="text-orange-500">HIGHLIGHTS</span>
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
          
          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md text-left">
            <div className="p-6">
              <div className="flex gap-2 mb-3">
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
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">
                Smart Study Assistant
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                An AI-powered study companion that personalizes learning experiences, tracks student mastery, and provides automated coding solution recommendations.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
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
          </div>

          <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden shadow-md text-left">
            <div className="p-6">
              <div className="flex gap-2 mb-3">
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
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">
                EcoTrack Mobile Platform
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                A sustainability-focused mobile app helping college students calculate carbon footprints and discover eco-friendly transit and dining alternatives.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
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

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Student Stories
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
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Help Center
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
      {/* 10. CONTACT LEADERSHIP TEAM FORM                                          */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-6 sm:p-10 shadow-lg">
          <div className="text-left mb-6">
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              Get in Touch
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-1.5">
              CONTACT OUR <span className="text-orange-500">LEADERSHIP TEAM</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Have questions about organizing a workshop, sponsoring an event, or becoming a community lead? Send us a message.
            </p>
          </div>

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

            <div className="text-left pt-1">
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
      </section>

    </div>
  );
};
