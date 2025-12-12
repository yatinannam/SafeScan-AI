import React from 'react';
import { AnalysisResult, RiskLabel } from '../types';
import RiskGauge from './RiskGauge';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  // Logic based on Risk Label and Trust Score
  const isSafe = result.risk_label === RiskLabel.LEGITIMATE || result.trust_score >= 80;
  const isHighRisk = result.risk_label === RiskLabel.HIGH_RISK || result.trust_score < 50;

  let borderColor = "border-amber-200";
  let bgColor = "bg-amber-50/50";
  let iconColor = "text-amber-600";

  if (isSafe) {
    borderColor = "border-emerald-200";
    bgColor = "bg-emerald-50/50";
    iconColor = "text-emerald-600";
  } else if (isHighRisk) {
    borderColor = "border-rose-200";
    bgColor = "bg-rose-50/50";
    iconColor = "text-rose-600";
  }

  return (
    <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border ${borderColor} animate-fade-in-up`}>
      {/* Header */}
      <div className={`p-6 ${bgColor} border-b ${borderColor}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis Complete</h2>
            <p className="text-slate-600 leading-relaxed">{result.summary}</p>
          </div>
          <div className="flex-shrink-0">
            <RiskGauge score={result.trust_score} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Red Flags */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Identified Red Flags
          </h3>
          {result.red_flags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.red_flags.map((flag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 border border-rose-200"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {flag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-emerald-600 flex items-center text-sm font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No specific red flags detected.
            </div>
          )}
        </div>

        {/* Evidence */}
        {result.evidence.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              Evidence from Text
            </h3>
            <div className="space-y-2">
              {result.evidence.map((item, idx) => (
                <blockquote key={idx} className="border-l-4 border-slate-300 pl-4 py-1 italic text-slate-600 bg-slate-50 text-sm">
                  "{item.replace(/^['"]|['"]$/g, '')}"
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
             <svg className={`w-5 h-5 mr-2 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
             </svg>
             Recommended Actions
          </h3>
          <ul className="space-y-3">
            {result.recommended_action.map((action, idx) => (
              <li key={idx} className="flex items-start text-slate-700">
                <span className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold mr-3 mt-0.5`}>
                  {idx + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center text-xs text-slate-400 border-t pt-4">
             <span>Confidence Score: {(result.confidence * 100).toFixed(0)}%</span>
             <button onClick={onReset} className="text-brand-600 hover:text-brand-800 font-medium hover:underline">
                Analyze Another Message
             </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;