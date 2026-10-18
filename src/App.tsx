import { api } from './api';
import React, { useState, useEffect } from 'react';
import { ScreenType, College, CommunityDiscussion, SpotlightMentor } from './types';
import { INITIAL_COLLEGES, INITIAL_DISCUSSIONS, CRITICAL_DEADLINES } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import LoginPage from './screens/LoginPage.jsx';
import { DashboardScreen } from './screens/DashboardScreen';
import { CareersScreen } from './screens/CareersScreen';
import { CollegesScreen } from './screens/CollegesScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { DiscussionDetailScreen } from './screens/DiscussionDetailScreen';
import { Toast } from './components/Modals/Toast';
import { CareerAssessmentModal } from './components/Modals/CareerAssessmentModal';
import { RoiCalculatorModal } from './components/Modals/RoiCalculatorModal';
import { CollegeCompareModal } from './components/Modals/CollegeCompareModal';
import { CollegeDetailsModal } from './components/Modals/CollegeDetailsModal';
import { MentorConnectDrawer } from './components/Modals/MentorConnectDrawer';
import { AskQuestionModal } from './components/Modals/AskQuestionModal';
import { FilterCollegesDrawer } from './components/Modals/FilterCollegesDrawer';
import { NotificationsModal } from './components/Modals/NotificationsModal';
import { ProfileDrawer } from './components/Modals/ProfileDrawer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home-discover');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string>('discussion-1');
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>(INITIAL_DISCUSSIONS);
  const [deadlines, setDeadlines] = useState(CRITICAL_DEADLINES);
  const [profileScore, setProfileScore] = useState<number>(85);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  // Modals & Drawers
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isRoiCalcOpen, setIsRoiCalcOpen] = useState(false);
  const [isCompareMatrixOpen, setIsCompareMatrixOpen] = useState(false);
  const [selectedCompareColleges, setSelectedCompareColleges] = useState<College[]>([
    INITIAL_COLLEGES[0],
    INITIAL_COLLEGES[1]
  ]);
  const [selectedCollegeForDetails, setSelectedCollegeForDetails] = useState<College | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isMentorDrawerOpen, setIsMentorDrawerOpen] = useState(false);
  const [activeMentor, setActiveMentor] = useState<SpotlightMentor | undefined>(undefined);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    if (screen !== 'account') {
      void api().then(applyState).catch(error => showToast(error.message));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDiscussion = (id: string) => {
    setSelectedDiscussionId(id);
    setCurrentScreen('community-discussion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [collegeFilters, setCollegeFilters] = useState<{stream:string;maxTuition:number;region:string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const applyState = (data: Awaited<ReturnType<typeof api>>) => {
    setColleges(data.colleges);
    setDiscussions(data.discussions);
    setProfileScore(data.profileScore);
    setUnreadCount(data.unreadCount);
    setDeadlines(CRITICAL_DEADLINES.map(d => ({...d, hasReminder: data.reminders[d.id] ?? d.hasReminder})));
  };
  const load = async () => {
    setIsLoading(true);
    setLoadError('');
    try { applyState(await api()); }
    catch (error) { setLoadError((error as Error).message); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const persist = async (action: Record<string, unknown>, message?: string) => {
    try {
      applyState(await api(action));
      if (message) showToast(message);
      return true;
    } catch (error) { showToast((error as Error).message); return false; }
  };
  const handleToggleSaveCollege = (id: string) => { void persist({action:'save_college',id}); };
  const handleToggleCompareCollege = (college: College) => {
    setSelectedCompareColleges(prev => {
      if (prev.some(c => c.id === college.id)) return prev.filter(c => c.id !== college.id);
      if (prev.length >= 3) { showToast('Maximum 3 colleges can be compared simultaneously.'); return prev; }
      return [...prev, college];
    });
  };
  const handleToggleUpvoteDiscussion = (id: string) => { void persist({action:'vote_discussion',id}); };
  const handleToggleSaveDiscussion = (id: string) => { void persist({action:'save_discussion',id},'Bookmark updated'); };
  const handleToggleDeadlineReminder = (id: string) => { void persist({action:'reminder',id}); };
  const handleAddCapstoneProject = () => { void persist({action:'profile'},'Capstone project added! Profile score is now 100%.'); };

  const currentDiscussion =
    discussions.find((d) => d.id === selectedDiscussionId) || discussions[0];

  if (currentScreen === 'account') {
    return <LoginPage onBack={() => handleNavigate('home-discover')} />;
  }

  if (isLoading || loadError) return <div className="min-h-screen flex items-center justify-center bg-surface"><div className="p-8 text-center"><h1 className="text-2xl font-bold">Campus Web House</h1><p className="my-4">{loadError || 'Loading your campus...'}</p>{loadError && <button className="px-6 py-3 bg-primary text-white rounded-xl" onClick={() => void load()}>Retry</button>}</div></div>;
  return (
    <div className="min-h-screen bg-surface flex flex-col font-body selection:bg-primary selection:text-white">
      {/* Top Application Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Screen Body with Top & Bottom Safe-Area Insets */}
      <main className="flex-1 w-full pt-16">
        {currentScreen === 'home-discover' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
            onSelectCollege={(col) => setSelectedCollegeForDetails(col)}
            colleges={colleges}
          />
        )}

        {currentScreen === 'student-dashboard' && (
          <DashboardScreen
            onNavigate={handleNavigate}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenCompare={() => setIsCompareMatrixOpen(true)}
            onSelectCollege={(col) => setSelectedCollegeForDetails(col)}
            onOpenDiscussion={handleOpenDiscussion}
            onTriggerToast={showToast}
            colleges={colleges}
            profileScore={profileScore}
            deadlines={deadlines}
            onToggleDeadlineReminder={handleToggleDeadlineReminder}
          />
        )}

        {currentScreen === 'careers-roadmap' && (
          <CareersScreen
            onNavigate={handleNavigate}
            onOpenMentorDrawer={() => {
              setActiveMentor(undefined);
              setIsMentorDrawerOpen(true);
            }}
            onTriggerToast={showToast}
          />
        )}

        {currentScreen === 'colleges-admissions' && (
          <CollegesScreen
            colleges={colleges.filter(c => !collegeFilters || (
              c.annualFeeNumber <= collegeFilters.maxTuition &&
              (collegeFilters.region === 'All' || `${c.location} ${c.subLocation}`.toLowerCase().includes(collegeFilters.region.toLowerCase())) &&
              (collegeFilters.stream === 'All' || collegeFilters.stream.split(' / ').some(stream => c.programs.includes(stream)))
            ))}
            onSelectCollege={(col) => setSelectedCollegeForDetails(col)}
            onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
            onOpenRoiCalculator={() => setIsRoiCalcOpen(true)}
            onOpenCompareMatrix={() => setIsCompareMatrixOpen(true)}
            onToggleCompareCollege={handleToggleCompareCollege}
            selectedCompareColleges={selectedCompareColleges}
            onToggleSaveCollege={handleToggleSaveCollege}
            onTriggerToast={showToast}
          />
        )}

        {currentScreen === 'community-feed' && (
          <CommunityScreen
            discussions={discussions}
            onOpenDiscussion={handleOpenDiscussion}
            onOpenAskModal={() => setIsAskModalOpen(true)}
            onOpenMentorDrawer={(mentor) => {
              setActiveMentor(mentor);
              setIsMentorDrawerOpen(true);
            }}
            onToggleUpvoteDiscussion={handleToggleUpvoteDiscussion}
            onToggleSaveDiscussion={handleToggleSaveDiscussion}
            onTriggerToast={showToast}
          />
        )}

        {currentScreen === 'community-discussion' && (
          <DiscussionDetailScreen
            key={currentDiscussion.id}
            discussion={currentDiscussion}
            onNavigate={handleNavigate}
            onTriggerToast={showToast}
          />
        )}
      </main>

      {/* Persistent Bottom Mobile Tab Navigation */}
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Floating Global Toasts */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Modals & Dialogs */}
      <CareerAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onComplete={(track) => {
          void persist({action:'assessment',track}, `Set active roadmap: ${track}!`);
          handleNavigate('careers-roadmap');
        }}
      />

      <RoiCalculatorModal
        isOpen={isRoiCalcOpen}
        onClose={() => setIsRoiCalcOpen(false)}
      />

      <CollegeCompareModal
        isOpen={isCompareMatrixOpen}
        onClose={() => setIsCompareMatrixOpen(false)}
        selectedColleges={selectedCompareColleges}
        allColleges={colleges}
        onToggleCollege={handleToggleCompareCollege}
      />

      <CollegeDetailsModal
        college={selectedCollegeForDetails}
        onClose={() => setSelectedCollegeForDetails(null)}
        onToggleSave={(id) => handleToggleSaveCollege(id)}
        isSaved={colleges.find(c => c.id === selectedCollegeForDetails?.id)?.isSaved}
      />

      <MentorConnectDrawer
        isOpen={isMentorDrawerOpen}
        onClose={() => setIsMentorDrawerOpen(false)}
        mentor={activeMentor}
        onSentQuestion={async (q) => {
          return await persist({action:'mentor_question',question:q,mentor:activeMentor?.name || ''},'Question saved for mentor review.');
        }}
      />

      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmit={async (newDis) => {
          return await persist({action:'create_discussion',title:newDis.title,body:newDis.body,tags:newDis.tags},'Discussion published to community feed!');
        }}
      />

      <FilterCollegesDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={(f) => {
          setCollegeFilters(f);
          showToast(`Filtered colleges by ${f.stream} (Max ₹${f.maxTuition}L)`);
        }}
        onReset={() => {
          setCollegeFilters(null);
          showToast('College filters reset');
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => {
          void persist({action:'read_notifications'},'All notifications marked as read');
        }}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profileScore={profileScore}
        onAddCapstoneProject={handleAddCapstoneProject}
        savedCollegesCount={colleges.filter((c) => c.isSaved).length}
      />
    </div>
  );
}
