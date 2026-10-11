import React, { useState } from 'react';
import { College } from '../types';

interface CollegesScreenProps {
  colleges: College[];
  onSelectCollege: (college: College) => void;
  onOpenFilterDrawer: () => void;
  onOpenRoiCalculator: () => void;
  onOpenCompareMatrix: () => void;
  onToggleCompareCollege: (college: College) => void;
  selectedCompareColleges: College[];
  onToggleSaveCollege: (collegeId: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const CollegesScreen: React.FC<CollegesScreenProps> = ({
  colleges,
  onSelectCollege,
  onOpenFilterDrawer,
  onOpenRoiCalculator,
  onOpenCompareMatrix,
  onToggleCompareCollege,
  selectedCompareColleges,
  onToggleSaveCollege,
  onTriggerToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All Colleges');
  const [sortOption, setSortOption] = useState<'ctc' | 'nirf' | 'fee'>('ctc');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filtering logic
  const filteredColleges = colleges
    .filter((col) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        col.name.toLowerCase().includes(q) ||
        col.location.toLowerCase().includes(q) ||
        col.subLocation.toLowerCase().includes(q) ||
        col.entranceExam.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeChip === 'NIRF Top 50') {
        return (col.nirfRank || 999) <= 50;
      }
      if (activeChip === 'B.Tech / BE') {
        return col.programs.includes('B.Tech') || col.programs.includes('B.E.');
      }
      if (activeChip === 'BCA / MCA') {
        return col.programs.includes('BCA') || col.programs.includes('MCA');
      }
      if (activeChip === 'Govt. Autonomous') {
        return col.category === 'Govt. Autonomous' || col.category === 'Central Inst.';
      }
      if (activeChip === 'Fees < ₹2L/yr') {
        return col.annualFeeNumber <= 2.0;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'ctc') return b.avgCtcNumber - a.avgCtcNumber;
      if (sortOption === 'nirf') return (a.nirfRank || 999) - (b.nirfRank || 999);
      if (sortOption === 'fee') return a.annualFeeNumber - b.annualFeeNumber;
      return 0;
    });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setIsLoadingMore(false);
      onTriggerToast('Loaded verified colleges from MoE 2025 catalog! 🏛️');
    }, 700);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Utility Container */}
      <div className="pt-2 pb-4 flex flex-col gap-3">
        {/* Context indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Admissions 2025 Catalog
            </span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-0.5 rounded-full text-on-surface">
            <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
            <span className="font-mono text-xs font-semibold">1,248 Verified</span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full shadow-xs rounded-2xl">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by college, city, or entrance exam..."
            className="w-full h-11 pl-11 pr-11 bg-surface-container-lowest text-on-surface rounded-2xl text-xs sm:text-sm placeholder:text-outline border border-surface-container focus:outline-none focus:border-primary/40 transition-all"
          />
          <button
            type="button"
            onClick={() => onTriggerToast('Voice & instant college search activated')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </button>
        </div>

        {/* Scrollable Filter Chips Horizon */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            'All Colleges',
            'NIRF Top 50',
            'B.Tech / BE',
            'BCA / MCA',
            'Govt. Autonomous',
            'Fees < ₹2L/yr'
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`shrink-0 h-8 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeChip === chip
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-surface-container'
              }`}
            >
              {chip === 'NIRF Top 50' && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
              {chip}
            </button>
          ))}
        </div>

        {/* Filter Trigger Bar & Sort */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onOpenFilterDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">filter_list</span>
            <span>Filter & Sort</span>
            <span className="min-w-[18px] h-[18px] px-1 bg-primary text-on-primary font-mono text-[10px] rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-on-surface-variant hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-surface-container-lowest border border-surface-container rounded-xl px-2.5 py-1.5 text-xs font-semibold text-on-surface focus:outline-none"
            >
              <option value="ctc">Median CTC (High-Low)</option>
              <option value="nirf">NIRF Rank (Ascending)</option>
              <option value="fee">Tuition Fee (Low-High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Colleges Feed */}
      <div className="flex flex-col gap-4">
        {filteredColleges.slice(0, visibleCount).map((college) => {
          const isSelectedForCompare = selectedCompareColleges.some((c) => c.id === college.id);

          return (
            <article
              key={college.id}
              className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-primary/30"
            >
              {/* Header Image with Badges */}
              <div className="relative w-full h-36 sm:h-40">
                <img
                  src={college.image}
                  alt={college.altText}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/25 to-transparent"></div>

                {/* Top Action Bar */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[11px] text-primary font-bold shadow-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">military_tech</span>
                    <span>{college.nirfLabel || `NIRF Rank #${college.nirfRank}`}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSaveCollege(college.id);
                      onTriggerToast(
                        college.isSaved
                          ? `Removed ${college.name} from saved list`
                          : `Saved ${college.name} to profile bookmarks! 📌`
                      );
                    }}
                    title={college.isSaved ? 'Saved' : 'Bookmark'}
                    className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-xs ${
                      college.isSaved
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest/90 text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {college.isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                {/* Name & Region */}
                <div className="absolute bottom-2.5 inset-x-3.5 flex flex-col">
                  <h2 className="font-display font-bold text-base sm:text-lg text-white leading-snug line-clamp-1">
                    {college.name}
                  </h2>
                  <div className="flex items-center gap-1 text-surface-container-low text-xs mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                    <span className="truncate">{college.subLocation}</span>
                  </div>
                </div>
              </div>

              {/* Card Core Information */}
              <div className="p-4 flex flex-col gap-3">
                {/* Tags Strip */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-surface-container text-xs font-medium text-on-surface">
                    {college.category}
                  </span>
                  {college.naacGrade && (
                    <span className="px-2 py-0.5 rounded-lg bg-surface-container text-xs font-semibold text-secondary">
                      {college.naacGrade}
                    </span>
                  )}
                  {college.tagExtra && (
                    <span className="px-2 py-0.5 rounded-lg bg-tertiary-fixed text-xs font-semibold text-on-tertiary-fixed">
                      {college.tagExtra}
                    </span>
                  )}
                </div>

                {/* Key Programs */}
                <div className="flex items-center gap-1.5 text-xs bg-surface-container-low p-2 rounded-xl border border-surface-container">
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">school</span>
                  <span className="font-bold text-on-surface">Programs:</span>
                  <span className="text-on-surface-variant truncate">{college.programs}</span>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-3 gap-2 py-0.5 text-center">
                  <div className="flex flex-col bg-surface-container-low p-2 rounded-xl border border-surface-container">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Avg CTC</span>
                    <span className="font-mono text-xs font-bold text-primary mt-0.5">{college.avgCtc}</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-low p-2 rounded-xl border border-surface-container">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Annual Fee</span>
                    <span className="font-mono text-xs font-semibold text-on-surface mt-0.5">{college.annualFee}</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-low p-2 rounded-xl border border-surface-container">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Cutoff</span>
                    <span className="font-mono text-xs font-semibold text-secondary mt-0.5 truncate">
                      {college.entranceExam}
                    </span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleCompareCollege(college);
                      onTriggerToast(
                        isSelectedForCompare
                          ? `Removed ${college.name} from comparison`
                          : `Added ${college.name} to comparison matrix! 📊`
                      );
                    }}
                    className={`flex-1 h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors border ${
                      isSelectedForCompare
                        ? 'bg-primary-fixed border-primary text-primary'
                        : 'bg-surface-container hover:bg-surface-container-high border-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                    <span>{isSelectedForCompare ? 'Selected' : 'Compare'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCollege(college)}
                    className="flex-[2] h-9 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Cutoffs & Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredColleges.length === 0 && (
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-surface-container text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-outline">search_off</span>
            <h3 className="font-display font-bold text-sm text-on-surface">No colleges matched your filters</h3>
            <p className="text-xs text-on-surface-variant max-w-xs">
              Try adjusting your search query, tuition range, or stream selection.
            </p>
          </div>
        )}

        {/* Compare Floating Banner if items selected */}
        {selectedCompareColleges.length > 0 && (
          <div className="p-3 bg-primary text-on-primary rounded-2xl flex items-center justify-between shadow-lg">
            <span className="text-xs font-semibold">
              {selectedCompareColleges.length} college{selectedCompareColleges.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={onOpenCompareMatrix}
              className="px-3.5 py-1.5 bg-surface-container-lowest text-primary text-xs font-bold rounded-xl shadow-xs"
            >
              Open Comparison Matrix
            </button>
          </div>
        )}

        {/* Placement & ROI Quick Glance Banner */}
        <div
          onClick={onOpenRoiCalculator}
          className="bg-gradient-to-r from-primary-fixed to-surface-container p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-on-surface leading-snug">
                College ROI Calculator
              </span>
              <span className="text-xs text-on-surface-variant">
                Calculate pay-off period based on tuition and average CTC
              </span>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Catalog Pagination */}
        <div className="pt-2 pb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">database</span>
            <span>
              Showing{' '}
              <strong className="text-on-surface font-semibold">
                1 - {Math.min(visibleCount, filteredColleges.length)}
              </strong>{' '}
              of <strong className="text-on-surface font-semibold">1,248</strong> Accredited Colleges
            </span>
          </div>

          {visibleCount < filteredColleges.length && (
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              className="w-full h-12 rounded-2xl bg-surface-container-lowest hover:bg-surface-container text-primary text-xs sm:text-sm font-bold shadow-xs border border-surface-container flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isLoadingMore ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Fetching verified colleges...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  <span>Load More Colleges</span>
                </>
              )}
            </button>
          )}

          <p className="text-[10px] text-outline max-w-xs">
            Updated hourly via MoE (NIRF 2024), AICTE Gazette & direct placement cell verification.
          </p>
        </div>
      </div>
    </div>
  );
};
