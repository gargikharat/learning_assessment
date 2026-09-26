import React, { useState } from 'react';
import { UserProfile, SkillItem, Course } from '../../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  Clock,
  Play,
  Bell,
  Check,
} from 'lucide-react';

interface LearnerDashboardProps {
  user: UserProfile;
  skills: SkillItem[];
  courses: Course[];
  onNavigate: (view: string) => void;
  onStartCourse: (course: Course) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  user,
  skills,
  courses,
  onNavigate,
  onStartCourse,
}) => {
  const [scheduleJoined, setScheduleJoined] = useState(false);
  const [scheduleReminded, setScheduleReminded] = useState(false);

  const activeCourse = courses.find((c) => c.isEnrolled) || courses[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-blue-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>AI Capacity Building Engine · MoSPI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Your skill gap in <span className="font-bold underline decoration-blue-300">Python for Statistics</span> has reduced by <span className="font-bold text-white">25%</span> since last week. You are on track for the upcoming ISS Assistant Director cadre promotion review.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('learning-path')}
              className="bg-white text-blue-800 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-blue-50 transition-colors shadow-xs flex items-center space-x-2 cursor-pointer"
            >
              <span>Resume Learning Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('skill-gaps')}
              className="bg-blue-600/40 hover:bg-blue-600/60 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-blue-400/30 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Review Skill Gaps</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark / Emblem Representation */}
        <div className="absolute right-4 bottom-2 sm:right-10 sm:top-1/2 sm:-translate-y-1/2 opacity-10 pointer-events-none select-none">
          <Award className="w-48 h-48 sm:w-64 sm:h-64 text-white" />
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Overall Competency
          </div>
          <div className="text-3xl font-extrabold text-blue-600 tabular-nums">
            {user.overallProgress}%
          </div>
          <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${user.overallProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Role Requirement: 80%</span>
            <span className="text-blue-600 font-semibold">8% to target</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Skills Improved
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tabular-nums">
            {user.skillsImprovedCount}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-3 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>+1 New: Python Basics upgraded</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Validated via iGOT assessments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Courses Completed
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 tabular-nums">
            {user.completedCoursesCount}
          </div>
          <div className="text-xs text-indigo-600 font-semibold mt-3 truncate">
            Latest: Microdata Privacy & DPDP
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Certified by NSSTA Academy</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Quiz Avg. Score
          </div>
          <div className="text-3xl font-extrabold text-amber-600 tabular-nums">
            {user.averageQuizScore}%
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-3">
            Across 8 evaluated assessments
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Passing standard: 70%</div>
        </div>
      </div>

      {/* Grid: Skill Snapshot + Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Current Skill Snapshot */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Skill Snapshot</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Validated against Subordinate Statistical Service competency standards
              </p>
            </div>
            <button
              onClick={() => onNavigate('my-skills')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Full Matrix →
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {skills.map((skill) => {
              const levelColor =
                skill.level === 'Advanced'
                  ? 'bg-blue-600'
                  : skill.level === 'Intermediate'
                  ? 'bg-blue-400'
                  : 'bg-amber-400';

              return (
                <div key={skill.id} className="group">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {skill.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500">{skill.category}</span>
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          skill.level === 'Advanced'
                            ? 'bg-blue-50 text-blue-700'
                            : skill.level === 'Intermediate'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {skill.level} ({skill.proficiencyScore}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${levelColor}`}
                      style={{ width: `${skill.proficiencyScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Last evaluated: September 21, 2026</span>
            <button
              onClick={() => onNavigate('skill-gaps')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Analyze Gap Differential
            </button>
          </div>
        </div>

        {/* Right: Upcoming Schedule & Actionable Milestones */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Official Schedule</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                NSSTA Academy webinars and mandatory cadre assessments
              </p>
            </div>
            <span className="text-xs text-slate-400">MoSPI Calendar</span>
          </div>

          <div className="space-y-4 flex-1">
            {/* Event 1: NSSTA Webinar */}
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-orange-50/70 border border-orange-100">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex flex-col items-center justify-center text-white font-bold shrink-0 shadow-xs">
                <span className="text-base leading-none">28</span>
                <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5">Sep</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">NSSTA National Webinar</span>
                  <span className="text-[10px] bg-orange-200/70 text-orange-800 font-semibold px-1.5 py-0.2 rounded">
                    Live
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-medium truncate">
                  Official Statistics in the Digital Era & Satellite AI
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-3">
                  <span>10:30 AM - 12:00 PM IST</span>
                  <span>·</span>
                  <span>Dr. P. Srivastava, DDG</span>
                </div>
              </div>
              <button
                onClick={() => setScheduleJoined(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                  scheduleJoined
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {scheduleJoined ? 'Registered ✓' : 'Register'}
              </button>
            </div>

            {/* Event 2: Quiz Deadline */}
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-700 font-bold shrink-0">
                <span className="text-base leading-none">30</span>
                <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5">Sep</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">Quarterly Assessment Deadline</span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.2 rounded">
                    Mandatory
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-medium truncate">
                  SDG National Indicator Framework (NIF) Competency Quiz
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Duration: 8 mins · Passing standard: 75%
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onNavigate('quizzes')}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Start Quiz
                </button>
              </div>
            </div>

            {/* Event 3: Annual Cadre Review */}
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-700 font-bold shrink-0">
                <span className="text-base leading-none">12</span>
                <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5">Oct</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900">
                  Annual Departmental Review (APAR)
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-medium truncate">
                  Assessment of training hours logged on iGOT Karmayogi
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Required: 40 hrs annually · Logged: 34 hrs (85%)
                </div>
              </div>
              <button
                onClick={() => setScheduleReminded(true)}
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-colors cursor-pointer"
              >
                {scheduleReminded ? 'Set ✓' : 'Remind'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Course Card: Continue where you left off */}
      {activeCourse && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-xs text-blue-300 font-semibold">
              <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded border border-blue-400/30">
                {activeCourse.source} Karmayogi
              </span>
              <span>·</span>
              <span>Continue Learning</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {activeCourse.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2">
              {activeCourse.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeCourse.duration}</span>
              </span>
              <span>·</span>
              <span>Impact: {activeCourse.impact}</span>
            </div>
          </div>

          <div className="w-full md:w-64 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 shrink-0">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Syllabus Progress</span>
              <span className="font-bold text-blue-400">{activeCourse.progressPercent || 60}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${activeCourse.progressPercent || 60}%` }}
              />
            </div>
            <button
              onClick={() => onStartCourse(activeCourse)}
              className="mt-4 w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Module 4</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
