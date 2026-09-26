import React, { useState } from 'react';
import { Assessment, QuizQuestion } from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface AssessmentsViewProps {
  assessments: Assessment[];
  onCompleteQuiz: (assessmentId: string, score: number, targetSkill: string) => void;
  onViewCertificate: (certInfo: {
    title: string;
    score: number;
    date: string;
    skill: string;
  }) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  assessments,
  onCompleteQuiz,
  onViewCertificate,
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const startQuiz = (assessment: Assessment) => {
    setActiveQuiz(assessment);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScore(0);
    setShowExplanation({});
  };

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: option,
    });
  };

  const calculateResults = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizScore(scorePercent);
    setIsSubmitted(true);

    // Trigger Closed-Loop state update
    onCompleteQuiz(activeQuiz.id, scorePercent, activeQuiz.targetSkill);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Active Quiz Player Modal / View */}
      {activeQuiz ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto animate-in zoom-in-95 duration-200">
          {/* Quiz Header */}
          <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-blue-300 font-semibold mb-1">
                <span className="bg-blue-600/30 px-2 py-0.5 rounded border border-blue-400/30 uppercase">
                  {activeQuiz.category} Assessment
                </span>
                <span>·</span>
                <span>Target Skill: {activeQuiz.targetSkill}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{activeQuiz.title}</h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {activeQuiz.sourceManual || 'Official MoSPI / NSSTA Question Bank'}
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto">
              {!isSubmitted && (
                <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-mono text-blue-300 border border-slate-700 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time Allocated: {activeQuiz.durationMinutes}m</span>
                </div>
              )}
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {!isSubmitted ? (
            /* Active Question State */
            <div className="p-6 sm:p-8 space-y-6">
              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>
                    Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                  </span>
                  <span>
                    {Math.round(((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100)}%
                    Answered
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Stem */}
              {activeQuiz.questions[currentQuestionIdx] && (
                <div className="space-y-5 pt-2">
                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {activeQuiz.questions[currentQuestionIdx].question}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {activeQuiz.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIdx] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/70 border-blue-600 text-blue-950 font-medium shadow-xs ring-1 ring-blue-600'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold rounded-lg text-slate-700 cursor-pointer"
                >
                  Previous
                </button>

                {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={calculateResults}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Official Assessment</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen & Closed-Loop Confirmation */
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-3 py-4">
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg ${
                    quizScore >= activeQuiz.passingScorePercent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {quizScore >= activeQuiz.passingScorePercent ? (
                    <Award className="w-9 h-9" />
                  ) : (
                    <AlertCircle className="w-9 h-9" />
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {quizScore >= activeQuiz.passingScorePercent
                    ? 'Assessment Successfully Passed!'
                    : 'Assessment Complete - Review Recommended'}
                </h3>

                <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  <span
                    className={
                      quizScore >= activeQuiz.passingScorePercent
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }
                  >
                    {quizScore}%
                  </span>
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    (Passing Standard: {activeQuiz.passingScorePercent}%)
                  </span>
                </div>

                {/* Closed-Loop Notification Alert */}
                {quizScore >= activeQuiz.passingScorePercent && (
                  <div className="max-w-xl mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-left space-y-1">
                    <div className="flex items-center space-x-2 font-bold text-emerald-800">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Closed-Loop Competency Engine Activated!</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      Your score has been synchronized with the MoSPI Human Resource Management System (HRMS). Your skill proficiency for{' '}
                      <span className="font-bold underline">{activeQuiz.targetSkill}</span> has been upgraded, and your skill gap has shrunk accordingly!
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {quizScore >= activeQuiz.passingScorePercent && (
                  <button
                    onClick={() =>
                      onViewCertificate({
                        title: activeQuiz.title,
                        score: quizScore,
                        date: new Date().toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }),
                        skill: activeQuiz.targetSkill,
                      })
                    }
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    <span>View MoSPI Certificate of Competency</span>
                  </button>
                )}

                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>

                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Back to All Assessments
                </button>
              </div>

              {/* Detailed Question Review */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-900">Official Question & Answer Review</h4>
                <div className="space-y-4">
                  {activeQuiz.questions.map((q, qIdx) => {
                    const isUserCorrect = selectedAnswers[qIdx] === q.answer;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs space-y-3 ${
                          isUserCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-red-50/50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-slate-900">
                            {qIdx + 1}. {q.question}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isUserCorrect
                                ? 'bg-emerald-200 text-emerald-800'
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {isUserCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                          </span>
                        </div>

                        <div className="text-slate-600 space-y-1">
                          <div>
                            <span className="font-semibold text-slate-500">Your Answer: </span>
                            <span className={isUserCorrect ? 'text-emerald-800 font-medium' : 'text-red-700 font-medium'}>
                              {selectedAnswers[qIdx] || 'No answer selected'}
                            </span>
                          </div>
                          {!isUserCorrect && (
                            <div>
                              <span className="font-semibold text-emerald-700">Correct Official Answer: </span>
                              <span className="text-emerald-900 font-bold">{q.answer}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 bg-white/70 p-3 rounded-lg">
                          <span className="font-bold text-slate-800">MoSPI Official Rationale: </span>
                          <span>{q.explanation}</span>
                          {q.referenceSource && (
                            <div className="mt-1 text-[10px] text-slate-400 font-mono">
                              Ref: {q.referenceSource}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Assessments List View */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>MoSPI Cadre Evaluation</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Official Assessments & Certifications</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Objective evaluations grounded in official training handbooks. Successful completion automatically triggers real-time competency matrix updates and reduces your diagnosed skill gaps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((asmt) => {
              const isDone = asmt.status === 'Completed';

              return (
                <div
                  key={asmt.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                        {asmt.category}
                      </span>
                      {isDone ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Passed ({asmt.lastScore}%)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          {asmt.questions.length} Questions
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {asmt.title}
                    </h2>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-700">Target Skill:</span>
                        <span className="text-blue-700 font-medium">{asmt.targetSkill}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-700">Difficulty:</span>
                        <span>{asmt.difficulty}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Source: {asmt.sourceManual || 'MoSPI Guidelines'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Standard: <span className="font-bold text-slate-700">{asmt.passingScorePercent}%</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isDone && (
                        <button
                          onClick={() =>
                            onViewCertificate({
                              title: asmt.title,
                              score: asmt.lastScore || 90,
                              date: asmt.completedAt || 'Sep 14, 2026',
                              skill: asmt.targetSkill,
                            })
                          }
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
                          title="View Certificate"
                        >
                          <Award className="w-3.5 h-3.5 text-blue-600" />
                          <span>Certificate</span>
                        </button>
                      )}

                      <button
                        onClick={() => startQuiz(asmt)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center space-x-1"
                      >
                        <span>{isDone ? 'Retake' : 'Start'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
