const CollegeDetailsModal = ({
  college,
  onClose,
  onToggleSave,
  isSaved
}) => {
  if (!college) return null;
  return <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-surface-container">
        {
    /* Banner with image */
  }
        <div className="relative h-44 w-full shrink-0">
          <img
    src={college.image}
    alt={college.altText}
    className="w-full h-full object-cover"
  />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent" />

          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-xs font-bold text-primary shadow-xs">
              {college.nirfLabel || `NIRF Rank #${college.nirfRank}`}
            </span>
            <div className="flex items-center gap-2">
              <button
    onClick={() => onToggleSave(college.id)}
    className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-colors ${isSaved ? "bg-primary text-on-primary" : "bg-surface-container-lowest/90 text-on-surface hover:text-primary"}`}
  >
                <span className="material-symbols-outlined text-[19px]">
                  {isSaved ? "bookmark" : "bookmark_border"}
                </span>
              </button>
              <button
    onClick={onClose}
    className="w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shadow-xs"
  >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-3 inset-x-4">
            <h2 className="font-display font-bold text-xl text-white leading-tight">
              {college.name}
            </h2>
            <p className="text-xs text-surface-container-low flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">pin_drop</span>
              <span>{college.subLocation}</span>
            </p>
          </div>
        </div>

        {
    /* Scrollable Content */
  }
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {
    /* Key Metric Strip */
  }
          <div className="grid grid-cols-3 gap-2.5 bg-surface-container-low p-3 rounded-2xl border border-surface-container">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Avg CTC</span>
              <span className="font-mono font-bold text-sm text-primary mt-0.5">{college.avgCtc}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Annual Fee</span>
              <span className="font-mono font-bold text-sm text-on-surface mt-0.5">{college.annualFee}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Placement Rate</span>
              <span className="font-mono font-bold text-sm text-secondary mt-0.5">{college.placementRate}</span>
            </div>
          </div>

          {
    /* Tags */
  }
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-medium text-on-surface">
              {college.category}
            </span>
            {college.naacGrade && <span className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-semibold text-secondary">
                {college.naacGrade}
              </span>}
            {college.tagExtra && <span className="px-2.5 py-1 rounded-lg bg-tertiary-fixed text-xs font-semibold text-on-tertiary-fixed">
                {college.tagExtra}
              </span>}
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-xs text-on-surface-variant">
              Entrance: {college.entranceExam}
            </span>
          </div>

          {
    /* Branch-wise Cutoff Matrix */
  }
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-bold text-sm text-on-surface flex items-center justify-between">
              <span>Verified Branch Cutoffs (Round 1 to 6)</span>
              <span className="text-[11px] font-mono text-primary font-semibold">2024 / 2025</span>
            </h3>

            {college.cutoffs && college.cutoffs.length > 0 ? <div className="border border-surface-container rounded-xl overflow-hidden divide-y divide-surface-container text-xs">
                {college.cutoffs.map((item, idx) => <div key={idx} className="p-3 bg-surface-container-lowest flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-on-surface block">{item.branch}</span>
                      <span className="text-[10px] text-on-surface-variant">Intake: {item.seats} Seats</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-primary block">
                        Rank {item.openingRank} - {item.closingRank}
                      </span>
                      <span className="text-[10px] text-outline">Category: Open / General</span>
                    </div>
                  </div>)}
              </div> : <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant text-center">
                Detailed branch cutoff database synchronized via MoE JoSAA / State Counseling portal.
              </div>}
          </div>

          {
    /* Admission Process Info */
  }
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
              Application & Counseling Notice
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Admissions conducted through national seat allocation councils. Bookmark this college to receive automated SMS & dashboard notifications when seat matrix and verification dates are gazetted.
            </p>
          </div>
        </div>

        {
    /* Action Bottom Bar */
  }
        <div className="p-3 bg-surface-container-low border-t border-surface-container flex items-center justify-between gap-3">
          <button
    onClick={() => onToggleSave(college.id)}
    className="px-4 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5"
  >
            <span className="material-symbols-outlined text-[16px]">
              {isSaved ? "bookmark_added" : "bookmark_border"}
            </span>
            <span>{isSaved ? "Saved in Profile" : "Save College"}</span>
          </button>
          <button
    onClick={onClose}
    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-display text-xs font-bold shadow-md hover:bg-primary-container transition-all"
  >
            Done
          </button>
        </div>
      </div>
    </div>;
};
export {
  CollegeDetailsModal
};
