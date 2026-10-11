import React from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 3
}) => {
  const getScreenSubtitle = () => {
    switch (currentScreen) {
      case 'home-discover':
        return 'Home Discover';
      case 'student-dashboard':
        return 'Student Dashboard';
      case 'careers-roadmap':
        return 'Careers Roadmap';
      case 'colleges-admissions':
        return 'Colleges Admissions';
      case 'community-feed':
        return 'Student Community';
      case 'community-discussion':
        return 'Discussion Thread';
      default:
        return 'Academic Precision';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand & Wordmark Zone */}
        <button
          onClick={() => onNavigate('home-discover')}
          className="flex items-center gap-2.5 min-w-0 text-left group transition-transform active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display font-bold text-[16px] text-on-surface tracking-tight truncate leading-none">
              Campus Web House
            </span>
            <span className="text-[11px] font-semibold text-primary/80 truncate mt-0.5">
              {getScreenSubtitle()}
            </span>
          </div>
        </button>

        {/* Desktop Quick Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-surface-container">
          <button
            onClick={() => onNavigate('home-discover')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentScreen === 'home-discover'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('student-dashboard')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentScreen === 'student-dashboard'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('careers-roadmap')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentScreen === 'careers-roadmap'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Careers
          </button>
          <button
            onClick={() => onNavigate('colleges-admissions')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentScreen === 'colleges-admissions'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Colleges
          </button>
          <button
            onClick={() => onNavigate('community-feed')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentScreen === 'community-feed' || currentScreen === 'community-discussion'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Community
          </button>
        </nav>

        {/* Actions Zone: Notification + Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            aria-label="Profile"
            onClick={onOpenProfile}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-95 transition-opacity active:scale-95"
          >
            <img
              alt="Profile of Rohan"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDERLp8Ud00e1JvKLEr5vVf-BWBvI3RirZ66n8LXV-PRMVbL2LKckwz14Z3L1hzHJdrGFnBd5XU6i0MlXs_mXZx6i3pq8ptTZ0AltXqG8OoA_m13JYcDPHd6Y-IpNjBHpnSxxwBftM6OQROPOsbNd0f2uS5-2M2H6pN5fL_zRaNGgMsPARqfrsHM0-65xWKDlzbp_fBu_65afuFoQZ8mWQVhGRzMpgWR5waNo4TiYltL5LfJ-w9oFjp"
              onError={(e) => {
                // Graceful fallback avatar if remote image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
