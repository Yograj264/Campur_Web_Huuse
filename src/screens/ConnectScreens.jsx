import { useEffect, useState } from "react";
import { connectRequest } from "../api";
import { LandingIcon } from "../components/landing/LandingIcon";
import "./CampusHome.css";

export function CommunityScreen({ user, onNavigate }) {
  const [threads, setThreads] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    connectRequest("community")
      .then((data) => {
        if (active) {
          setThreads(data.threads);
          setMessage("");
        }
      })
      .catch((e) => {
        if (active) setMessage(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  async function post(e) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    setBusy(true);
    try {
      const result = await connectRequest(
        "community",
        Object.fromEntries(new FormData(form)),
      );
      setThreads(result.threads);
      form.reset();
      setMessage("Your question is now visible to the community.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="cc-support">
      <p className="cc-audience">LEARN TOGETHER</p>
      <h1>Find your campus community.</h1>
      <p className="cc-support-lead">
        Ask a college or career question, share what you’re exploring, and learn
        from other students. Questions posted here are public.
      </p>
      <div className="cc-support-grid">
        <div className="cc-panel">
          <h2>Student questions</h2>
          {loading && <p role="status">Loading questions…</p>}
          {!loading && !threads.length && (
            <p>
              Be the first to start a conversation about your college journey.
            </p>
          )}
          {threads.map((thread) => (
            <article className="cc-thread" key={thread.id}>
              <h3>{thread.title}</h3>
              <p>{thread.body}</p>
              <small>
                {thread.author} ·{" "}
                {new Date(thread.created_at).toLocaleDateString()}
              </small>
            </article>
          ))}
          <button className="cc-link" onClick={() => setRetry((n) => n + 1)}>
            Refresh questions
          </button>
        </div>
        <div className="cc-panel">
          <h2>Start a conversation</h2>
          <p>
            Keep it helpful and respectful. Don’t post passwords, contact
            details or other private information.
          </p>
          {user ? (
            <form className="cc-support-form" onSubmit={post}>
              <label htmlFor="community-title">Question title</label>
              <input
                id="community-title"
                name="title"
                required
                minLength={5}
                maxLength={160}
                placeholder="What would you like to know?"
              />
              <label htmlFor="community-body">Your question</label>
              <textarea
                id="community-body"
                name="body"
                required
                minLength={10}
                maxLength={3000}
                rows={6}
                placeholder="Add a little context to help other students understand."
              />
              <button className="cc-primary" disabled={busy}>
                {busy ? "Posting…" : "Post Question →"}
              </button>
            </form>
          ) : (
            <button
              className="cc-primary"
              style={{ marginTop: 20 }}
              onClick={() => onNavigate("login")}
            >
              Sign in to ask a question →
            </button>
          )}
          {message && (
            <p role="status" className="cc-support-notice">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function MentorshipScreen({ user, onNavigate }) {
  const [questions, setQuestions] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    if (user)
      connectRequest("guidance")
        .then((data) => {
          if (active) setQuestions(data.questions);
        })
        .catch((e) => {
          if (active) setMessage(e.message);
        });
    return () => {
      active = false;
    };
  }, [user?.id]);
  async function save(e) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    setBusy(true);
    try {
      const result = await connectRequest(
        "guidance",
        Object.fromEntries(new FormData(form)),
      );
      setQuestions(result.questions);
      form.reset();
      setMessage("Saved to your private guidance planner.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="cc-support">
      <p className="cc-audience">A CLEARER NEXT STEP</p>
      <h1>Make room for good guidance.</h1>
      <p className="cc-support-lead">
        Prepare for conversations with teachers, alumni and industry
        professionals. Start by collecting the questions that matter to you.
      </p>
      <p className="cc-support-notice">
        This is your private planning space. Live mentor matching and messaging
        are not available yet; saved questions are not sent to a mentor.
      </p>
      <div className="cc-support-grid">
        <div className="cc-panel">
          <h2>Your guidance checklist</h2>
          <ol>
            <li>Describe your interests and current education.</li>
            <li>Choose a career path or a shortlist of colleges.</li>
            <li>
              Write specific questions about skills, courses or campus life.
            </li>
            <li>
              Take your questions to a trusted teacher, counsellor or mentor.
            </li>
          </ol>
          <button
            className="cc-primary"
            onClick={() => onNavigate("careers-roadmap")}
          >
            Explore career roadmaps →
          </button>
        </div>
        <div className="cc-panel">
          <h2>My guidance questions</h2>
          {user ? (
            <>
              <form className="cc-support-form" onSubmit={save}>
                <label htmlFor="guidance-question">
                  What would you like guidance on?
                </label>
                <textarea
                  id="guidance-question"
                  name="question"
                  rows={4}
                  minLength={10}
                  maxLength={2000}
                  required
                  placeholder="e.g. What projects should I build before applying for an internship?"
                />
                <button className="cc-primary" disabled={busy}>
                  {busy ? "Saving…" : "Save Question →"}
                </button>
              </form>
              {questions.map((question) => (
                <article className="cc-thread" key={question.id}>
                  <p>{question.question}</p>
                  <small>
                    {new Date(question.created_at).toLocaleDateString()}
                  </small>
                </article>
              ))}
            </>
          ) : (
            <button className="cc-primary" onClick={() => onNavigate("login")}>
              Sign in to start your planner →
            </button>
          )}
          {message && <p role="status">{message}</p>}
        </div>
      </div>
    </section>
  );
}

export function ExploreScreen({ onNavigate }) {
  return (
    <section className="cc-support">
      <p className="cc-audience">FIND YOUR DIRECTION</p>
      <h1>Every next step starts here.</h1>
      <p className="cc-support-lead">
        A little discovery today can open up a world of possibilities.
      </p>
      <div className="cc-explore-grid">
        {[
          [
            "building",
            "Find a college",
            "Explore courses, campuses and college details.",
            "colleges-admissions",
          ],
          [
            "code",
            "Explore a career",
            "Follow a step-by-step learning roadmap.",
            "careers-roadmap",
          ],
          [
            "people",
            "Join a conversation",
            "Ask questions and learn from fellow students.",
            "community",
          ],
          [
            "bulb",
            "Plan your guidance",
            "Collect the questions to ask your future mentor.",
            "mentorship",
          ],
        ].map(([icon, title, description, screen]) => (
          <button
            className="cc-explore-card"
            key={screen}
            onClick={() => onNavigate(screen)}
          >
            <LandingIcon name={icon} size={36} />
            <h2>{title}</h2>
            <p>{description}</p>
            <span>Explore →</span>
          </button>
        ))}
      </div>
    </section>
  );
}
