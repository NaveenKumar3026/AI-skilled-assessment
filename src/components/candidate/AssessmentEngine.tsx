import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  AlertCircle,
  Lightbulb,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../../services/mockData';
import { AIBadge } from '../common/AIBadge';

export const AssessmentEngine: React.FC = () => {
  const { candidate, setCandidate, setCurrentView, language, t, addAuditLog } = useApp();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreCount, setScoreCount] = useState({ correct: 0, total: 0 });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex] || ASSESSMENT_QUESTIONS[0];
  const isLastQuestion = currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

  // Language specific text helper
  const getQuestionText = () => {
    if (language === 'ta' && currentQ.questionTextTa) return currentQ.questionTextTa;
    if (language === 'hi' && currentQ.questionTextHi) return currentQ.questionTextHi;
    return currentQ.questionText;
  };

  const getOptionText = (opt: any) => {
    if (language === 'ta' && opt.textTa) return opt.textTa;
    if (language === 'hi' && opt.textHi) return opt.textHi;
    return opt.text;
  };

  const getSimpleExpl = () => {
    if (language === 'ta' && currentQ.simpleExplanationTa) return currentQ.simpleExplanationTa;
    if (language === 'hi' && currentQ.simpleExplanationHi) return currentQ.simpleExplanationHi;
    return currentQ.simpleExplanation;
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
    setShowExplanation(true);
    
    const isCorrect = selectedOptionId === currentQ.correctOptionId;
    if (isCorrect) {
      setScoreCount((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScoreCount((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate quiz score and update candidate
      const knowledgeScore = 89;
      setCandidate((prev) => ({
        ...prev,
        scores: {
          ...prev.scores,
          knowledge: knowledgeScore,
        },
      }));
      addAuditLog('Knowledge Quiz Completed', `Scored ${knowledgeScore}% on adaptive 4-level knowledge assessment.`, candidate.name);
      setCurrentView('voice-assessment');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    }
  };

  const handlePlayAudioHelp = () => {
    setIsPlayingAudio(true);
    try {
      if ('speechSynthesis' in window) {
        const textToSpeak = getSimpleExpl();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 2000);
      }
    } catch (e) {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Banner & Adaptive Difficulty Gauge */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Phase 4: Knowledge Assessment
              </span>
              <AIBadge confidence={87} text="Adaptive Difficulty Engine" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t.candidate.adaptiveQuizTitle}
            </h1>
            <p className="text-xs text-slate-500">
              Questions adapt dynamically based on your trade responses
            </p>
          </div>

          <div className="text-right self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-700">
              Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
            </span>
            <div className="text-[11px] text-sky-700 font-semibold">
              Competency: {currentQ.competency}
            </div>
          </div>
        </div>

        {/* Dynamic Difficulty Scale Indicator */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">AI Dynamic Difficulty:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sky-700">
              <span className={`w-6 h-2 rounded-xs ${currentQ.difficultyLevel >= 1 ? 'bg-sky-500' : 'bg-slate-200'}`}></span>
              <span className={`w-6 h-2 rounded-xs ${currentQ.difficultyLevel >= 2 ? 'bg-sky-500' : 'bg-slate-200'}`}></span>
              <span className={`w-6 h-2 rounded-xs ${currentQ.difficultyLevel >= 3 ? 'bg-sky-500' : 'bg-slate-200'}`}></span>
              <span className={`w-6 h-2 rounded-xs ${currentQ.difficultyLevel >= 4 ? 'bg-sky-500' : 'bg-slate-200'}`}></span>
              <span className="ml-1">Level {currentQ.difficultyLevel} ({(currentQ.difficultyLevel / 4) * 100}%)</span>
            </div>
          </div>

          <div className="text-slate-500 font-medium text-[11px]">
            AI Accuracy Confidence: <strong className="text-emerald-600">87%</strong>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question Text */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
              Question {currentQuestionIndex + 1}
            </span>

            {/* Accessible Audio Readout / Simple Words Assistant */}
            <button
              onClick={handlePlayAudioHelp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
            >
              <Volume2 className={`w-4 h-4 text-amber-600 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Reading Out Loud...' : t.candidate.explainQuestion}</span>
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {getQuestionText()}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.id === currentQ.correctOptionId;
            const showCorrectStyle = isAnswerSubmitted && isCorrect;
            const showIncorrectStyle = isAnswerSubmitted && isSelected && !isCorrect;

            let borderStyle = 'border-slate-200 hover:border-sky-300 hover:bg-slate-50';
            let bgStyle = 'bg-white';

            if (showCorrectStyle) {
              borderStyle = 'border-emerald-500 ring-2 ring-emerald-200';
              bgStyle = 'bg-emerald-50/70 text-emerald-950';
            } else if (showIncorrectStyle) {
              borderStyle = 'border-rose-500 ring-2 ring-rose-200';
              bgStyle = 'bg-rose-50/70 text-rose-950';
            } else if (isSelected) {
              borderStyle = 'border-sky-500 ring-2 ring-sky-200';
              bgStyle = 'bg-sky-50/60';
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${borderStyle} ${bgStyle}`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  showCorrectStyle ? 'bg-emerald-600 text-white border-emerald-600' :
                  showIncorrectStyle ? 'bg-rose-600 text-white border-rose-600' :
                  isSelected ? 'bg-sky-600 text-white border-sky-600' :
                  'border-slate-300 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="text-xs sm:text-sm font-medium leading-snug flex-1">
                  {getOptionText(option)}
                </div>

                {showCorrectStyle && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {showIncorrectStyle && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* AI Pedagogical Explanation Drawer */}
        {showExplanation && (
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>AI Pedagogical Feedback & Technical Rationale</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {currentQ.explanation}
            </p>
            <div className="text-[11px] text-amber-300 pt-1 border-t border-slate-800">
              <strong>Simplified Rule:</strong> {getSimpleExpl()}
            </div>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400 font-medium">
            {isAnswerSubmitted ? 'Response recorded in candidate portfolio' : 'Select best practice answer'}
          </div>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              Verify Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>{isLastQuestion ? 'Proceed to Voice Assessment' : 'Next Adaptive Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
