"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Settings, 
  Code2, 
  Terminal, 
  Cpu, 
  Lightbulb, 
  Database, 
  Copy, 
  Check, 
  Download, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Info, 
  RefreshCw, 
  Trophy, 
  TrendingUp,
  Upload,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-defined competition templates to make the agent workspace functional out of the box
interface CompetitionTemplate {
  id: string;
  title: string;
  description: string;
  problemType: string;
  metric: string;
  validation: string;
  columns: Array<{ name: string; type: string; missing: string; importance: number }>;
  baselineScore: number;
  bestScore: number;
}

const COMPETITION_TEMPLATES: CompetitionTemplate[] = [
  {
    id: "titanic",
    title: "Titanic - Machine Learning from Disaster",
    description: "Predict survival on the Titanic (passenger characteristics like age, fare, sex, socio-economic class) using binary classification models.",
    problemType: "Binary Classification",
    metric: "Accuracy",
    validation: "Stratified K-Fold",
    columns: [
      { name: "Pclass", type: "Categorical (Ordinal)", missing: "0%", importance: 15 },
      { name: "Sex", type: "Categorical", missing: "0%", importance: 42 },
      { name: "Age", type: "Numerical (Continuous)", missing: "19.9%", importance: 18 },
      { name: "SibSp", type: "Numerical (Discrete)", missing: "0%", importance: 5 },
      { name: "Parch", type: "Numerical (Discrete)", missing: "0%", importance: 4 },
      { name: "Fare", type: "Numerical (Continuous)", missing: "0%", importance: 14 },
      { name: "Embarked", type: "Categorical", missing: "0.2%", importance: 2 }
    ],
    baselineScore: 0.772,
    bestScore: 0.835
  },
  {
    id: "spaceship_titanic",
    title: "Spaceship Titanic",
    description: "Predict which passengers were transported to an alternate dimension during the collision of Spaceship Titanic with a spacetime anomaly.",
    problemType: "Binary Classification",
    metric: "Accuracy",
    validation: "Stratified K-Fold",
    columns: [
      { name: "HomePlanet", type: "Categorical", missing: "2.3%", importance: 12 },
      { name: "CryoSleep", type: "Boolean", missing: "2.5%", importance: 38 },
      { name: "Cabin", type: "Categorical (String/ID)", missing: "2.3%", importance: 15 },
      { name: "Age", type: "Numerical", missing: "2.1%", importance: 8 },
      { name: "VIP", type: "Boolean", missing: "2.3%", importance: 2 },
      { name: "RoomService", type: "Numerical", missing: "2.1%", importance: 10 },
      { name: "Spa", type: "Numerical", missing: "2.1%", importance: 15 }
    ],
    baselineScore: 0.751,
    bestScore: 0.824
  },
  {
    id: "house_prices",
    title: "House Prices - Advanced Regression Techniques",
    description: "Predict sales prices of residential homes in Ames, Iowa using 79 explanatory variables describing aspects of residential homes.",
    problemType: "Regression",
    metric: "RMSE (Log)",
    validation: "K-Fold",
    columns: [
      { name: "OverallQual", type: "Categorical (Ordinal)", missing: "0%", importance: 35 },
      { name: "GrLivArea", type: "Numerical", missing: "0%", importance: 22 },
      { name: "GarageCars", type: "Numerical", missing: "0%", importance: 12 },
      { name: "TotalBsmtSF", type: "Numerical", missing: "0%", importance: 15 },
      { name: "YearBuilt", type: "Numerical", missing: "0%", importance: 10 },
      { name: "Neighborhood", type: "Categorical", missing: "0%", importance: 6 }
    ],
    baselineScore: 0.142,
    bestScore: 0.111
  },
  {
    id: "store_sales",
    title: "Store Sales - Time Series Forecasting",
    description: "Predict sales for grocery families at supermarket stores in Ecuador using sales trends, oil prices, and holiday indicators.",
    problemType: "Time Series Forecasting",
    metric: "RMSLE",
    validation: "TimeSeriesSplit",
    columns: [
      { name: "date", type: "Temporal", missing: "0%", importance: 40 },
      { name: "store_nbr", type: "Categorical", missing: "0%", importance: 15 },
      { name: "family", type: "Categorical", missing: "0%", importance: 25 },
      { name: "onpromotion", type: "Numerical (discrete)", missing: "0%", importance: 12 },
      { name: "dcoilwtico (Oil)", type: "Numerical", missing: "28.5%", importance: 8 }
    ],
    baselineScore: 0.452,
    bestScore: 0.362
  }
];

