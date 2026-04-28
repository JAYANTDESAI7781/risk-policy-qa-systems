import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8000/api/query";

const SAMPLES = {
  "🇮🇳 Indian Laws": [
    "What is SARFAESI Act and how does it help banks recover NPAs?",
    "Explain RBI's Prompt Corrective Action (PCA) framework",
    "What are NPA classification norms under RBI guidelines?",
    "How does IBC 2016 help resolve stressed bank assets?",
    "What is Priority Sector Lending and its norms in India?",
    "Explain CRR and SLR requirements for Indian banks",
  ],
  "🌍 International": [
    "What is credit risk in mortgage lending?",
    "Explain Basel III capital requirements",
    "How to assess counterparty risk in derivatives?",
    "What are AML red flags in banking?",
    "How does liquidity risk affect banks?",
    "What is VaR in market risk management?",
  ],
};

const RISK_STYLE = {
  LOW:      { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)", glow: "rgba(16,185,129,0.4)", label: "LOW RISK",      icon: "🛡️" },
  MEDIUM:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)", glow: "rgba(245,158,11,0.4)", label: "MEDIUM RISK",   icon: "⚠️" },
  HIGH:     { color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.3)", glow: "rgba(249,115,22,0.4)", label: "HIGH RISK",     icon: "🔥" },
  CRITICAL: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",  glow: "rgba(239,68,68,0.4)",  label: "CRITICAL RISK", icon: "🚨" },
};

const CAT_COLOR = {
  "Credit Risk":      "#60a5fa",
  "Market Risk":      "#a78bfa",
  "Operational Risk": "#fb923c",
  "Liquidity Risk":   "#34d399",
  "Compliance":       "#f472b6",
  "NPA Management":   "#f87171",
  "Other":            "#94a3b8",
};

const INDIAN_LAWS = [
  { name: "RBI Act 1934",              desc: "Establishes RBI & monetary policy",        icon: "🏛️" },
  { name: "Banking Regulation Act 1949", desc: "Core law governing Indian banks",         icon: "📜" },
  { name: "SARFAESI Act 2002",         desc: "NPA recovery without court",                icon: "⚖️" },
  { name: "IBC 2016",                  desc: "Insolvency & Bankruptcy resolution",        icon: "🔨" },
  { name: "PMLA 2002",                 desc: "Prevention of Money Laundering",            icon: "🚫" },
  { name: "FEMA 1999",                 desc: "Foreign Exchange Management",               icon: "💱" },
  { name: "SEBI Regulations",          desc: "Capital markets & investment banking",      icon: "📈" },
  { name: "KYC/AML RBI 2016",          desc: "Customer verification master directions",  icon: "🪪" },
];

