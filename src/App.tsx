/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile, Course, Assessment } from './types';
import {
  initialLearnerProfile,
  adminProfile,
  initialSkills,
  initialSkillGaps,
  initialCourses,
  initialAssessments,
  organizationMetrics,
  traineeRecords,
  initialNotifications,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { SkillGapsView } from './components/learner/SkillGapsView';
import { LearningPathView } from './components/learner/LearningPathView';
import { AssessmentsView } from './components/learner/AssessmentsView';
import { MySkillsView } from './components/learner/MySkillsView';
import { CourseStudyModal } from './components/learner/CourseStudyModal';
import { CertificateModal } from './components/CertificateModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QuizGeneratorView } from './components/admin/QuizGeneratorView';
import { TraineeRosterView } from './components/admin/TraineeRosterView';
import { ExportReportModal } from './components/admin/ExportReportModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [role, setRole] = useState<UserRole>('learner');
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Profiles & Core State
  const [learnerProfile, setLearnerProfile] = useState<UserProfile>(initialLearnerProfile);
  const [skills, setSkills] = useState(initialSkills);
  const [skillGaps, setSkillGaps] = useState(initialSkillGaps);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [notifications, setNotifications] = useState(initialNotifications);

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

  const currentUser = role === 'learner' ? learnerProfile : adminProfile;

  // Switch role handler (Learner <-> Admin)
  const handleSwitchRole = () => {
    if (role === 'learner') {
      setRole('admin');
      setCurrentView('admin-dashboard');
    } else {
      setRole('learner');
      setCurrentView('dashboard');
    }
  };

  // Login handler from modal
  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    setCurrentView(selectedRole === 'learner' ? 'dashboard' : 'admin-dashboard');
  };

  // Closed-Loop: Complete Quiz & Update Skill Profile
  const handleCompleteQuiz = (assessmentId: string, score: number, targetSkill: string) => {
    // 1. Mark assessment as completed
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              status: 'Completed',
              lastScore: score,
              completedAt: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            }
          : a
      )
    );

    if (score >= 70) {
      // 2. Upgrade the skill in learner's skill ledger
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

      // 3. Shrink the Skill Gap! (The core closed-loop showcase)
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

      // 4. Update overall learner profile stats
      setLearnerProfile((prev) => ({
        ...prev,
        overallProgress: Math.min(prev.overallProgress + 4, 98),
        skillsImprovedCount: prev.skillsImprovedCount + 1,
        averageQuizScore: Math.round((prev.averageQuizScore + score) / 2),
      }));

      // 5. Add notification
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: 'Competency Profile Synchronized!',
        message: `Your score of ${score}% in ${targetSkill} upgraded your profile and reduced your diagnosed skill gap.`,
        time: 'Just now',
        type: 'achievement' as const,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Admin AI Quiz Generator: Publish to Learners
  const handlePublishQuiz = (newAssessment: Assessment) => {
    setAssessments((prev) => [newAssessment, ...prev]);

    // Push notification to learners
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'New Official Assessment Published',
      message: `NSSTA Academy has published "${newAssessment.title}". Complete this to fulfill your quarterly requirement.`,
      time: 'Just now',
      type: 'quiz' as const,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Recalculate AI Gaps
  const handleRecalculateGaps = async () => {
    setIsRecalculatingGaps(true);
    try {
      const res = await fetch('/api/analyze-skill-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: 'Statistical Officer Grade II',
          currentSkills: skills,
        }),
      });
      await res.json();
    } catch {
      // Graceful fallback
    } finally {
      setIsRecalculatingGaps(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Login / Role Selection Modal */}
      <LoginModal
        isOpen={!isLoggedIn}
        onSelectRole={handleSelectRole}
      />

      {/* Main Application Layout */}
      {isLoggedIn && (
        <div className="flex-1 flex min-h-screen w-full">
          {/* Sidebar */}
          <Sidebar
            role={role}
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onLogout={() => setIsLoggedIn(false)}
            onSwitchRole={handleSwitchRole}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Top Navigation Bar */}
            <Header
              user={currentUser}
              notifications={notifications}
              onSwitchRole={handleSwitchRole}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              activeView={currentView}
            />

            {/* View Router */}
            <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto flex-1">
              {role === 'learner' ? (
                <>
                  {currentView === 'dashboard' && (
                    <LearnerDashboard
                      user={learnerProfile}
                      skills={skills}
                      courses={courses}
                      onNavigate={(v) => setCurrentView(v)}
                      onStartCourse={(c) => setActiveCourseForStudy(c)}
                    />
                  )}

                  {currentView === 'skill-gaps' && (
                    <SkillGapsView
                      skillGaps={skillGaps}
                      onNavigate={(v) => setCurrentView(v)}
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
                      user={learnerProfile}
                      skills={skills}
                      onNavigate={(v) => setCurrentView(v)}
                      onViewCertificate={(cert) => setActiveCertificate(cert)}
                    />
                  )}
                </>
              ) : (
                <>
                  {currentView === 'admin-dashboard' && (
                    <AdminDashboard
                      departmentMetrics={organizationMetrics}
                      trainees={traineeRecords}
                      onNavigate={(v) => setCurrentView(v)}
                      onExportReport={() => setIsExportReportOpen(true)}
                    />
                  )}

                  {currentView === 'quiz-generator' && (
                    <QuizGeneratorView
                      onPublishQuiz={handlePublishQuiz}
                      onNavigate={(v) => setCurrentView(v)}
                    />
                  )}

                  {currentView === 'trainees' && (
                    <TraineeRosterView trainees={traineeRecords} />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      )}

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
        user={learnerProfile}
        certInfo={activeCertificate}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      {/* Export Report Modal (Admin) */}
      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        departmentMetrics={organizationMetrics}
        trainees={traineeRecords}
      />
    </div>
  );
}
