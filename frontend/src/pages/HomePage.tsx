import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Users,
  Trophy,
  Rocket,
  CheckCircle2,
  ChevronDown,
  Star,
  Send,
  BookOpen,
  FolderGit2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { publicApi } from '../api/public';
import { communityApi } from '../api/community';
import { SiteContentResponse } from '../types/public';
import { Blog, Project, Activity } from '../types/community';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BlogCard } from '../components/community/BlogCard';
import { ProjectCard } from '../components/community/ProjectCard';
import { ActivityCard } from '../components/community/ActivityCard';

export const HomePage: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteContentResponse | null>(null);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    // Load Site Content, Blogs, Projects, Activities
    publicApi.getSiteContent().then(setSiteData).catch(console.error);
    communityApi.getBlogs({ page: 1 }).then((res) => setFeaturedBlogs(res.results.slice(0, 3))).catch(console.error);
    communityApi.getProjects({ page: 1 }).then((res) => setFeaturedProjects(res.results.slice(0, 3))).catch(console.error);
    communityApi.getActivities({ page: 1 }).then((res) => setFeaturedActivities(res.results.slice(0, 3))).catch(console.error);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    try {
      setSubmittingContact(true);
      const res = await publicApi.submitContact({
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      });
      success(res.message);
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
    membersCount: 500,
    projectsCount: 50,
    sessionsCount: 120,
    blogsCount: 25,
    activitiesCount: 15,
  };

  const faqs = siteData?.faqs || [
    {
      id: 1,
      question: 'What is RiseTogether?',
      answer: 'RiseTogether is an open-source, collaborative tech ecosystem where developers build projects, share technical blogs, solve DSA challenges, and grow together.',
    },
    {
      id: 2,
      question: 'Is it free to join the community?',
      answer: 'Yes! RiseTogether is 100% free and open for developers, students, and mentors worldwide.',
    },
    {
      id: 3,
      question: 'How do activity scores and leaderboard ranking work?',
      answer: 'You earn points for contributing projects (10 pts), publishing blogs (10 pts), sharing feed posts (2-5 pts), and receiving likes and comments from peers.',
    },
    {
      id: 4,
      question: 'Can I showcase my own projects or write blogs?',
      answer: 'Absolutely. Once registered, you can publish articles to our blog index, showcase your GitHub repositories, and post directly to the community feed.',
    },
  ];

  return (
    <div className="space-y-28 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center hero-gradient pt-12 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism text-xs font-semibold text-orange-400 mb-8 border border-orange-500/40 shadow-glow-orange animate-float">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>The Premier Collaborative Developer Platform</span>
          </div>

          {/* Heading */}
          <h1 className="font-rajdhani font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-none mb-6">
            EMPOWER YOUR CODE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 text-glow">
              RISE TOGETHER.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed mb-10">
            Join thousands of developers building real-world open-source software, publishing tutorials, solving algorithmic challenges, and networking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/feed' : '/join'}>
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                {isAuthenticated ? 'Go to Feed' : 'Join the Community'}
              </Button>
            </Link>
            <Link to="/community/projects">
              <Button size="lg" variant="secondary" leftIcon={<FolderGit2 className="w-5 h-5 text-orange-400" />}>
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-gray-800/80">
            <div className="p-4 rounded-2xl glassmorphism-light text-center">
              <div className="font-rajdhani font-bold text-3xl sm:text-4xl text-orange-400">
                {stats.membersCount}+
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">
                Active Members
              </div>
            </div>

            <div className="p-4 rounded-2xl glassmorphism-light text-center">
              <div className="font-rajdhani font-bold text-3xl sm:text-4xl text-amber-400">
                {stats.projectsCount}+
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">
                Open Projects
              </div>
            </div>

            <div className="p-4 rounded-2xl glassmorphism-light text-center">
              <div className="font-rajdhani font-bold text-3xl sm:text-4xl text-orange-400">
                {stats.sessionsCount}+
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">
                Tech Workshops
              </div>
            </div>

            <div className="p-4 rounded-2xl glassmorphism-light text-center">
              <div className="font-rajdhani font-bold text-3xl sm:text-4xl text-emerald-400">
                {stats.blogsCount}+
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">
                Tech Articles
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PILLARS / MISSION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="orange" size="md" className="mb-3">OUR MISSION</Badge>
          <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white tracking-wide">
            BUILT BY DEVELOPERS, FOR DEVELOPERS
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            Four pillars that define our supportive developer culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-800 hover:border-orange-500/50">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-5">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani font-bold text-xl text-white mb-2">Collaborative Code</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pair program, contribute to production repos, and receive actionable code reviews from senior developers.
            </p>
          </Card>

          <Card className="border border-gray-800 hover:border-orange-500/50">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani font-bold text-xl text-white mb-2">Knowledge Sharing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Write rich blog posts and technical guides to solidify your learning and build your personal brand.
            </p>
          </Card>

          <Card className="border border-gray-800 hover:border-orange-500/50">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani font-bold text-xl text-white mb-2">DSA & Problem Solving</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sharpen your algorithmic thinking with weekly coding challenges and competitive rankings.
            </p>
          </Card>

          <Card className="border border-gray-800 hover:border-orange-500/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-rajdhani font-bold text-xl text-white mb-2">Gamified Growth</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Earn activity scores and climb the community leaderboard as you build and engage with others.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="purple" size="md" className="mb-2">OPEN SOURCE</Badge>
            <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white">
              COMMUNITY PROJECTS
            </h2>
            <p className="text-sm text-gray-400 mt-1">Explore applications built collaboratively by members.</p>
          </div>
          <Link to="/community/projects">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Projects
            </Button>
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <FolderGit2 className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Projects showcase is being updated. Be the first to share your project!</p>
          </Card>
        )}
      </section>

      {/* ================= FEATURED BLOGS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="orange" size="md" className="mb-2">LATEST ARTICLES</Badge>
            <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white">
              FROM THE TECH BLOG
            </h2>
            <p className="text-sm text-gray-400 mt-1">Tutorials, engineering deep dives, and career insights.</p>
          </div>
          <Link to="/community/blogs">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Read All Articles
            </Button>
          </Link>
        </div>

        {featuredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <BookOpen className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No published articles found. Start drafting your first tutorial today!</p>
          </Card>
        )}
      </section>

      {/* ================= ACTIVITIES & EVENTS ================= */}
      {featuredActivities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="emerald" size="md" className="mb-2">EVENTS & WORKSHOPS</Badge>
              <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white">
                COMMUNITY ACTIVITIES
              </h2>
              <p className="text-sm text-gray-400 mt-1">Live hackathons, pair programming sprints, and talks.</p>
            </div>
            <Link to="/community/activities">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Calendar
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredActivities.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        </section>
      )}

      {/* ================= TESTIMONIALS ================= */}
      {siteData?.testimonials && siteData.testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="orange" size="md" className="mb-2">COMMUNITY LOVE</Badge>
            <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white">
              WHAT DEVELOPERS SAY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.testimonials.slice(0, 3).map((t) => (
              <Card key={t.id} className="border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {Array.from({ length: t.stars }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed italic mb-6">
                    "{t.message}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                  <img
                    src={
                      t.user?.profile_pic ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={t.name || t.user?.username || 'Member'}
                    className="w-9 h-9 rounded-full object-cover border border-orange-500/40"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {t.name || t.user?.username || 'Community Member'}
                    </div>
                    <div className="text-xs text-orange-400 font-mono">Contributor</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ================= FAQ ACCORDION ================= */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <Badge variant="orange" size="md" className="mb-2">FAQ</Badge>
          <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaqIdx === idx;
            return (
              <div
                key={faq.id}
                className="glassmorphism rounded-2xl border border-gray-800/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-rajdhani font-bold text-lg text-white hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <Card className="border border-orange-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <Badge variant="orange" size="md" className="mb-2">GET IN TOUCH</Badge>
            <h2 className="font-rajdhani font-bold text-3xl sm:text-4xl text-white">
              CONTACT OUR LEADERSHIP TEAM
            </h2>
            <p className="text-sm text-gray-400 mt-2">
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
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
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
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
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
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div className="text-center pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submittingContact}
                rightIcon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto px-10"
              >
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
};
