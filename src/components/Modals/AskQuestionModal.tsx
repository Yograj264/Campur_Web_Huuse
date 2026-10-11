import React, { useState } from 'react';
import { CommunityDiscussion } from '../../types';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDiscussion: CommunityDiscussion) => Promise<boolean>;
}

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career & Placements');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['PlacementDrive', 'Tier3ToTier1']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 4 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().replace(/^#/, '')]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);

    const newDiscussion: CommunityDiscussion = {
      id: `discussion-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      author: {
        name: 'Rohan Verma',
        role: '3rd Year B.Tech CSE (CGPA 8.4)',
        college: 'Your Campus',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDERLp8Ud00e1JvKLEr5vVf-BWBvI3RirZ66n8LXV-PRMVbL2LKckwz14Z3L1hzHJdrGFnBd5XU6i0MlXs_mXZx6i3pq8ptTZ0AltXqG8OoA_m13JYcDPHd6Y-IpNjBHpnSxxwBftM6OQROPOsbNd0f2uS5-2M2H6pN5fL_zRaNGgMsPARqfrsHM0-65xWKDlzbp_fBu_65afuFoQZ8mWQVhGRzMpgWR5waNo4TiYltL5LfJ-w9oFjp',
        isOP: true
      },
      timeAgo: 'Just now',
      viewsCount: '1 view',
      tags: tags.length > 0 ? tags : ['CareerAdvice'],
      upvotes: 1,
      hasUpvoted: true,
      answersCount: 0
    };

    const success = await onSubmit(newDiscussion);
    setIsSubmitting(false);
    if (success) {
      setTitle('');
      setBody('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto border border-surface-container">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="font-display font-bold text-base text-on-surface">
              Start a Community Discussion
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Question Title / Subject</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to balance GATE CSE preparation with 7th sem capstone project?"
              className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface rounded-xl text-xs sm:text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container-low text-on-surface rounded-xl text-xs sm:text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>Career & Placements</option>
              <option>Admissions & Cutoffs 2025</option>
              <option>System Design & Coding Prep</option>
              <option>Resume & Project Review</option>
              <option>Higher Studies (GATE, CAT, MS)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Details & Current Progress</label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your current tech stack, CGPA/percentile, specific bottlenecks, and what guidance you are seeking..."
              className="w-full p-3 bg-surface-container-low text-on-surface rounded-xl text-xs sm:text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Tags (Up to 3)</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] flex items-center gap-1 font-semibold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-error text-primary"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
              {tags.length < 3 && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag"
                    className="w-24 px-2 py-1 bg-surface-container rounded-full text-[11px] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2 py-1 bg-surface-container rounded-full text-[11px] font-semibold text-on-surface-variant hover:text-primary"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-semibold hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-display text-xs sm:text-sm font-bold shadow-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
