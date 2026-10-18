import { useState } from "react";
const HomeScreen = ({
  onNavigate,
  onOpenAssessment,
  onSelectCollege,
  colleges
}) => {
  const [searchTab, setSearchTab] = useState("colleges");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const topThreeColleges = colleges.filter(
    (c) => ["iit-bombay", "bits-pilani", "nit-trichy"].includes(c.id)
  );
  const faqs = [
    {
      q: "Is Campus Web House completely free for students?",
      a: "Yes! All college admission cutoffs, basic career assessment metrics, and core semester tech roadmaps are 100% free for all enrolled collegiate students."
    },
    {
      q: "How are the career roadmaps verified?",
      a: "Every pathway is authored and quarterly updated by senior engineering alumni currently working at top MNCs, unicorns, and Tier-1 IT services, matching actual live hiring assessments."
    },
    {
      q: "Does this cater to BCA, B.Sc, and non-B.Tech degrees?",
      a: "Absolutely. We feature dedicated non-engineering pathways, including NIMCET preparation for MCA, direct lateral entry routes, data analytics, and government competitive exam trajectories."
    },
    {
      q: "Can I track college application deadlines?",
      a: "Yes, you can bookmark colleges in the Admissions section to receive alerts for application windows, counseling rounds, and document verification dates."
    }
  ];
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTab === "colleges") {
      onNavigate("colleges-admissions");
    } else {
      onNavigate("careers-roadmap");
    }
  };
  return <div className="flex flex-col w-full pb-20">
      {
    /* Dynamic Hero Stage */
  }
      <section className="relative px-4 sm:px-6 pt-3 pb-8 overflow-hidden bg-gradient-to-b from-surface-container-low to-surface">
        {
    /* Ambient micro-glow */
  }
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 -left-12 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-start gap-3">
          {
    /* Tag badge */
  }
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed shadow-xs">
            <span
    className="material-symbols-outlined text-[16px] text-primary"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
              verified
            </span>
            <span className="font-display text-[11px] uppercase tracking-wider font-bold">
              Hello, Students! Welcome to Campus Web House
            </span>
          </div>

          {
    /* Core Value Proposition Heading */
  }
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight mt-1 leading-tight sm:leading-snug">
            Empowering Indian Students from{" "}
            <span className="text-primary font-extrabold">Classroom</span> to Dream Career
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
            Your Campus. Your Career. Your Future. Bridging degree curricula with Tier-1 tech placements,
            product startups, and top entrance admissions.
          </p>

          {
    /* Primary Action Buttons */
  }
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2.5 mt-2">
            <button
    onClick={onOpenAssessment}
    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-on-primary font-display text-sm font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all"
  >
              <span>Start Free Career Assessment</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
    onClick={() => onNavigate("careers-roadmap")}
    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-surface-container-lowest text-on-surface font-display text-sm font-semibold shadow-xs hover:bg-surface-container active:scale-[0.98] transition-all border border-surface-container"
  >
              <span className="material-symbols-outlined text-[18px] text-primary">alt_route</span>
              <span>Explore 250+ Roadmaps</span>
            </button>
          </div>

          {
    /* Interactive Dual Mode Search Box */
  }
          <div className="w-full mt-4 bg-surface-container-lowest rounded-2xl p-3 shadow-md flex flex-col gap-2.5 border border-surface-container">
            {
    /* Tab selector */
  }
            <div className="flex p-1 bg-surface-container-low rounded-xl">
              <button
    type="button"
    onClick={() => setSearchTab("colleges")}
    className={`flex-1 py-1.5 px-2 rounded-lg text-xs text-center transition-all flex items-center justify-center gap-1 font-semibold ${searchTab === "colleges" ? "bg-surface-container-lowest text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface"}`}
  >
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>1,200+ Colleges</span>
              </button>
              <button
    type="button"
    onClick={() => setSearchTab("careers")}
    className={`flex-1 py-1.5 px-2 rounded-lg text-xs text-center transition-all flex items-center justify-center gap-1 font-semibold ${searchTab === "careers" ? "bg-surface-container-lowest text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface"}`}
  >
                <span className="material-symbols-outlined text-[16px]">timeline</span>
                <span>250+ Careers</span>
              </button>
            </div>

            {
    /* Input Bar */
  }
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder={searchTab === "colleges" ? "Search IIT, NIT, BCA fees, or cutoffs..." : "Search SDE-1, Cloud, Data Analyst tracks..."}
    className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low rounded-xl text-on-surface text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary/30"
  />
              <button
    type="submit"
    aria-label="Filter"
    className="absolute right-2.5 p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
  >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </form>

            {
    /* Popular Queries Pill Rail */
  }
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-[10px] text-on-surface-variant whitespace-nowrap uppercase tracking-wider font-semibold">
                Trending:
              </span>
              <button
    onClick={() => {
      setSearchTab("careers");
      onNavigate("careers-roadmap");
    }}
    className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] whitespace-nowrap hover:bg-primary-fixed transition-colors"
  >
                B.Tech CS vs AI
              </button>
              <button
    onClick={() => {
      setSearchTab("colleges");
      onNavigate("colleges-admissions");
    }}
    className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] whitespace-nowrap hover:bg-primary-fixed transition-colors"
  >
                IIT Madras NIRF #1
              </button>
              <button
    onClick={() => {
      setSearchTab("careers");
      onNavigate("student-dashboard");
    }}
    className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] whitespace-nowrap hover:bg-primary-fixed transition-colors"
  >
                GATE 2026 CS
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-8">
        {
    /* Platform Impact Metrics Strip */
  }
        <section className="py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-on-surface block leading-tight">
                  45,000+
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Students Mentored</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-on-surface block leading-tight">
                  1,200+
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Verified Campuses</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-2">
                <span className="material-symbols-outlined text-[20px]">route</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-on-surface block leading-tight">
                  250+
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Live Career Maps</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant mb-2">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-on-surface block leading-tight">
                  ₹12.4 LPA
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Avg Target Package</span>
              </div>
            </div>
          </div>
        </section>

        {
    /* Strategic Workflow: How Campus Web House Works */
  }
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-primary text-xs uppercase tracking-wider font-bold">
              Strategic Workflow
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-on-surface">
              How Campus Web House Works
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              A structured, telemetry-driven blueprint crafted for Indian degree candidates.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            {
    /* Step 1 */
  }
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-display font-bold shrink-0">
                01
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Assess & Discover
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold">
                    10 Mins
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Evaluate current academic standing (CGPA, degree stream, coding readiness) and uncover high-fit pathways.
                </p>
              </div>
            </div>

            {
    /* Step 2 */
  }
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-display font-bold shrink-0">
                02
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    Interactive Roadmapping
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-bold">
                    Live Milestones
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Follow semester-by-semester tech stacks, DSA checkpoints, projects, and interview preparation guides.
                </p>
              </div>
            </div>

            {
    /* Step 3 */
  }
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary flex items-center justify-center font-display font-bold shrink-0">
                03
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                    College & Placement Gate
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-bold">
                    NIRF / On-Campus
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Unlock vetted admission cutoff trackers, alumni salary audits, and tier-wise referral opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {
    /* Roadmap Sneak Peek Module */
  }
        <section>
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-lowest shadow-sm border border-surface-container">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-primary-fixed text-primary material-symbols-outlined text-[20px]">
                  terminal
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-on-surface leading-tight">
                    B.Tech to SDE-1 Roadmap
                  </h3>
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    Target: ₹16 - ₹24 LPA • Product MNCs
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[11px] font-bold">
                Live Preview
              </span>
            </div>

            {
    /* Stepper Preview */
  }
            <div className="space-y-3.5 pl-1 my-3">
              <div className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[13px] shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div className="w-0.5 h-10 bg-primary/30 mt-1" />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-on-surface">
                      Phase 1: CS Fundamentals & C++
                    </span>
                    <span className="font-mono text-[10px] text-primary font-bold">100% Done</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Data Structures, Time Complexity, Memory layouts</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-primary text-primary flex items-center justify-center shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div className="w-0.5 h-10 bg-outline-variant/40 mt-1" />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-on-surface">
                      Phase 2: Full-Stack & System Design
                    </span>
                    <span className="font-mono text-[10px] text-secondary font-bold">Semester 5 (Active)</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">REST APIs, PostgreSQL, Docker microservices</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs sm:text-sm text-outline">
                      Phase 3: Mock Drives & ATS Resumes
                    </span>
                    <span className="font-mono text-[10px] text-outline">Semester 7</span>
                  </div>
                  <p className="text-xs text-outline">LeetCode Hard patterns, Company-specific interview rounds</p>
                </div>
              </div>
            </div>

            <button
    onClick={() => onNavigate("careers-roadmap")}
    className="w-full mt-2 py-2.5 px-3 bg-surface-container-lowest hover:bg-surface-container text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors border border-surface-container"
  >
              <span>Customize Roadmap for Your College</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {
    /* Featured High-Growth Career Pathways */
  }
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-on-surface">Featured Pathways</h2>
              <p className="text-xs text-on-surface-variant">Top-hiring trajectories for 2025–2026 batches</p>
            </div>
            <button
    onClick={() => onNavigate("careers-roadmap")}
    className="text-xs text-primary font-bold flex items-center hover:underline"
  >
              <span>View all</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
    {
      title: "Full Stack Developer",
      sub: "MERN / Next.js / Java Spring",
      tag: "Tier-1 & Startups",
      ctc: "\u20B98.5 - \u20B918.0 LPA",
      icon: "code",
      bg: "bg-primary-fixed text-primary",
      modules: "View 4 Modules"
    },
    {
      title: "Data Analyst & BI Engineer",
      sub: "SQL / Power BI / Python / Tableau",
      tag: "High Demand",
      ctc: "\u20B96.5 - \u20B914.0 LPA",
      icon: "analytics",
      bg: "bg-secondary-fixed text-secondary",
      modules: "View 3 Modules"
    },
    {
      title: "Cloud Solutions Architect",
      sub: "AWS / Kubernetes / Terraform",
      tag: "Global Remote",
      ctc: "\u20B912.0 - \u20B926.0 LPA",
      icon: "cloud_circle",
      bg: "bg-tertiary-fixed text-tertiary",
      modules: "View 5 Modules"
    },
    {
      title: "Cybersecurity Analyst",
      sub: "SOC / Network Defense / CompTIA",
      tag: "Govt & BFSI",
      ctc: "\u20B97.0 - \u20B916.5 LPA",
      icon: "shield",
      bg: "bg-surface-container-high text-on-surface",
      modules: "View 4 Modules"
    }
  ].map((track) => <div
    key={track.title}
    onClick={() => onNavigate("careers-roadmap")}
    className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between gap-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
  >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${track.bg}`}>
                      <span className="material-symbols-outlined text-[22px]">{track.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                        {track.title}
                      </h3>
                      <span className="text-[11px] text-on-surface-variant block">{track.sub}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-mono text-[10px] font-semibold">
                    {track.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-on-surface-variant border-t border-surface-container">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
                    <span className="text-xs font-semibold">{track.ctc}</span>
                  </div>
                  <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                    {track.modules} <span className="material-symbols-outlined text-[16px]">navigate_next</span>
                  </span>
                </div>
              </div>)}
          </div>
        </section>

        {
    /* Top Verified Campuses */
  }
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-on-surface">Top Verified Campuses</h2>
              <p className="text-xs text-on-surface-variant">Admissions, NIRF ranks & verified placement data</p>
            </div>
            <button
    onClick={() => onNavigate("colleges-admissions")}
    className="text-xs text-primary font-bold flex items-center hover:underline"
  >
              <span>Explore</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topThreeColleges.map((col) => <div
    key={col.id}
    className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between gap-3"
  >
                <div className="flex items-center gap-3">
                  <img
    src={col.image}
    alt={col.altText}
    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-surface-container"
  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-sm text-on-surface truncate">
                        {col.name}
                      </h3>
                      <span className="px-1.5 py-0.5 bg-primary-fixed text-primary text-[10px] rounded font-bold shrink-0">
                        {col.nirfLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{col.subLocation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-2 bg-surface-container-low rounded-xl text-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Avg CTC</span>
                    <span className="font-mono text-xs font-bold text-on-surface">{col.avgCtc}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Tuition/Yr</span>
                    <span className="font-mono text-xs font-bold text-on-surface">{col.annualFee}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Placement</span>
                    <span className="font-mono text-xs font-bold text-secondary">{col.placementRate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Entrance: {col.entranceExam}</span>
                  <button
    onClick={() => onSelectCollege(col)}
    className="px-3 py-1.5 bg-surface-container text-on-surface text-xs rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-colors"
  >
                    View Cutoffs
                  </button>
                </div>
              </div>)}
          </div>
        </section>

        {
    /* Proven Outcomes: Student Testimonials */
  }
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Student Journeys
            </span>
            <h2 className="font-display font-bold text-xl text-on-surface">Proven Outcomes</h2>
            <p className="text-xs text-on-surface-variant">
              From regional campuses to premier tech enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {
    /* Testimonial 1 */
  }
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhFgH35htMcKE6CvRu3Dh34zKx5pCOf9GOJgfUUeCZaOy1-NAKVRpbWoF6rbBs1xJi4toYN3ff75Ul5Hvv0t5z1sXgNj7iRRHlbGWWrJJyynNJM50Ih3ncpdhDOxNpo48T8aK_t8dze0M5nCWvH3JUEsA96m_JHHcz6_einrWaYUUVP5r4kPkekBPzq74hK-i61iXf_gfzeS_OdMdSYnXWfIRcOLw45Rqcb8u-qRZ3q1KtkYWSq9ci"
    alt="Ananya Roy portrait"
    className="w-10 h-10 rounded-full object-cover"
  />
                  <div>
                    <span className="font-display font-bold text-xs sm:text-sm text-on-surface block leading-tight">
                      Ananya Roy
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      BCA (Tier-3) → SDE @ Microsoft
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[11px] font-bold text-primary">
                  ₹24.5 LPA
                </span>
              </div>
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "Being in a BCA program, colleges said I could only apply for support roles. Campus Web House provided the exact MCA bridge roadmap and open-source milestones that got me shortlisted directly."
              </p>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] pt-1 border-t border-surface-container">
                <span
    className="material-symbols-outlined text-[14px] text-primary"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
                  verified
                </span>
                <span>Verified Student • Batch of 2024</span>
              </div>
            </div>

            {
    /* Testimonial 2 */
  }
            <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuChaJrERLwvSn6QFZsuK2FLi5lKH8aADFLLEjLgXmz3RB2fWdtYTIeFB-5tgbFc4JSgIcTxLixRKp-syAIWU12GJqKY_HXxwnuBid1hQQk670gAtK6dJJug2_jFTCYXYtBprt1Bx3cxu-yJuv74s0-9Iubl0ZNRILoSG3fCB2tdqFMCyJcWxiA-RLkul4DhCbKv2cu9LGA_HnpOJNW9cTmU4Dr0a89qcHp-JHVeLds0Qe0Utwc1Rmvj"
    alt="Rohan Verma portrait"
    className="w-10 h-10 rounded-full object-cover"
  />
                  <div>
                    <span className="font-display font-bold text-xs sm:text-sm text-on-surface block leading-tight">
                      Rohan Verma
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      B.Tech ECE → Cloud Engg @ Zomato
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[11px] font-bold text-primary">
                  ₹16.0 LPA
                </span>
              </div>
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "The interactive roadmap stopped me from drowning in random YouTube tutorials. I cleared my AWS certification and Docker system design assignments in semester 6 itself."
              </p>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] pt-1 border-t border-surface-container">
                <span
    className="material-symbols-outlined text-[14px] text-primary"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
                  verified
                </span>
                <span>Verified Student • Batch of 2024</span>
              </div>
            </div>
          </div>
        </section>

        {
    /* FAQs Accordion */
  }
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Clarifications
            </span>
            <h2 className="font-display font-bold text-xl text-on-surface">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {faqs.map((faq, idx) => {
    const isOpen = openFaq === idx;
    return <div
      key={idx}
      className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container overflow-hidden"
    >
                  <button
      type="button"
      onClick={() => setOpenFaq(isOpen ? null : idx)}
      className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-surface-container-low transition-colors"
    >
                    <span className="font-display font-bold text-xs sm:text-sm text-on-surface">
                      {faq.q}
                    </span>
                    <span
      className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && <div className="px-3.5 pb-3.5 pt-0 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-surface-container pt-2">
                      {faq.a}
                    </div>}
                </div>;
  })}
          </div>
        </section>

        {
    /* Pre-Footer Conversion Card */
  }
        <section className="py-2">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg flex flex-col items-center text-center gap-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">rocket_launch</span>
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="font-display font-bold text-lg text-on-primary">
                Ready to Map Your Future?
              </h3>
              <p className="text-xs text-on-primary-container">
                Join 45,000+ collegiate students leveling up their campus placement journey today.
              </p>
            </div>
            <button
    onClick={() => onNavigate("account")}
    className="w-full sm:w-auto px-8 py-3 bg-surface-container-lowest text-primary font-display text-xs sm:text-sm font-bold rounded-xl shadow-md active:scale-95 transition-transform"
  >
              Create Your Free Account
            </button>
          </div>
        </section>

        {
    /* Educational Trust Badges & Institutional Footer */
  }
        <footer className="pt-2 pb-8 flex flex-col gap-4 text-center border-t border-surface-container">
          {
    /*<div className="flex flex-wrap items-center justify-center gap-4 text-on-surface-variant">
      <div className="flex items-center gap-1 text-[11px] font-semibold">
        <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
        <span>Verified NIRF Data</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-semibold">
        <span className="material-symbols-outlined text-[16px] text-primary">encrypted</span>
        <span>SSL Secured</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-semibold">
        <span className="material-symbols-outlined text-[16px] text-primary">school</span>
        <span>UGC Aligned</span>
      </div>
    </div>*/
  }

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
            <button onClick={() => onNavigate("home-discover")} className="hover:text-primary">
              About Campus Web House
            </button>
            <button onClick={() => onNavigate("colleges-admissions")} className="hover:text-primary">
              College Directory
            </button>
            <button onClick={() => onNavigate("careers-roadmap")} className="hover:text-primary">
              Placement Audits
            </button>
            <button onClick={() => onNavigate("community-feed")} className="hover:text-primary">
              Student Code of Conduct
            </button>
          </div>

          <p className="text-[10px] text-outline">
            © 2026 Campus Web House Inc. Designed for the Indian Collegiate Ecosystem. All rights reserved.
          </p>
        </footer>
      </div>
    </div>;
};
export {
  HomeScreen
};
