const CollegeCompareModal = ({
  isOpen,
  onClose,
  selectedColleges,
  allColleges,
  onToggleCollege
}) => {
  if (!isOpen) return null;
  const collegesToCompare = selectedColleges.length >= 2 ? selectedColleges : allColleges.slice(0, 3);
  return <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto border border-surface-container">
        {
    /* Header */
  }
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-on-surface leading-tight">
                College Comparison Matrix
              </h2>
              <p className="text-xs text-on-surface-variant">
                Side-by-side NIRF, placement audit and tuition cutoff metrics
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

        {
    /* Comparison Table */
  }
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse text-left text-xs min-w-[580px]">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="p-3 text-on-surface-variant font-semibold w-1/4">Metric</th>
                {collegesToCompare.map((c) => <th key={c.id} className="p-3 font-display font-bold text-sm text-on-surface">
                    <div className="flex items-center justify-between gap-1">
                      <span>{c.name}</span>
                      <button
    onClick={() => onToggleCollege(c)}
    title="Remove from comparison"
    className="text-on-surface-variant hover:text-error text-xs"
  >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <span className="text-[11px] font-normal text-on-surface-variant block mt-0.5">
                      {c.subLocation}
                    </span>
                  </th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs">
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">NIRF Ranking</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold font-mono">
                      {c.nirfLabel || `#${c.nirfRank}`}
                    </span>
                  </td>)}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Average Package (CTC)</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3 font-mono font-bold text-sm text-primary">
                    {c.avgCtc}
                  </td>)}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Annual Tuition Fee</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3 font-mono font-semibold text-on-surface">
                    {c.annualFee}
                  </td>)}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Verified Placement Rate</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3 font-mono font-bold text-secondary">
                    {c.placementRate}
                  </td>)}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Entrance Exam</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3 font-semibold text-on-surface">
                    {c.entranceExam}
                  </td>)}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Accreditation / Type</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3 text-on-surface-variant">
                    {c.category} {c.naacGrade ? `\u2022 ${c.naacGrade}` : ""}
                  </td>)}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Key Programs</td>
                {collegesToCompare.map((c) => <td key={c.id} className="p-3 text-on-surface-variant leading-relaxed">
                    {c.programs}
                  </td>)}
              </tr>
            </tbody>
          </table>
        </div>

        {
    /* Footer */
  }
        <div className="pt-2 flex justify-end">
          <button
    onClick={onClose}
    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-display text-xs font-bold shadow-md hover:bg-primary-container transition-all"
  >
            Close Matrix
          </button>
        </div>
      </div>
    </div>;
};
export {
  CollegeCompareModal
};
