import { api } from '../api';
import React, { useState, useEffect } from 'react';
import { ScreenType, CommunityDiscussion, CommunityAnswer } from '../types';


interface DiscussionDetailScreenProps {
  discussion: CommunityDiscussion;
  onNavigate: (screen: ScreenType) => void;
  onTriggerToast: (msg: string) => void;
}

export const DiscussionDetailScreen: React.FC<DiscussionDetailScreenProps> = ({
  discussion,
  onNavigate,
  onTriggerToast
}) => {
  const [answers, setAnswers] = useState<CommunityAnswer[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isQuestionUpvoted, setIsQuestionUpvoted] = useState(discussion.hasUpvoted ?? true);
  const [questionUpvoteCount, setQuestionUpvoteCount] = useState(discussion.upvotes);
  const [isBookmarked, setIsBookmarked] = useState(discussion.isSaved ?? true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Top Voted (Alumni First)');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const refreshAnswers = async () => {
    const response = await fetch(`/api/discussions/${discussion.id}/answers/`);
    if (!response.ok) throw new Error('Could not load answers.');
    setAnswers((await response.json()).answers);
  };
  useEffect(() => { void refreshAnswers().catch(error => onTriggerToast(error.message)); }, [discussion.id]);
  const update = async (action: string, id: string) => {
    try {
      const data = await api({action,id});
      const current = data.discussions.find((d: CommunityDiscussion) => d.id === discussion.id);
      if (current) {setIsQuestionUpvoted(current.hasUpvoted);setQuestionUpvoteCount(current.upvotes);setIsBookmarked(current.isSaved);}
      await refreshAnswers();
    } catch (error) { onTriggerToast((error as Error).message); }
  };
  const toggleQuestionUpvote = () => { void update('vote_discussion',discussion.id); };
  const toggleAnswerUpvote = (id: string) => { void update('vote_answer',id); };
  const toggleAnswerHelpful = (id: string) => { void update('helpful_answer',id); };
  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await api({action:'create_answer',id:discussion.id,body:replyText.trim()});
      await refreshAnswers();
      setReplyText('');
      onTriggerToast('Your answer has been posted.');
    } catch (error) { onTriggerToast((error as Error).message); }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    onTriggerToast('Code snippet copied to clipboard! 📋');
  };

  const insertSyntax = (before: string, after: string) => {
    setReplyText((prev) => `${prev}${before}code${after}`);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Sticky Secondary Subheader */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 py-2.5 flex items-center justify-between border-b border-surface-container">
        <button
          onClick={() => onNavigate('community-feed')}
          className="inline-flex items-center gap-1 text-primary font-display font-semibold text-xs sm:text-sm active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Community</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            aria-label="Bookmark post"
            onClick={() => {
              void update('save_discussion',discussion.id);
              onTriggerToast(
                !isBookmarked
                  ? 'Added discussion to your Saved Threads! 📌'
                  : 'Removed from Saved Threads'
              );
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isBookmarked
                ? 'bg-primary-fixed text-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          <button
            aria-label="Share discussion"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: discussion.title, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
                onTriggerToast('Discussion link copied! 📋');
              }
            }}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>

          <div className="relative">
            <button
              aria-label="More options"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl py-1.5 z-40 border border-surface-container">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowReportModal(true);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 text-error text-xs font-semibold hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>Report Discussion</span>
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onTriggerToast('Thread muted from your recommendations');
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 text-on-surface-variant text-xs font-semibold hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                  <span>Mute Thread</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-3">
        {/* Original Question Card */}
        <article className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container p-5 flex flex-col gap-4">
          {/* Tag Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
              #SystemDesign
            </span>
            <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
              #Tier3ToTier1
            </span>
            <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
              #ProductMNCs
            </span>
          </div>

          {/* Author Block */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={discussion.author.avatar}
                alt={discussion.author.name}
                className="w-11 h-11 rounded-full object-cover shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-bold text-sm text-on-surface truncate">
                  {discussion.author.name}
                </span>
                <span className="bg-surface-container-low text-on-surface-variant px-1.5 py-0.2 rounded font-mono text-[10px] uppercase font-bold">
                  OP
                </span>
              </div>
              <span className="text-xs text-on-surface-variant truncate">
                {discussion.author.role} • Active Learner
              </span>
              <span className="text-[10px] text-outline mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                <span>2h ago</span>
                <span>•</span>
                <span className="material-symbols-outlined text-[12px]">visibility</span>
                <span>1.8k views</span>
              </span>
            </div>
          </div>

          {/* Question Title */}
          <h1 className="font-display font-bold text-base sm:text-xl text-on-surface tracking-tight leading-snug">
            {discussion.title}
          </h1>

          {/* Question Description Body */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            <p>
              Currently comfortable with DSA (350+ LeetCode solved, graphs/DP solid), but most Tier-1
              campus and off-campus drives (Razorpay, Swiggy, Atlassian, PhonePe) require solid Low-Level
              Design (LLD), object modeling, and basic HLD concepts.
            </p>

            <p className="font-bold text-on-surface">Specific pain points I need guidance on:</p>

            <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 text-on-surface border border-surface-container">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                  help_center
                </span>
                <span className="text-xs">
                  Which standard resources (Head First, Refactoring Guru, or specific GitHub repos) are best suited for Indian product drives?
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                  calendar_month
                </span>
                <span className="text-xs">
                  How to balance academic semester exams with building complete LLD projects (Parking Lot, Splitwise, Rate Limiter)?
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                  psychology
                </span>
                <span className="text-xs">
                  What do interviewers realistically expect from a 3rd-year undergraduate intern vs a 4th-year senior engineer?
                </span>
              </div>
            </div>
          </div>

          {/* Thread Reaction Rail */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-container">
            <button
              onClick={toggleQuestionUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isQuestionUpvoted
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_drop_up</span>
              <span className="font-mono">{questionUpvoteCount}</span>
              <span className="hidden sm:inline">Upvoted</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-semibold">
              <span className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">forum</span>
                <span>{answers.length} Insights</span>
              </span>
            </div>
          </div>
        </article>

        {/* Sort & Answers Count Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-on-surface">
              {answers.length} Answers
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">auto_awesome</span>
              <span>{selectedSort}</span>
              <span className="material-symbols-outlined text-[15px]">expand_more</span>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-surface-container-lowest rounded-xl shadow-xl py-1 z-30 border border-surface-container">
                {['Top Voted (Alumni First)', 'Most Recent', 'Verified Engineers Only'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedSort(opt);
                      setShowSortMenu(false);
                      onTriggerToast(`Sorted by: ${opt}`);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-semibold ${
                      selectedSort === opt ? 'text-primary bg-surface-container-low font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Answers List */}
        <div className="flex flex-col gap-4">
          {answers.map((ans, idx) => (
            <article
              key={ans.id}
              className={`rounded-2xl p-5 shadow-xs border flex flex-col gap-3 relative overflow-hidden ${
                ans.author.isVerifiedAlumni
                  ? 'bg-surface-container-lowest border-primary/30 shadow-sm'
                  : 'bg-surface-container-lowest border-surface-container'
              }`}
            >
              {/* If top-rated verified answer: show distinction accent banner */}
              {ans.author.isVerifiedAlumni && (
                <div className="bg-gradient-to-r from-primary via-tertiary-container to-secondary -mx-5 -mt-5 px-5 py-2 flex items-center justify-between text-on-primary">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span className="text-[10px] tracking-wider uppercase font-extrabold">
                      VERIFIED ALUMNI ANSWER
                    </span>
                  </div>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold">
                    TOP RATED
                  </span>
                </div>
              )}

              {/* Author Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={ans.author.avatar}
                      alt={ans.author.name}
                      className="w-11 h-11 rounded-full object-cover shadow-xs"
                    />
                    {ans.author.isVerifiedAlumni && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                        <span
                          className="material-symbols-outlined text-[11px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display font-bold text-xs sm:text-sm text-on-surface truncate">
                        {ans.author.name}
                      </span>
                      {ans.author.badgeTag && (
                        <span className="bg-primary-fixed text-on-primary-fixed text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                          {ans.author.badgeTag}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-on-surface-variant truncate">
                      {ans.author.role} • {ans.author.alumniInfo}
                    </span>
                    {ans.author.studentsMentored && (
                      <span className="text-[10px] text-secondary font-semibold">
                        {ans.author.studentsMentored}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-outline shrink-0">{ans.timeAgo}</span>
              </div>

              {/* Endorsed by tag */}
              {ans.endorsedBy && (
                <div className="bg-surface-container-low px-3 py-1 rounded-xl flex items-center gap-1.5 text-on-surface-variant text-xs border border-surface-container">
                  <span className="material-symbols-outlined text-primary text-[16px]">workspace_premium</span>
                  <span>{ans.endorsedBy}</span>
                </div>
              )}

              {/* Steps / Content */}
              {ans.steps && (
                <div className="flex flex-col gap-2.5">
                  {ans.steps.map((st, i) => (
                    <div
                      key={i}
                      className="bg-surface-container-low/70 p-3.5 rounded-xl flex flex-col gap-1 border border-surface-container"
                    >
                      <span className="font-display font-bold text-xs text-primary">{st.headline}</span>
                      <p className="text-xs text-on-surface leading-relaxed">{st.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Pro Tip */}
              {ans.proTip && (
                <div className="bg-primary/5 rounded-xl p-3 flex items-start gap-2 text-on-surface border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                    tips_and_updates
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong className="text-primary font-bold">Pro-tip for 3rd years:</strong> {ans.proTip}
                  </p>
                </div>
              )}

              {/* Code Snippet Box */}
              {ans.codeSnippet && (
                <div className="rounded-xl overflow-hidden bg-[#1e293b] text-white shadow-xs text-xs font-mono">
                  <div className="bg-[#0f172a] px-3 py-1.5 flex items-center justify-between text-slate-300 text-[11px] border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="ml-1 text-slate-300">{ans.codeSnippet.fileName}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(ans.codeSnippet!.code)}
                      className="hover:text-white flex items-center gap-1 transition-colors text-[11px]"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto leading-relaxed text-indigo-200">
                    <code>{ans.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAnswerUpvote(ans.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all ${
                      ans.hasUpvoted
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      thumb_up
                    </span>
                    <span className="font-mono">{ans.upvotes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAnswerHelpful(ans.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                      ans.hasMarkedHelpful
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">
                      volunteer_activism
                    </span>
                    <span>Helpful ({ans.helpfulCount})</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onTriggerToast(`Viewing ${ans.nestedCount} nested replies`)}
                  className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  <span>{ans.nestedCount} nested</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Community Callout Banner */}
        <div className="bg-gradient-to-br from-surface-container-high to-surface-container p-4 rounded-2xl border border-surface-container flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm text-on-surface">
              Have a solution or project link?
            </span>
            <span className="text-xs text-on-surface-variant">
              Contribute your insight to help 1,200+ students preparing this cycle.
            </span>
          </div>
          <span className="material-symbols-outlined text-primary text-[32px] shrink-0 opacity-80">
            psychology_alt
          </span>
        </div>

        {/* Post Your Answer Card */}
        <article className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <img
              alt="Your Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDERLp8Ud00e1JvKLEr5vVf-BWBvI3RirZ66n8LXV-PRMVbL2LKckwz14Z3L1hzHJdrGFnBd5XU6i0MlXs_mXZx6i3pq8ptTZ0AltXqG8OoA_m13JYcDPHd6Y-IpNjBHpnSxxwBftM6OQROPOsbNd0f2uS5-2M2H6pN5fL_zRaNGgMsPARqfrsHM0-65xWKDlzbp_fBu_65afuFoQZ8mWQVhGRzMpgWR5waNo4TiYltL5LfJ-w9oFjp"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs text-on-surface leading-tight">
                Post Your Answer
              </span>
              <span className="text-[10px] text-outline">Contributing as Student</span>
            </div>
          </div>

          <form onSubmit={handlePostAnswer} className="flex flex-col gap-2">
            <div className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden border border-surface-container focus-within:border-primary/40">
              {/* Markdown bar */}
              <div className="bg-surface-container-high px-3 py-1 flex items-center justify-between text-on-surface-variant text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertSyntax('**', '**')}
                    className="p-1 hover:text-primary transition-colors"
                    title="Bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">format_bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSyntax('`', '`')}
                    className="p-1 hover:text-primary transition-colors"
                    title="Code"
                  >
                    <span className="material-symbols-outlined text-[16px]">code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSyntax('\n• ', '')}
                    className="p-1 hover:text-primary transition-colors"
                    title="List item"
                  >
                    <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                  </button>
                </div>
                <span className="font-mono text-[10px] text-outline">Markdown enabled</span>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your answer or ask Siddharth a follow-up question..."
                rows={4}
                className="w-full p-3 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-on-surface placeholder:text-outline"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[10px] text-outline max-w-[200px] sm:max-w-xs leading-tight">
                Adheres to Campus Web House academic guidelines.
              </p>
              <button
                type="submit"
                className="bg-primary text-on-primary px-4 py-2 rounded-xl font-display text-xs font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1 active:scale-95"
              >
                <span>Post Answer</span>
                <span className="material-symbols-outlined text-[15px]">send</span>
              </button>
            </div>
          </form>
        </article>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 flex flex-col gap-3 shadow-2xl border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-error">
                <span className="material-symbols-outlined text-[20px]">flag</span>
                <span className="font-display font-bold text-sm text-on-surface">Report Discussion</span>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Help us maintain high academic signal for collegiate students. Why are you reporting this thread?
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input type="radio" name="report" defaultChecked className="accent-primary" />
                <span>Off-topic / Duplicate thread</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input type="radio" name="report" className="accent-primary" />
                <span>Coaching institute spam</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low cursor-pointer">
                <input type="radio" name="report" className="accent-primary" />
                <span>Misleading placement CTC claims</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 text-xs text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  onTriggerToast('Report submitted for moderator review');
                }}
                className="px-3.5 py-1.5 bg-error text-on-error text-xs font-bold rounded-lg shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
