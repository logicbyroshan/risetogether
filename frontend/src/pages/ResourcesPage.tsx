import React from 'react';
import { Code, Terminal, Database, Cpu, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ResourcesPage: React.FC = () => {
  const resourceCategories = [
    {
      title: 'Full Stack & Web Development',
      icon: <Code className="w-5 h-5 text-orange-400" />,
      items: [
        { name: 'React 19 & TypeScript Modern Cheatsheet', type: 'Cheatsheet', link: 'https://react.dev' },
        { name: 'Django 5.2 Architecture & DRF Best Practices', type: 'Guide', link: 'https://docs.djangoproject.com' },
        { name: 'Tailwind CSS Utility Masterclass', type: 'Reference', link: 'https://tailwindcss.com' },
      ],
    },
    {
      title: 'Data Structures & Algorithms',
      icon: <Terminal className="w-5 h-5 text-blue-400" />,
      items: [
        { name: 'Top 75 LeetCode Patterns & Complexity Analysis', type: 'Curated List', link: 'https://leetcode.com' },
        { name: 'Dynamic Programming Visualized', type: 'Tutorial', link: 'https://neetcode.io' },
        { name: 'Graph Algorithms in Python & TypeScript', type: 'Repo', link: 'https://github.com' },
      ],
    },
    {
      title: 'System Design & Databases',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      items: [
        { name: 'Scalable Microservices & Redis Caching', type: 'Architecture', link: 'https://github.com/donnemartin/system-design-primer' },
        { name: 'PostgreSQL Indexing & Query Optimization', type: 'Whitepaper', link: 'https://postgresql.org' },
        { name: 'REST API Security & CSRF/Session Protocols', type: 'Security', link: 'https://owasp.org' },
      ],
    },
    {
      title: 'DevOps & Cloud Infrastructure',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      items: [
        { name: 'Docker & Docker Compose for Full Stack Apps', type: 'Setup Guide', link: 'https://docker.com' },
        { name: 'CI/CD Pipelines with GitHub Actions', type: 'Workflow', link: 'https://docs.github.com' },
        { name: 'Nginx Reverse Proxy & SSL Configuration', type: 'Deployment', link: 'https://nginx.org' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-800">
        <Badge variant="orange" size="md" className="mb-2">
          CURATED KNOWLEDGE
        </Badge>
        <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
          DEVELOPER RESOURCE LIBRARY
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
          High-yield roadmaps, cheatsheets, system design blueprints, and reference materials curated by community maintainers.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resourceCategories.map((cat, idx) => (
          <Card key={idx} className="border border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-800">
              <div className="p-2.5 rounded-[2px] bg-neutral-900 border border-neutral-800">
                {cat.icon}
              </div>
              <h2 className="font-rajdhani font-bold text-xl text-white">
                {cat.title}
              </h2>
            </div>

            <div className="space-y-2.5">
              {cat.items.map((item, itemIdx) => (
                <a
                  key={itemIdx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-[3px] bg-neutral-900/60 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-900 transition-all group"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-gray-500 font-mono">{item.type}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
