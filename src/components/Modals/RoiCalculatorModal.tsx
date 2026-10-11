import React, { useState } from 'react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [tuitionPerYear, setTuitionPerYear] = useState<number>(2.2); // Lakhs
  const [durationYears, setDurationYears] = useState<number>(4);
  const [livingCostPerYear, setLivingCostPerYear] = useState<number>(1.0); // Lakhs
  const [expectedCtc, setExpectedCtc] = useState<number>(21.5); // LPA

  if (!isOpen) return null;

  const totalTuition = tuitionPerYear * durationYears;
  const totalLiving = livingCostPerYear * durationYears;
  const totalInvestment = totalTuition + totalLiving;

  // In-hand ratio ~76% of CTC after tax, PF and deductions in India
  const annualInHand = expectedCtc * 0.76;
  const monthlyInHand = (annualInHand * 100000) / 12;

  // Monthly surplus after average young professional living cost (₹35k/mo)
  const monthlySavings = Math.max(monthlyInHand - 35000, 10000);
  const paybackMonths = Math.max(
    Math.round((totalInvestment * 100000) / monthlySavings),
    1
  );

  const fiveYearEarnings = annualInHand * 5 * 1.15; // assuming 15% progression
  const roiMultiple = (fiveYearEarnings / totalInvestment).toFixed(1);

  const applyPreset = (t: number, ctc: number) => {
    setTuitionPerYear(t);
    setExpectedCtc(ctc);
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto border border-surface-container">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-on-surface leading-tight">
                College ROI Calculator
              </h2>
              <p className="text-xs text-on-surface-variant">
                Tuition break-even & 5-year wealth multiple projection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-semibold text-on-surface-variant shrink-0">Presets:</span>
          <button
            onClick={() => applyPreset(2.2, 21.5)}
            className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-semibold hover:bg-surface-container text-on-surface"
          >
            IIT Delhi
          </button>
          <button
            onClick={() => applyPreset(5.4, 18.8)}
            className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-semibold hover:bg-surface-container text-on-surface"
          >
            BITS Pilani
          </button>
          <button
            onClick={() => applyPreset(1.98, 9.2)}
            className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-semibold hover:bg-surface-container text-on-surface"
          >
            VIT Vellore
          </button>
          <button
            onClick={() => applyPreset(1.5, 15.7)}
            className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-semibold hover:bg-surface-container text-on-surface"
          >
            NIT Trichy
          </button>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-4 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface">Annual Tuition Fee</span>
              <span className="font-mono font-bold text-primary">₹{tuitionPerYear.toFixed(2)} Lakhs/yr</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="7.0"
              step="0.1"
              value={tuitionPerYear}
              onChange={(e) => setTuitionPerYear(parseFloat(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface">Target Average CTC</span>
              <span className="font-mono font-bold text-secondary">₹{expectedCtc.toFixed(1)} LPA</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="35.0"
              step="0.5"
              value={expectedCtc}
              onChange={(e) => setExpectedCtc(parseFloat(e.target.value))}
              className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center pt-1 text-xs text-on-surface-variant">
            <span>Total 4-Year Direct Investment:</span>
            <span className="font-mono font-bold text-on-surface">₹{totalInvestment.toFixed(2)} Lakhs</span>
          </div>
        </div>

        {/* Calculated Results Bento */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-primary-fixed/50 border border-primary/20 flex flex-col justify-between">
            <span className="text-xs text-on-primary-fixed-variant font-semibold">Payback Period</span>
            <div className="mt-2">
              <span className="font-display font-extrabold text-2xl text-primary">
                {paybackMonths}
              </span>
              <span className="text-xs font-semibold text-on-surface ml-1">Months</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">
              ~{(paybackMonths / 12).toFixed(1)} years post graduation
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-secondary-fixed/50 border border-secondary/20 flex flex-col justify-between">
            <span className="text-xs text-on-secondary-fixed-variant font-semibold">5-Yr ROI Multiplier</span>
            <div className="mt-2">
              <span className="font-display font-extrabold text-2xl text-secondary">
                {roiMultiple}x
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">
              Estimated ₹{(fiveYearEarnings).toFixed(1)}L cumulative in-hand
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-primary text-on-primary font-display text-sm font-bold shadow-md hover:bg-primary-container transition-all"
        >
          Got It, Back to Colleges
        </button>
      </div>
    </div>
  );
};
