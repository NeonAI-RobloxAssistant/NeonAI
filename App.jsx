import React, { useState, useRef } from 'react';
import { Send, Copy, Check, Sparkles, Code2, Zap, Lock } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const codeRef = useRef(null);

  const canGenerate = () => {
    if (isPremium) return true;
    return usageCount < 3;
  };

  const generateCode = async () => {
    if (!canGenerate()) {
      setShowPaywall(true);
      return;
    }

    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert Roblox Lua programmer. Generate clean, well-commented Lua code for Roblox Studio. Output ONLY the Lua code block, no explanations.",
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      const code = data.content[0].text;
      setGeneratedCode({
        code: code,
        prompt: prompt,
        timestamp: new Date().toLocaleTimeString()
      });

      const newCount = usageCount + 1;
      setUsageCount(newCount);

      if (newCount >= 3 && !isPremium) {
        setTimeout(() => setShowPaywall(true), 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePremiumUpgrade = () => {
    window.location.href = 'https://buy.stripe.com/test_14k4gq6Jt5Za5gI144';
  };

  const useTemplate = (template) => {
    setPrompt(template.prompt);
    setActiveTab('generator');
  };

  const templates = [
    {
      id: 'weapon',
      name: 'Weapon System',
      description: 'A basic weapon that deals damage on click',
      prompt: 'Create a simple weapon system with damage, cooldown, and attack animation'
    },
    {
      id: 'health',
      name: 'Health System',
      description: 'Player health, damage, and respawn mechanics',
      prompt: 'Generate a health system with damage, healing, and death handling'
    },
    {
      id: 'jumping',
      name: 'Jump Mechanic',
      description: 'Enhanced jumping with customizable height',
      prompt: 'Create an advanced jumping system with variable height based on button hold time'
    },
    {
      id: 'inventory',
      name: 'Inventory System',
      description: 'Item storage and management',
      prompt: 'Build a simple inventory system that stores items and allows drop/use'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"></div>
      </div>

      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '3s'}}></div>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-orange-500/30 rounded-xl p-8 max-w-md mx-4 space-y-6">
            <div className="text-center space-y-2">
              <Lock className="w-12 h-12 text-orange-400 mx-auto" />
              <h2 className="text-2xl font-bold text-orange-400">Trial Ended</h2>
              <p className="text-slate-400">You've used your 3 free generations!</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-300"><strong>Free Trial:</strong></p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✓ 3 code generations</li>
                <li>✗ Unlimited after trial</li>
              </ul>
            </div>

            <button
              onClick={handlePremiumUpgrade}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-lg transition-all"
            >
              Unlock Premium
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <header className="backdrop-blur-sm bg-gradient-to-b from-slate-900/80 to-transparent sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                  NeonAI
                </h1>
                <p className="text-xs text-cyan-300/70">NeonAI is a Roblox Studio AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50">
              {isPremium ? (
                <>
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-300">Premium</span>
                </>
              ) : (
                <>
                  <span className="text-sm text-cyan-300">{usageCount}/3 used</span>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex gap-2 mb-8 border-b border-cyan-500/10">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === 'generator'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === 'templates'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Templates
            </button>
          </div>

          {activeTab === 'generator' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-cyan-300">
                    Describe what you need
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={!canGenerate()}
                    placeholder="E.g., Create a sword weapon that deals 25 damage with a 1 second cooldown"
                    className="w-full h-32 bg-slate-900/30 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none transition-all disabled:opacity-50"
                  />
                </div>

                <button
                  onClick={generateCode}
                  disabled={loading || !prompt.trim() || !canGenerate()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : !canGenerate() ? (
                    <>
                      <Lock className="w-5 h-5" />
                      Trial Expired - Upgrade to Premium
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Code
                    </>
                  )}
                </button>

                <div className="space-y-2 pt-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Quick Examples</p>
                  <div className="space-y-2">
                    {[
                      'Create a health bar that displays player health',
                      'Make a weapon that shoots projectiles with physics',
                      'Build a simple NPC that walks around and patrols'
                    ].map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(example)}
                        disabled={!canGenerate()}
                        className="w-full text-left px-3 py-2 text-sm text-slate-300 bg-slate-800/20 hover:bg-cyan-500/10 rounded-lg transition-all disabled:opacity-50"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {generatedCode ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-orange-300">
                        Generated Lua Code
                      </label>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-1 bg-slate-800/20 rounded-lg text-orange-300 hover:bg-orange-500/10 transition-all text-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      ref={codeRef}
                      className="bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 overflow-auto max-h-96 font-mono text-sm text-cyan-300 whitespace-pre-wrap break-words leading-relaxed"
                    >
                      {generatedCode.code}
                    </div>
                  </div>
                ) : (
                  <div className="h-96 rounded-xl flex flex-col items-center justify-center space-y-3 text-slate-600">
                    <Sparkles className="w-8 h-8 opacity-50" />
                    <p className="text-sm">Your Lua code will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group bg-slate-900/20 hover:bg-slate-900/40 rounded-xl p-6 transition-all cursor-pointer"
                  onClick={() => useTemplate(template)}
                >
                  <h3 className="text-lg font-semibold text-cyan-400 group-hover:text-orange-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">{template.description}</p>
                  <button className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-cyan-600/10 hover:from-cyan-500/30 hover:to-cyan-500/20 rounded-lg text-sm text-cyan-300 transition-all">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
