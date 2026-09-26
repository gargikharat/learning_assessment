import React, { useState } from 'react';
import { Assessment, QuizQuestion, SkillCategory, SkillLevel } from '../../types';
import { samplePreloadedManuals } from '../../data/mockData';
import {
  Wand2,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  Eye,
  Edit3,
  BookOpen,
  FileCheck,
  Check,
} from 'lucide-react';

interface QuizGeneratorViewProps {
  onPublishQuiz: (newAssessment: Assessment) => void;
  onNavigate: (view: string) => void;
}

export const QuizGeneratorView: React.FC<QuizGeneratorViewProps> = ({
  onPublishQuiz,
  onNavigate,
}) => {
  const [selectedManualId, setSelectedManualId] = useState<string>('man-1');
  const [customManualText, setCustomManualText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [targetSkill, setTargetSkill] = useState<string>('SDG National Indicator Framework');
  const [difficulty, setDifficulty] = useState<SkillLevel>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [category, setCategory] = useState<SkillCategory>('Statistical');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);
  const [assessmentTitle, setAssessmentTitle] = useState<string>('');
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  const activePreloadedManual = samplePreloadedManuals.find((m) => m.id === selectedManualId);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setCustomManualText(
        `[Extracted content from ${file.name}]\nOfficial statistical procedure on sample validation, survey response harmonization, and quality metrics compliance with MoSPI standards.`
      );
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setPublishSuccessMsg(null);

    const sourceText = uploadedFileName
      ? customManualText
      : activePreloadedManual?.content || '';

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetSkill,
          category,
          difficulty,
          questionCount,
          sourceContent: sourceText,
        }),
      });

      const data = await response.json();
      if (data.success && data.questions) {
        setGeneratedQuestions(data.questions);
        setAssessmentTitle(`${targetSkill} Competency Assessment (AI Generated)`);
      }
    } catch (err) {
      console.error('Failed to generate quiz via server, using local fallback:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    if (generatedQuestions.length === 0) return;

    const newAssessment: Assessment = {
      id: `asmt-gen-${Date.now()}`,
      title: assessmentTitle || `${targetSkill} Competency Assessment`,
      targetSkill,
      category,
      difficulty,
      questions: generatedQuestions,
      durationMinutes: questionCount * 3,
      passingScorePercent: 70,
      sourceManual: uploadedFileName || activePreloadedManual?.title || 'MoSPI Guidelines',
      createdBy: 'AI Generator',
      status: 'Available',
    };

    onPublishQuiz(newAssessment);
    setPublishSuccessMsg(
      `Assessment "${newAssessment.title}" published successfully! It is now live in the Learner Portal for all eligible officers.`
    );

    setTimeout(() => {
      setPublishSuccessMsg(null);
    }, 6000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Generative AI Assessment Pipeline</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI-Powered Official Quiz Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Ground questions in official MoSPI training manuals, NSSO handbooks, or circulars. Generates standardized psychometric MCQs with authoritative explanations.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                Context-Grounded Assessment Creation
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Upload official departmental documentation or select pre-loaded MoSPI manuals
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Document Selection: Preloaded vs Custom */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Training Material Source
            </div>

            {/* Preloaded Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {samplePreloadedManuals.map((man) => {
                const isSelected = selectedManualId === man.id && !uploadedFileName;
                return (
                  <button
                    key={man.id}
                    onClick={() => {
                      setSelectedManualId(man.id);
                      setUploadedFileName(null);
                      if (man.id === 'man-1') {
                        setTargetSkill('SDG National Indicator Framework');
                        setCategory('Statistical');
                      } else if (man.id === 'man-2') {
                        setTargetSkill('Official Price Statistics & CPI');
                        setCategory('Statistical');
                      } else {
                        setTargetSkill('Python for Data Analysis');
                        setCategory('Technical');
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="truncate">{man.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {man.summary}
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      Size: {man.fileSize}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="pt-2">
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-6 text-center transition-colors cursor-pointer group bg-slate-50/50">
                <input
                  type="file"
                  id="docUpload"
                  accept=".pdf,.ppt,.pptx,.docx,.txt"
                  className="hidden"
                  onChange={handleSimulatedUpload}
                />
                <label htmlFor="docUpload" className="cursor-pointer block space-y-2">
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 mx-auto transition-colors" />
                  <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                    {uploadedFileName ? (
                      <span className="text-emerald-700 flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Uploaded: {uploadedFileName}</span>
                      </span>
                    ) : (
                      'Or upload new departmental PDF / Presentation / Handbook'
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports official PDF, PPTX, DOCX guidelines up to 25 MB
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Assessment Parameters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Skill
                </label>
                <input
                  type="text"
                  value={targetSkill}
                  onChange={(e) => setTargetSkill(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cadre Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as SkillLevel)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (JSO Induction)</option>
                  <option value="Intermediate">Intermediate (Statistical Officer Gr. II)</option>
                  <option value="Advanced">Advanced (Assistant Director / ISS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Count
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={3}>3 Questions (Micro-Quiz)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={8}>8 Questions (Comprehensive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating
                ? 'AI Reading Material & Synthesizing Assessment...'
                : 'Generate AI Assessment from Manual'}
            </span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {publishSuccessMsg && (
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between space-x-3 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{publishSuccessMsg}</span>
          </div>
          <button
            onClick={() => onNavigate('quizzes')}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            View in Learner Portal →
          </button>
        </div>
      )}

      {/* Generated Questions Live Preview */}
      {generatedQuestions.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Generated Preview
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  {generatedQuestions.length} Questions
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Preview & Edit Generated Assessment
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleGenerateQuiz}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Regenerate
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Learners</span>
              </button>
            </div>
          </div>

          {/* Assessment Title Field */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Assessment Title (Learner View)
            </label>
            <input
              type="text"
              value={assessmentTitle}
              onChange={(e) => setAssessmentTitle(e.target.value)}
              className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Questions Cards */}
          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="font-bold text-slate-900 text-sm">{q.question}</div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = opt === q.answer;
                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start space-x-2 ${
                              isCorrect
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold text-slate-400">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-800">MoSPI Explanation: </span>
                      <span>{q.explanation}</span>
                      {q.referenceSource && (
                        <div className="mt-1 text-[10px] text-slate-400 font-mono">
                          Source: {q.referenceSource}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Assessment to MoSPI Cadre</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
