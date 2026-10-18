import React, { useState } from "react";
import { SPOTLIGHT_MENTORS } from "../data/mockData";
const CommunityScreen = ({
  discussions,
  onOpenDiscussion,
  onOpenAskModal,
  onOpenMentorDrawer,
  onToggleUpvoteDiscussion,
  onToggleSaveDiscussion,
  onTriggerToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Discussions");
  const [sortOption, setSortOption] = useState("trending");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const tags = [
    { label: "All Discussions", count: void 0 },
    { label: "Admissions 2025", count: "420" },
    { label: "Career & Placements", count: "1.2k" },
    { label: "System Design & Tech", count: "850" },
    { label: "Tier-1 vs Tier-3 Prep", count: "310" },
    { label: "Study Resources & GATE", count: "180" }
  ];
  const filteredDiscussions = discussions.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q) || d.author.name.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (selectedTag === "Admissions 2025") {
      return d.tags.some((t) => t.includes("Admissions") || t.includes("BITSvsIIT"));
    }
    if (selectedTag === "System Design & Tech") {
      return d.tags.some((t) => t.includes("SystemDesign") || t.includes("FullStack"));
    }
    if (selectedTag === "Tier-1 vs Tier-3 Prep") {
      return d.tags.some((t) => t.includes("Tier3ToTier1"));
    }
    return true;
  });
  return <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      {
    /* Top Header */
  }
      <section className="pt-2 pb-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Live Student Exchange
            </span>
          </div>
          <span className="font-mono text-xs text-primary font-bold bg-primary-fixed/60 px-2.5 py-0.5 rounded-full">
            12.4k+ active threads
          </span>
        </div>
        <h1 className="font-display font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight">
          Student & Alumni Community
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Peer discussions, placement reviews & verified MNC mentor solutions across Indian engineering colleges.
        </p>
      </section>

      {
    /* Search & Actions Toolbar */
  }
      <section className="pb-3 flex flex-col gap-2.5">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
    type="search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search questions, tags, colleges, roles..."
    className="w-full h-11 pl-10 pr-20 bg-surface-container-lowest text-on-surface rounded-2xl text-xs sm:text-sm placeholder:text-outline border border-surface-container focus:outline-none focus:border-primary/40 transition-all"
  />
          <div className="absolute right-2 flex items-center gap-1">
            <button
    type="button"
    onClick={() => onTriggerToast("Voice discussion query active")}
    className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
  >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
            <button
    type="button"
    onClick={() => onTriggerToast("Filter feed options")}
    className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-container-low text-primary hover:bg-surface-container"
  >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {
    /* Quick CTA Bar */
  }
        <div className="flex items-center gap-2">
          <button
    onClick={onOpenAskModal}
    className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-display text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all"
  >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Ask a Question</span>
          </button>
          <button
    onClick={() => setShowLeaderboard(true)}
    className="h-11 px-4 bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-semibold rounded-xl shadow-xs border border-surface-container flex items-center gap-1.5 hover:bg-surface-container-low transition-colors"
  >
            <span className="material-symbols-outlined text-[18px] text-tertiary">military_tech</span>
            <span>Leaderboard</span>
          </button>
        </div>
      </section>

      {
    /* Horizontal Filter Pills */
  }
      <section className="pb-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {tags.map((t) => <button
    key={t.label}
    onClick={() => setSelectedTag(t.label)}
    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedTag === t.label ? "bg-primary text-on-primary shadow-xs" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container"}`}
  >
              <span>{t.label}</span>
              {t.count && <span
    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedTag === t.label ? "bg-white/20 text-white" : "bg-surface-container text-on-surface"}`}
  >
                  {t.count}
                </span>}
            </button>)}
        </div>
      </section>

      {
    /* Sorting Segmented Tab */
  }
      <section className="pb-4">
        <div className="flex items-center justify-between gap-1 p-1 bg-surface-container rounded-2xl border border-surface-container">
          {[
    { id: "trending", label: "Trending", icon: "local_fire_department" },
    { id: "top", label: "Top Upvoted", icon: void 0 },
    { id: "unanswered", label: "Unanswered", icon: void 0 },
    { id: "alumni", label: "Alumni", icon: "verified" }
  ].map((s) => <button
    key={s.id}
    onClick={() => {
      setSortOption(s.id);
      onTriggerToast(`Feed sorted by ${s.label}`);
    }}
    className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-all ${sortOption === s.id ? "bg-surface-container-lowest text-primary shadow-xs font-bold" : "text-on-surface-variant hover:text-on-surface"}`}
  >
              {s.icon && <span
    className={`material-symbols-outlined text-[15px] ${s.id === "trending" ? "text-amber-500" : "text-primary"}`}
    style={s.id === "trending" ? { fontVariationSettings: "'FILL' 1" } : void 0}
  >
                  {s.icon}
                </span>}
              <span>{s.label}</span>
            </button>)}
        </div>
      </section>

      {
    /* Feed List */
  }
      <section className="flex flex-col gap-4">
        {filteredDiscussions.map((discussion, idx) => <React.Fragment key={discussion.id}>
            <article className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container p-4 sm:p-5 flex flex-col gap-3 transition-all hover:border-primary/40 hover:shadow-sm">
              {
    /* Badges / Pinned Indicator */
  }
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  {discussion.isPinned && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      <span
    className="material-symbols-outlined text-[13px]"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
                        push_pin
                      </span>
                      Pinned
                    </span>}
                  {discussion.tags.map((tag) => <span
    key={tag}
    className="bg-surface-container text-on-surface font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold"
  >
                      #{tag}
                    </span>)}
                </div>
                <button
    type="button"
    onClick={() => onTriggerToast("Thread options")}
    className="text-on-surface-variant hover:text-on-surface w-8 h-8 rounded-full flex items-center justify-center"
  >
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>

              {
    /* Author Row */
  }
              <div className="flex items-center gap-2.5">
                <img
    src={discussion.author.avatar}
    alt={discussion.author.name}
    className="w-9 h-9 rounded-full object-cover shrink-0"
  />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-display font-bold text-xs sm:text-sm text-on-surface truncate">
                      {discussion.author.name}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      • {discussion.author.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">Posted {discussion.timeAgo}</span>
                </div>
              </div>

              {
    /* Question Title & Body */
  }
              <div
    onClick={() => onOpenDiscussion(discussion.id)}
    className="flex flex-col gap-1.5 cursor-pointer group"
  >
                <h2 className="font-display font-bold text-sm sm:text-base text-on-surface leading-snug group-hover:text-primary transition-colors">
                  {discussion.title}
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                  {discussion.body}
                </p>
              </div>

              {
    /* Special Attachment: Verified Top Answer Quote */
  }
              {discussion.topAnswerPreview && <div
    onClick={() => onOpenDiscussion(discussion.id)}
    className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-surface-container cursor-pointer hover:border-primary/30 transition-colors"
  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
    src={discussion.topAnswerPreview.authorAvatar}
    alt={discussion.topAnswerPreview.authorName}
    className="w-7 h-7 rounded-full object-cover shrink-0"
  />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs text-on-surface truncate">
                            {discussion.topAnswerPreview.authorName}
                          </span>
                          <span
    className="material-symbols-outlined text-primary text-[15px]"
    style={{ fontVariationSettings: "'FILL' 1" }}
  >
                            verified
                          </span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant truncate">
                          {discussion.topAnswerPreview.authorRole}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      Top Solution
                    </span>
                  </div>
                  <p className="text-xs text-on-surface italic pl-1 leading-relaxed">
                    "{discussion.topAnswerPreview.quote}"
                  </p>
                </div>}

              {
    /* Special Attachment: Metrics Highlight (e.g. BITS vs NIT) */
  }
              {discussion.metricsHighlight && <div className="grid grid-cols-2 gap-2 bg-surface-container-low/70 rounded-xl p-3 border border-surface-container">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                      {discussion.metricsHighlight.leftLabel}
                    </span>
                    <span className="font-display font-bold text-sm text-primary">
                      {discussion.metricsHighlight.leftValue}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                      {discussion.metricsHighlight.rightLabel}
                    </span>
                    <span className="font-display font-bold text-sm text-secondary">
                      {discussion.metricsHighlight.rightValue}
                    </span>
                  </div>
                </div>}

              {
    /* Special Attachment: Live Project Link Preview */
  }
              {discussion.liveProjectAttachment && <div
    onClick={() => onTriggerToast("Opening portfolio project preview! \u{1F310}")}
    className="flex items-center gap-3 bg-surface-container-low rounded-xl p-2.5 hover:bg-surface-container transition-colors cursor-pointer border border-surface-container"
  >
                  <img
    src={discussion.liveProjectAttachment.thumbnail}
    alt="Portfolio Preview"
    className="w-12 h-12 rounded-lg object-cover shrink-0"
  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold text-xs text-on-surface truncate">
                      {discussion.liveProjectAttachment.url}
                    </span>
                    <span className="text-[10px] text-on-surface-variant truncate">
                      {discussion.liveProjectAttachment.techStack}
                    </span>
                    <span className="font-mono text-[10px] text-primary flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      Live Demo Attached
                    </span>
                  </div>
                </div>}

              {
    /* Action Footer */
  }
              <div className="flex items-center justify-between pt-1 border-t border-surface-container text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <button
    type="button"
    onClick={() => onToggleUpvoteDiscussion(discussion.id)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${discussion.hasUpvoted ? "bg-primary text-on-primary" : "bg-surface-container-low text-primary hover:bg-surface-container"}`}
  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    <span className="font-mono">{discussion.upvotes}</span>
                  </button>

                  <button
    type="button"
    onClick={() => onOpenDiscussion(discussion.id)}
    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-surface-container-low transition-colors text-xs"
  >
                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                    <span className="font-mono">{discussion.answersCount}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
    type="button"
    onClick={() => {
      if (navigator.share) {
        navigator.share({ title: discussion.title, url: window.location.href }).catch(() => {
        });
      } else {
        onTriggerToast("Discussion link copied! \u{1F4CB}");
      }
    }}
    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>

                  <button
    type="button"
    onClick={() => onToggleSaveDiscussion(discussion.id)}
    className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors ${discussion.isSaved ? "text-primary" : ""}`}
  >
                    <span className="material-symbols-outlined text-[18px]">
                      {discussion.isSaved ? "bookmark" : "bookmark_border"}
                    </span>
                  </button>
                </div>
              </div>
            </article>

            {
    /* Spotlight Mentors Carousel inserted after 1st discussion */
  }
            {idx === 0 && <div className="bg-gradient-to-r from-primary-fixed/40 via-surface-container to-secondary-fixed/30 rounded-2xl p-4 flex flex-col gap-3 border border-surface-container">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
                    <span className="font-display font-bold text-sm text-on-surface">
                      Spotlight Mentors Online
                    </span>
                  </div>
                  <button
    onClick={() => onTriggerToast("Viewing 42 verified online alumni mentors")}
    className="text-xs font-bold text-primary flex items-center hover:underline"
  >
                    <span>View All</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>

                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {SPOTLIGHT_MENTORS.map((m) => <div
    key={m.id}
    className="min-w-[190px] bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-2 shadow-xs border border-surface-container shrink-0"
  >
                      <div className="flex items-center gap-2">
                        <img
    src={m.avatar}
    alt={m.name}
    className="w-10 h-10 rounded-full object-cover shrink-0"
  />
                        <div className="flex flex-col min-w-0">
                          <span className="font-display font-bold text-xs text-on-surface truncate">
                            {m.name}
                          </span>
                          <span className={`text-[10px] font-semibold truncate ${m.companyColor}`}>
                            {m.role}
                          </span>
                        </div>
                      </div>
                      <span className="bg-surface-container text-on-surface-variant font-mono text-[10px] px-2 py-0.5 rounded text-center truncate">
                        {m.collegeYear}
                      </span>
                      <button
    onClick={() => onOpenMentorDrawer(m)}
    className="w-full py-1.5 rounded-lg bg-surface-container-low text-primary text-xs font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-1"
  >
                        <span className="material-symbols-outlined text-[14px]">send</span>
                        <span>Ask Directly</span>
                      </button>
                    </div>)}
                </div>
              </div>}
          </React.Fragment>)}
      </section>

      {
    /* Code of Conduct */
  }
      <section className="pt-6">
        <div className="bg-surface-container rounded-2xl p-4 flex items-start gap-3 border border-surface-container">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </div>
          <div className="flex flex-col gap-0.5 text-on-surface">
            <span className="font-display font-bold text-xs">Campus Verified Code of Conduct</span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              All alumni and senior placement answers are verified using institutional credentials (.ac.in / company emails). Maintain constructive, academic integrity.
            </p>
          </div>
        </div>
      </section>

      {
    /* Leaderboard Modal */
  }
      {showLeaderboard && <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-surface-container">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
                <h3 className="font-display font-bold text-base text-on-surface">Alumni & Peer Leaderboard</h3>
              </div>
              <button
    onClick={() => setShowLeaderboard(false)}
    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
  >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {[
    { name: "Siddharth Roy", role: "PhonePe SDE-2 (Ex-VIT)", points: "2,840 pts", rank: 1 },
    { name: "Pooja Nair", role: "Microsoft SDE-1 (IIIT-H)", points: "2,410 pts", rank: 2 },
    { name: "Harsh Vardhan", role: "AWS Cloud Eng (DTU)", points: "1,980 pts", rank: 3 },
    { name: "Tanmay Kulkarni", role: "Student Contributor (PICT)", points: "1,420 pts", rank: 4 }
  ].map((ldr) => <div
    key={ldr.name}
    className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between"
  >
                  <div className="flex items-center gap-2.5">
                    <span
    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${ldr.rank === 1 ? "bg-amber-400 text-amber-950" : ldr.rank === 2 ? "bg-slate-300 text-slate-900" : "bg-amber-700 text-white"}`}
  >
                      {ldr.rank}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-on-surface block leading-tight">{ldr.name}</span>
                      <span className="text-[10px] text-on-surface-variant">{ldr.role}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary">{ldr.points}</span>
                </div>)}
            </div>

            <button
    onClick={() => setShowLeaderboard(false)}
    className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold"
  >
              Close Leaderboard
            </button>
          </div>
        </div>}
    </div>;
};
export {
  CommunityScreen
};
