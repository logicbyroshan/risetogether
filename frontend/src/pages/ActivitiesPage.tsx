import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Activity } from '../types/community';
import { communityApi } from '../api/community';
import { ActivityCard } from '../components/community/ActivityCard';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

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

  const occurrenceTabs: TabItem[] = [
    { id: 'all', label: 'All Activities' },
    { id: 'weekly', label: 'Weekly Sprints' },
    { id: 'monthly', label: 'Monthly Hackathons' },
    { id: 'once', label: 'Special Events' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-gray-800">
        <Badge variant="green" size="md" className="mb-2">COMMUNITY EVENTS</Badge>
        <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
          ACTIVITIES & CODING SPRINTS
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
          Participate in live weekend workshops, LeetCode problem solving sprints, hackathons, and virtual meetups.
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={occurrenceTabs}
        activeTab={selectedOccurrence}
        onChange={(tabId) => setSelectedOccurrence(tabId)}
        size="sm"
      />

      {/* Grid */}
      {loading ? (
        <LoadingState
          title="Loading Community Events"
          message="Fetching upcoming sprints, workshops, and coding challenges..."
          className="py-16"
        />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="No Events Scheduled"
          description="Check back soon for upcoming workshops, live streams, and coding sprints."
        />
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
