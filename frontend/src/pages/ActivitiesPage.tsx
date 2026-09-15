import React, { useState, useEffect } from 'react';
import { Calendar, Tag } from 'lucide-react';
import { Activity } from '../types/community';
import { communityApi } from '../api/community';
import { ActivityCard } from '../components/community/ActivityCard';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await communityApi.getActivities({
        occurrence: selectedOccurrence !== 'all' ? selectedOccurrence : undefined,
      });
      setActivities(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedOccurrence]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-gray-800">
        <Badge variant="emerald" size="md" className="mb-2">COMMUNITY EVENTS</Badge>
        <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
          ACTIVITIES & CODING SPRINTS
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-xl">
          Participate in live weekend workshops, LeetCode problem solving sprints, hackathons, and virtual meetups.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedOccurrence('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedOccurrence === 'all'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All Activities
        </button>
        <button
          onClick={() => setSelectedOccurrence('weekly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedOccurrence === 'weekly'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Weekly Sprints
        </button>
        <button
          onClick={() => setSelectedOccurrence('monthly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedOccurrence === 'monthly'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Monthly Hackathons
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : activities.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 rounded-2xl glassmorphism">
          <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-rajdhani font-bold text-xl text-gray-200">No Events Scheduled</h3>
          <p className="text-xs text-gray-400 mt-1">Check back soon for upcoming workshops and coding sprints.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}
    </div>
  );
};
