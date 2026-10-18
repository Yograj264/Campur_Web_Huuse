import { useState } from "react";
const ProfileDrawer = ({
  isOpen,
  onClose,
  profileScore,
  onAddCapstoneProject,
  savedCollegesCount
}) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  if (!isOpen) return null;
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    onAddCapstoneProject();
    setShowAddForm(false);
  };
  return <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto border border-surface-container">
        {
    /* Header */
  }
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <span className="font-display font-bold text-base text-on-surface">Student Profile & Readiness</span>
          <button
    onClick={onClose}
    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
  >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {
    /* User Card */
  }
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
          <img
    alt="Profile of Rohan"
    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDERLp8Ud00e1JvKLEr5vVf-BWBvI3RirZ66n8LXV-PRMVbL2LKckwz14Z3L1hzHJdrGFnBd5XU6i0MlXs_mXZx6i3pq8ptTZ0AltXqG8OoA_m13JYcDPHd6Y-IpNjBHpnSxxwBftM6OQROPOsbNd0f2uS5-2M2H6pN5fL_zRaNGgMsPARqfrsHM0-65xWKDlzbp_fBu_65afuFoQZ8mWQVhGRzMpgWR5waNo4TiYltL5LfJ-w9oFjp"
  />
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-sm text-on-surface leading-tight">
              Rohan Verma
            </h3>
            <span className="text-xs text-on-surface-variant block mt-0.5">
              B.Tech CSE • 3rd Year (CGPA 8.4)
            </span>
            <span className="text-[11px] font-semibold text-primary font-mono mt-0.5 block">
              Batch of 2026 • Verified Student
            </span>
          </div>
        </div>

        {
    /* Score Card */
  }
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary via-primary-container to-tertiary text-on-primary flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-fixed">
                Placement Readiness
              </span>
              <h4 className="font-display text-base font-bold mt-0.5">
                {profileScore}% Profile Health
              </h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-display font-extrabold text-base">
              {profileScore}%
            </div>
          </div>

          {profileScore < 100 ? <div className="p-2.5 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-between gap-2">
              <span className="text-xs text-on-primary leading-tight">
                Add capstone graduation project to hit <strong className="text-secondary-fixed">100% score</strong>
              </span>
              <button
    onClick={() => setShowAddForm(true)}
    className="px-2.5 py-1 bg-surface-container-lowest text-primary font-bold text-xs rounded shadow-xs shrink-0 active:scale-95"
  >
                Add
              </button>
            </div> : <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-200 text-xs font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>100% Profile Score achieved! Ready for Tier-1 ATS review.</span>
            </div>}
        </div>

        {
    /* Add Capstone Form */
  }
        {showAddForm && <form onSubmit={handleAddSubmit} className="p-3.5 rounded-xl bg-surface-container border border-surface-container flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">Capstone Project Title & Stack</label>
            <input
    type="text"
    required
    value={projectTitle}
    onChange={(e) => setProjectTitle(e.target.value)}
    placeholder="e.g. Distributed Rate Limiter & Auth SaaS in Go & Redis"
    className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg text-xs border border-surface-container focus:outline-none"
  />
            <div className="flex justify-end gap-2 pt-1">
              <button
    type="button"
    onClick={() => setShowAddForm(false)}
    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant"
  >
                Cancel
              </button>
              <button
    type="submit"
    className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs"
  >
                Save Project
              </button>
            </div>
          </form>}

        {
    /* Quick Stats */
  }
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <span className="text-on-surface-variant text-[11px]">Saved Colleges</span>
            <span className="font-display font-bold text-base text-on-surface block mt-0.5">
              {savedCollegesCount} Institutions
            </span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <span className="text-on-surface-variant text-[11px]">Active Pathway</span>
            <span className="font-display font-bold text-xs text-primary block mt-0.5 truncate">
              Full Stack Web Dev
            </span>
          </div>
        </div>

        <button
    onClick={onClose}
    className="w-full py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors"
  >
          Close
        </button>
      </div>
    </div>;
};
export {
  ProfileDrawer
};
