import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, LayoutGrid, CalendarDays } from 'lucide-react';
import { Activity } from '../types/community';
import { communityApi } from '../api/community';
import { ActivityCard } from '../components/community/ActivityCard';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Calendar, CalendarEvent } from '../components/ui/Calendar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
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

  // Convert activities to calendar events format
  const calendarEvents: CalendarEvent[] = activities.map((act) => ({
    id: act.id,
    date: act.date || new Date().toISOString(),
    title: act.title,
    category: act.occurrence_display || act.occurrence,
    categoryVariant: act.occurrence === 'weekly' ? 'emerald' : act.occurrence === 'monthly' ? 'orange' : 'purple',
    description: act.description,
    timing: act.date ? new Date(act.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <Badge variant="emerald" size="md" className="mb-2">
            COMMUNITY SPRINT CALENDAR
          </Badge>
          <h1 className="font-rajdhani font-bold text-4xl sm:text-5xl text-white tracking-tight">
            ACTIVITIES & CODING SPRINTS
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
            Participate in live weekend workshops, algorithmic problem-solving sprints, open-source hackathons, and virtual developer meetups.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex bg-black p-1 rounded-[3px] border border-neutral-800 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-neutral-800 text-white border border-neutral-700 font-bold shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-neutral-800 text-white border border-neutral-700 font-bold shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={occurrenceTabs}
        activeTab={selectedOccurrence}
        onChange={(tabId) => setSelectedOccurrence(tabId)}
        size="sm"
      />

      {/* Main Content */}
      {loading ? (
        <LoadingState
          title="Loading Community Events"
          message="Fetching upcoming sprints, workshops, and coding challenges..."
          className="py-16"
        />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="w-8 h-8" />}
          title="No Events Scheduled"
          description="Check back soon for upcoming workshops, live streams, and coding sprints."
        />
      ) : viewMode === 'calendar' ? (
        <div className="max-w-4xl mx-auto">
          <Calendar events={calendarEvents} />
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
