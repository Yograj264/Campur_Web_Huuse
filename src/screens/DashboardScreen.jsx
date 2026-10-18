const DashboardScreen = ({
  onNavigate,
  onOpenAssessment,
  onOpenProfile,
  onOpenCompare,
  onSelectCollege,
  onOpenDiscussion,
  onTriggerToast,
  colleges,
  profileScore,
  deadlines,
  onToggleDeadlineReminder
}) => {
  const savedColleges = colleges.filter(
    (c) => ["iit-delhi", "iiit-hyderabad", "dtu-delhi"].includes(c.id)
  );
  return <div className="flex flex-col w-full pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      {
    /* Top Greeting & Profile Health Banner */
  }
      <section className="pt-2 pb-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-tertiary p-5 sm:p-6 text-on-primary shadow-md">
          {
    /* Decorative Backdrop Geometry */
  }
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-12 w-28 h-28 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-on-primary text-xs font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
                  B.Tech CSE • 3rd Year (CGPA 8.4)
                </span>
                <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight mt-1 truncate">
                  Welcome back, Rohan! 👋
                </h1>
              </div>

              {
    /* Radial Gauge */
  }
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
    className="text-white/20 fill-none"
    cx="24"
    cy="24"
    r="20"
    stroke="currentColor"
    strokeWidth="3.5"
  />
                  <circle
    className="text-secondary-fixed fill-none transition-all duration-1000 ease-out"
    cx="24"
    cy="24"
    r="20"
    stroke="currentColor"
    strokeDasharray="125.6"
    strokeDashoffset={125.6 - 125.6 * profileScore / 100}
    strokeLinecap="round"
    strokeWidth="3.5"
  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-display font-extrabold text-sm sm:text-base leading-none text-on-primary">
                    {profileScore}%
                  </span>
                </div>
              </div>
            </div>

            {
    /* Completion Nudge Prompt */
  }
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <span
    className="material-symbols-outlined text-[18px] text-secondary-fixed shrink-0"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
                  stars
                </span>
                <p className="text-xs text-on-primary/95 truncate">
                  Add capstone graduation project to hit{" "}
                  <span className="font-bold text-secondary-fixed">100% profile score</span>
                </p>
              </div>
              <button
    onClick={onOpenProfile}
    aria-label="Add project"
    className="shrink-0 px-3 py-1 rounded-lg bg-surface-container-lowest text-primary text-xs font-bold shadow-xs active:scale-95 transition-transform"
  >
                Add
              </button>
            </div>
          </div>
        </div>
      </section>

      {
    /* Horizontal Quick Action Pills */
  }
      <section className="pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
    onClick={() => onNavigate("careers-roadmap")}
    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-xs active:scale-95 transition-transform"
  >
            <span
    className="material-symbols-outlined text-[18px]"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
              play_circle
            </span>
            <span>Resume Roadmap</span>
          </button>

          <button
    onClick={() => onTriggerToast("Viewing 3 critical deadlines for your batch")}
    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shadow-xs active:scale-95 transition-transform border border-surface-container"
  >
            <span className="material-symbols-outlined text-[18px] text-error">event_upcoming</span>
            <span>Upcoming Deadlines</span>
          </button>

          <button
    onClick={onOpenAssessment}
    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shadow-xs active:scale-95 transition-transform border border-surface-container"
  >
            <span className="material-symbols-outlined text-[18px] text-tertiary">quiz</span>
            <span>Take Skill Quiz</span>
          </button>

          <button
    onClick={() => onNavigate("community-feed")}
    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold shadow-xs active:scale-95 transition-transform border border-surface-container"
  >
            <span className="material-symbols-outlined text-[18px] text-secondary">forum</span>
            <span>Ask Community</span>
          </button>
        </div>
      </section>

      {
    /* Main Modular Feed */
  }
      <div className="flex flex-col gap-4">
        {
    /* Active Roadmap Progress Card */
  }
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-mono text-[10px] font-bold">
                  ACTIVE TRACK
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Stage 3 of 6</span>
              </div>
              <h2 className="font-display font-bold text-base sm:text-lg text-on-surface tracking-tight truncate">
                Full Stack Web Developer
              </h2>
              <p className="text-xs text-on-surface-variant">MERN & Python Specialist Pathway</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 border border-surface-container">
              <span className="material-symbols-outlined text-[22px]">terminal</span>
            </div>
          </div>

          {
    /* Linear Bar */
  }
          <div className="my-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-on-surface-variant">Advanced Backend & API Integration</span>
              <span className="font-bold text-primary font-mono text-xs">62% Done</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div
    className="h-full bg-gradient-to-r from-primary to-secondary-container rounded-full"
    style={{ width: "62%" }}
  />
            </div>
          </div>

          {
    /* Next Task Card */
  }
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">code</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] uppercase font-bold text-on-surface-variant">
                  Next Task
                </span>
                <p className="font-display font-semibold text-xs sm:text-sm text-on-surface truncate">
                  Build Django REST JWT Auth Service
                </p>
              </div>
            </div>
            <button
    onClick={() => onNavigate("careers-roadmap")}
    className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-display text-xs font-bold shadow-xs hover:bg-primary-container active:scale-95 transition-all"
  >
              <span>Continue</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {
    /* Critical Deadlines */
  }
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-error/10 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[18px]">alarm</span>
              </div>
              <h2 className="font-display font-bold text-base text-on-surface">Critical Deadlines</h2>
            </div>
            <button
    onClick={() => onTriggerToast("Viewing 5 registered deadlines")}
    className="text-xs font-bold text-primary flex items-center hover:underline"
  >
              <span>View All (5)</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {deadlines.map((dl) => <div
    key={dl.id}
    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container"
  >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${dl.isUrgent ? "bg-error-container text-on-error-container font-bold" : "bg-surface-container text-on-surface"}`}
  >
                    <span className="text-[10px] leading-tight font-bold uppercase">{dl.month}</span>
                    <span className="font-display text-sm leading-none font-bold">{dl.day}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-display font-bold text-xs sm:text-sm text-on-surface truncate">
                        {dl.title}
                      </p>
                      {dl.tag && <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-error text-on-error uppercase">
                          {dl.tag}
                        </span>}
                    </div>
                    <p className={`text-xs ${dl.isUrgent ? "text-error font-medium" : "text-on-surface-variant"}`}>
                      {dl.subtext}
                    </p>
                  </div>
                </div>

                <button
    onClick={() => {
      onToggleDeadlineReminder(dl.id);
      onTriggerToast(
        dl.hasReminder ? `Reminder cancelled for ${dl.title}` : `Reminder set for ${dl.title}! \u{1F514}`
      );
    }}
    title={dl.hasReminder ? "Reminder active" : "Set reminder"}
    className={`shrink-0 p-2 rounded-full transition-colors ${dl.hasReminder ? "bg-primary-fixed text-primary" : "hover:bg-surface-container text-on-surface-variant"}`}
  >
                  <span className="material-symbols-outlined text-[20px]">
                    {dl.hasReminder ? "notifications_active" : "notifications_none"}
                  </span>
                </button>
              </div>)}
          </div>
        </section>

        {
    /* Rule-Based Career Recommendations */
  }
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary">psychology</span>
                <h2 className="font-display font-bold text-base text-on-surface">Target Career Matches</h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">Customized for B.Tech CSE (CGPA 8.4)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {
    /* Match 1 */
  }
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      94% Match
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-semibold">
                      High Demand
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface mt-1.5">
                    Cloud DevOps Engineer
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-1 rounded shrink-0">
                  ₹14 - 22 LPA
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Strong fit with your Docker, Linux, and Python projects.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs">
                <span className="text-on-surface-variant">42 Active campus openings</span>
                <button
    onClick={() => onNavigate("careers-roadmap")}
    className="font-bold text-primary flex items-center gap-0.5 hover:underline"
  >
                  Explore <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {
    /* Match 2 */
  }
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      89% Match
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface mt-1.5">
                    Backend Systems Architect
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-1 rounded shrink-0">
                  ₹16 - 28 LPA
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                High correlation with your DBMS & Data Structures ratings.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs">
                <span className="text-on-surface-variant">28 Active campus openings</span>
                <button
    onClick={() => onNavigate("careers-roadmap")}
    className="font-bold text-primary flex items-center gap-0.5 hover:underline"
  >
                  Explore <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {
    /* Saved Colleges (3) & Comparator */
  }
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">bookmark</span>
              <h2 className="font-display font-bold text-base text-on-surface">Saved Colleges (3)</h2>
            </div>
            <button
    onClick={onOpenCompare}
    className="px-3 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center gap-1"
  >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Compare Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {savedColleges.map((col) => <div
    key={col.id}
    onClick={() => onSelectCollege(col)}
    className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container flex flex-col items-center text-center cursor-pointer transition-colors"
  >
                <img
    src={col.image}
    alt={col.name}
    className="w-10 h-10 rounded-full object-cover mb-1.5 bg-surface-container shadow-xs"
  />
                <h4 className="font-display font-bold text-xs text-on-surface truncate w-full">
                  {col.name.split("-")[0].trim()}
                </h4>
                <span className="text-[10px] text-on-surface-variant truncate w-full">
                  {col.nirfLabel || "NIRF Ranked"}
                </span>
                <span className="mt-1 font-mono text-xs font-bold text-primary">{col.avgCtc}</span>
              </div>)}
          </div>
        </section>

        {
    /* Recently Viewed Study Resources */
  }
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">folder_open</span>
              <h2 className="font-display font-bold text-base text-on-surface">Recent Resources</h2>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">Semester 5 Prep</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-xs sm:text-sm text-on-surface truncate">
                    Operating Systems Semester Notes
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Process Scheduling & Virtual Memory • 12.4 MB
                  </p>
                </div>
              </div>
              <button
    onClick={() => onTriggerToast("Downloading Operating Systems Notes (12.4 MB)... \u{1F4E5}")}
    aria-label="Download PDF"
    className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-full transition-colors"
  >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-xs sm:text-sm text-on-surface truncate">
                    DBMS Previous Year Solved Papers
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    2019-2024 University Papers with SQL Solutions
                  </p>
                </div>
              </div>
              <button
    onClick={() => onTriggerToast("Downloading DBMS Papers (8.1 MB)... \u{1F4E5}")}
    aria-label="Download Solved Papers"
    className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-full transition-colors"
  >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </div>
        </section>

        {
    /* Community Pulse Feed Preview */
  }
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-tertiary">forum</span>
              <h2 className="font-display font-bold text-base text-on-surface">Community Pulse</h2>
            </div>
            <span className="text-xs font-semibold text-primary">Trending Discussion</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[10px] font-semibold">
                System Design
              </span>
              <span className="text-xs text-on-surface-variant">2 hours ago</span>
            </div>

            <h3 className="font-display font-bold text-sm sm:text-base text-on-surface leading-snug">
              How to prepare for System Design in 6 months for Tier-1 Product MNCs?
            </h3>

            <div className="flex items-center justify-between text-on-surface-variant pt-1 border-t border-surface-container text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                  24 answers
                </span>
                <span className="flex items-center gap-1 text-secondary font-semibold">
                  <span
    className="material-symbols-outlined text-[16px]"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
                    verified
                  </span>
                  8 Alumni Verified
                </span>
              </div>
              <button
    onClick={() => onOpenDiscussion("discussion-1")}
    className="font-bold text-primary hover:underline flex items-center gap-0.5"
  >
                Join Thread →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>;
};
export {
  DashboardScreen
};
