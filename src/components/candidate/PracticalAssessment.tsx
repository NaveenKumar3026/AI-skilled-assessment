import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Clock, 
  Layers,
  Wrench,
  Camera,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRACTICAL_DEMO_DATA } from '../../services/mockData';
import { AIService } from '../../services/aiService';
import { AIBadge } from '../common/AIBadge';

export const PracticalAssessment: React.FC = () => {
  const { candidate, setCandidate, setCurrentView, t, addAuditLog } = useApp();

  const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);

  const practicalData = PRACTICAL_DEMO_DATA;

  const handleSimulateReAnalysis = async () => {
    setIsProcessingVideo(true);
    try {
      const res = await AIService.analyzePracticalVideo();
      setCandidate((prev) => ({
        ...prev,
        scores: {
          ...prev.scores,
          practical: res.scores.overallPractical,
          safety: Math.max(prev.scores.safety, res.scores.safetyCompliance),
        },
      }));
      addAuditLog(
        'Practical Video Demo Evaluated',
        `Practical CV Score: ${res.scores.overallPractical}%, Safety Compliance: ${res.scores.safetyCompliance}%`,
        candidate.name
      );
    } finally {
      setIsProcessingVideo(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Phase 6: Computer Vision Demonstration
            </span>
            <AIBadge confidence={93} text="Real-Time CV Object & Posture Detection" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t.candidate.practicalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Practical skill demonstration recorded via camera — evaluated for tool selection, technique, and PPE safety.
          </p>
        </div>

        <button
          onClick={handleSimulateReAnalysis}
          disabled={isProcessingVideo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{isProcessingVideo ? 'Re-running CV Models...' : 'Re-run CV Analysis'}</span>
        </button>
      </div>

      {/* Main Grid: Video Stream with Bounding Box Overlays + Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Video Demonstration Player with Interactive Bounding Boxes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
            {/* Top Video Metadata Overlay Bar */}
            <div className="absolute top-0 inset-x-0 z-20 bg-linear-to-b from-slate-950/90 to-transparent p-4 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono font-bold">REC • 00:48 / 01:00</span>
                <span className="text-slate-400">|</span>
                <span className="text-[11px] text-sky-400 font-semibold">1080p 60FPS AI-Stream</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 text-[10px] text-emerald-400 font-mono">
                <Eye className="w-3 h-3" />
                <span>4 Models Active</span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={practicalData.videoThumbnail}
                alt="Practical Demonstration"
                className="w-full h-full object-cover opacity-85"
              />

              {/* Simulated Scanning Laser line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-400 shadow-[0_0_12px_#38bdf8] animate-scan pointer-events-none opacity-60"></div>

              {/* Computer Vision Detection Bounding Boxes */}
              {practicalData.observations.map((obs, idx) => {
                const isSelected = activeBoxIndex === idx;
                const isAlert = obs.status === 'alert';
                const isWarning = obs.status === 'warning';

                const borderClass = isAlert 
                  ? 'border-rose-500 bg-rose-500/20 text-rose-300' 
                  : isWarning 
                  ? 'border-amber-400 bg-amber-400/20 text-amber-200' 
                  : 'border-emerald-400 bg-emerald-400/20 text-emerald-200';

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveBoxIndex(idx)}
                    className={`absolute border-2 rounded-md transition-all cursor-pointer ${borderClass} ${
                      isSelected ? 'ring-2 ring-white scale-102 z-20' : 'opacity-80 hover:opacity-100 z-10'
                    }`}
                    style={{
                      left: `${obs.box.x}%`,
                      top: `${obs.box.y}%`,
                      width: `${obs.box.width}%`,
                      height: `${obs.box.height}%`,
                    }}
                  >
                    {/* Bounding Box Label Tag */}
                    <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold font-mono whitespace-nowrap shadow-md ${
                      isAlert ? 'bg-rose-600 text-white' : isWarning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                    }`}>
                      {obs.label}
                    </div>

                    {/* Corner Target Reticles */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Timeline Controls */}
            <div className="p-3.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-slate-400">00:32 / 00:48</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Click any box on video to inspect CV observation</span>
              </div>
            </div>
          </div>

          {/* Active Observation Card */}
          {activeBoxIndex !== null && (
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Observation at {practicalData.observations[activeBoxIndex].timestamp}
                </span>
                <span className="font-mono text-[10px] uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {practicalData.observations[activeBoxIndex].status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {practicalData.observations[activeBoxIndex].description}
              </p>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Computer Vision Scores & Milestone Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Practical Performance Score</span>
                </h3>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-600">85%</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Overall Practical</span>
                </div>
              </div>

              {/* 4 Core Practical Metric Bars */}
              <div className="space-y-3 pt-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Safety & PPE Compliance</span>
                    <span className="font-bold text-emerald-600">91%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Insulated Tool Handling</span>
                    <span className="font-bold text-sky-600">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Procedure Precision</span>
                    <span className="font-bold text-sky-600">84%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">Task Speed & Completion</span>
                    <span className="font-bold text-amber-600">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>

              {/* Timeline Milestones */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2.5">
                  Automated CV Timeline Milestones
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {practicalData.timelineEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 text-xs">
                      <span className="font-mono font-bold text-slate-500 text-[10px] shrink-0">{evt.time}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{evt.title}</span>
                          {evt.status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{evt.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer & Next Action */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-[10px] text-slate-600 italic">
                * Computer vision outputs are advisory. Authorized RPL evaluators review video segments before issuing certifications.
              </p>
              <button
                onClick={() => setCurrentView('evidence-verification')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                <span>Proceed to Workplace Evidence Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
