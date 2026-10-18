import { useState } from "react";
const MentorConnectDrawer = ({
  isOpen,
  onClose,
  mentor,
  onSentQuestion
}) => {
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;
  const currentMentor = mentor || {
    id: "siddharth-roy",
    name: "Siddharth K.",
    role: "SDE-2 at PhonePe",
    company: "PhonePe",
    collegeYear: "B.Tech 2022 Alumni \u2022 Ex-VIT Vellore"
  };
  const handleSend = async () => {
    if (!questionText.trim()) return;
    setIsSubmitting(true);
    const success = await onSentQuestion(questionText);
    setIsSubmitting(false);
    if (success) {
      setQuestionText("");
      onClose();
    }
  };
  return <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-outline-variant/60 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-base shadow-xs">
              {currentMentor.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-on-surface leading-tight">
                Connect with {currentMentor.name}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {currentMentor.collegeYear} • {currentMentor.role}
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

        <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
          <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            How this mentor can help you:
          </span>
          <ul className="text-on-surface-variant text-xs list-disc pl-4 space-y-1">
            <li>Code review on your Django / Spring REST serializers & SQL queries</li>
            <li>System design roadmap for Tier-1 off-campus test rounds</li>
            <li>Cold referral guidance on LinkedIn with verified alumni backing</li>
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface">Your Question or Code Query</label>
          <textarea
    value={questionText}
    onChange={(e) => setQuestionText(e.target.value)}
    className="w-full p-3 rounded-xl bg-surface border border-outline-variant/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface text-sm resize-none transition-all placeholder:text-outline"
    placeholder="Hi Siddharth, I'm working through Stage 3 and had a quick question regarding JWT token refresh policies and PostgreSQL indexing..."
    rows={4}
  />
        </div>

        <div className="flex items-center gap-2">
          <button
    type="button"
    onClick={onClose}
    className="px-4 py-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors"
  >
            Cancel
          </button>
          <button
    type="button"
    disabled={!questionText.trim() || isSubmitting}
    onClick={handleSend}
    className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-display text-sm font-bold shadow-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
  >
            {isSubmitting ? <span>Sending...</span> : <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Submit Question to Mentor</span>
              </>}
          </button>
        </div>
      </div>
    </div>;
};
export {
  MentorConnectDrawer
};
