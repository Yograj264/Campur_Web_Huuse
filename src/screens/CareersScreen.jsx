import { useState } from "react";
import { FULL_STACK_MILESTONES } from "../data/mockData";
const CareersScreen = ({
  onNavigate,
  onOpenMentorDrawer,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [milestones, setMilestones] = useState(FULL_STACK_MILESTONES);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const toggleTask = (stageNum, taskId) => {
    setMilestones(
      (prev) => prev.map((stage) => {
        if (stage.stageNumber !== stageNum || !stage.tasks) return stage;
        return {
          ...stage,
          tasks: stage.tasks.map(
            (t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          )
        };
      })
    );
    onTriggerToast("Milestone task state updated! \u2728");
  };
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onTriggerToast(
      !isBookmarked ? "Full Stack Web Developer roadmap saved to your profile! \u{1F4CC}" : "Removed from saved roadmaps"
    );
  };
  const handleDownloadPdf = () => {
    onTriggerToast("Generating personalized syllabus PDF... \u{1F4C4}");
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Full Stack Web Developer Roadmap - Campus Web House",
        url: window.location.href
      }).catch(() => {
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      onTriggerToast("Roadmap link copied to clipboard! \u{1F4CB}");
    }
  };
  const handleLaunchSandbox = () => {
    setIsSandboxRunning(true);
    onTriggerToast("Launching Interactive Python/Django Sandbox Terminal... \u26A1");
    setTimeout(() => {
      setIsSandboxRunning(false);
      onTriggerToast("Sandbox environment ready at port :8000! \u{1F680}");
    }, 1500);
  };
  return <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      {
    /* Top Career Pathway Banner Card */
  }
      <section className="pt-2 pb-4">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-5 sm:p-6 shadow-xs border border-surface-container">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-3">
            {
    /* Badge row */
  }
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  High Fit for Tech Jobs
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs">
                  B.Tech / BCA / MCA
                </span>
              </div>
              <button
    aria-label="Bookmark Pathway"
    onClick={handleBookmark}
    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${isBookmarked ? "bg-primary-fixed text-primary" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"}`}
  >
                <span className="material-symbols-outlined text-[19px]">
                  {isBookmarked ? "bookmark" : "bookmark_border"}
                </span>
              </button>
            </div>

            {
    /* Title & Description */
  }
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span className="text-xs uppercase font-bold tracking-wider">Engineering Track</span>
              </div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-on-surface tracking-tight mt-0.5">
                Full Stack Web Developer
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                Curated curriculum aligned with product startups and Tier-1 GCC hiring criteria across
                Bangalore, Pune, and NCR.
              </p>
            </div>

            {
    /* Metrics Bento Strip */
  }
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">payments</span>
                  Avg. CTC
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-on-surface mt-0.5">
                  ₹6.5 - 18 LPA
                </span>
                <span className="text-[10px] text-outline">Tier-1 & GCCs</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                  Duration
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-on-surface mt-0.5">
                  6 - 9 Mos
                </span>
                <span className="text-[10px] text-outline">~12 hrs/wk</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">trending_up</span>
                  Demand
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-primary mt-0.5">
                  18,400+
                </span>
                <span className="text-[10px] text-outline truncate">Active Roles</span>
              </div>
            </div>

            {
    /* Live Hiring Pulse banner */
  }
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary-fixed/50 text-on-secondary-fixed-variant border border-secondary-fixed">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              <span className="text-xs leading-tight flex-1">
                <strong>Campus Hiring Peak:</strong> 42 companies interviewing for Junior Full-Stack roles this month.
              </span>
            </div>
          </div>
        </div>
      </section>

      {
    /* Segmented Tabs Navigation */
  }
      <section className="pb-3">
        <div className="flex items-center p-1 rounded-2xl bg-surface-container-low border border-surface-container gap-1 overflow-x-auto">
          {[
    { id: "roadmap", label: "Roadmap" },
    { id: "skills", label: "Skills" },
    { id: "certs", label: "Certifications" },
    { id: "market", label: "Job Market" }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => {
      setActiveTab(tab.id);
      onTriggerToast(`Switched to ${tab.label} tab`);
    }}
    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-surface-container-lowest text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface"}`}
  >
              {tab.label}
            </button>)}
        </div>
      </section>

      {
    /* Tab: Skills view */
  }
      {activeTab === "skills" && <section className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container my-2 flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-on-surface">Target Skill Competencies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
    { skill: "React 18 & Next.js", level: "Advanced", cat: "Frontend" },
    { skill: "Python / Django REST", level: "Advanced", cat: "Backend" },
    { skill: "PostgreSQL 3NF", level: "Intermediate", cat: "Database" },
    { skill: "Redis Caching & TTL", level: "Intermediate", cat: "In-Memory" },
    { skill: "Docker Containers", level: "Working", cat: "DevOps" },
    { skill: "SOLID & Clean LLD", level: "Essential", cat: "Architecture" }
  ].map((s) => <div key={s.skill} className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col">
                <span className="text-[10px] text-outline uppercase font-semibold">{s.cat}</span>
                <span className="font-semibold text-xs text-on-surface mt-0.5">{s.skill}</span>
                <span className="font-mono text-[10px] text-primary font-bold mt-1">{s.level}</span>
              </div>)}
          </div>
        </section>}

      {
    /* Tab: Certifications view */
  }
      {activeTab === "certs" && <section className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container my-2 flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-on-surface">Recommended Student Certifications</h3>
          <div className="flex flex-col gap-2.5">
            {[
    { title: "AWS Certified Cloud Practitioner", cost: "\u20B98,500 (50% Student Discount)", val: "Recognized in 90% MNC drives" },
    { title: "PostgreSQL Certified Associate", cost: "Free via Campus Web House voucher", val: "Direct proof of SQL competence" }
  ].map((c) => <div key={c.title} className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-on-surface">{c.title}</h4>
                  <span className="text-[11px] text-on-surface-variant block">{c.val}</span>
                  <span className="font-mono text-[10px] text-primary">{c.cost}</span>
                </div>
                <button
    onClick={() => onTriggerToast("Voucher details sent to your registered email! \u{1F393}")}
    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shrink-0"
  >
                  Claim Voucher
                </button>
              </div>)}
          </div>
        </section>}

      {
    /* Tab: Job Market view */
  }
      {activeTab === "market" && <section className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container my-2 flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-on-surface">Tier-1 & Startup Hiring Velocity</h3>
          <p className="text-xs text-on-surface-variant">
            Current live open roles requiring MERN + Django stack across Bangalore, Pune, Hyderabad, and Gurgaon.
          </p>
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
            <span className="font-mono text-xl font-bold text-primary">18,420 Active Roles</span>
            <span className="text-xs text-on-surface-variant block mt-0.5">
              Top locations: Bangalore (45%), NCR (28%), Pune (16%), Remote (11%)
            </span>
          </div>
        </section>}

      {
    /* Progress Summary Module */
  }
      <section className="mt-2">
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">military_tech</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-sm text-on-surface leading-tight">
                  Your Cohort Progress
                </h2>
                <p className="text-xs text-on-surface-variant">Stage 3 of 6 • Placement Ready at Stage 5</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-base sm:text-lg text-primary">50%</span>
              <span className="block text-[10px] text-outline uppercase font-semibold">Overall</span>
            </div>
          </div>

          {
    /* Segmented Bar */
  }
          <div className="w-full flex gap-1.5 h-2.5 mt-1">
            <div className="flex-1 rounded-full bg-primary" />
            <div className="flex-1 rounded-full bg-primary" />
            <div className="flex-1 rounded-full bg-primary-fixed-dim relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-3/4 bg-primary rounded-full" />
            </div>
            <div className="flex-1 rounded-full bg-surface-container-high" />
            <div className="flex-1 rounded-full bg-surface-container-high" />
            <div className="flex-1 rounded-full bg-surface-container-high" />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Current Focus: <strong className="text-on-surface">Backend APIs & ORM</strong>
            </span>
            <span className="font-mono text-outline">Stage 3</span>
          </div>
        </div>
      </section>

      {
    /* Milestone Journey */
  }
      <section className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-bold text-base text-on-surface">Milestone Journey</h2>
          <span className="text-xs text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            Updated Sep 2024
          </span>
        </div>

        {
    /* Timeline wrapper */
  }
        <div className="relative flex flex-col gap-4 pl-3 sm:pl-4">
          <div className="absolute left-6 top-4 bottom-8 w-0.5 bg-surface-container-high -translate-x-1/2" />

          {
    /* STAGE 1 */
  }
          <div className="relative flex items-start gap-3 sm:gap-4">
            <div className="relative z-10 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0 mt-3">
              <span className="material-symbols-outlined text-[14px] font-bold">check</span>
            </div>
            <div className="flex-1 rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-xs border border-surface-container flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Stage 01
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Core Fundamentals & Programming
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold shrink-0">
                  Completed
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Python 3, Modern ECMAScript (ES6+), Clean OOP architecture, Time/Space complexities, and Essential DSA patterns.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  Python
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  JavaScript
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  DSA Basics
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-surface-container">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  14/14 Modules Mastered
                </span>
                <button
    onClick={() => onTriggerToast("Reviewing Stage 1 Notes & DSA Cheat Sheets")}
    className="hover:text-primary transition-colors flex items-center gap-0.5 font-semibold"
  >
                  Review Notes
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {
    /* STAGE 2 */
  }
          <div className="relative flex items-start gap-3 sm:gap-4">
            <div className="relative z-10 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0 mt-3">
              <span className="material-symbols-outlined text-[14px] font-bold">check</span>
            </div>
            <div className="flex-1 rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-xs border border-surface-container flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Stage 02
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Modern Frontend Architecture
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold shrink-0">
                  Completed
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Component lifecycles, Custom Hooks, Redux Toolkit, Tailwind CSS token systems, and responsive layout foundations.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  React 18
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  Tailwind
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  Redux Toolkit
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-surface-container">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Project: E-Commerce UI Verified
                </span>
                <button
    onClick={() => onTriggerToast("Opening E-Commerce Project Repository... \u{1F4BB}")}
    className="hover:text-primary transition-colors flex items-center gap-0.5 font-semibold"
  >
                  Codebase
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {
    /* STAGE 3 (HERO ACTIVE MILESTONE) */
  }
          <div className="relative flex items-start gap-3 sm:gap-4">
            <div className="relative z-10 w-6 h-6 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-md shrink-0 mt-3 ring-4 ring-primary/20">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="flex-1 rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-md border-2 border-primary/30 flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-primary uppercase font-bold tracking-wider">
                      Stage 03 • Current Focus
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-on-surface mt-0.5">
                    Backend Engineering & APIs
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold shrink-0">
                  3/4 Done
                </span>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Designing resilient relational models, indexing queries, JWT claims validation, and stateless API contracts.
              </p>

              {
    /* Interactive Checklist */
  }
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-surface-container">
                <span className="text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>Required Milestone Tasks</span>
                  <span className="font-mono text-primary">75%</span>
                </span>

                {milestones[2]?.tasks?.map((task) => <label
    key={task.id}
    className={`flex items-start gap-2.5 cursor-pointer select-none p-1 rounded-lg transition-colors ${task.isDueSoon ? "bg-surface-container-lowest shadow-xs" : ""} ${task.isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-container"}`}
  >
                    <input
    type="checkbox"
    checked={task.isCompleted}
    disabled={task.isDisabled}
    onChange={() => !task.isDisabled && toggleTask(3, task.id)}
    className="mt-0.5 w-4 h-4 rounded text-primary accent-primary cursor-pointer shrink-0"
  />
                    <div className="flex flex-col min-w-0">
                      <span
    className={`text-xs ${task.isCompleted ? "line-through opacity-75 text-on-surface" : "font-medium text-on-surface"}`}
  >
                        {task.label}
                      </span>
                      <span className="text-[10px] text-outline flex items-center gap-1">
                        {task.sublabel}
                      </span>
                    </div>
                  </label>)}
              </div>

              {
    /* Prep Materials */
  }
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-xs font-bold text-on-surface-variant">Recommended Free Prep Material</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
    onClick={() => onTriggerToast("Opening DRF Documentation... \u{1F4D6}")}
    className="p-2.5 rounded-xl bg-surface-container flex items-center gap-2 text-left hover:bg-surface-container-high transition-colors"
  >
                    <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-on-surface truncate">DRF Official Guide</span>
                      <span className="text-[10px] text-outline truncate">Interactive Docs</span>
                    </div>
                  </button>

                  <button
    onClick={() => onTriggerToast("Opening API Mastery Video Series... \u{1F3AC}")}
    className="p-2.5 rounded-xl bg-surface-container flex items-center gap-2 text-left hover:bg-surface-container-high transition-colors"
  >
                    <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center text-error shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-on-surface truncate">API Mastery Series</span>
                      <span className="text-[10px] text-outline truncate">6 Videos • Hindi/Eng</span>
                    </div>
                  </button>
                </div>
              </div>

              {
    /* Resume Sandbox Action */
  }
              <button
    onClick={handleLaunchSandbox}
    disabled={isSandboxRunning}
    className="mt-1 w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-display text-xs sm:text-sm font-bold shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2"
  >
                <span className="material-symbols-outlined text-[18px]">
                  {isSandboxRunning ? "sync" : "code"}
                </span>
                <span>{isSandboxRunning ? "Launching Sandbox..." : "Resume Sandbox Workspace"}</span>
              </button>
            </div>
          </div>

          {
    /* STAGE 4 (LOCKED) */
  }
          <div className="relative flex items-start gap-3 sm:gap-4 opacity-75">
            <div className="relative z-10 w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 mt-3">
              <span className="material-symbols-outlined text-[14px]">lock</span>
            </div>
            <div className="flex-1 rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-xs border border-surface-container flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Stage 04
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Cloud Deployment & DevOps
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-semibold shrink-0">
                  Up Next
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Dockerizing full-stack environments, setting GitHub Actions CI/CD pipelines, and AWS EC2 with S3 static buckets.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  Docker
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  AWS EC2/S3
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
                  Nginx
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-outline text-xs pt-1 border-t border-surface-container">
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                Unlocks upon completing Stage 3 API assignment
              </div>
            </div>
          </div>

          {
    /* STAGE 5 (PORTFOLIO) */
  }
          <div className="relative flex items-start gap-3 sm:gap-4 opacity-70">
            <div className="relative z-10 w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 mt-3">
              <span className="material-symbols-outlined text-[14px]">lock</span>
            </div>
            <div className="flex-1 rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-xs border border-surface-container flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Stage 05
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Capstone Production Project
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-semibold shrink-0">
                  Portfolio
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Live deployed SaaS with payments (Razorpay integration), automated tests, and 1-on-1 code review by industry lead.
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-surface-container">
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-semibold">
                  Peer Code Review Included
                </span>
              </div>
            </div>
          </div>

          {
    /* STAGE 6 (PLACEMENT SPRINT) */
  }
          <div className="relative flex items-start gap-3 sm:gap-4 opacity-70">
            <div className="relative z-10 w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 mt-3">
              <span className="material-symbols-outlined text-[14px]">stars</span>
            </div>
            <div className="flex-1 rounded-2xl bg-surface-container-lowest p-4 sm:p-5 shadow-xs border border-surface-container flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    Stage 06
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Interview Prep & Mock Drives
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold shrink-0">
                  Placement Sprint
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                System design basics, behavioral STAR format responses, live whiteboard coding, and direct resume dispatch to Campus Web House partner drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
    /* Top Recruiting Networks */
  }
      <section className="mt-6">
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-xs border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-base text-on-surface">Top Recruiting Networks</h2>
              <p className="text-xs text-on-surface-variant">Where our alumni have joined after this roadmap</p>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">corporate_fare</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
    { name: "Swiggy", ctc: "12-16 LPA", color: "bg-primary" },
    { name: "Razorpay", ctc: "15-18 LPA", color: "bg-secondary" },
    { name: "TCS Digital", ctc: "7.5-9 LPA", color: "bg-tertiary" },
    { name: "Infosys DNB", ctc: "6.5-8 LPA", color: "bg-outline" }
  ].map((company) => <div
    key={company.name}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-xs"
  >
                <span className={`w-2 h-2 rounded-full ${company.color}`} />
                <span className="font-semibold text-on-surface">{company.name}</span>
                <span className="font-mono text-[10px] text-outline">{company.ctc}</span>
              </div>)}
          </div>
        </div>
      </section>

      {
    /* Actions: Download PDF & Share */
  }
      <section className="mt-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2.5">
          <button
    onClick={handleDownloadPdf}
    className="h-11 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold shadow-xs border border-surface-container flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
  >
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            Download PDF
          </button>
          <button
    onClick={handleShare}
    className="h-11 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold shadow-xs border border-surface-container flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
  >
            <span className="material-symbols-outlined text-[18px] text-secondary">share</span>
            Share Track
          </button>
        </div>

        {
    /* Sticky Alumni Assistance Trigger Card */
  }
        <div className="rounded-2xl bg-surface-container-high p-3.5 shadow-xs border border-surface-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-high" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-semibold text-xs sm:text-sm text-on-surface truncate">
                Stuck on Stage 3 APIs?
              </span>
              <span className="text-xs text-on-surface-variant truncate">
                Siddharth (SDE-2 at PhonePe) is online
              </span>
            </div>
          </div>
          <button
    onClick={onOpenMentorDrawer}
    className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-display text-xs font-bold shadow-xs hover:bg-primary-container whitespace-nowrap active:scale-95 transition-all flex items-center gap-1"
  >
            <span>Ask Mentor</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>;
};
export {
  CareersScreen
};
