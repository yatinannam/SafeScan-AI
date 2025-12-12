import React, { useState } from 'react';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult } from './types';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(inputText);
      setResult(data);
    } catch (err) {
      setError("Unable to analyze content. Please try again or check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="Return to Home"
          >
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-sm transition-all duration-300 ease-out group-hover:bg-brand-500 group-hover:scale-110 group-hover:rotate-3 group-active:scale-95">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-slate-700">
              SafeScan <span className="text-brand-600 transition-colors group-hover:text-brand-500">AI</span>
            </h1>
          </button>
          
          <button 
            onClick={() => setShowAbout(true)}
            className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors focus:outline-none hover:bg-slate-50 px-3 py-1.5 rounded-full"
          >
            About
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        
        {!result && (
          <div className="text-center mb-10 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 animate-fade-in-up">
              Is that message safe?
            </h2>
            <p className="text-slate-500 text-lg animate-fade-in-up delay-100">
              Paste suspicious emails, text messages, or URLs below. Our AI analyzes patterns to detect scams and phishing attempts instantly.
            </p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-2xl mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center animate-fade-in">
             <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             {error}
          </div>
        )}

        {!result ? (
          <div className="w-full max-w-2xl bg-slate-900 p-1 rounded-2xl shadow-xl border border-slate-700 overflow-hidden ring-4 ring-slate-100 animate-fade-in-up delay-200">
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <textarea
                className="w-full min-h-[200px] p-5 bg-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:bg-slate-750 transition-colors resize-y text-lg leading-relaxed"
                placeholder="Paste email content, SMS, or URL here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                spellCheck={false}
              />
              <div className="px-5 pb-4 pt-2 flex justify-between items-center bg-slate-800 border-t border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium">
                  {inputText.length} characters
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || inputText.length === 0}
                  className={`
                    flex items-center px-6 py-2.5 rounded-lg font-semibold text-white transition-all
                    ${isLoading || inputText.length === 0 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-900/20 active:scale-95'}
                  `}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning...
                    </>
                  ) : (
                    <>
                      Analyze Risk
                      <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ResultCard result={result} onReset={handleReset} />
        )}

        <div className="mt-16 text-center border-t border-slate-200 pt-8 w-full max-w-4xl">
           <p className="text-slate-400 text-sm">
             <strong>Disclaimer:</strong> SafeScan AI uses generative AI to analyze text patterns. It may not catch every threat and can occasionally produce inaccurate results. Always verify critical information through official channels.
           </p>
        </div>

      </main>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in-up">
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">About SafeScan AI</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Powered by Gemini 2.5</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                SafeScan AI is an intelligent security tool designed to help you identify potential phishing attempts, scams, and malicious links.
              </p>
              <p>
                By analyzing the content of emails, SMS messages, and URLs, our AI provides a trust score and highlights specific red flags, empowering you to make safer digital decisions.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500">
                <strong>Note:</strong> While we strive for accuracy, AI analysis is not perfect. Always verify suspicious requests directly with the sender or institution.
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowAbout(false)}
                className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;