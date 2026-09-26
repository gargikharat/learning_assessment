/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole, UserProfile, Course, Assessment } from './types';
import {
  initialSkills,
  initialSkillGaps,
  organizationMetrics,
  traineeRecords as defaultTrainees,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/auth/AuthPage';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { SkillGapsView } from './components/learner/SkillGapsView';
import { LearningPathView } from './components/learner/LearningPathView';
import { AssessmentsView } from './components/learner/AssessmentsView';
import { MySkillsView } from './components/learner/MySkillsView';
import { ProfileView } from './components/learner/ProfileView';
import { CourseStudyModal } from './components/learner/CourseStudyModal';
import { CertificateModal } from './components/CertificateModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QuizGeneratorView } from './components/admin/QuizGeneratorView';
import { TraineeRosterView } from './components/admin/TraineeRosterView';
import { ExportReportModal } from './components/admin/ExportReportModal';

import {
  seedInitialDataIfEmpty,
  fetchCourses,
  fetchAssessments,
  saveAssessmentToFirestore,
  saveUserAssessmentResult,
  fetchUserNotifications,
  addNotification,
  markNotificationAsRead,
  fetchAllRegisteredLearners,
} from './services/dbService';

import { Building2, ShieldAlert } from 'lucide-react';

function MainApp() {
  const { currentUser, userProfile, role, loading, logout, updateUserProfileData } = useAuth();

  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Application Data States (synced with Firestore)
  const [skills, setSkills] = useState(initialSkills);
  const [skillGaps, setSkillGaps] = useState(initialSkillGaps);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [trainees, setTrainees] = useState(defaultTrainees);

  // Filter routing state
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | undefined>(undefined);
  const [isRecalculatingGaps, setIsRecalculatingGaps] = useState(false);

  // Modals
  const [activeCourseForStudy, setActiveCourseForStudy] = useState<Course | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<{
    title: string;
    score: number;
    date: string;
    skill: string;
  } | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);

  // Initial Data Fetch & Firestore Seed
  useEffect(() => {
    async function initData() {
      if (!currentUser) return;

      try {
        await seedInitialDataIfEmpty();
        const loadedCourses = await fetchCourses();
        setCourses(loadedCourses);
        const loadedAssessments = await fetchAssessments();
        setAssessments(loadedAssessments);

        const notifs = await fetchUserNotifications(currentUser.uid);
        setNotifications(notifs);

        if (role === 'admin') {
          const learnerList = await fetchAllRegisteredLearners();
          setTrainees(learnerList);
        }
      } catch (err) {
        console.error('Error during data initialization:', err);
      }
    }
    initData();
  }, [currentUser, role]);

  // Set initial landing view based on user role upon login
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin' && currentView === 'dashboard') {
        setCurrentView('admin-dashboard');
      } else if (
        userProfile.role === 'learner' &&
        ['admin-dashboard', 'quiz-generator', 'trainees'].includes(currentView)
      ) {
        setCurrentView('dashboard');
      }
    }
  }, [userProfile?.role, currentView]);

  // If loading Firebase Auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl animate-pulse">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div className="text-center space-y-1">
          <div className="text-lg font-bold">SkillSet AI · MoSPI</div>
          <div className="text-xs text-blue-300">Connecting to Firebase Authentication & Cloud Firestore...</div>
        </div>
        <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-2/3 animate-ping" />
        </div>
      </div>
    );
  }

  // If not authenticated, display the full professional Login & Auth Page
  if (!currentUser || !userProfile) {
    return <AuthPage />;
  }

  // Switch demonstration perspective (Admins can toggle to inspect Learner mode)
  const handleSwitchRole = () => {
    if (role === 'admin') {
      setCurrentView((prev) => (prev.startsWith('admin') || prev === 'trainees' ? 'dashboard' : 'admin-dashboard'));
    } else {
      // Learner cannot escalate role to admin
      alert('Your account is registered as a Civil Servant / Learner. Administrative access requires NSSTA Director credentials.');
    }
  };

  // Safe navigation with Role-Based Access Control (RBAC)
  const handleNavigate = (view: string) => {
    const adminOnlyViews = ['admin-dashboard', 'quiz-generator', 'trainees'];
    if (adminOnlyViews.includes(view) && role !== 'admin') {
      alert('Access Denied: You do not possess Administrative privileges for this view.');
      setCurrentView('dashboard');
      return;
    }
    setCurrentView(view);
  };

  // Closed-Loop Assessment completion: persistent in Firestore
  const handleCompleteQuiz = async (assessmentId: string, score: number, targetSkill: string) => {
    const passed = score >= 70;
    const completedDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // 1. Mark assessment completed locally
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              status: 'Completed',
              lastScore: score,
              completedAt: completedDate,
            }
          : a
      )
    );

    // 2. Persist in Firestore
    if (currentUser) {
      await saveUserAssessmentResult(currentUser.uid, {
        id: `res-${Date.now()}`,
        userId: currentUser.uid,
        assessmentId,
        assessmentTitle: assessments.find((a) => a.id === assessmentId)?.title || targetSkill,
        targetSkill,
        score,
        passed,
        completedAt: new Date().toISOString(),
      });
    }

    if (passed) {
      // 3. Upgrade skill in ledger
      setSkills((prev) =>
        prev.map((s) => {
          if (
            s.name.toLowerCase().includes(targetSkill.toLowerCase()) ||
            targetSkill.toLowerCase().includes(s.name.toLowerCase())
          ) {
            const upgradedProficiency = Math.min(s.proficiencyScore + 25, 95);
            return {
              ...s,
              proficiencyScore: upgradedProficiency,
              level: upgradedProficiency >= 75 ? 'Intermediate' : 'Beginner',
              lastAssessed: 'Today (Verified)',
              trend: 'up',
            };
          }
          return s;
        })
      );

      // 4. Shrink the diagnosed skill gap
      setSkillGaps((prev) =>
        prev.map((g) => {
          if (
            g.name.toLowerCase().includes(targetSkill.toLowerCase()) ||
            targetSkill.toLowerCase().includes(g.name.toLowerCase())
          ) {
            const newGapPercent = Math.max(g.gapPercent - 50, 15);
            return {
              ...g,
              current: 'Intermediate',
              currentScore: Math.min(g.currentScore + 30, 85),
              gapPercent: newGapPercent,
              gapLevel: newGapPercent < 30 ? 'Low' : 'Medium',
            };
          }
          return g;
        })
      );

      // 5. Update user profile stats in Firestore
      const newProgress = Math.min(userProfile.overallProgress + 4, 98);
      const newImproved = userProfile.skillsImprovedCount + 1;
      const newAvg = Math.round((userProfile.averageQuizScore + score) / 2);

      await updateUserProfileData({
        overallProgress: newProgress,
        skillsImprovedCount: newImproved,
        averageQuizScore: newAvg,
      });

      // 6. Push notification in Firestore
      const newNotif = {
        id: `notif-${Date.now()}`,
        userId: currentUser.uid,
        title: 'Competency Profile Synchronized!',
        message: `Your score of ${score}% in ${targetSkill} upgraded your profile and reduced your diagnosed skill gap.`,
        time: 'Just now',
        type: 'achievement' as const,
        read: false,
      };

      await addNotification(currentUser.uid, newNotif);
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Admin AI Quiz Generator: save to Firestore and notify learners
  const handlePublishQuiz = async (newAssessment: Assessment) => {
    // 1. Save to Firestore assessments catalog
    await saveAssessmentToFirestore(newAssessment);
    setAssessments((prev) => [newAssessment, ...prev]);

    // 2. Add notification for current user and learners
    if (currentUser) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        userId: currentUser.uid,
        title: 'New Official Assessment Published',
        message: `NSSTA Academy has published "${newAssessment.title}". Available immediately for cadre evaluation.`,
        time: 'Just now',
        type: 'quiz' as const,
        read: false,
      };
      await addNotification(currentUser.uid, newNotif);
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Recalculate AI Gaps
  const handleRecalculateGaps = async () => {
    setIsRecalculatingGaps(true);
    try {
      const res = await fetch('/api/analyze-skill-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: userProfile.designation,
          currentSkills: skills,
        }),
      });
      await res.json();
    } catch {
      // Graceful local handling
    } finally {
      setIsRecalculatingGaps(false);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    if (currentUser) {
      for (const n of notifications) {
        if (!n.read) {
          await markNotificationAsRead(currentUser.uid, n.id);
        }
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      <div className="flex-1 flex min-h-screen w-full">
        {/* Persistent Sidebar */}
        <Sidebar
          role={role}
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={logout}
          onSwitchRole={handleSwitchRole}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navigation Bar */}
          <Header
            user={userProfile}
            notifications={notifications}
            onSwitchRole={handleSwitchRole}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            activeView={currentView}
            onNavigate={handleNavigate}
            onLogout={logout}
          />

          {/* View Router with Role Protection */}
          <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto flex-1">
            {/* Common Profile View */}
            {currentView === 'profile' && <ProfileView />}

            {/* Learner Views */}
            {currentView === 'dashboard' && (
              <LearnerDashboard
                user={userProfile}
                skills={skills}
                courses={courses}
                onNavigate={handleNavigate}
                onStartCourse={(c) => setActiveCourseForStudy(c)}
              />
            )}

            {currentView === 'skill-gaps' && (
              <SkillGapsView
                skillGaps={skillGaps}
                onNavigate={handleNavigate}
                onFilterCoursesBySkill={(skill) => setSelectedSkillFilter(skill)}
                onRecalculateGaps={handleRecalculateGaps}
                isRecalculating={isRecalculatingGaps}
              />
            )}

            {currentView === 'learning-path' && (
              <LearningPathView
                courses={courses}
                onStartCourse={(c) => setActiveCourseForStudy(c)}
                selectedSkillFilter={selectedSkillFilter}
                onClearFilter={() => setSelectedSkillFilter(undefined)}
              />
            )}

            {currentView === 'quizzes' && (
              <AssessmentsView
                assessments={assessments}
                onCompleteQuiz={handleCompleteQuiz}
                onViewCertificate={(cert) => setActiveCertificate(cert)}
              />
            )}

            {currentView === 'my-skills' && (
              <MySkillsView
                user={userProfile}
                skills={skills}
                onNavigate={handleNavigate}
                onViewCertificate={(cert) => setActiveCertificate(cert)}
              />
            )}

            {/* Admin Protected Views */}
            {currentView === 'admin-dashboard' && (
              role === 'admin' ? (
                <AdminDashboard
                  departmentMetrics={organizationMetrics}
                  trainees={trainees}
                  onNavigate={handleNavigate}
                  onExportReport={() => setIsExportReportOpen(true)}
                />
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Administrative Clearance Required</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    This section is restricted to authorized Training Administrators at NSSTA.
                  </p>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Return to Learner Dashboard
                  </button>
                </div>
              )
            )}

            {currentView === 'quiz-generator' && (
              role === 'admin' ? (
                <QuizGeneratorView
                  onPublishQuiz={handlePublishQuiz}
                  onNavigate={handleNavigate}
                />
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Administrative Clearance Required</h3>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Return to Learner Dashboard
                  </button>
                </div>
              )
            )}

            {currentView === 'trainees' && (
              role === 'admin' ? (
                <TraineeRosterView trainees={trainees} />
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Administrative Clearance Required</h3>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Return to Learner Dashboard
                  </button>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Interactive Course Study Modal */}
      {activeCourseForStudy && (
        <CourseStudyModal
          course={activeCourseForStudy}
          onClose={() => setActiveCourseForStudy(null)}
          onLaunchAssessment={(skill) => {
            setActiveCourseForStudy(null);
            setCurrentView('quizzes');
          }}
        />
      )}

      {/* Official Government Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(activeCertificate)}
        onClose={() => setActiveCertificate(null)}
        user={userProfile}
        certInfo={activeCertificate}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

      {/* Export Report Modal (Admin) */}
      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        departmentMetrics={organizationMetrics}
        trainees={trainees}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
