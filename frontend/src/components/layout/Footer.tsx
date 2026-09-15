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
    <footer className="border-t border-orange-500/20 bg-gray-950/80 backdrop-blur-md pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
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
                className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <i className="fa-brands fa-github text-sm" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <i className="fa-brands fa-x-twitter text-sm" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 hover:border-orange-500/60 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                <i className="fa-brands fa-linkedin text-sm" />
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
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700/80 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/80 pr-10"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} RiseTogether Community. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the open-source community
          </p>
        </div>
      </div>
    </footer>
  );
};
