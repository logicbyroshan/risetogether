import React, { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-neutral-800 space-x-6 overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 pb-3 font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap text-sm ${
                isActive
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.5 rounded-[2px] text-xs ${isActive ? 'bg-neutral-800 text-white border border-neutral-700' : 'bg-neutral-900 text-gray-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 p-1 bg-black rounded-[3px] border border-neutral-800 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center rounded-[3px] font-medium transition-all cursor-pointer ${sizeStyles[size]} ${
              isActive
                ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-neutral-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-[2px] text-xs ${isActive ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-gray-400'}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
