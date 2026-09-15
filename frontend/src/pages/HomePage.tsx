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
      icon: <Video className="w-5 h-5 text-red-500" />,
      link: 'https://youtube.com',
      actionText: 'Watch',
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Comprehensive guide covering all important DSA concepts with examples and practice problems.',
      meta: '250 pages',
      icon: <FileText className="w-5 h-5 text-red-400" />,
      link: '#',
      actionText: 'Download',
    },
    {
      id: 3,
      title: 'AI/ML Fundamentals',
      category: 'articles',
      categoryLabel: 'Article Series',
      description: 'In-depth articles explaining machine learning concepts from basics to advanced neural architectures.',
      meta: '12 articles',
      icon: <BookMarked className="w-5 h-5 text-blue-400" />,
      link: '/community/blogs',
      actionText: 'Read',
    },
    {
      id: 4,
      title: 'Mobile App Development',
      category: 'videos',
      categoryLabel: 'Video Workshop',
      description: 'React Native workshop covering cross-platform mobile app development from scratch.',
      meta: '8 hours',
      icon: <Video className="w-5 h-5 text-red-500" />,
      link: 'https://youtube.com',
      actionText: 'Watch',
    },
    {
      id: 5,
      title: 'Developer Toolkit',
      category: 'tools',
      categoryLabel: 'Essential Tools',
      description: 'Curated list of essential development tools, IDE configurations, and productivity extensions.',
      meta: '50+ tools',
      icon: <Wrench className="w-5 h-5 text-emerald-400" />,
      link: '/community/resources',
      actionText: 'Explore',
    },
    {
      id: 6,
      title: 'System Design Guide',
      category: 'pdfs',
      categoryLabel: 'PDF Guide',
      description: 'Complete system design handbook covering scalability, database partitioning, and microservices.',
      meta: '180 pages',
      icon: <FileCode className="w-5 h-5 text-amber-400" />,
      link: '#',
      actionText: 'Download',
    },
  ];

  const filteredResources =
    activeResourceCategory === 'all'
      ? resources
      : resources.filter((r) => r.category === activeResourceCategory);

  return (
    <div className="w-full space-y-24 sm:space-y-32 overflow-hidden text-gray-100 font-inter pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (BIG BACKGROUND IMAGE WITH DARK OVERLAY & HERO CONTENT)   */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="min-h-[90vh] md:min-h-screen flex items-center justify-center relative overflow-hidden pt-10 pb-20"
      >
        {/* BIG BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
          }}
        />

        {/* DARK OVERLAY WITH BLUR */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

        {/* GRADIENT ATMOSPHERE OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#111827]" />
        <div className="hero-gradient absolute inset-0 pointer-events-none" />

        {/* FLOATING PARTICLES */}
        <div className="absolute w-2 h-2 rounded-full bg-orange-400/50 blur-xs top-[20%] left-[12%] animate-pulse-slow" />
        <div className="absolute w-3 h-3 rounded-full bg-amber-400/40 blur-xs top-[60%] left-[82%] animate-pulse-slow delay-700" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/50 blur-xs top-[30%] left-[72%] animate-pulse-slow delay-1000" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-300/40 blur-xs top-[80%] left-[18%] animate-pulse-slow delay-500" />

        {/* HERO CONTENT OVERLAY */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* TOP ANNOUNCEMENT PILL */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-orange-400 mb-6 border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.25)] animate-float">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Empowering India's Premier Student Tech Movement</span>
          </div>

          {/* MAIN HEADING */}
          <h1 className="font-rajdhani text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-wider text-white mb-4 text-glow drop-shadow-[0_4px_35px_rgba(249,115,22,0.4)]">
            RISE TOGETHER
          </h1>

          {/* TAGLINE */}
          <p className="text-xl sm:text-3xl font-rajdhani font-bold mb-5 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
            LEARN. BUILD. GROW.
          </p>

          {/* DESCRIPTION */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            Join India's most innovative student tech community where future developers, designers, and innovators come together to create extraordinary solutions and build the next generation of technology.
          </p>

          {/* REFINED CTA BUTTONS GROUP */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <Link
              to={isAuthenticated ? '/feed' : '/join'}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm sm:text-base font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:shadow-[0_0_35px_rgba(249,115,22,0.7)] transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{isAuthenticated ? 'Go to Social Feed' : 'Join the Community'}</span>
            </Link>

            <Link
              to="/community/projects"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-orange-400 border border-orange-500/80 hover:bg-orange-500 hover:text-white transition-all duration-300 backdrop-blur-md bg-black/40 hover:scale-105 flex items-center justify-center gap-2.5 shadow-lg"
            >
              <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explore Projects</span>
            </Link>

            <Link
              to="/leaderboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-gray-200 border border-white/20 hover:border-orange-400/60 hover:text-white transition-all duration-300 backdrop-blur-md bg-white/5 hover:bg-white/10 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Grind 500 Arena</span>
            </Link>
          </div>

          {/* HERO LIVE STATS FLOATING STRIP */}
          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="text-center p-2">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">{stats.membersCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Active Members</div>
            </div>
            <div className="text-center p-2 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">{stats.sessionsCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Tech Sessions</div>
            </div>
            <div className="text-center p-2 border-t sm:border-t-0 sm:border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">{stats.projectsCount}+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Projects Built</div>
            </div>
            <div className="text-center p-2 border-t sm:border-t-0 border-l border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 font-rajdhani">25+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Hackathon Wins</div>
            </div>
          </div>
        </div>

        {/* SCROLL DOWN INDICATOR */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10 pointer-events-none">
          <div className="w-6 h-10 border-2 border-orange-400/80 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT US SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            ABOUT <span className="text-orange-500">US</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
              Rise Together is more than just a tech community—we're a movement of passionate students who believe in the power of collaboration, innovation, and continuous learning. Founded by students, for students, we create an ecosystem where ideas flourish and dreams become reality.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8">
              From beginner coders to seasoned developers, from creative designers to strategic thinkers, we welcome everyone who shares our vision of building a better tomorrow through technology.
            </p>

            {/* LIVE STATS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-md shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-3xl font-bold text-orange-500 font-rajdhani">
                  {stats.membersCount}+
                </div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Members</div>
              </div>

              <div className="text-center p-4 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-md shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-3xl font-bold text-orange-500 font-rajdhani">
                  {stats.sessionsCount}+
                </div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Sessions</div>
              </div>

              <div className="text-center p-4 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-md shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="text-3xl font-bold text-orange-500 font-rajdhani">
                  {stats.projectsCount}+
                </div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Projects</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900/90 to-black border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-6 left-6 z-10 bg-black/70 backdrop-blur-md border border-orange-500/40 px-3 py-1.5 rounded-full text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Empowering 500+ Students</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                alt="Community Workshop"
                className="rounded-2xl w-full h-auto object-cover shadow-lg border border-white/5 group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR MISSION SECTION                                                    */}
      {/* ========================================================================= */}
      <section id="mission" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            OUR <span className="text-orange-500">MISSION</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of tech leaders through collaborative learning, innovative projects, and career growth opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-gray-900/80 border border-gray-800 text-center hover:border-orange-500/50 transition-all duration-300 group shadow-xl hover:-translate-y-1.5">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white mb-3">Learn Together</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Master cutting-edge technologies through interactive workshops, peer-to-peer learning, and mentorship from industry experts.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-900/80 border border-gray-800 text-center hover:border-orange-500/50 transition-all duration-300 group shadow-xl hover:-translate-y-1.5">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
              <Hammer className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white mb-3">Build Projects</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Transform ideas into reality through collaborative open-source projects, hackathons, and real-world problem-solving initiatives.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-900/80 border border-gray-800 text-center hover:border-orange-500/50 transition-all duration-300 group shadow-xl hover:-translate-y-1.5">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-rajdhani text-2xl font-bold text-white mb-3">Grow Careers</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Build your professional network, develop leadership skills, and access exclusive internship, referral, and job opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACHIEVEMENTS & AWARDS SECTION                                          */}
      {/* ========================================================================= */}
      <section id="achievements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            OUR <span className="text-orange-500">ACHIEVEMENTS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full" />
        </div>

        {/* MAJOR ACHIEVEMENTS CARDS */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          <div className="p-8 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl hover:border-orange-500/40 transition-all">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mr-6 shadow-md shrink-0">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-1">
                  National Hackathon Winners
                </h3>
                <p className="text-orange-400 font-semibold text-sm mb-3">
                  Smart India Hackathon 2024
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Our student team secured 1st place in Smart India Hackathon with an innovative AI-powered education platform, competing against 10,000+ participants nationwide.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400">
              <span>March 2024</span>
              <div className="flex items-center text-orange-400 font-bold gap-1">
                <Medal className="w-4 h-4" />
                <span>1st Place Champions</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl hover:border-orange-500/40 transition-all">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-md shrink-0">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-1">
                  Best Student Tech Community
                </h3>
                <p className="text-orange-400 font-semibold text-sm mb-3">
                  Tech Innovation Awards 2024
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Recognized as the "Best Student Tech Community" for outstanding contribution to collaborative student skill development and open-source project initiatives.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400">
              <span>January 2024</span>
              <div className="flex items-center text-orange-400 font-bold gap-1">
                <Award className="w-4 h-4" />
                <span>Winner</span>
              </div>
            </div>
          </div>

        </div>

        {/* COUNTER METRICS */}
        <div className="p-8 rounded-3xl bg-gray-900/60 border border-gray-800 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-400 font-rajdhani">25+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase font-semibold">Awards Won</div>
            </div>
            <div>
              <Medal className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-400 font-rajdhani">50+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase font-semibold">Competitions</div>
            </div>
            <div>
              <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-400 font-rajdhani">15+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase font-semibold">Media Features</div>
            </div>
            <div>
              <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-400 font-rajdhani">20+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase font-semibold">Partnerships</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Rocket className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-400 font-rajdhani">500+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase font-semibold">Students Mentored</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RECENT ACTIVITIES & SESSIONS                                            */}
      {/* ========================================================================= */}
      <section id="activities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-2">
              RECENT <span className="text-orange-500">ACTIVITIES</span>
            </h2>
            <p className="text-sm text-gray-400">Interactive programming sessions, showcases, and sprint hackathons.</p>
          </div>
          <Link
            to="/community/activities"
            className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1.5"
          >
            <span>View All Activities</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div className="h-40 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Code2 className="w-12 h-12 text-white opacity-85" />
            </div>
            <div className="p-6">
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Weekly Coding Classes</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Interactive hands-on programming sessions covering Web Development, DSA, and System Architecture.
              </p>
              <div className="flex items-center text-xs text-orange-400 font-medium gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Every Saturday at 6:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div className="h-40 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white opacity-85" />
            </div>
            <div className="p-6">
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Project Showcases</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Monthly presentations where student teams demo innovative production builds and receive senior review.
              </p>
              <div className="flex items-center text-xs text-orange-400 font-medium gap-1.5">
                <Users className="w-4 h-4" />
                <span>Monthly Event (Next: Last Friday)</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div className="h-40 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white opacity-85" />
            </div>
            <div className="p-6">
              <h3 className="font-rajdhani text-xl font-bold text-white mb-2">Hackathon Sprints</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Rapid 24-48 hour collaborative hack sprints solving community challenges with modern tech stacks.
              </p>
              <div className="flex items-center text-xs text-orange-400 font-medium gap-1.5">
                <Rocket className="w-4 h-4" />
                <span>Quarterly Community Sprint</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEARNING RESOURCES SECTION                                             */}
      {/* ========================================================================= */}
      <section id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            LEARNING <span className="text-orange-500">RESOURCES</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-8" />

          {/* CATEGORY FILTER PILLS */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'all', label: 'All Resources' },
              { key: 'videos', label: 'Videos' },
              { key: 'pdfs', label: 'PDF Guides' },
              { key: 'articles', label: 'Articles' },
              { key: 'tools', label: 'Dev Tools' },
            ].map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveResourceCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  activeResourceCategory === cat.key
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-900/80 text-gray-300 hover:text-white border border-gray-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    {res.icon}
                  </div>
                  <div>
                    <h3 className="font-rajdhani text-lg font-bold text-white line-clamp-1">
                      {res.title}
                    </h3>
                    <span className="text-xs text-orange-400 font-semibold uppercase font-mono">
                      {res.categoryLabel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800/80 text-xs">
                <span className="text-gray-400 font-mono">{res.meta}</span>
                <a
                  href={res.link}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-colors inline-flex items-center gap-1"
                >
                  <span>{res.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROJECT HIGHLIGHTS SECTION                                             */}
      {/* ========================================================================= */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-2">
              PROJECT <span className="text-orange-500">HIGHLIGHTS</span>
            </h2>
            <p className="text-sm text-gray-400">Open-source applications engineered by student contributors.</p>
          </div>
          <Link
            to="/community/projects"
            className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1.5"
          >
            <span>Browse All Projects</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div className="relative h-48 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs font-semibold text-yellow-300 border border-yellow-400/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-300" />
                <span>Featured Project</span>
              </div>
              <Code2 className="w-16 h-16 text-white opacity-85" />
            </div>
            <div className="p-7">
              <div className="flex gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  AI / ML
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Python
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TensorFlow
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">
                Smart Study Assistant
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                An AI-powered study companion that personalizes learning experiences, tracks student mastery, and provides automated coding solution recommendations.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs">
                <span className="text-gray-400 font-medium">Built by Community Core Team</span>
                <Link
                  to="/community/projects"
                  className="text-orange-400 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs font-semibold text-yellow-300 border border-yellow-400/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 fill-yellow-300" />
                <span>Award Winner</span>
              </div>
              <Compass className="w-16 h-16 text-white opacity-85" />
            </div>
            <div className="p-7">
              <div className="flex gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  React Native
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Firebase
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Mobile
                </span>
              </div>
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">
                EcoTrack Mobile Platform
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                A sustainability-focused mobile app helping college students calculate carbon footprints and discover eco-friendly transit and dining alternatives.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs">
                <span className="text-gray-400 font-medium">Built by Student Contributors</span>
                <Link
                  to="/community/projects"
                  className="text-orange-400 hover:text-white font-bold flex items-center gap-1"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            WHAT <span className="text-orange-500">DEVELOPERS SAY</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
              className="p-7 rounded-3xl bg-gray-900/80 border border-gray-800 flex flex-col justify-between shadow-xl hover:border-orange-500/30 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-orange-500"
                />
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-orange-400 font-mono">{t.role}</div>
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
        <div className="text-center mb-12">
          <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            FREQUENTLY ASKED <span className="text-orange-500">QUESTIONS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaqIdx === idx;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border overflow-hidden transition-all shadow-md ${
                  isOpen
                    ? 'bg-gray-900/90 border-orange-500/40'
                    : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-rajdhani font-bold text-base sm:text-lg text-white hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4.5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/80 pt-3">
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
        <div className="rounded-3xl bg-gray-900/90 border border-orange-500/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <h2 className="font-rajdhani text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-2">
              CONTACT OUR <span className="text-orange-500">LEADERSHIP TEAM</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Have questions about organizing a workshop, sponsoring an event, or becoming a community lead? Send us a message.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="w-full px-4 py-2.5 bg-[#10131a] border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full px-4 py-2.5 bg-[#10131a] border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Your Message
              </label>
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="How can we help or collaborate with you?"
                required
                className="w-full px-4 py-2.5 bg-[#10131a] border border-gray-700/80 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={submittingContact}
                className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submittingContact ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};
