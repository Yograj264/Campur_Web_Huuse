import { ROADMAPS } from "../data/roadmaps";
import { LandingIcon } from "../components/landing/LandingIcon";

export function CareersScreen({ selectedCareer, onSelectCareer, onNavigate }) {
  const roadmap = ROADMAPS.find((item) => item.id === selectedCareer);
  return (
    <section className="connect-container connect-subpage">
      <p className="connect-eyebrow">Plan your next step</p>
      <h1>{roadmap ? roadmap.title : "Career Roadmaps"}</h1>
      <p className="connect-page-description">
        {roadmap
          ? roadmap.summary
          : "Choose a path and explore a simple learning sequence. These are general guides, not personalized assessments."}
      </p>
      {roadmap ? (
        <>
          <ol className="connect-learning-steps">
            {roadmap.stages.map((stage, index) => (
              <li key={stage}>
                <span>{index + 1}</span>
                <div>
                  <h2>Step {index + 1}</h2>
                  <p>{stage}</p>
                </div>
              </li>
            ))}
          </ol>
          <button
            className="connect-text-link"
            onClick={() => onSelectCareer(null)}
          >
            View all roadmaps <LandingIcon name="arrow" size={18} />
          </button>
        </>
      ) : (
        <div className="connect-roadmap-grid">
          {ROADMAPS.map((item) => (
            <button
              key={item.id}
              className={`connect-roadmap-card connect-theme-${item.theme}`}
              onClick={() => onSelectCareer(item.id)}
            >
              <div className="connect-roadmap-art">
                <LandingIcon name={item.icon} size={59} />
              </div>
              <h3>{item.title}</h3>
              <div className="connect-roadmap-bottom">
                <p>Skills, tools, roles and a step-by-step roadmap.</p>
                <span className="connect-roadmap-arrow">
                  <LandingIcon name="arrow" size={22} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        className="connect-text-link"
        onClick={() => onNavigate("home-discover")}
      >
        Back to home
      </button>
    </section>
  );
}
