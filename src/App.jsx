import { useEffect, useState } from "react";
import { loadColleges, authRequest } from "./api";
import { LandingHeader } from "./components/landing/LandingHeader";
import { HomeScreen } from "./screens/HomeScreen";
import { CollegesScreen, CollegeDetails } from "./screens/CollegesScreen";
import { CareersScreen } from "./screens/CareersScreen";
import LoginPage from "./screens/LoginPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  useEffect(() => {
    authRequest("session")
      .then((data) => setUser(data.user))
      .catch(() =>
        setAuthError("Unable to load your session. Refresh to retry."),
      );
  }, []);
  async function signOut() {
    try {
      await authRequest("logout");
      setUser(null);
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
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        setError(failure.message);
        setCatalogueStatus("error");
      });
    return () => controller.abort();
  }, [retry]);

  function navigate(screen) {
    setCurrentScreen(screen);
    if (screen === "careers-roadmap") setSelectedCareer(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCollege(college) {
    setSelectedCollege(college);
    navigate("college-detail");
  }

  function selectCareer(id) {
    setSelectedCareer(id);
    setCurrentScreen("careers-roadmap");
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
          navigate("home-discover");
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
        onLogout={signOut}
      />
      {authError && <p role="alert">{authError}</p>}
      <main className="connect-main">
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
            onNavigate={navigate}
            onSelectCollege={selectCollege}
            onSelectCareer={selectCareer}
          />
        )}
        {currentScreen === "colleges-admissions" && (
          <CollegesScreen
            colleges={colleges}
            onSelectCollege={selectCollege}
            onNavigate={navigate}
          />
        )}
        {currentScreen === "college-detail" && selectedCollege && (
          <CollegeDetails college={selectedCollege} onNavigate={navigate} />
        )}
        {currentScreen === "careers-roadmap" && (
          <CareersScreen
            selectedCareer={selectedCareer}
            onSelectCareer={selectCareer}
            onNavigate={navigate}
          />
        )}
      </main>
    </>
  );
}
