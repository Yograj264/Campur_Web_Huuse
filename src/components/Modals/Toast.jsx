import { useEffect } from "react";
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-inverse-surface text-inverse-on-surface text-xs md:text-sm font-semibold shadow-xl flex items-center gap-2 animate-bounce-subtle pointer-events-none transition-all">
      <span className="material-symbols-outlined text-[18px] text-secondary-container">
        check_circle
      </span>
      <span>{message}</span>
    </div>;
};
export {
  Toast
};
