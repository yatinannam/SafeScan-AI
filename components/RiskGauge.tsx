import React, { useEffect, useState } from 'react';

interface RiskGaugeProps {
  score: number; // This is now a Trust Score (0-100)
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  // Animation state
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate from 0 to target score on mount/change
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Gauge configuration
  const radius = 80;
  const strokeWidth = 12;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * innerRadius;
  
  // Dimensions
  const width = radius * 2;
  const height = radius;
  
  // Calculate stroke offset based on score (0-100)
  // Ensure we clamp values
  const normalizedScore = Math.min(100, Math.max(0, displayScore));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Trust Score Color Logic
  // 0-49: Red (Danger)
  // 50-79: Amber (Caution)
  // 80-100: Green (Safe)
  let colorClass = "text-rose-600";
  let textClass = "text-rose-700";
  let label = "HIGH RISK";

  if (score >= 50 && score < 80) {
    colorClass = "text-amber-500";
    textClass = "text-amber-700";
    label = "CAUTION";
  } else if (score >= 80) {
    colorClass = "text-emerald-500";
    textClass = "text-emerald-700";
    label = "SAFE";
  }

  return (
    <div className="flex flex-col items-center">
      {/* Gauge Container */}
      <div className="relative flex justify-center items-end" style={{ width: width, height: height + strokeWidth / 2 }}>
         {/* SVG Graph */}
         <svg 
            width={width} 
            height={height + strokeWidth} 
            className="absolute bottom-0 overflow-visible"
            viewBox={`0 0 ${width} ${height + strokeWidth}`}
         >
            {/* Background Arc (Gray) */}
            <path
              d={`M ${strokeWidth/2} ${height} A ${innerRadius} ${innerRadius} 0 0 1 ${width - strokeWidth/2} ${height}`}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Foreground Arc (Colored) */}
             <path
              d={`M ${strokeWidth/2} ${height} A ${innerRadius} ${innerRadius} 0 0 1 ${width - strokeWidth/2} ${height}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
         </svg>
         
         {/* Score Text - Absolute positioned at bottom center */}
         <div className="relative z-10 flex flex-col items-center justify-end pb-3">
            <span className={`text-5xl font-bold leading-none tracking-tighter ${textClass} transition-colors duration-500`}>
              {displayScore}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Trust Score
            </span>
         </div>
      </div>
      
      {/* Label */}
      <div className={`mt-2 font-extrabold ${textClass} uppercase tracking-wider text-sm transition-colors duration-500`}>
        {label}
      </div>
    </div>
  );
};

export default RiskGauge;