export default function KaggleVibeAgent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // App states
  const [selectedTemplate, setSelectedTemplate] = useState<CompetitionTemplate>(COMPETITION_TEMPLATES[0]);
  
  // Custom form state
  const [customTitle, setCustomTitle] = useState(COMPETITION_TEMPLATES[0].title);
  const [customDesc, setCustomDesc] = useState(COMPETITION_TEMPLATES[0].description);
  const [customMetric, setCustomMetric] = useState(COMPETITION_TEMPLATES[0].metric);
  const [customProblemType, setCustomProblemType] = useState(COMPETITION_TEMPLATES[0].problemType);
  const [customValidation, setCustomValidation] = useState(COMPETITION_TEMPLATES[0].validation);
  
  // File Upload and Data Analysis states
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAnalyzingData, setIsAnalyzingData] = useState(false);
  const [qualityInsights, setQualityInsights] = useState<string[]>([]);
  const [proposedFeatures, setProposedFeatures] = useState<Array<{ name: string; derivation: string; rationale: string }>>([]);
  const [edaSummary, setEdaSummary] = useState<string>("");
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Strategy configurations
  const [useTuning, setUseTuning] = useState(true);
  const [selectedTricks, setSelectedTricks] = useState<string[]>([
    "Target Encoding",
    "CatBoost + LightGBM + XGBoost Ensemble"
  ]);
  const [customInstructions, setCustomInstructions] = useState("");
  
  // Active state flags
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "agents" | "data">("code");
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Agent response results
  const [domainInsight, setDomainInsight] = useState<string>(
    "🧠 Domain Expert Agent: Select 'Generate Strategy' to kick off the multi-agent design."
  );
  const [featureInsight, setFeatureInsight] = useState<string>(
    "🛠️ Feature Engineer Agent: Ready to build state-of-the-art transformers."
  );
  const [modelingInsight, setModelingInsight] = useState<string>(
    "🤖 ML Modeler Agent: Standing by to write cross-validated ensemble pipelines."
  );
  const [pythonCode, setPythonCode] = useState<string>(`# Kaggle Pipeline Boilerplate
# Select a competition template or enter custom criteria, then click "Generate Agent Strategy"

import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
import lightgbm as lgb

print("Ready to develop elite solution.")
`);
  const [simulatedScore, setSimulatedScore] = useState<number>(COMPETITION_TEMPLATES[0].baselineScore);
  const [scoreMetric, setScoreMetric] = useState<string>(COMPETITION_TEMPLATES[0].metric);
  const [featureImportances, setFeatureImportances] = useState<Array<{ feature: string; importance: number }>>(
    COMPETITION_TEMPLATES[0].columns.map(c => ({ feature: c.name, importance: c.importance }))
  );

  // Chat refinement state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "agents"; text: string }>>([]);
  const [isChatting, setIsChatting] = useState(false);

  // Run Simulator state
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardRank, setLeaderboardRank] = useState(1402);
  
  // Selected code explanation state
  const [selectedCodeSection, setSelectedCodeSection] = useState<string | null>(null);
  const [codeExplanation, setCodeExplanation] = useState<string>("");

  // Populate form fields when template changes
  useEffect(() => {
    setCustomTitle(selectedTemplate.title);
    setCustomDesc(selectedTemplate.description);
    setCustomMetric(selectedTemplate.metric);
    setCustomProblemType(selectedTemplate.problemType);
    setCustomValidation(selectedTemplate.validation);
    
    // Set default features
    setFeatureImportances(selectedTemplate.columns.map(c => ({ feature: c.name, importance: c.importance })));
    setSimulatedScore(selectedTemplate.baselineScore);
    setScoreMetric(selectedTemplate.metric);
    
    // Clear simulation status
    setSimulationComplete(false);
    setIsRunningSim(false);
  }, [selectedTemplate]);

  // Handle advanced trick toggles
  const toggleTrick = (trick: string) => {
    if (selectedTricks.includes(trick)) {
      setSelectedTricks(selectedTricks.filter(t => t !== trick));
    } else {
      setSelectedTricks([...selectedTricks, trick]);
    }
  };

  // Execute server API to generate end-to-end strategy
  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    setActiveTab("code");
    setSelectedCodeSection(null);
    setSimulationComplete(false);
    
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_strategy",
          competitionTitle: customTitle,
          description: customDesc,
          problemType: customProblemType,
          evaluationMetric: customMetric,
          validationStrategy: customValidation,
          useTuning: useTuning,
          advancedTricks: selectedTricks,
          customInstructions: customInstructions,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setDomainInsight(data.domainExpertInsight);
      setFeatureInsight(data.featureEngineeringPlan);
      setModelingInsight(data.mlModelingPlan);
      setPythonCode(data.pythonCode);
      setSimulatedScore(data.simulatedScore);
      setScoreMetric(data.scoreMetric);
      
      if (data.featureImportances && Array.isArray(data.featureImportances)) {
        setFeatureImportances(data.featureImportances);
      }
      
      // Seed a welcome message in chat history
      setChatHistory([
        { 
          sender: "agents", 
          text: `👋 Greetings! We have constructed a highly customized grandmaster strategy for "${customTitle}". We achieved a simulated local Validation ${data.scoreMetric} of ${data.simulatedScore.toFixed(4)}. Try checking the "Agent Team Sync" tab to read our detailed plans, or click "Simulate Local Run" to test-drive the pipeline!` 
        }
      ]);
      
    } catch (error: any) {
      console.error("Failed to generate strategy:", error);
      alert(`Strategy Generation Error: ${error.message || "Please check server logs."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit refinement from user chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsChatting(true);
    
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_refine",
          chatHistory: chatHistory.map(c => `${c.sender}: ${c.text}`),
          userMessage: userMsg,
          currentCode: pythonCode,
          competitionTitle: customTitle,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setChatHistory(prev => [...prev, { sender: "agents", text: data.agentMessage }]);
      setPythonCode(data.updatedPythonCode);
      setSimulatedScore(data.newSimulatedScore);
      
    } catch (error: any) {
      console.error("Chat refinement error:", error);
      setChatHistory(prev => [
        ...prev, 
        { sender: "agents", text: `⚠️ Error occurred: ${error.message || "Failed to parse. Please try again."}` }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  // Simulated code runner logs generator
  const runCodeSimulator = () => {
    setIsRunningSim(true);
    setSimulationComplete(false);
    setSimLogs([]);
    setSimProgress(0);
    
    const logs = [
      "⚡ Initializing local development container...",
      "📂 Loading train.csv and test.csv paths...",
      `📊 Analyzing dimensions: train has 14,208 records, test has 4,500 records.`,
      "🧹 Cleaning null values and executing target transformations...",
      "🛠️ Feature Engineering: Deriving advanced feature sets, target encodings, and temporal lag columns...",
      "📐 Cross-Validation Strategy: Setting up Stratified 5-Fold split (shuffled, seed=42)...",
      `🚀 Model training started: LightGBM GBDT booster...`,
      "🔄 [Fold 1] Validation LogLoss: 0.2814 - Iterations: 140/500 (Early Stopped)",
      "🔄 [Fold 2] Validation LogLoss: 0.2792 - Iterations: 155/500 (Early Stopped)",
      "🔄 [Fold 3] Validation LogLoss: 0.2851 - Iterations: 120/500 (Early Stopped)",
      "🔄 [Fold 4] Validation LogLoss: 0.2744 - Iterations: 180/500 (Early Stopped)",
      "🔄 [Fold 5] Validation LogLoss: 0.2809 - Iterations: 135/500 (Early Stopped)",
      `🏆 CV Out-Of-Fold Summary: Mean score = ${simulatedScore.toFixed(4)}`,
      "🗳️ Ensembling predictions on test set...",
      "📁 Building submission.csv file...",
      "✅ Validation successful: 4,500 rows verified with zero missing values."
    ];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setSimLogs(prev => [...prev, logs[currentIdx]]);
        setSimProgress(Math.floor(((currentIdx + 1) / logs.length) * 100));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunningSim(false);
        setSimulationComplete(true);
        // Simulate competition leaderboard rank!
        let targetRank = 1402;
        if (selectedTricks.length > 2) targetRank = 422;
        if (selectedTricks.length > 3 && useTuning) targetRank = 58;
        if (customInstructions.length > 10) targetRank = Math.max(12, targetRank - 45);
        
        setLeaderboardRank(targetRank);
        setShowLeaderboard(true);
      }
    }, 450);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([pythonCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${customTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_pipeline.py`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Parses user uploaded CSV file, extracts headers/columns, and triggers agent data analysis API
  const handleCSVParseAndAnalyze = async (file: File) => {
    setUploadedFileName(file.name);
    setIsAnalyzingData(true);
    setActiveTab("data"); // switch to schema/EDA tab
    
    try {
      const text = await file.text();
      // Basic CSV parser to find headers
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        throw new Error("The uploaded file appears to be empty.");
      }
      
      const headerLine = lines[0];
      const columns = headerLine.split(",").map(col => col.trim()).filter(Boolean);
      
      // Extract a 5-line sample
      const sampleLines = lines.slice(0, 6);
      
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze_data",
          fileName: file.name,
          fileContentSample: sampleLines.join("\n"),
          columns: columns.map(c => ({ name: c, type: "Unknown" }))
        }),
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setQualityInsights(data.qualityInsights || []);
      setProposedFeatures(data.proposedFeatures || []);
      setEdaSummary(data.edaSummary || "Detailed CSV Column Analysis Completed.");
      
      // Assemble a custom template on the fly using parsed columns
      const dynamicColumns = columns.map((col) => {
        // Simple type inference based on header name
        let inferredType = "Numerical";
        const nameLower = col.toLowerCase();
        if (nameLower.includes("id") || nameLower.includes("key") || nameLower.includes("name") || nameLower.includes("sex") || nameLower.includes("gender") || nameLower.includes("class") || nameLower.includes("embark")) {
          inferredType = "Categorical";
        } else if (nameLower.includes("date") || nameLower.includes("time") || nameLower.includes("year") || nameLower.includes("month")) {
          inferredType = "Temporal";
        } else if (nameLower.includes("is_") || nameLower.includes("has_") || nameLower.includes("cryo") || nameLower.includes("vip")) {
          inferredType = "Boolean";
        }
        
        return {
          name: col,
          type: inferredType,
          missing: `${Math.floor(Math.random() * 5)}%`, // realistic missing ratio simulation
          importance: Math.max(5, Math.floor(Math.random() * 35))
        };
      });
      
      // Normalize sum of importances to 100
      const sumImp = dynamicColumns.reduce((sum, col) => sum + col.importance, 0) || 1;
      const normalizedColumns = dynamicColumns.map(col => ({
        ...col,
        importance: Math.max(2, Math.round((col.importance / sumImp) * 100))
      }));
      
      const newTemplate: CompetitionTemplate = {
        id: `dynamic_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "), // prettier title
        description: data.edaSummary || `Ensemble strategy custom-designed for columns: ${columns.slice(0, 5).join(", ")}`,
        problemType: "Binary Classification",
        metric: "LogLoss",
        validation: "Stratified K-Fold",
        columns: normalizedColumns,
        baselineScore: 0.650,
        bestScore: 0.885
      };
      
      setSelectedTemplate(newTemplate);
      
      // Update custom form inputs directly
      setCustomTitle(newTemplate.title);
      setCustomDesc(newTemplate.description);
      setCustomMetric(newTemplate.metric);
      setCustomProblemType(newTemplate.problemType);
      setCustomValidation(newTemplate.validation);
      
    } catch (err: any) {
      console.error(err);
      alert(`CSV analysis failed: ${err.message || err}`);
    } finally {
      setIsAnalyzingData(false);
    }
  };

  // Inspect or explain a code section based on line clicks
  const handleCodeLineClick = (sectionName: string, explanationText: string) => {
    setSelectedCodeSection(sectionName);
    setCodeExplanation(explanationText);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-[#00FF41] animate-spin" />
          <span className="text-xs text-[#00FF41] uppercase tracking-[0.3em] font-bold animate-pulse">
            INITIALIZING GRANDMASTER WORKSPACE...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41] antialiased">
      
      {/* Top Navigation / Header Styled with Sophisticated Dark Theme */}
      <header id="header_section" className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0A0A0A] sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#00FF41] rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.2)]">
            <div className="w-4 h-4 bg-black rotate-45"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-50 font-bold text-[#E0E0E0]">PROJECT // PROTOTYPE</span>
            <span className="text-sm font-semibold tracking-tight text-white uppercase font-mono">FREESTYLE_TRACK_V1.0</span>
          </div>
        </div>

        {/* Global Standings and Agent Telemetry */}
        <div className="flex gap-8 items-center">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] uppercase opacity-40 font-mono">Kaggle AI Vibe</span>
            <span className="text-xs font-mono text-[#00FF41] tracking-wider">STABLE_CONNECTION_OK</span>
          </div>
          
          <div className="hidden md:block w-px h-8 bg-white/10"></div>
          
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase opacity-40 font-mono">Leaderboard Rank</span>
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#00FF41]" />
              TOP_0.4%
            </span>
          </div>

          <div className="w-px h-8 bg-white/10"></div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase opacity-40 font-mono font-bold text-white/50">Simulated {scoreMetric}</span>
            <span className="text-sm font-mono text-[#00FF41] font-bold">{simulatedScore.toFixed(4)}</span>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full relative">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        
        {/* Left Side: Setup & Agent Control Center (5 Cols) */}
        <section id="config_panel" className="lg:col-span-5 flex flex-col gap-6 relative z-10">
          
          {/* Section A: Template Selector & Objectives */}
          <div className="bg-[#080808] border border-white/5 rounded-xl p-5 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00FF41]" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Problem Definition</h2>
              </div>
              <span className="text-[9px] text-[#00FF41]/60 uppercase font-mono tracking-wider">Kaggle API Seed</span>
            </div>

            {/* Template Buttons */}
            <div>
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 block">
                Select Competition Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMPETITION_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition duration-200 border flex flex-col gap-1 ${
                      selectedTemplate.id === tpl.id
                        ? "bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41] shadow-md shadow-[#00FF41]/5"
                        : "bg-black/40 border-white/5 hover:border-white/20 text-white/50 hover:text-white"
                    }`}
                  >
                    <span className="font-semibold truncate font-mono text-[11px]">
                      {tpl.id === "titanic" ? "Titanic" : tpl.id === "spaceship_titanic" ? "Spaceship Titanic" : tpl.id === "house_prices" ? "House Prices" : "Store Sales"}
                    </span>
                    <span className="text-[9px] opacity-60 truncate">{tpl.problemType}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Goal inputs */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Competition Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00FF41]/70 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Competition Description</label>
                <textarea
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00FF41]/70 font-mono resize-none h-16"
                  placeholder="Describe the target variable and prediction problem..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Objective / Target Metric</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={customProblemType}
                    onChange={(e) => setCustomProblemType(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00FF41] font-mono"
                  >
                    <option>Binary Classification</option>
                    <option>Multi-class Classification</option>
                    <option>Regression</option>
                    <option>Time Series Forecasting</option>
                  </select>
                  <input
                    type="text"
                    value={customMetric}
                    onChange={(e) => setCustomMetric(e.target.value)}
                    placeholder="Metric (e.g. LogLoss)"
                    className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00FF41] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Strategy Sandbox Triggers */}
          <div className="bg-[#080808] border border-white/5 rounded-xl p-5 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#00FF41]" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Grandmaster Strategy Config</h2>
              </div>
              <Cpu className="w-4 h-4 text-white/20" />
            </div>

            {/* Validation split option */}
            <div>
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1.5">Validation Splitting Scheme</label>
              <select
                value={customValidation}
                onChange={(e) => setCustomValidation(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF41] font-mono"
              >
                <option>Stratified K-Fold (5-Fold)</option>
                <option>Standard K-Fold (10-Fold)</option>
                <option>Group K-Fold (Leakage Protection)</option>
                <option>TimeSeriesSplit (OOF temporal)</option>
              </select>
            </div>

            {/* Optuna hyperparameter optimization toggle */}
            <div className="flex items-center justify-between bg-black/60 border border-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FF41]" />
                <div>
                  <div className="text-xs font-semibold text-white font-mono">Optuna Tuning Study</div>
                  <div className="text-[9px] opacity-40">Adds an intelligent Bayesian optimization class to loop</div>
                </div>
              </div>
              <button
                onClick={() => setUseTuning(!useTuning)}
                className={`w-11 h-6 rounded-full p-0.5 transition duration-200 ${
                  useTuning ? "bg-[#00FF41]" : "bg-white/10"
                }`}
              >
                <div
                  className={`bg-black w-5 h-5 rounded-full shadow-md transform transition duration-200 ${
                    useTuning ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Grandmaster tricks checklist */}
            <div>
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-2">Advanced Pipeline Components</label>
              <div className="flex flex-col gap-2">
                {[
                  "Target Encoding",
                  "Pseudo-Labeling on Test Data",
                  "Feature Interaction Multipliers",
                  "CatBoost + LightGBM + XGBoost Ensemble"
                ].map((trick) => (
                  <button
                    key={trick}
                    onClick={() => toggleTrick(trick)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs transition duration-150 border ${
                      selectedTricks.includes(trick)
                        ? "bg-[#00FF41]/10 border-[#00FF41]/30 text-[#00FF41]"
                        : "bg-black/40 border-white/5 hover:border-white/10 text-white/50"
                    }`}
                  >
                    <span className="font-mono text-[11px]">{trick}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      selectedTricks.includes(trick) 
                        ? "border-[#00FF41] bg-[#00FF41] text-black" 
                        : "border-white/20"
                    }`}>
                      {selectedTricks.includes(trick) && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom instruction prompt */}
            <div>
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">Custom Agent Instructions (Optional)</label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Try engineering standard log scales on numerical properties, or use early stopping rounds=150."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF41]/70 h-16 resize-none placeholder:text-zinc-600 font-mono"
              />
            </div>

            {/* Submit Pipeline Blueprint */}
            <button
              onClick={handleGenerateStrategy}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 ${
                isGenerating
                  ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                  : "bg-[#00FF41] hover:bg-[#00FF41]/80 text-black shadow-lg shadow-[#00FF41]/10 hover:shadow-[#00FF41]/25 active:scale-98"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agent Collaboration...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Generate Agent Strategy & Code</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Side: IDE & Workspace Results (7 Cols) */}
        <section id="workspace_panel" className="lg:col-span-7 flex flex-col gap-6 relative z-10">
          
          {/* Panel Tabs */}
          <div className="bg-[#080808] border border-white/5 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden relative">
            
            {/* Tab header with Sophisticated Dark visual aesthetics */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-white/10">
              <div className="flex gap-1.5 bg-black/60 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition duration-150 font-mono ${
                    activeTab === "code"
                      ? "bg-[#080808] text-[#00FF41] shadow-sm border border-white/10"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Python Pipeline</span>
                </button>
                <button
                  onClick={() => setActiveTab("agents")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition duration-150 font-mono ${
                    activeTab === "agents"
                      ? "bg-[#080808] text-[#00FF41] shadow-sm border border-white/10"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>Agent Team Sync</span>
                </button>
                <button
                  onClick={() => setActiveTab("data")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition duration-150 font-mono ${
                    activeTab === "data"
                      ? "bg-[#080808] text-[#00FF41] shadow-sm border border-white/10"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Schema & EDA</span>
                </button>
              </div>

              {/* Sub-actions based on selected tab */}
              {activeTab === "code" && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 bg-black border border-white/5 rounded-lg hover:border-white/20 transition duration-150 text-white/60 hover:text-[#00FF41]"
                    title="Copy Pipeline Code"
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={downloadCode}
                    className="p-1.5 bg-black border border-white/5 rounded-lg hover:border-white/20 transition duration-150 text-white/60 hover:text-[#00FF41]"
                    title="Download Python Script"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={runCodeSimulator}
                    disabled={isRunningSim}
                    className="bg-[#00FF41] hover:bg-[#00FF41]/80 text-black font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition duration-150 disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed shadow-md shadow-[#00FF41]/5 font-mono uppercase"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRunningSim ? "Simulating..." : "Simulate Local Run"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab content space */}
            <div className="flex-1 overflow-y-auto relative bg-[#050505]/40">
              
              {/* Tab 1: Python Editor */}
              {activeTab === "code" && (
                <div className="h-full flex flex-col font-mono text-xs text-[#E0E0E0] relative">
                  
                  {/* Explanation box popup if selected */}
                  <AnimatePresence>
                    {selectedCodeSection && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute bottom-4 left-4 right-4 bg-[#0A0A0A] border border-[#00FF41]/20 rounded-xl p-4 shadow-2xl z-20 flex gap-3"
                      >
                        <div className="text-[#00FF41]">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#00FF41] uppercase tracking-wider font-mono">
                              Grandmaster Highlight: {selectedCodeSection}
                            </span>
                            <button 
                              onClick={() => setSelectedCodeSection(null)} 
                              className="text-white/40 hover:text-white text-xs font-sans"
                            >
                              ✕ Close
                            </button>
                          </div>
                          <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                            {codeExplanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Runnable Simulator Terminal overlay if active */}
                  {isRunningSim && (
                    <div className="absolute inset-0 bg-black/95 z-30 flex flex-col p-5 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                        <div className="flex items-center gap-2 text-[#00FF41]">
                          <Terminal className="w-4 h-4 animate-pulse" />
                          <span className="font-semibold uppercase tracking-wider text-[10px]">Local Submission Sandbox</span>
                        </div>
                        <div className="text-white/40 text-[10px]">{simProgress}% Complete</div>
                      </div>
                      
                      {/* Streaming terminal logs */}
                      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-white/10">
                        {simLogs.map((log, i) => (
                          <div key={i} className={`leading-relaxed ${
                            log.startsWith("🔄") ? "text-amber-400" : log.startsWith("🏆") || log.startsWith("✅") ? "text-[#00FF41]" : "text-white/70"
                          }`}>
                            {log}
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#00FF41] h-full transition-all duration-300" style={{ width: `${simProgress}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic interactive line clickable zones */}
                  <div className="p-4 leading-relaxed overflow-x-auto select-text whitespace-pre-wrap flex-1">
                    <div className="text-white/40 text-[10px] mb-3 border-b border-white/5 pb-2 flex items-center gap-1.5 font-sans">
                      <Info className="w-3.5 h-3.5 text-[#00FF41]" />
                      <span>💡 Code is fully interactive. Click highlighted tags below to query Grandmaster structural insights.</span>
                    </div>

                    <div className="mb-4">
                      <button 
                        onClick={() => handleCodeLineClick("Leakage Prevention", "This baseline sets up custom Out-Of-Fold tracking. It ensures your cross-validation folds strictly match standard data-science constraints. By computing mean Target Encoding values solely on the training splits of each cross-validation fold, we avoid data leakage into your validation metrics.")} 
                        className="bg-[#00FF41]/15 hover:bg-[#00FF41]/25 text-[#00FF41] border border-[#00FF41]/30 text-[10px] px-2.5 py-0.5 rounded-md mr-2 uppercase tracking-wide font-semibold cursor-pointer transition duration-150"
                      >
                        🔍 Leakage Prevention
                      </button>
                      <button 
                        onClick={() => handleCodeLineClick("Ensemble Model Weights", "A combined LightGBM and XGBoost architecture maximizes diverse feature learning. LightGBM optimizes column-wise fraction leaf-wise growth, while XGBoost handles symmetric level-wise adjustments. Combining their prediction indexes with a 0.6 / 0.4 split typically yields a 0.003-0.007 score lift on general tabular data.")} 
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] px-2.5 py-0.5 rounded-md mr-2 uppercase tracking-wide font-semibold cursor-pointer transition duration-150"
                      >
                        🔍 Ensemble Strategy
                      </button>
                      {useTuning && (
                        <button 
                          onClick={() => handleCodeLineClick("Optuna Search Space", "To run hyperparameter tuning autonomously, Optuna's TPESampler is implemented. This conducts a Tree-structured Parzen Estimator search over key values like num_leaves, max_depth, learning_rate, and reg_alpha. It ensures optimization doesn't overfit local splits.")} 
                          className="bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 text-[10px] px-2.5 py-0.5 rounded-md mr-2 uppercase tracking-wide font-semibold cursor-pointer transition duration-150"
                        >
                          🔍 Optuna Tuning
                        </button>
                      )}
                    </div>

                    {/* Format the python code for visual display */}
                    <pre className="text-white/90 font-mono text-[11px] leading-relaxed">{pythonCode}</pre>
                  </div>
                </div>
              )}

              {/* Tab 2: Agent Team Sync (Insights) */}
              {activeTab === "agents" && (
                <div className="p-6 flex flex-col gap-6">
                  
                  {/* Domain Expert */}
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="bg-[#00FF41]/10 text-[#00FF41] w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[#00FF41]/20">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">🧠 Domain Expert Agent</h3>
                      <p className="text-xs text-[#E0E0E0]/80 leading-relaxed font-sans">{domainInsight}</p>
                    </div>
                  </div>

                  {/* Feature Engineer */}
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="bg-amber-500/10 text-amber-400 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">🛠️ Feature Engineer Agent</h3>
                      <p className="text-xs text-[#E0E0E0]/80 leading-relaxed font-sans">{featureInsight}</p>
                    </div>
                  </div>

                  {/* ML Modeler */}
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="bg-fuchsia-500/10 text-fuchsia-400 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-fuchsia-500/20">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">🤖 ML Modeler Agent</h3>
                      <p className="text-xs text-[#E0E0E0]/80 leading-relaxed font-sans">{modelingInsight}</p>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 3: Schema Analysis / EDA */}
              {activeTab === "data" && (
                <div className="p-6 flex flex-col gap-6">
                  
                  {/* File Upload Component */}
                  <div className="bg-black/40 border border-dashed border-white/10 hover:border-[#00FF41]/40 transition duration-300 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
                       onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                       onDragLeave={() => setIsDragActive(false)}
                       onDrop={(e) => { e.preventDefault(); setIsDragActive(false); if (e.dataTransfer.files?.[0]) handleCSVParseAndAnalyze(e.dataTransfer.files[0]); }}
                  >
                    {isDragActive && (
                      <div className="absolute inset-0 bg-[#00FF41]/5 backdrop-blur-sm pointer-events-none flex items-center justify-center">
                        <span className="text-sm font-mono text-[#00FF41] font-bold animate-pulse">DROP CSV FILE HERE</span>
                      </div>
                    )}
                    
                    {isAnalyzingData ? (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <RefreshCw className="w-8 h-8 text-[#00FF41] animate-spin" />
                        <span className="text-xs font-mono text-[#00FF41] animate-pulse">AI AGENTS RUNNING COMPREHENSIVE DATASET PROFILING...</span>
                      </div>
                    ) : uploadedFileName ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-[#00FF41]/10 rounded-full flex items-center justify-center border border-[#00FF41]/20">
                          <FileText className="w-6 h-6 text-[#00FF41]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-white">{uploadedFileName}</span>
                          <span className="text-[10px] text-white/40">CSV schema parsed and analyzed successfully</span>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFileName(null);
                            setQualityInsights([]);
                            setProposedFeatures([]);
                            setEdaSummary("");
                            setSelectedTemplate(COMPETITION_TEMPLATES[0]);
                          }}
                          className="text-[10px] uppercase font-mono text-rose-500 hover:text-rose-400 font-bold border border-rose-500/20 bg-rose-500/5 px-2.5 py-1 rounded transition mt-2"
                        >
                          Reset Uploaded Data
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-2.5 group">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#00FF41]/30 group-hover:bg-[#00FF41]/5 transition">
                          <Upload className="w-5 h-5 text-white/60 group-hover:text-[#00FF41] transition" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-white group-hover:text-[#00FF41] transition">UPLOAD LOCAL CSV DATASET</span>
                          <span className="text-[10px] text-white/40 font-mono mt-0.5">DRAG & DROP OR CLICK TO CHOOSE (E.G. TRAIN.CSV)</span>
                        </div>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => { if (e.target.files?.[0]) handleCSVParseAndAnalyze(e.target.files[0]); }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Dynamic Agent EDA Summary & Quality Insights */}
                  {uploadedFileName && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Quality Insights */}
                      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Dataset Quality Insights</h4>
                        </div>
                        {qualityInsights.length > 0 ? (
                          <ul className="flex flex-col gap-2">
                            {qualityInsights.map((insight, idx) => (
                              <li key={idx} className="text-xs text-white/70 font-sans flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5 font-bold">▪</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-white/40 italic font-mono">No data anomalies identified by agents.</p>
                        )}
                      </div>

                      {/* Right: Proposed Feature Engineering Derivatives */}
                      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Proposed Derivative Features</h4>
                        </div>
                        {proposedFeatures.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {proposedFeatures.map((feat, idx) => (
                              <div key={idx} className="flex flex-col gap-0.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-mono font-bold text-[#00FF41]">{feat.name}</span>
                                  <span className="text-[9px] uppercase tracking-wider font-mono text-white/30">{feat.derivation}</span>
                                </div>
                                <p className="text-[11px] text-white/60 leading-normal">{feat.rationale}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-white/40 italic font-mono">No advanced derivatives generated yet.</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2 font-mono">Column Schema Analysis</h3>
                    <p className="text-xs text-white/50 mb-4 font-sans">
                      Data layout for <strong>{customTitle}</strong> target. Features represent the core properties fed to validation models.
                    </p>
                    
                    {/* Schema Table */}
                    <div className="bg-black/60 border border-white/10 rounded-xl overflow-hidden mb-6">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#0A0A0A] text-white/50 border-b border-white/10 font-mono text-[10px] uppercase">
                            <th className="px-4 py-2.5">Feature Column</th>
                            <th className="px-4 py-2.5">Type Class</th>
                            <th className="px-4 py-2.5">Null Ratio</th>
                            <th className="px-4 py-2.5">Kaggle Rank Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTemplate.columns.map((col, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                              <td className="px-4 py-3 font-mono font-bold text-[#00FF41]">{col.name}</td>
                              <td className="px-4 py-3 text-white/80 font-mono">{col.type}</td>
                              <td className="px-4 py-3 text-white/40 font-mono">{col.missing}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden w-24">
                                    <div className="bg-[#00FF41] h-full" style={{ width: `${col.importance * 2}%` }} />
                                  </div>
                                  <span className="font-mono text-[10px] text-white/40">{col.importance}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Feature Importance Vector */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2 font-mono">Agent-Predicted Feature Importances</h3>
                    <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                      {featureImportances.slice(0, 8).map((imp, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-white/70">{imp.feature}</span>
                            <span className="text-[#00FF41] font-semibold">{((imp.importance || 0)).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                            <div className="bg-[#00FF41] h-full rounded-full" style={{ width: `${imp.importance}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Leaderboard overlay trigger */}
            {showLeaderboard && (
              <div className="absolute inset-0 bg-black/95 z-40 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#0A0A0A] border border-[#00FF41]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center"
                >
                  <div className="bg-[#00FF41] text-black p-4 rounded-full mb-4 shadow-lg shadow-[#00FF41]/20">
                    <Trophy className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 font-mono">Local Pipeline Submitted!</h3>
                  <p className="text-xs text-white/40 mb-6">Evaluating validation score against online test set labels...</p>
                  
                  <div className="bg-black border border-white/5 rounded-xl py-4 px-6 w-full mb-6 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50 uppercase tracking-wider font-mono">Out-Of-Fold {scoreMetric}</span>
                      <span className="text-sm font-bold text-[#00FF41] font-mono">{simulatedScore.toFixed(4)}</span>
                    </div>
                    <div className="h-px bg-white/5"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50 uppercase tracking-wider font-mono">Simulated Kaggle Rank</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 font-mono">
                        #{leaderboardRank} <span className="text-[10px] text-[#00FF41] font-normal">(Top {((leaderboardRank / 3402) * 100).toFixed(1)}%)</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 mb-6 font-sans">
                    🏆 Awesome! The advanced ensembling and leakage protections engineered by the agents have put you deep in the medal standings zone!
                  </p>

                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="w-full py-2.5 bg-[#00FF41] hover:bg-[#00FF41]/80 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition duration-150"
                  >
                    Return to Code Workspace
                  </button>
                </motion.div>
              </div>
            )}

          </div>

          {/* Chat Interaction Refinement Center */}
          <div className="bg-[#080808] border border-white/5 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <MessageSquare className="w-4 h-4 text-[#00FF41]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Collaborative Critique Sandbox</h2>
              <span className="ml-auto bg-black border border-white/10 text-white/40 text-[10px] font-mono px-2 py-0.5 rounded">
                Direct Chat with Agents
              </span>
            </div>

            {/* Chat History Box */}
            <div className="bg-[#050505] border border-white/5 rounded-xl p-4 h-36 overflow-y-auto flex flex-col gap-3 mb-3 scrollbar-thin scrollbar-thumb-white/10">
              {chatHistory.length === 0 ? (
                <div className="text-center text-white/30 text-xs my-auto italic flex flex-col items-center gap-1 font-mono">
                  <Cpu className="w-6 h-6 stroke-[1.5] text-[#00FF41]" />
                  <span>No feedback logs yet. Engage the strategy above to initiate discussion.</span>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col text-xs rounded-xl p-2.5 max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-[#00FF41]/10 border border-[#00FF41]/25 text-[#00FF41] self-end"
                        : "bg-[#0A0A0A] border border-white/10 text-white/80 self-start"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-white/40 mb-1 font-mono">
                      {msg.sender === "user" ? "You" : "Agent Collective"}
                    </span>
                    <p className="leading-relaxed font-sans">{msg.text}</p>
                  </div>
                ))
              )}
              {isChatting && (
                <div className="bg-[#0A0A0A] text-white/40 border border-white/5 text-xs rounded-xl p-2.5 max-w-[80%] self-start animate-pulse font-mono">
                  Agents are analyzing the directive, refactoring the Python pipelines, and re-calculating local scores...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={chatHistory.length === 0 ? "Ask agents to design a custom pipeline or suggest features..." : "Suggest tweaks e.g. 'Use XGBoost instead of LightGBM'"}
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF41]/80 font-mono"
                disabled={isChatting}
              />
              <button
                type="submit"
                disabled={isChatting || !chatInput.trim()}
                className="bg-[#00FF41] hover:bg-[#00FF41]/80 text-black p-2.5 rounded-xl transition duration-150 disabled:bg-white/5 disabled:text-white/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </section>

      </main>

      {/* Sophisticated Dark Bottom Status Bar / Footer */}
      <footer className="h-10 bg-black border-t border-white/10 px-8 flex items-center justify-between font-mono text-[9px] tracking-wider opacity-60 w-full mt-12">
        <div className="flex gap-6">
          <span>COORDINATES: 37.7749° N, 122.4194° W</span>
          <span>SEED: 0x8FA2B9</span>
          <span>UPTIME: 42:12:09</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></div>
          <span>AGENT_ONLINE</span>
        </div>
      </footer>
    </div>
  );
}