function RiskMeter({ score, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(score), 200); }, [score]);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>RISK SCORE</span>
        <span style={{ fontSize: 22, fontWeight: 800, color }}>{score}<span style={{ fontSize: 13, color: "#64748b" }}>/100</span></span>
      </div>
      <div style={{ height: 14, background: "#1e293b", borderRadius: 99, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {["#10b98130","#f59e0b30","#f9731630","#ef444430"].map((c,i) => <div key={i} style={{ flex:1, background:c, borderRight:i<3?"1px solid #0f172a":"none" }} />)}
        </div>
        <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${w}%`, background:`linear-gradient(90deg,#10b981,${color})`, borderRadius:99, transition:"width 1.5s cubic-bezier(.4,0,.2,1)", boxShadow:`0 0 12px ${color}80` }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        {["Safe","Moderate","High","Critical"].map((l,i) => <span key={i} style={{ fontSize:9, color:"#475569", width:"25%", textAlign:i===0?"left":i===3?"right":"center" }}>{l}</span>)}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────
function Dashboard({ history }) {
  const total    = history.length;
  const critical = history.filter(h => h.risk_level==="CRITICAL").length;
  const high     = history.filter(h => h.risk_level==="HIGH").length;
  const medium   = history.filter(h => h.risk_level==="MEDIUM").length;
  const low      = history.filter(h => h.risk_level==="LOW").length;
  const avgScore = total ? Math.round(history.reduce((a,h)=>a+h.risk_score,0)/total) : 0;
  const cats = {};
  history.forEach(h => { cats[h.category]=(cats[h.category]||0)+1; });

  return (
    <div style={{ animation:"fadein .4s ease" }}>
      <h2 style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>Dashboard</h2>
      <p style={{ fontSize:13, color:"#475569", marginBottom:24 }}>Overview of your banking risk analysis activity</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Total Queries",   value:total,    icon:"🔍", color:"#6366f1" },
          { label:"Avg Risk Score",  value:avgScore, icon:"📊", color:"#f59e0b" },
          { label:"Critical Alerts", value:critical, icon:"🚨", color:"#ef4444" },
          { label:"Low Risk",        value:low,      icon:"🛡️", color:"#10b981" },
        ].map(({ label,value,icon,color }) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${color}25`, borderRadius:16, padding:20, borderTop:`3px solid ${color}` }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{icon}</div>
            <div style={{ fontSize:28, fontWeight:900, color, marginBottom:4 }}>{value}</div>
            <div style={{ fontSize:12, color:"#475569" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
          <h3 style={{ fontSize:12, fontWeight:700, color:"#94a3b8", letterSpacing:"1px", marginBottom:16 }}>RISK DISTRIBUTION</h3>
          {[{label:"Low",count:low,color:"#10b981"},{label:"Medium",count:medium,color:"#f59e0b"},{label:"High",count:high,color:"#f97316"},{label:"Critical",count:critical,color:"#ef4444"}].map(({label,count,color})=>(
            <div key={label} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"#94a3b8" }}>{label}</span>
                <span style={{ fontSize:12, color, fontWeight:700 }}>{count}</span>
              </div>
              <div style={{ height:8, background:"#1e293b", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:total?`${(count/total)*100}%`:"0%", background:color, borderRadius:99, transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
          <h3 style={{ fontSize:12, fontWeight:700, color:"#94a3b8", letterSpacing:"1px", marginBottom:16 }}>CATEGORY BREAKDOWN</h3>
          {total===0 ? <p style={{ fontSize:13, color:"#334155", textAlign:"center", marginTop:30 }}>No data yet!</p>
            : Object.entries(cats).map(([cat,count])=>(
              <div key={cat} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:CAT_COLOR[cat]||"#94a3b8", flexShrink:0 }} />
                <span style={{ fontSize:12, color:"#94a3b8", flex:1 }}>{cat}</span>
                <span style={{ fontSize:13, fontWeight:700, color:CAT_COLOR[cat]||"#94a3b8" }}>{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Indian Laws Reference Card */}
      <div style={{ background:"rgba(255,165,0,0.05)", border:"1px solid rgba(255,165,0,0.2)", borderRadius:16, padding:20 }}>
        <h3 style={{ fontSize:12, fontWeight:700, color:"#fb923c", letterSpacing:"1px", marginBottom:16 }}>🇮🇳 INDIAN BANKING LAWS REFERENCE</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {INDIAN_LAWS.map(({ name,desc,icon }) => (
            <div key={name} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,165,0,0.15)", borderRadius:12, padding:12 }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#fed7aa", marginBottom:3 }}>{name}</div>
              <div style={{ fontSize:10, color:"#78716c" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {total===0 && (
        <div style={{ textAlign:"center", padding:"30px 0", color:"#334155", marginTop:16 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
          <p style={{ fontSize:14 }}>No queries yet. Go to Analysis to get started!</p>
        </div>
      )}
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────
function Reports({ history }) {
  const [filter, setFilter] = useState("ALL");
  const levels = ["ALL","LOW","MEDIUM","HIGH","CRITICAL"];
  const filtered = filter==="ALL" ? history : history.filter(h=>h.risk_level===filter);

  function exportCSV() {
    if (!history.length) return;
    const headers = ["Query","Risk Level","Risk Score","Category","Confidence","Indian Context","Timestamp"];
    const rows = history.map(h => [`"${h.query}"`,h.risk_level,h.risk_score,h.category,h.confidence,`"${h.indian_context||""}"`,h.timestamp]);
    const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="risk_report_india.csv"; a.click();
  }

  return (
    <div style={{ animation:"fadein .4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>Reports</h2>
          <p style={{ fontSize:13, color:"#475569" }}>All your risk analysis reports with Indian regulatory context</p>
        </div>
        <button onClick={exportCSV} disabled={!history.length}
          style={{ padding:"10px 20px", background:history.length?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.05)", border:"none", borderRadius:12, color:history.length?"white":"#334155", fontSize:13, fontWeight:700, cursor:history.length?"pointer":"not-allowed", fontFamily:"inherit" }}>
          ⬇️ Export CSV
        </button>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {levels.map(l => {
          const active = filter===l;
          const hs = RISK_STYLE[l];
          return (
            <button key={l} onClick={()=>setFilter(l)}
              style={{ padding:"6px 16px", background:active?(hs?.color||"#6366f1")+"25":"rgba(255,255,255,0.04)", border:`1.5px solid ${active?(hs?.color||"#6366f1"):"rgba(255,255,255,0.1)"}`, borderRadius:99, color:active?(hs?.color||"#818cf8"):"#475569", fontSize:12, fontWeight:active?700:400, cursor:"pointer", fontFamily:"inherit" }}>
              {l}
            </button>
          );
        })}
      </div>

      {filtered.length===0 ? (
        <div style={{ textAlign:"center", padding:"50px 0", color:"#334155" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📋</div>
          <p>No reports found. Run some queries in Analysis!</p>
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"12px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.03)" }}>
            {["Query","Risk Level","Score","Category","Indian Law"].map(h => (
              <span key={h} style={{ fontSize:10, fontWeight:700, color:"#475569", letterSpacing:"1px" }}>{h}</span>
            ))}
          </div>
          {filtered.map((h,i) => {
            const hs = RISK_STYLE[h.risk_level]||RISK_STYLE.MEDIUM;
            const hc = CAT_COLOR[h.category]||CAT_COLOR.Other;
            return (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"14px 18px", borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,0.04)":"none", alignItems:"center" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:12, color:"#cbd5e1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:12 }}>{h.query}</span>
                <span style={{ fontSize:11, color:hs.color, fontWeight:700 }}>{hs.icon} {h.risk_level}</span>
                <span style={{ fontSize:13, color:hs.color, fontWeight:800 }}>{h.risk_score}</span>
                <span style={{ fontSize:11, color:hc, fontWeight:600 }}>{h.category}</span>
                <span style={{ fontSize:10, color:"#fb923c" }}>{h.indian_context ? "🇮🇳 Yes" : "—"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────
function Settings({ settings, setSettings }) {
  return (
    <div style={{ animation:"fadein .4s ease" }}>
      <h2 style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>Settings</h2>
      <p style={{ fontSize:13, color:"#475569", marginBottom:24 }}>Configure your Risk Sentinel preferences</p>

      {[
        { section:"API Configuration", items:[
          { label:"Backend URL", sublabel:"FastAPI server endpoint", type:"input", key:"apiUrl" },
          { label:"AI Model",    sublabel:"Groq model being used",   type:"select", key:"model", options:["llama-3.3-70b-versatile","llama-3.1-8b-instant","mixtral-8x7b-32768","gemma2-9b-it"] },
        ]},
        { section:"Display Preferences", items:[
          { label:"Show Confidence Score",  sublabel:"Display AI confidence percentage", type:"toggle", key:"showConfidence" },
          { label:"Show Indian Context",    sublabel:"Display Indian law context box",   type:"toggle", key:"showIndian" },
          { label:"Show Timestamp",         sublabel:"Display query timestamps",         type:"toggle", key:"showTimestamp" },
          { label:"Auto-switch to Result",  sublabel:"Auto navigate to result tab",      type:"toggle", key:"autoSwitch" },
        ]},
        { section:"Risk Thresholds", items:[
          { label:"High Risk Threshold",     sublabel:"Score above this = HIGH",     type:"range", key:"highThreshold",   min:50, max:90 },
          { label:"Critical Risk Threshold", sublabel:"Score above this = CRITICAL", type:"range", key:"critThreshold",   min:70, max:99 },
        ]},
      ].map(({ section, items }) => (
        <div key={section} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20, marginBottom:16 }}>
          <h3 style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"1.5px", marginBottom:18 }}>{section.toUpperCase()}</h3>
          {items.map(({ label,sublabel,type,key,options,min,max }) => (
            <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ fontSize:14, color:"#e2e8f0", marginBottom:2 }}>{label}</div>
                <div style={{ fontSize:11, color:"#475569" }}>{sublabel}</div>
              </div>
              {type==="toggle" && (
                <div onClick={()=>setSettings(s=>({...s,[key]:!s[key]}))}
                  style={{ width:44, height:24, borderRadius:99, background:settings[key]?"#6366f1":"#1e293b", border:`1px solid ${settings[key]?"#6366f1":"rgba(255,255,255,0.1)"}`, cursor:"pointer", position:"relative", transition:"all .3s" }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"white", position:"absolute", top:2, left:settings[key]?22:2, transition:"left .3s" }} />
                </div>
              )}
              {type==="input" && (
                <input value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))}
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"6px 12px", color:"#e2e8f0", fontSize:12, outline:"none", width:220, fontFamily:"inherit" }} />
              )}
              {type==="select" && (
                <select value={settings[key]} onChange={e=>setSettings(s=>({...s,[key]:e.target.value}))}
                  style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"6px 12px", color:"#e2e8f0", fontSize:12, outline:"none", fontFamily:"inherit", cursor:"pointer" }}>
                  {options.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {type==="range" && (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <input type="range" min={min} max={max} value={settings[key]}
                    onChange={e=>setSettings(s=>({...s,[key]:Number(e.target.value)}))}
                    style={{ width:120, accentColor:"#6366f1" }} />
                  <span style={{ fontSize:13, color:"#6366f1", fontWeight:700, minWidth:30 }}>{settings[key]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
        <button onClick={()=>setSettings({ apiUrl:"http://localhost:8000/api/query", model:"llama-3.3-70b-versatile", showConfidence:true, showIndian:true, showTimestamp:true, autoSwitch:true, highThreshold:60, critThreshold:80 })}
          style={{ padding:"10px 20px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#94a3b8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          Reset Defaults
        </button>
        <button style={{ padding:"10px 24px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:12, color:"white", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Save Settings ✓
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [page, setPage]     = useState("analysis");
  const [query, setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState(null);
  const [history, setHistory] = useState([]);
  const [tab, setTab]       = useState("query");
  const [sampleTab, setSampleTab] = useState("🇮🇳 Indian Laws");
  const [settings, setSettings] = useState({
    apiUrl:"http://localhost:8000/api/query",
    model:"llama-3.3-70b-versatile",
    showConfidence:true,
    showIndian:true,
    showTimestamp:true,
    autoSwitch:true,
    highThreshold:60,
    critThreshold:80,
  });
  const ref = useRef();

  async function submit() {
    if (!query.trim()||loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(settings.apiUrl, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ query }),
      });
      if (!res.ok) { const e=await res.json(); throw new Error(e.detail||"Error"); }
      const data = await res.json();
      setResult(data);
      setHistory(h=>[data,...h.slice(0,19)]);
      if (settings.autoSwitch) setTab("result");
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const rs = result?(RISK_STYLE[result.risk_level]||RISK_STYLE.MEDIUM):null;
  const cc = result?(CAT_COLOR[result.category]||CAT_COLOR.Other):null;

  const NAV = [
    { id:"dashboard", label:"Dashboard", icon:"📊" },
    { id:"analysis",  label:"Analysis",  icon:"🔍" },
    { id:"reports",   label:"Reports",   icon:"📋" },
    { id:"settings",  label:"Settings",  icon:"⚙️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#020817", color:"#e2e8f0", fontFamily:"'Segoe UI', system-ui, sans-serif" }}>

      {/* Background */}
      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", top:-200, left:-200 }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)", bottom:-100, right:-100 }} />
      </div>

      {/* Navbar */}
      <nav style={{ position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 32px", display:"flex", alignItems:"center", height:64, background:"rgba(2,8,23,0.9)", backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginRight:32 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(99,102,241,0.5)" }}>
            <span style={{ fontSize:18 }}>🏦</span>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, background:"linear-gradient(135deg,#e2e8f0,#94a3b8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Risk Sentinel</div>
            <div style={{ fontSize:9, color:"#475569", letterSpacing:"1.5px" }}>🇮🇳 INDIA + GLOBAL BANKING AI</div>
          </div>
        </div>

        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)}
            style={{ padding:"8px 16px", background:page===n.id?"rgba(99,102,241,0.15)":"transparent", border:page===n.id?"1px solid rgba(99,102,241,0.3)":"1px solid transparent", borderRadius:10, color:page===n.id?"#818cf8":"#475569", fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:page===n.id?700:400, display:"flex", alignItems:"center", gap:6, transition:"all .2s", marginRight:4 }}>
            {n.icon} {n.label}
          </button>
        ))}

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 8px #10b981" }} />
          <span style={{ fontSize:12, color:"#10b981", fontWeight:600 }}>Online</span>
        </div>
      </nav>

      <div style={{ position:"relative", zIndex:1, maxWidth:1100, margin:"0 auto", padding:"32px 20px" }}>

        {page==="dashboard" && <Dashboard history={history} />}
        {page==="reports"   && <Reports history={history} />}
        {page==="settings"  && <Settings settings={settings} setSettings={setSettings} />}

        {page==="analysis" && (
          <>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ display:"inline-flex", gap:8, marginBottom:14 }}>
                <span style={{ padding:"4px 14px", background:"rgba(251,146,60,0.15)", border:"1px solid rgba(251,146,60,0.3)", borderRadius:99, fontSize:11, color:"#fb923c", fontWeight:600 }}>🇮🇳 Indian Banking Laws</span>
                <span style={{ padding:"4px 14px", background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:99, fontSize:11, color:"#818cf8", fontWeight:600 }}>🌍 International Standards</span>
              </div>
              <h1 style={{ fontSize:38, fontWeight:900, lineHeight:1.15, marginBottom:10 }}>
                <span style={{ background:"linear-gradient(135deg,#e2e8f0,#94a3b8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Banking Risk</span><br />
                <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Policy Intelligence</span>
              </h1>
              <p style={{ fontSize:14, color:"#64748b", maxWidth:520, margin:"0 auto" }}>
                AI-powered risk analysis covering RBI guidelines, SARFAESI, IBC, PMLA, Basel III, Dodd-Frank & more
              </p>
            </div>

            {/* Main Card */}
            <div style={{ background:"rgba(15,23,42,0.8)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, overflow:"hidden", boxShadow:"0 25px 80px rgba(0,0,0,0.4)", backdropFilter:"blur(20px)" }}>
              {/* Tabs */}
              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 24px" }}>
                {[
                  { id:"query",   label:"Query",             icon:"🔍" },
                  { id:"result",  label:"Result",            icon:"📊", disabled:!result },
                  { id:"history", label:`History (${history.length})`, icon:"🕐", disabled:history.length===0 },
                ].map(t=>(
                  <button key={t.id} onClick={()=>!t.disabled&&setTab(t.id)} disabled={t.disabled}
                    style={{ padding:"16px 20px", background:"transparent", border:"none", borderBottom:tab===t.id?"2px solid #6366f1":"2px solid transparent", color:t.disabled?"#1e293b":tab===t.id?"#6366f1":"#475569", fontSize:13, fontWeight:tab===t.id?700:400, cursor:t.disabled?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, transition:"all .2s" }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <div style={{ padding:28 }}>

                {/* Query Tab */}
                {tab==="query" && (
                  <div>
                    <textarea ref={ref} value={query} onChange={e=>setQuery(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)) submit(); }}
                      rows={4} placeholder="Ask any Indian or international banking risk question..."
                      style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"18px 20px", fontSize:15, color:"#f1f5f9", outline:"none", resize:"none", fontFamily:"inherit", lineHeight:1.7, transition:"all .2s", marginBottom:16 }}
                      onFocus={e=>{ e.target.style.borderColor="#6366f1"; e.target.style.boxShadow="0 0 0 4px rgba(99,102,241,0.1)"; }}
                      onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.boxShadow="none"; }} />

                    {/* Sample Tabs */}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                        {Object.keys(SAMPLES).map(k=>(
                          <button key={k} onClick={()=>setSampleTab(k)}
                            style={{ padding:"5px 14px", background:sampleTab===k?"rgba(251,146,60,0.2)":"rgba(255,255,255,0.04)", border:`1px solid ${sampleTab===k?"rgba(251,146,60,0.5)":"rgba(255,255,255,0.1)"}`, borderRadius:99, color:sampleTab===k?"#fb923c":"#475569", fontSize:12, fontWeight:sampleTab===k?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
                            {k}
                          </button>
                        ))}
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                        {SAMPLES[sampleTab].map((s,i)=>(
                          <button key={i} onClick={()=>{ setQuery(s); ref.current?.focus(); }}
                            style={{ padding:"6px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:99, cursor:"pointer", fontSize:12, color:"#94a3b8", transition:"all .15s", fontFamily:"inherit" }}
                            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(251,146,60,0.15)"; e.currentTarget.style.borderColor="rgba(251,146,60,0.4)"; e.currentTarget.style.color="#fb923c"; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="#94a3b8"; }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, color:"#334155" }}>Ctrl + Enter to submit</span>
                      <button onClick={submit} disabled={loading||!query.trim()}
                        style={{ padding:"13px 32px", background:loading||!query.trim()?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#6366f1,#8b5cf6)", color:loading||!query.trim()?"#334155":"white", border:"none", borderRadius:14, fontSize:14, fontWeight:700, cursor:loading||!query.trim()?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:loading||!query.trim()?"none":"0 8px 25px rgba(99,102,241,0.4)", transition:"all .2s" }}>
                        {loading?"⏳ Analyzing...":"🔍 Analyze Risk →"}
                      </button>
                    </div>

                    {error && <div style={{ marginTop:16, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, padding:"14px 18px", color:"#fca5a5", fontSize:13 }}>⚠️ {error}</div>}

                    {loading && (
                      <div style={{ marginTop:24, textAlign:"center", padding:"30px 0" }}>
                        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:16 }}>
                          {[0,1,2,3].map(i=><div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"#6366f1", animation:`bounce 1.2s ${i*0.2}s infinite` }} />)}
                        </div>
                        <p style={{ fontSize:14, color:"#475569" }}>Analyzing under Indian & International banking frameworks...</p>
                        <p style={{ fontSize:12, color:"#334155", marginTop:4 }}>Checking RBI, SARFAESI, IBC, Basel III, Dodd-Frank...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Result Tab */}
                {tab==="result" && result && (
                  <div style={{ animation:"fadein .4s ease" }}>
                    <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:160, background:rs.bg, border:`1px solid ${rs.border}`, borderRadius:16, padding:18, boxShadow:`0 0 30px ${rs.glow}` }}>
                        <div style={{ fontSize:28, marginBottom:6 }}>{rs.icon}</div>
                        <div style={{ fontSize:20, fontWeight:900, color:rs.color }}>{rs.label}</div>
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>Risk Level</div>
                      </div>
                      <div style={{ flex:1, minWidth:160, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:18 }}>
                        <div style={{ fontSize:11, color:"#475569", letterSpacing:"1px", fontWeight:700, marginBottom:10 }}>CATEGORY</div>
                        <div style={{ padding:"5px 14px", background:cc+"20", color:cc, border:`1.5px solid ${cc}40`, borderRadius:99, fontSize:13, fontWeight:700, display:"inline-block", marginBottom:8 }}>{result.category}</div>
                        {settings.showConfidence && <div style={{ fontSize:12, color:"#475569" }}>Confidence: <span style={{ color:"#e2e8f0", fontWeight:700 }}>{result.confidence}%</span></div>}
                      </div>
                      <div style={{ flex:2, minWidth:260, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:18 }}>
                        <RiskMeter score={result.risk_score} color={rs.color} />
                      </div>
                    </div>

                    {/* Answer */}
                    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderLeft:`4px solid ${rs.color}`, borderRadius:14, padding:18, marginBottom:14 }}>
                      <p style={{ fontSize:11, color:"#475569", letterSpacing:"1px", fontWeight:700, marginBottom:10 }}>AI ANALYSIS</p>
                      <p style={{ fontSize:14, color:"#cbd5e1", lineHeight:1.9, margin:0 }}>{result.answer}</p>
                    </div>

                    {/* 🇮🇳 Indian Context Box */}
                    {settings.showIndian && result.indian_context && (
                      <div style={{ background:"rgba(251,146,60,0.08)", border:"1px solid rgba(251,146,60,0.25)", borderLeft:"4px solid #fb923c", borderRadius:14, padding:16, marginBottom:14 }}>
                        <p style={{ fontSize:11, color:"#fb923c", letterSpacing:"1px", fontWeight:700, marginBottom:8 }}>🇮🇳 INDIAN REGULATORY CONTEXT</p>
                        <p style={{ fontSize:13, color:"#fed7aa", lineHeight:1.7, margin:0 }}>{result.indian_context}</p>
                      </div>
                    )}

                    {/* 3 Cards */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                      {[
                        { title:"Risk Factors",    emoji:"⚠️", color:"#ef4444", items:result.risk_factors },
                        { title:"Recommendations", emoji:"✅", color:"#10b981", items:result.recommendations },
                        { title:"Regulations",     emoji:"📋", color:"#6366f1", items:result.regulatory_refs?.length?result.regulatory_refs:["No specific references"] },
                      ].map(({ title,emoji,color,items })=>(
                        <div key={title} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${color}25`, borderTop:`3px solid ${color}`, borderRadius:14, padding:16 }}>
                          <h3 style={{ fontSize:11, fontWeight:700, color:"#e2e8f0", margin:"0 0 12px", display:"flex", alignItems:"center", gap:6 }}>{emoji} {title.toUpperCase()}</h3>
                          {(items||[]).map((item,i)=>(
                            <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                              <div style={{ width:6, height:6, borderRadius:"50%", background:color, marginTop:5, flexShrink:0, boxShadow:`0 0 6px ${color}` }} />
                              <span style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
                      {settings.showTimestamp && <p style={{ fontSize:11, color:"#334155" }}>{new Date(result.timestamp).toLocaleString()}</p>}
                      <button onClick={()=>{ setTab("query"); setResult(null); setQuery(""); }}
                        style={{ padding:"8px 20px", background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:10, color:"#818cf8", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                        + New Query
                      </button>
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {tab==="history" && (
                  <div>
                    <p style={{ fontSize:11, color:"#475569", letterSpacing:"1px", fontWeight:700, marginBottom:14 }}>QUERY HISTORY</p>
                    {history.map((h,i)=>{
                      const hs=RISK_STYLE[h.risk_level]||RISK_STYLE.MEDIUM;
                      const hc=CAT_COLOR[h.category]||CAT_COLOR.Other;
                      return (
                        <div key={i} onClick={()=>{ setResult(h); setQuery(h.query); setTab("result"); }}
                          style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", marginBottom:8, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, cursor:"pointer", transition:"all .2s" }}
                          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor="rgba(99,102,241,0.3)"; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; }}>
                          <span style={{ fontSize:20 }}>{hs.icon}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontSize:13, color:"#e2e8f0", margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.query}</p>
                            <div style={{ display:"flex", gap:8 }}>
                              <span style={{ fontSize:10, color:hs.color, fontWeight:700 }}>{hs.label}</span>
                              <span style={{ fontSize:10, color:hc }}>{h.category}</span>
                              {h.indian_context && <span style={{ fontSize:10, color:"#fb923c" }}>🇮🇳 Indian Law</span>}
                            </div>
                          </div>
                          <div style={{ textAlign:"right", flexShrink:0 }}>
                            <div style={{ fontSize:16, fontWeight:800, color:hs.color }}>{h.risk_score}</div>
                            <div style={{ fontSize:9, color:"#475569" }}>SCORE</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign:"center", marginTop:24, color:"#1e293b", fontSize:12 }}>
              Built with ⚡ FastAPI + React + Groq AI • Covers RBI, SARFAESI, IBC, PMLA, Basel III & more
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadein { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        *{box-sizing:border-box;margin:0;padding:0}
        textarea::placeholder{color:#334155}
        textarea{color:#f1f5f9 !important}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}
      `}</style>
    </div>
  );
}