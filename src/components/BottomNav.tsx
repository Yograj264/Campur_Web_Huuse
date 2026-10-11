import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { screen: ScreenType; label: string; icon: string }[] = [
    { screen: 'home-discover', label: 'Home', icon: 'explore' },
    { screen: 'student-dashboard', label: 'Dashboard', icon: 'dashboard' },
    { screen: 'careers-roadmap', label: 'Careers', icon: 'timeline' },
    { screen: 'colleges-admissions', label: 'Colleges', icon: 'school' },
    { screen: 'community-feed', label: 'Community', icon: 'groups' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/92 backdrop-blur-xl border-t border-surface-container shadow-[0_-4px_16px_rgba(11,28,48,0.06)] md:hidden">
      <div className="flex justify-between items-center h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.screen ||
            (item.screen === 'community-feed' && currentScreen === 'community-discussion');

          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 min-w-[56px] min-h-[44px] transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] tracking-tight truncate max-w-full px-1 text-center font-display">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
