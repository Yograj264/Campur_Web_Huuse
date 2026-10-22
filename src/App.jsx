import { useEffect, useState } from "react";
import { loadColleges, authRequest } from "./api";
import { LandingHeader } from "./components/landing/LandingHeader";
import { HomeScreen } from "./screens/HomeScreen";
import { CollegesScreen } from "./screens/CollegesScreen";
import CollegeDetails from "./screens/CollegeDetails";
import { CareersScreen } from "./screens/CareersScreen";
import LoginPage from "./screens/LoginPage";
import {
  CommunityScreen,
  MentorshipScreen,
  ExploreScreen,
} from "./screens/ConnectScreens";
import { ROADMAPS } from "./data/roadmaps";
import StudentDashboard from "./screens/StudentDashboard";

export default function App() {
  const [collegeQuery, setCollegeQuery] = useState("");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  useEffect(() => {
    authRequest("session")
      .then((data) => {
        setUser(data.user);
        if (
          data.user &&
          !data.user.is_staff &&
          !new URLSearchParams(window.location.search).has("college") &&
          !new URLSearchParams(window.location.search).has("career")
        )
          setCurrentScreen("student-dashboard");
      })
      .catch(() =>
        setAuthError("Unable to load your session. Refresh to retry."),
      );
  }, []);
  async function signOut() {
    try {
      await authRequest("logout");
      setUser(null);
      navigate("home-discover");
      setAuthError("");
    } catch (error) {
      setAuthError(error.message);
    }
  }
  const [currentScreen, setCurrentScreen] = useState("home-discover");
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [catalogueStatus, setCatalogueStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCatalogueStatus("loading");
    setError("");
    loadColleges(controller.signal)
      .then((records) => {
        setColleges(records);
        setCatalogueStatus("ready");
        const sharedId = new URLSearchParams(window.location.search).get(
          "college",
        );
        const sharedCollege = records.find((record) => record.id === sharedId);
        if (sharedCollege) {
          setSelectedCollege(sharedCollege);
          setCurrentScreen("college-detail");
        } else {
          const careerId = new URLSearchParams(window.location.search).get(
            "career",
          );
          if (ROADMAPS.some((item) => item.id === careerId)) {
            setSelectedCareer(careerId);
            setCurrentScreen("careers-roadmap");
          }
        }
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        setError(failure.message);
        setCatalogueStatus("error");
      });
    return () => controller.abort();
  }, [retry]);

  function navigate(screen) {
    if (user?.is_staff && screen === "student-dashboard") {
      window.location.assign("/admin/");
      return;
    }
    if (user && ["account", "login"].includes(screen))
      screen = "student-dashboard";
    setCurrentScreen(screen);
    if (screen !== "college-detail") {
      const url = new URL(window.location.href);
      url.searchParams.delete("college");
      url.searchParams.delete("career");
      window.history.replaceState(null, "", url);
    }
    if (screen === "careers-roadmap") setSelectedCareer(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function searchSite(query) {
    const value = query.trim();
    const career =
      value.length > 2 &&
      ROADMAPS.find((item) =>
        `${item.title} ${item.summary}`
          .toLowerCase()
          .includes(value.toLowerCase()),
      );
    if (career) selectCareer(career.id);
    else {
      setCollegeQuery(value);
      navigate("colleges-admissions");
    }
  }

  function selectCollege(college) {
    setSelectedCollege(college);
    navigate("college-detail");
    const url = new URL(window.location.href);
    url.searchParams.delete("career");
    url.searchParams.set("college", college.id);
    window.history.replaceState(null, "", url);
  }

  function selectCareer(id) {
    setSelectedCareer(id);
    setCurrentScreen("careers-roadmap");
    const url = new URL(window.location.href);
    url.searchParams.delete("college");
    if (id) url.searchParams.set("career", id);
    else url.searchParams.delete("career");
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (currentScreen === "account" || currentScreen === "login") {
    return (
      <LoginPage
        key={currentScreen}
        initialMode={currentScreen === "login" ? "login" : "signup"}
        onBack={() => navigate("home-discover")}
        onAuthenticated={(account) => {
          setUser(account);
          if (account.is_staff) window.location.assign("/admin/");
          else navigate("student-dashboard");
        }}
      />
    );
  }

  return (
    <>
      <LandingHeader
        currentScreen={currentScreen}
        onNavigate={navigate}
        user={user}
        onSearch={searchSite}
      />
      {authError && <p role="alert">{authError}</p>}
      <main className="connect-main">
        {currentScreen === "community" && (
          <CommunityScreen user={user} onNavigate={navigate} />
        )}
        {currentScreen === "mentorship" && (
          <MentorshipScreen user={user} onNavigate={navigate} />
        )}
        {currentScreen === "explore" && <ExploreScreen onNavigate={navigate} />}

        {currentScreen === "student-dashboard" && user && (
          <StudentDashboard
            colleges={colleges}
            onSelectCollege={selectCollege}
            onSelectCareer={selectCareer}
            user={user}
            onUserUpdate={setUser}
            onLogout={signOut}
            onNavigate={navigate}
            onSessionExpired={() => {
              setUser(null);
              setCurrentScreen("login");
            }}
          />
        )}
        {catalogueStatus === "loading" && (
          <p className="connect-catalogue-status" role="status">
            Loading college catalogue...
          </p>
        )}
        {error && (
          <div
            className="connect-catalogue-status connect-catalogue-error"
            role="alert"
          >
            {error}{" "}
            <button onClick={() => setRetry((value) => value + 1)}>
              Retry
            </button>
          </div>
        )}
        {currentScreen === "home-discover" && (
          <HomeScreen
            colleges={colleges}
            user={user}
            onNavigate={navigate}
            onSelectCollege={selectCollege}
            onSelectCareer={selectCareer}
          />
        )}
        {currentScreen === "colleges-admissions" && (
          <CollegesScreen
            key={collegeQuery}
            initialQuery={collegeQuery}
            colleges={colleges}
            onSelectCollege={selectCollege}
            onNavigate={navigate}
          />
        )}
        {currentScreen === "college-detail" && selectedCollege && (
          <CollegeDetails
            key={selectedCollege.id}
            college={selectedCollege}
            colleges={colleges}
            user={user}
            onNavigate={navigate}
          />
        )}
        {currentScreen === "careers-roadmap" && (
          <CareersScreen
            key={selectedCareer || "directory"}
            colleges={colleges}
            onSelectCollege={selectCollege}
            user={user}
            selectedCareer={selectedCareer}
            onSelectCareer={selectCareer}
            onNavigate={navigate}
          />
        )}
      </main>
    </>
  );
}
