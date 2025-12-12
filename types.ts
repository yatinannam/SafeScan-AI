export enum RiskLabel {
  LEGITIMATE = "Legitimate",
  SUSPICIOUS = "Suspicious",
  HIGH_RISK = "High Risk (Scam/Phish)"
}

export interface AnalysisResult {
  risk_label: RiskLabel | string;
  trust_score: number;
  summary: string;
  red_flags: string[];
  evidence: string[];
  recommended_action: string[];
  confidence: number;
}