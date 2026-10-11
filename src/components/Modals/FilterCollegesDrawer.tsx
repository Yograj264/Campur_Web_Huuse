import React, { useState } from 'react';

interface FilterCollegesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    stream: string;
    maxTuition: number;
    region: string;
  }) => void;
  onReset: () => void;
}

export const FilterCollegesDrawer: React.FC<FilterCollegesDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onReset
}) => {
  const [stream, setStream] = useState('B.Tech / B.E.');
  const [maxTuition, setMaxTuition] = useState<number>(3.5); // in Lakhs
  const [region, setRegion] = useState('Bengaluru');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({ stream, maxTuition, region });
    onClose();
  };

  const handleReset = () => {
    setStream('B.Tech / B.E.');
    setMaxTuition(10);
    setRegion('All');
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-surface-container">
        {/* Drawer Header */}
        <div className="p-4 flex items-center justify-between bg-surface-container-low border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h3 className="font-display font-bold text-base text-on-surface">Filter & Sort Colleges</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Degree Category */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">Degree Stream</label>
            <div className="grid grid-cols-2 gap-2">
              {['B.Tech / B.E.', 'BCA / MCA', 'M.Tech / M.E.', 'B.Sc Data Science'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStream(item)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                    stream === item
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                  }`}
                >
                  <span>{item}</span>
                  {stream === item && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Annual Tuition Slider */}
          <div className="flex flex-col gap-2 bg-surface-container-low p-3.5 rounded-2xl border border-surface-container">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-on-surface">Max Annual Tuition</span>
              <span className="font-mono font-bold text-primary">₹{maxTuition.toFixed(1)} Lakhs / yr</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="7.0"
              step="0.5"
              value={maxTuition}
              onChange={(e) => setMaxTuition(parseFloat(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-on-surface-variant font-mono text-[10px]">
              <span>₹50K</span>
              <span>₹7L+</span>
            </div>
          </div>

          {/* Preferred Region */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">Preferred Region</label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Mumbai'].map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setRegion(reg)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    region === reg
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container border border-surface-container'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stick CTA */}
        <div className="p-3.5 bg-surface-container-low border-t border-surface-container flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-[2] h-11 rounded-xl bg-primary text-on-primary font-display text-xs font-bold shadow-md hover:bg-primary-container transition-all"
          >
            Apply (View Filtered)
          </button>
        </div>
      </div>
    </div>
  );
};
