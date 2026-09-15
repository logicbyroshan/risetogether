import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, Heart } from 'lucide-react';
import { publicApi } from '../../api/public';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubscribing(true);
      const res = await publicApi.subscribeNewsletter(email);
      success(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      toastError(err.customMessage || 'Subscription failed. Please check your email.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="border-t border-neutral-800 bg-black pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/assets/images/logo.png"
                alt="RiseTogether Logo"
                className="w-9 h-9 rounded-[3px] object-cover border border-orange-500/40 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform"
              />
              <span className="font-rajdhani font-bold text-2xl tracking-wider text-white">
                RISE<span className="text-orange-500">TOGETHER</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering developers worldwide to learn, build, collaborate, and share coding knowledge without barriers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/logicbyroshan/risetogether"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-[3px] bg-neutral-900 border border-neutral-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-[3px] bg-neutral-900 border border-neutral-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-[3px] bg-neutral-900 border border-neutral-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-9 h-9 rounded-[3px] bg-neutral-900 border border-neutral-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-rajdhani font-bold text-lg text-white mb-4 tracking-wider">
              COMMUNITY
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/community/blogs" className="hover:text-orange-400 transition-colors">
                  Blogs & Tech Articles
                </Link>
              </li>
              <li>
                <Link to="/community/projects" className="hover:text-orange-400 transition-colors">
                  Open Source Projects
                </Link>
              </li>
              <li>
                <Link to="/community/activities" className="hover:text-orange-400 transition-colors">
                  Community Activities & Sprints
                </Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-orange-400 transition-colors">
                  Developer Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-rajdhani font-bold text-lg text-white mb-4 tracking-wider">
              PLATFORM
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/community/resources" className="hover:text-orange-400 transition-colors">
                  Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-orange-400 transition-colors">
                  Join As Contributor
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-orange-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-orange-400 transition-colors">
                  Contact Organizers
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="font-rajdhani font-bold text-lg text-white mb-4 tracking-wider">
              STAY UPDATED
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Get weekly project digests, workshop invitations, and top technical blogs.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-10 px-4 bg-black border border-neutral-800 rounded-[3px] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 pr-10"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-[2px] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} RiseTogether Community. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the open-source community
          </p>
        </div>
      </div>
    </footer>
  );
};
