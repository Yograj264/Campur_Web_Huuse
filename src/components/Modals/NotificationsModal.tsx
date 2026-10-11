import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onClear
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'GATE 2025 Registration Closes in 6 Days',
      time: '1 hour ago',
      desc: 'National examination registration window for CSE candidates closing on Oct 28.',
      type: 'urgent',
      icon: 'alarm'
    },
    {
      id: 'notif-2',
      title: 'Siddharth Roy (PhonePe) replied to your query',
      time: '2 hours ago',
      desc: 'Verified advice posted on System Design & LLD preparation roadmap.',
      type: 'mentor',
      icon: 'verified'
    },
    {
      id: 'notif-3',
      title: 'New On-Campus Placement Drive Alert',
      time: 'Yesterday',
      desc: '42 companies currently interviewing for Junior Full-Stack roles this month.',
      type: 'drive',
      icon: 'work'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-start justify-end p-3 sm:p-6">
      <div className="w-full max-w-sm mt-12 bg-surface-container-lowest rounded-2xl p-4 shadow-2xl flex flex-col gap-3 border border-surface-container animate-slide-up">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
            <h3 className="font-display font-bold text-sm text-on-surface">Notifications (3)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              Mark Read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-2.5"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'urgent'
                    ? 'bg-error-container text-on-error-container'
                    : item.type === 'mentor'
                    ? 'bg-primary-fixed text-primary'
                    : 'bg-secondary-fixed text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-on-surface leading-tight truncate">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                  {item.desc}
                </p>
                <span className="text-[10px] text-outline mt-1 block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};
