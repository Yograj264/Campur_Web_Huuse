import { useState } from "react";
const CareerAssessmentModal = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [degree, setDegree] = useState("B.Tech CSE");
  const [year, setYear] = useState("3rd Year");
  const [cgpa, setCgpa] = useState(8.4);
  const [codingLevel, setCodingLevel] = useState("Intermediate (200+ DSA)");
  const [targetGoal, setTargetGoal] = useState("Tier-1 Product MNC (\u20B916-24 LPA)");
  if (!isOpen) return null;
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4);
    }
  };
  const handleFinish = () => {
    onComplete("Full Stack Web Developer");
    onClose();
    setStep(1);
  };
  return <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto border border-surface-container">
        {
    /* Header */
  }
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="font-display font-bold text-lg text-on-surface">
              {step === 4 ? "Your Career Assessment Blueprint" : "Free Career Assessment"}
            </h2>
          </div>
          <button
    onClick={onClose}
    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
  >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {
    /* Stepper Dots */
  }
        {step < 4 && <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
            <span>Step {step} of 3</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => <div
    key={i}
    className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-secondary" : "w-3 bg-surface-container"}`}
  />)}
            </div>
          </div>}

        {
    /* Step 1 */
  }
        {step === 1 && <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">
                Academic Standing & Stream
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Helps us map syllabus overlaps with Tier-1 placement expectations.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface">Degree Stream</label>
              <div className="grid grid-cols-2 gap-2">
                {["B.Tech CSE / IT", "B.Tech ECE / EE", "BCA / MCA", "B.Sc / Non-Tech"].map((d) => <button
    key={d}
    type="button"
    onClick={() => setDegree(d)}
    className={`py-2 px-3 rounded-xl text-xs font-semibold text-left border transition-all ${degree === d ? "bg-primary text-on-primary border-primary shadow-xs" : "bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container"}`}
  >
                    {d}
                  </button>)}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface">Current Year</label>
              <div className="grid grid-cols-4 gap-2">
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => <button
    key={y}
    type="button"
    onClick={() => setYear(y)}
    className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${year === y ? "bg-primary text-on-primary border-primary shadow-xs" : "bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container"}`}
  >
                    {y}
                  </button>)}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-on-surface">Current CGPA</span>
                <span className="font-mono font-bold text-primary text-sm">{cgpa.toFixed(1)} / 10</span>
              </div>
              <input
    type="range"
    min="5.0"
    max="10.0"
    step="0.1"
    value={cgpa}
    onChange={(e) => setCgpa(parseFloat(e.target.value))}
    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
  />
              <span className="text-[11px] text-on-surface-variant">
                {cgpa >= 8 ? "Eligible for 95%+ campus shortlist cutoffs" : "Eligible for standard campus eligibility rounds"}
              </span>
            </div>
          </div>}

        {
    /* Step 2 */
  }
        {step === 2 && <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">
                Coding Readiness & Practical Exposure
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Evaluates hands-on coding depth vs theoretical semester curriculum.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
    { title: "Beginner / Fundamentals", desc: "Basic syntax in C++/Java/Python, still learning recursion" },
    { title: "Intermediate (200+ DSA)", desc: "Comfortable with Arrays, Trees, Dynamic Programming on LeetCode" },
    { title: "Full-Stack Project Builder", desc: "Built REST APIs, deployed database apps on Vercel / Render" },
    { title: "Cloud & Infrastructure Enthusiast", desc: "Experimented with Docker, Linux, CI/CD and AWS deployments" }
  ].map((opt) => <button
    key={opt.title}
    type="button"
    onClick={() => setCodingLevel(opt.title)}
    className={`p-3 rounded-xl text-left border transition-all ${codingLevel === opt.title ? "bg-primary/10 border-primary text-on-surface shadow-xs" : "bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container"}`}
  >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">{opt.title}</span>
                    {codingLevel === opt.title && <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                </button>)}
            </div>
          </div>}

        {
    /* Step 3 */
  }
        {step === 3 && <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">
                Target Aspiration & Dream Career
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                We will match hiring timelines and company-specific rounds.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
    { title: "Tier-1 Product MNC (\u20B916-24 LPA)", badge: "PhonePe, Swiggy, Atlassian, Microsoft" },
    { title: "High-Growth Tech Unicorn (\u20B912-18 LPA)", badge: "Zomato, Zepto, Razorpay, CRED" },
    { title: "Global Remote & DevOps (\u20B914-25 LPA)", badge: "Kubernetes, Cloud Infrastructure, US Startups" },
    { title: "National Higher Studies / GATE CSE", badge: "M.Tech at Top IITs / PSUs" }
  ].map((goal) => <button
    key={goal.title}
    type="button"
    onClick={() => setTargetGoal(goal.title)}
    className={`p-3 rounded-xl text-left border transition-all ${targetGoal === goal.title ? "bg-secondary/10 border-secondary text-on-surface shadow-xs" : "bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container"}`}
  >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">{goal.title}</span>
                    {targetGoal === goal.title && <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>}
                  </div>
                  <span className="text-[10px] text-outline font-mono mt-0.5 block">{goal.badge}</span>
                </button>)}
            </div>
          </div>}

        {
    /* Step 4: Results */
  }
        {step === 4 && <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary-fixed">
                    Recommended Pathway
                  </span>
                  <h3 className="font-display text-lg font-extrabold mt-0.5">
                    Full Stack Web Developer
                  </h3>
                  <p className="text-xs text-on-primary-container">
                    Target: ₹16 - 22 LPA • High Fit for {degree}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-on-primary/10 backdrop-blur-md flex flex-col items-center justify-center">
                  <span className="font-display font-extrabold text-base leading-none">94%</span>
                  <span className="text-[9px] uppercase font-bold text-secondary-fixed">Match</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-surface-container">
              <span className="text-xs font-bold text-on-surface">Your Action Blueprint for Semester 5/6:</span>
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>Complete REST API authentication & SQL normalization tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>Deploy 1 full-stack capstone SaaS with Razorpay payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>Begin 90-minute timed machine coding mock drives</span>
                </div>
              </div>
            </div>
          </div>}

        {
    /* Buttons */
  }
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
          {step > 1 && step < 4 && <button
    type="button"
    onClick={() => setStep(step - 1)}
    className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-semibold hover:bg-surface-container transition-colors"
  >
              Back
            </button>}
          {step < 4 ? <button
    type="button"
    onClick={handleNext}
    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-display text-xs font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
  >
              <span>{step === 3 ? "Generate My Blueprint" : "Continue"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button> : <button
    type="button"
    onClick={handleFinish}
    className="w-full py-3 rounded-xl bg-primary text-on-primary font-display text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
  >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Load My Customized Roadmap</span>
            </button>}
        </div>
      </div>
    </div>;
};
export {
  CareerAssessmentModal
};
