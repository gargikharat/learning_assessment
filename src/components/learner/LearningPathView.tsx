import React, { useState } from 'react';
import { Course } from '../../types';
import {
  Compass,
  Clock,
  Signal,
  CheckCircle2,
  BookOpen,
  Play,
  Search,
  Filter,
  Star,
  Users,
  Building2,
  Sparkles,
} from 'lucide-react';

interface LearningPathViewProps {
  courses: Course[];
  onStartCourse: (course: Course) => void;
  selectedSkillFilter?: string;
  onClearFilter?: () => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  courses,
  onStartCourse,
  selectedSkillFilter,
  onClearFilter,
}) => {
  const [sourceFilter, setSourceFilter] = useState<'All' | 'iGOT' | 'NSSTA'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSource = sourceFilter === 'All' || course.source === sourceFilter;
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skillsAddressed.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill =
      !selectedSkillFilter ||
      course.skillsAddressed.some((s) =>
        s.toLowerCase().includes(selectedSkillFilter.toLowerCase())
      );

    return matchesSource && matchesCategory && matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner and Source Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Karmayogi Pathways</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Pathways</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            AI-curated curriculum bridging your specific official statistical gaps, mapped to iGOT Mission Karmayogi and NSSTA National Academy accredited modules.
          </p>
        </div>

        {/* Source Filter Switch */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs shrink-0 self-start md:self-auto">
          <button
            onClick={() => setSourceFilter('All')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              sourceFilter === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setSourceFilter('iGOT')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              sourceFilter === 'iGOT'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            iGOT Karmayogi
          </button>
          <button
            onClick={() => setSourceFilter('NSSTA')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              sourceFilter === 'NSSTA'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NSSTA Academy
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, skills, Python, SDG, CPI, sampling..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {['All', 'Technical', 'Statistical', 'Governance'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Skill Filter Banner (if routed from Skill Gaps table) */}
      {selectedSkillFilter && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Showing courses addressing diagnosed gap:{' '}
              <span className="font-bold underline">{selectedSkillFilter}</span>
            </span>
          </div>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isIgOt = course.source === 'iGOT';

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-all group"
            >
              {/* Card Header & Backdrop */}
              <div
                className={`p-6 text-white relative ${
                  isIgOt
                    ? 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-900'
                    : 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
                      isIgOt
                        ? 'bg-orange-500 text-white border border-orange-400'
                        : 'bg-blue-600 text-white border border-blue-400'
                    }`}
                  >
                    {course.source} Karmayogi
                  </span>
                  <span className="text-[11px] font-semibold text-white/80 bg-black/20 px-2 py-0.5 rounded-full">
                    {course.category}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold leading-snug text-white group-hover:text-blue-200 transition-colors line-clamp-2">
                  {course.title}
                </h2>

                <div className="mt-4 flex items-center justify-between text-xs text-white/80">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Signal className="w-3.5 h-3.5" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* Skills Addressed */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                    Skills Addressed:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.skillsAddressed.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress (if enrolled) */}
                {course.isEnrolled && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700">Enrolled Progress</span>
                      <span className="font-bold text-blue-600">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Impact Badge */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400">Target Outcome:</span>
                    <div className="font-bold text-blue-700 text-xs">{course.impact}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedCourseForSyllabus(course)}
                      className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      title="View full module syllabus"
                    >
                      Syllabus
                    </button>
                    <button
                      onClick={() => onStartCourse(course)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{course.isEnrolled ? 'Continue' : 'Start'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching training modules found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your search query or selecting "All Sources" to explore the full MoSPI capacity repository.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSourceFilter('All');
              setCategoryFilter('All');
              if (onClearFilter) onClearFilter();
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Syllabus Modal */}
      {selectedCourseForSyllabus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded uppercase">
                  {selectedCourseForSyllabus.source} Official Syllabus
                </span>
                <h3 className="text-lg font-bold mt-1 text-white">
                  {selectedCourseForSyllabus.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  Duration: {selectedCourseForSyllabus.duration} · {selectedCourseForSyllabus.modulesCount} Modules
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseForSyllabus(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedCourseForSyllabus.description}
              </div>

              <div className="space-y-3 pt-2">
                {selectedCourseForSyllabus.syllabus.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{mod.title}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{mod.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {mod.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Accredited by National Statistical Systems Training Academy
              </span>
              <button
                onClick={() => {
                  const c = selectedCourseForSyllabus;
                  setSelectedCourseForSyllabus(null);
                  onStartCourse(c);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Launch Course Modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
