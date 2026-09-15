import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { Activity } from '../../types/community';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <Card className="flex flex-col h-full !p-0 group border border-gray-800 hover:border-orange-500/50">
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-800">
        <img
          src={
            activity.thumbnail ||
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'
          }
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge variant="orange" size="sm">
            {activity.occurrence_display || activity.occurrence}
          </Badge>
        </div>

        {activity.date && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md border border-gray-700 text-xs text-gray-200 font-semibold flex items-center gap-1.5 shadow-lg">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>{new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-rajdhani font-bold text-xl text-white group-hover:text-orange-400 transition-colors mb-2">
          {activity.title}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
          {activity.description}
        </p>
      </div>
    </Card>
  );
};
