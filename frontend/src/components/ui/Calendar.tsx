import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Sparkles } from 'lucide-react';
import { Badge } from './Badge';

export interface CalendarEvent {
  id: string | number;
  date: string; // ISO date string or YYYY-MM-DD
  title: string;
  category?: string;
  categoryVariant?: 'orange' | 'emerald' | 'blue' | 'purple' | 'yellow';
  description?: string;
  timing?: string;
  link?: string;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  className?: string;
  showEventDetails?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  events = [],
  selectedDate: propSelectedDate,
  onSelectDate,
  className = '',
  showEventDetails = true,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    propSelectedDate || new Date()
  );
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(
    propSelectedDate || new Date()
  );

  const selectedDate = propSelectedDate || internalSelectedDate;

  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Days calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonthDate(today);
    setInternalSelectedDate(today);
    onSelectDate?.(today);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setInternalSelectedDate(newDate);
    onSelectDate?.(newDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  // Find events on a specific day
  const getEventsForDay = (day: number) => {
    const targetDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      const eDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
      return eDateStr === targetDateStr;
    });
  };

  // Events on currently selected date
  const selectedDayEvents = events.filter((e) => {
    const eventDate = new Date(e.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className={`glassmorphism rounded-[3px] p-5 sm:p-6 border border-neutral-800 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[2px] bg-neutral-900 border border-neutral-800 text-orange-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-rajdhani font-bold text-lg text-white tracking-wide">
              {monthNames[currentMonth]} <span className="text-orange-400">{currentYear}</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">Community Schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-semibold rounded-[2px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-[2px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-[2px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {dayNames.map((d, i) => (
          <div key={i} className="text-[11px] font-mono font-bold text-gray-400 py-1 uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Previous Month Padding Days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => {
          const prevDay = daysInPrevMonth - firstDayOfMonth + i + 1;
          return (
            <div
              key={`prev-${i}`}
              className="h-9 sm:h-10 flex items-center justify-center text-xs text-neutral-600 rounded-[2px] select-none"
            >
              {prevDay}
            </div>
          );
        })}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`h-9 sm:h-10 relative flex flex-col items-center justify-center rounded-[2px] text-xs font-semibold transition-all cursor-pointer ${
                selected
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 font-bold'
                  : today
                  ? 'bg-neutral-900 text-orange-400 border border-orange-500/50'
                  : hasEvents
                  ? 'bg-neutral-900/90 text-gray-100 hover:bg-neutral-800 border border-neutral-800'
                  : 'text-gray-300 hover:bg-neutral-900/60 hover:text-white'
              }`}
            >
              <span>{day}</span>
              {hasEvents && !selected && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 absolute bottom-1 shadow-glow-orange" />
              )}
            </button>
          );
        })}
      </div>

      {/* Event Details Section for Selected Date */}
      {showEventDetails && (
        <div className="mt-5 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-rajdhani flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>
                Events for {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </h4>
            <span className="text-[11px] font-mono text-gray-500">
              {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
              {selectedDayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-[3px] bg-neutral-900/80 border border-neutral-800 hover:border-orange-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-white line-clamp-1">{evt.title}</h5>
                    {evt.category && (
                      <Badge variant={evt.categoryVariant || 'orange'} size="xs">
                        {evt.category}
                      </Badge>
                    )}
                  </div>
                  {evt.description && (
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                  {evt.timing && (
                    <div className="flex items-center gap-1.5 text-[10px] text-orange-400 mt-2 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{evt.timing}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-3 text-center bg-neutral-900/30 rounded-[2px] border border-dashed border-neutral-800">
              No events scheduled for this day. Select another date with an event indicator.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
