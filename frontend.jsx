import { useState, useEffect } from "react";

// ── Purple Palette ────────────────────────────────────────────
const C = {
  bg:       "#F7F4FF",
  surface:  "#FFFFFF",
  card:     "#FFFFFF",
  purpleDk: "#5B21B6",
  purple:   "#7C3AED",
  purpleM:  "#8B5CF6",
  purpleL:  "#A78BFA",
  purpleXL: "#C4B5FD",
  lavender: "#EDE9FE",
  lavXL:    "#F5F3FF",
  ink:      "#1E1B2E",
  inkMid:   "#3D3658",
  muted:    "#7C6FA0",
  border:   "#E4DEFF",
  borderL:  "#F0EBFF",
  accent:   "#EC4899",   // pink pop accent
  accentL:  "#F472B6",
  gold:     "#F59E0B",
  teal:     "#0EA5E9",
  green:    "#10B981",
};

// ── Mock Data ─────────────────────────────────────────────────
const MOCK_ITINERARY = {
  destination: "Goa, India",
  days: [
    { day: 1, title: "Arrive & Unwind", places: [
      { name: "Baga Beach",       time: "10:00 AM", dur: "2 hrs",   type: "Beach",   icon: "🏖" },
      { name: "Tito's Lane",      time: "1:00 PM",  dur: "1 hr",    type: "Food",    icon: "🍽" },
      { name: "Fort Aguada",      time: "3:30 PM",  dur: "1.5 hrs", type: "History", icon: "🏰" },
      { name: "Baga Night Market",time: "7:00 PM",  dur: "2 hrs",   type: "Market",  icon: "🛍" },
    ]},
    { day: 2, title: "Culture & Spice", places: [
      { name: "Old Goa Churches",    time: "9:00 AM",  dur: "2 hrs",   type: "Culture", icon: "⛪" },
      { name: "Spice Plantation",    time: "12:00 PM", dur: "2 hrs",   type: "Nature",  icon: "🌿" },
      { name: "Panjim Café District",time: "3:00 PM",  dur: "1.5 hrs", type: "Food",    icon: "☕" },
      { name: "Dona Paula Beach",    time: "6:00 PM",  dur: "1.5 hrs", type: "Beach",   icon: "🌅" },
    ]},
    { day: 3, title: "Adventure Day", places: [
      { name: "Dudhsagar Falls",   time: "7:00 AM", dur: "4 hrs", type: "Nature",    icon: "💧" },
      { name: "Calangute Beach",   time: "2:00 PM", dur: "2 hrs", type: "Adventure", icon: "🏄" },
      { name: "Anjuna Flea Market",time: "5:00 PM", dur: "2 hrs", type: "Market",    icon: "🎨" },
    ]},
  ],
};

const SAVED_TRIPS = [
  { id: 1, dest: "Manali, HP",  days: 5, date: "Mar 2025", cover: "🏔", budget: "Medium" },
  { id: 2, dest: "Jaipur, Raj", days: 3, date: "Jan 2025", cover: "🏯", budget: "Low"    },
  { id: 3, dest: "Coorg, KA",   days: 4, date: "Dec 2024", cover: "🌿", budget: "High"   },
];

const TYPE_COLORS = {
  Beach: C.teal, Food: C.accent, History: C.gold, Market: C.purpleM,
  Culture: C.purpleDk, Nature: C.green, Adventure: C.accent,
};

// ── Global CSS ────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,600;0,700;1,500;1,700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: ${C.bg};
      color: ${C.ink};
      -webkit-font-smoothing: antialiased;
    }

    .serif { font-family: 'Fraunces', serif; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes floatY  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
    @keyframes spin    { to { transform:rotate(360deg); } }
    @keyframes shimmer { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
    @keyframes pulseRing { 0% { transform:scale(1); opacity:.8; } 100% { transform:scale(1.6); opacity:0; } }
    @keyframes gradMove { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }

    .fu1 { animation: fadeUp .55s .05s ease both; }
    .fu2 { animation: fadeUp .55s .18s ease both; }
    .fu3 { animation: fadeUp .55s .32s ease both; }
    .fu4 { animation: fadeUp .55s .46s ease both; }
    .fu5 { animation: fadeUp .55s .60s ease both; }
    .float { animation: floatY 5s ease-in-out infinite; }

    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:${C.lavender}; }
    ::-webkit-scrollbar-thumb { background:${C.purpleL}; border-radius:4px; }

    input, select, textarea {
      font-family: 'Plus Jakarta Sans', sans-serif;
      width: 100%;
      border: 1.5px solid ${C.border};
      border-radius: 12px;
      padding: 11px 14px;
      font-size: 14px;
      background: ${C.lavXL};
      color: ${C.ink};
      outline: none;
      transition: border-color .2s, box-shadow .2s, background .2s;
    }
    input::placeholder { color: ${C.muted}; opacity:.6; }
    input:focus, select:focus {
      border-color: ${C.purpleM};
      box-shadow: 0 0 0 4px rgba(124,58,237,.1);
      background: #fff;
    }
    button { font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; }

    .chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 5px 13px; border-radius: 20px; font-size: 12px; font-weight: 600;
      border: 1.5px solid ${C.border}; background: ${C.lavXL};
      color: ${C.muted}; cursor: pointer; transition: all .2s; user-select: none;
    }
    .chip:hover { border-color: ${C.purpleM}; color: ${C.purple}; }
    .chip.on { background: linear-gradient(135deg,${C.purple},${C.purpleM}); border-color: transparent; color: #fff; }

    .card-hover { transition: transform .25s ease, box-shadow .25s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(91,33,182,.13) !important; }

    .grad-btn {
      background: linear-gradient(135deg, ${C.purple}, ${C.purpleM}, ${C.accentL});
      background-size: 200% 200%;
      animation: gradMove 4s ease infinite;
    }
  `}</style>
);

// ── Reusable: Button ──────────────────────────────────────────
function Btn({ children, onClick, variant="primary", size="md", loading, disabled, style }) {
  const sz = { sm: { p:"7px 16px", fs:12 }, md: { p:"10px 22px", fs:14 }, lg: { p:"14px 30px", fs:15 } }[size];
  const vars = {
    primary:   { background:`linear-gradient(135deg,${C.purple},${C.purpleM})`, color:"#fff", boxShadow:`0 4px 18px rgba(124,58,237,.35)`, border:"none" },
    accent:    { background:`linear-gradient(135deg,${C.accent},${C.accentL})`, color:"#fff", boxShadow:`0 4px 18px rgba(236,72,153,.3)`, border:"none" },
    outline:   { background:"transparent", color:C.purple, border:`1.5px solid ${C.border}`, boxShadow:"none" },
    ghost:     { background:C.lavender, color:C.purple, border:"none", boxShadow:"none" },
    dark:      { background:C.ink, color:"#fff", border:"none", boxShadow:`0 4px 18px rgba(30,27,46,.25)` },
    white:     { background:"#fff", color:C.purple, border:`1.5px solid ${C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,.06)" },
  }[variant] || {};
  return (
    <button onClick={onClick} disabled={disabled||loading}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
        fontWeight:700, borderRadius:12, transition:"all .2s",
        opacity:disabled?0.55:1, cursor:disabled||loading?"not-allowed":"pointer",
        fontSize:sz.fs, padding:sz.p, ...vars, ...style }}>
      {loading ? <span style={{width:16,height:16,border:"2.5px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .65s linear infinite"}} /> : children}
    </button>
  );
}

// ── Reusable: Card ────────────────────────────────────────────
function Card({ children, style, hover }) {
  return (
    <div className={hover ? "card-hover" : ""}
      style={{ background:"#fff", borderRadius:18, border:`1px solid ${C.borderL}`,
        boxShadow:"0 2px 16px rgba(91,33,182,.07)", ...style }}>
      {children}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav({ page, setPage, user, setUser }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200, height:62,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 max(20px,calc((100vw - 1140px)/2))",
      background: sc ? "rgba(247,244,255,.94)" : "transparent",
      backdropFilter: sc ? "blur(16px)" : "none",
      borderBottom: sc ? `1px solid ${C.border}` : "none",
      transition:"all .3s",
    }}>
      {/* Logo */}
      <div onClick={()=>setPage("landing")} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
        <div style={{
          width:36, height:36, borderRadius:11,
          background:`linear-gradient(135deg,${C.purple},${C.accentL})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, boxShadow:`0 4px 12px rgba(124,58,237,.35)`
        }}>✈</div>
        <span className="serif" style={{fontSize:21,fontWeight:700,color:C.ink}}>TripGenie</span>
      </div>

      {/* Right */}
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        {page==="landing" && ["Features","How it Works"].map(l=>(
          <span key={l} onClick={()=>{}} style={{fontSize:14,fontWeight:500,color:C.muted,cursor:"pointer",transition:"color .2s"}}
            onMouseEnter={e=>e.target.style.color=C.purple}
            onMouseLeave={e=>e.target.style.color=C.muted}>{l}</span>
        ))}
        {user ? (
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Btn variant="ghost" size="sm" onClick={()=>setPage("dashboard")}>Dashboard</Btn>
            <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>
              {(user.name||"U")[0].toUpperCase()}
            </div>
            <Btn variant="outline" size="sm" onClick={()=>{setUser(null);setPage("landing");}}>Logout</Btn>
          </div>
        ) : (
          <div style={{display:"flex",gap:10}}>
            <Btn variant="white" size="sm" onClick={()=>setPage("login")}>Login</Btn>
            <Btn variant="primary" size="sm" onClick={()=>setPage("signup")}>Get Started →</Btn>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Landing ───────────────────────────────────────────────────
function Landing({ setPage }) {
  const feats = [
    { icon:"🗺️", title:"AI Trip Generator",       desc:"Enter your destination and preferences — get a full day-by-day itinerary in seconds." },
    { icon:"⚡",  title:"Route Optimization",      desc:"Places auto-sorted to minimize travel time so you spend more time experiencing, less commuting." },
    { icon:"📍",  title:"Interactive Maps",         desc:"See your route visualized clearly. Navigate confidently from day one of your adventure." },
    { icon:"💾",  title:"Save & Revisit Trips",    desc:"All your plans stored in one place. Edit, reuse, or share any itinerary whenever you want." },
    { icon:"🎯",  title:"Smart Recommendations",   desc:"Hidden gems and local favorites — filtered by your interests in food, culture, nature, or adventure." },
    { icon:"📱",  title:"Works Everywhere",         desc:"Fully responsive. Plan on your laptop, navigate on your phone — always in sync." },
  ];

  const steps = [
    { n:"01", title:"Input",    desc:"Destination, days, budget & interests",   emoji:"🎛" },
    { n:"02", title:"Generate", desc:"AI builds your optimized plan instantly", emoji:"✨" },
    { n:"03", title:"Travel",   desc:"Follow the itinerary, explore freely",    emoji:"🌍" },
  ];

  const stats = [["50+","Destinations covered"],["<5s","Plan generation time"],["4.9★","User rating"]];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        padding:"80px 24px 60px", position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse 90% 70% at 50% -10%, rgba(124,58,237,.14) 0%, transparent 65%), ${C.bg}`,
      }}>
        {/* Decorative blobs */}
        <div style={{position:"absolute",top:"8%",right:"6%",width:380,height:380,borderRadius:"60% 40% 55% 45%",background:`linear-gradient(135deg,rgba(167,139,250,.18),rgba(236,72,153,.1))`,filter:"blur(50px)",animation:"floatY 7s ease-in-out infinite"}} />
        <div style={{position:"absolute",bottom:"10%",left:"4%",width:260,height:260,borderRadius:"50%",background:`rgba(196,181,253,.2)`,filter:"blur(36px)",animation:"floatY 9s ease-in-out infinite reverse"}} />
        <div style={{position:"absolute",top:"40%",left:"15%",width:120,height:120,borderRadius:"50%",background:`rgba(236,72,153,.08)`,filter:"blur(20px)"}} />

        <div style={{maxWidth:820,textAlign:"center",position:"relative",zIndex:2}}>
          {/* Badge */}
          <div className="fu1" style={{display:"inline-flex",alignItems:"center",gap:8,background:`rgba(124,58,237,.1)`,border:`1px solid rgba(124,58,237,.2)`,borderRadius:30,padding:"7px 18px",marginBottom:28,color:C.purple,fontSize:13,fontWeight:600}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:C.purple,display:"inline-block",animation:"pulseRing 1.5s ease-out infinite"}} />
            AI-Powered Travel Planning
          </div>

          <h1 className="serif fu2" style={{fontSize:"clamp(44px,6.5vw,78px)",lineHeight:1.08,color:C.ink,marginBottom:22}}>
            Your Intelligent<br />
            <span style={{fontStyle:"italic",background:`linear-gradient(135deg,${C.purple},${C.accentL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Travel Companion</span>
          </h1>

          <p className="fu3" style={{fontSize:"clamp(16px,1.9vw,20px)",color:C.muted,lineHeight:1.75,maxWidth:540,margin:"0 auto 40px",fontWeight:400}}>
            Generate complete travel plans in seconds. Day-wise itineraries, optimized routes, and smart recommendations — all in one place.
          </p>

          <div className="fu4" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
            <Btn variant="primary" size="lg" onClick={()=>setPage("signup")} style={{borderRadius:14,padding:"15px 34px",fontSize:16}}>
              ✈ Plan My Trip
            </Btn>
            <Btn variant="white" size="lg" onClick={()=>setPage("dashboard")} style={{borderRadius:14,padding:"15px 28px",fontSize:16}}>
              View Demo →
            </Btn>
          </div>

          {/* Stats */}
          <div className="fu5" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:32,flexWrap:"wrap"}}>
            {stats.map(([val,label])=>(
              <div key={label} style={{textAlign:"center"}}>
                <div className="serif" style={{fontSize:26,fontWeight:700,color:C.purple,lineHeight:1}}>{val}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:3,fontWeight:500}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{padding:"90px max(24px,calc((100vw - 1140px)/2))",background:"#fff"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{display:"inline-block",background:C.lavender,borderRadius:20,padding:"5px 16px",color:C.purple,fontSize:12,fontWeight:700,marginBottom:16,letterSpacing:".06em",textTransform:"uppercase"}}>Features</div>
          <h2 className="serif" style={{fontSize:"clamp(28px,3.8vw,46px)",color:C.ink,lineHeight:1.15,marginBottom:14}}>Everything to Travel Smarter</h2>
          <p style={{color:C.muted,fontSize:16,maxWidth:460,margin:"0 auto",lineHeight:1.7}}>Six powerful tools built into one seamless experience.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {feats.map((f,i)=>(
            <Card key={i} hover style={{padding:"28px 26px"}}>
              <div style={{width:48,height:48,borderRadius:14,background:C.lavender,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:18}}>{f.icon}</div>
              <h3 style={{fontSize:17,fontWeight:700,color:C.ink,marginBottom:9}}>{f.title}</h3>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.75}}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section style={{padding:"90px max(24px,calc((100vw - 1140px)/2))",background:C.bg}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{display:"inline-block",background:C.lavender,borderRadius:20,padding:"5px 16px",color:C.purple,fontSize:12,fontWeight:700,marginBottom:16,letterSpacing:".06em",textTransform:"uppercase"}}>How It Works</div>
          <h2 className="serif" style={{fontSize:"clamp(28px,3.8vw,46px)",color:C.ink,lineHeight:1.15}}>Three Steps to Your Perfect Trip</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24,maxWidth:860,margin:"0 auto 60px"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"36px 24px",background:"#fff",borderRadius:20,border:`1px solid ${C.borderL}`,boxShadow:`0 2px 16px rgba(91,33,182,.07)`,position:"relative"}}>
              <div style={{fontSize:40,marginBottom:16}}>{s.emoji}</div>
              <div className="serif" style={{fontSize:42,fontWeight:700,color:C.lavender,lineHeight:1,marginBottom:6}}>{s.n}</div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.ink,marginBottom:8}}>{s.title}</h3>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.7}}>{s.desc}</p>
              {i<2&&<div style={{position:"absolute",right:-12,top:"50%",transform:"translateY(-50%)",fontSize:22,color:C.purpleXL,display:"none"}}>→</div>}
            </div>
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <Btn variant="primary" size="lg" onClick={()=>setPage("signup")} style={{borderRadius:14,padding:"15px 36px",fontSize:16}}>Start Planning Free →</Btn>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{padding:"80px 24px",background:`linear-gradient(135deg,${C.purpleDk},${C.purple})`,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16,animation:"floatY 4s ease-in-out infinite"}}>✈</div>
        <h2 className="serif" style={{fontSize:"clamp(28px,4vw,46px)",color:"#fff",marginBottom:14,fontStyle:"italic"}}>Ready to explore the world?</h2>
        <p style={{color:"rgba(255,255,255,.65)",fontSize:16,marginBottom:36,maxWidth:420,margin:"0 auto 36px",lineHeight:1.7}}>Join thousands of travelers who plan smarter with TripGenie.</p>
        <Btn variant="white" size="lg" onClick={()=>setPage("signup")} style={{borderRadius:14,fontSize:16}}>Get Started Free</Btn>
      </section>
    </div>
  );
}

// ── Auth Pages ────────────────────────────────────────────────
function AuthPage({ mode, setPage, setUser }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = () => {
    setErr("");
    if (!form.email || !form.password) return setErr("Please fill all required fields.");
    if (mode==="signup" && !form.name) return setErr("Please enter your full name.");
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name || form.email.split("@")[0], email: form.email });
      setPage("dashboard");
    }, 1400);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",background:C.bg}}>
      {/* Left brand panel */}
      <div style={{
        flex:"0 0 44%", minWidth:0,
        background:`linear-gradient(160deg,${C.purpleDk} 0%,${C.purple} 55%,#6D28D9 100%)`,
        display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
        padding:"64px 48px", position:"relative", overflow:"hidden"
      }}>
        {/* Decorative circles */}
        <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",border:`1px solid rgba(255,255,255,.08)`}} />
        <div style={{position:"absolute",bottom:-40,left:-40,width:180,height:180,borderRadius:"50%",border:`1px solid rgba(255,255,255,.08)`}} />

        <div className="float" style={{fontSize:64,marginBottom:28}}>✈</div>
        <h2 className="serif" style={{fontSize:36,color:"#fff",textAlign:"center",lineHeight:1.2,marginBottom:16}}>
          Plan smarter,<br /><span style={{fontStyle:"italic",color:C.purpleXL}}>travel better.</span>
        </h2>
        <p style={{color:"rgba(255,255,255,.55)",fontSize:15,textAlign:"center",maxWidth:280,lineHeight:1.75,marginBottom:44}}>
          Join thousands of explorers who use TripGenie to create perfect itineraries instantly.
        </p>
        {["AI-powered day-by-day itineraries","Smart route optimization","Save & revisit all your trips"].map(f=>(
          <div key={f} style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,.8)",fontSize:14,marginBottom:12,width:"100%",maxWidth:280}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>✓</div>
            {f}
          </div>
        ))}
      </div>

      {/* Right form panel */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"80px 48px 48px",minWidth:320}}>
        <div style={{width:"100%",maxWidth:400}} className="fu1">
          {/* Logo */}
          <div onClick={()=>setPage("landing")} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:44}}>
            <div style={{width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${C.purple},${C.accentL})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,boxShadow:`0 3px 10px rgba(124,58,237,.3)`}}>✈</div>
            <span className="serif" style={{fontSize:19,fontWeight:700,color:C.ink}}>TripGenie</span>
          </div>

          <h1 className="serif" style={{fontSize:32,color:C.ink,marginBottom:6,lineHeight:1.15}}>
            {mode==="login" ? "Welcome back 👋" : "Create your account"}
          </h1>
          <p style={{color:C.muted,fontSize:14,marginBottom:32,lineHeight:1.6}}>
            {mode==="login" ? "Sign in to continue planning your adventures." : "Start planning your dream trips today. Free forever."}
          </p>

          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {mode==="signup" && (
              <div>
                <label style={{fontSize:13,fontWeight:600,color:C.inkMid,display:"block",marginBottom:7}}>Full Name</label>
                <input placeholder="Jane Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              </div>
            )}
            <div>
              <label style={{fontSize:13,fontWeight:600,color:C.inkMid,display:"block",marginBottom:7}}>Email address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <label style={{fontSize:13,fontWeight:600,color:C.inkMid}}>Password</label>
                {mode==="login" && <span style={{fontSize:12,color:C.purple,cursor:"pointer",fontWeight:500}}>Forgot password?</span>}
              </div>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&submit()} />
                <span onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:16,color:C.muted}}>{showPw?"🙈":"👁"}</span>
              </div>
            </div>

            {err && (
              <div style={{background:"rgba(236,72,153,.08)",border:`1px solid rgba(236,72,153,.25)`,borderRadius:10,padding:"10px 14px",color:C.accent,fontSize:13}}>⚠ {err}</div>
            )}

            <Btn variant="primary" size="lg" loading={loading} onClick={submit} style={{marginTop:4,borderRadius:13,padding:"14px",fontSize:15,width:"100%"}}>
              {mode==="login" ? "Sign In" : "Create Account"}
            </Btn>

            <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0"}}>
              <div style={{flex:1,height:1,background:C.border}} />
              <span style={{fontSize:12,color:C.muted}}>or</span>
              <div style={{flex:1,height:1,background:C.border}} />
            </div>

            <Btn variant="white" size="lg" onClick={submit} style={{borderRadius:13,padding:"13px",fontSize:14,width:"100%"}}>
              🌐 Continue with Google
            </Btn>
          </div>

          <p style={{textAlign:"center",marginTop:26,fontSize:14,color:C.muted}}>
            {mode==="login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={()=>setPage(mode==="login"?"signup":"login")} style={{color:C.purple,fontWeight:700,cursor:"pointer"}}>
              {mode==="login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard({ user, setPage }) {
  const [tab, setTab] = useState("plan");
  const [form, setForm] = useState({ dest:"", days:3, budget:"medium", interests:[] });
  const [itin, setItin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [saved, setSaved] = useState(SAVED_TRIPS);
  const [wasSaved, setWasSaved] = useState(false);

  const INTERESTS = ["Adventure","Food","Culture","Nature","Shopping","Nightlife"];
  const toggleI = i => setForm(f=>({...f,interests:f.interests.includes(i)?f.interests.filter(x=>x!==i):[...f.interests,i]}));

  const generate = () => {
    if(!form.dest.trim()) return;
    setLoading(true); setItin(null); setWasSaved(false);
    setTimeout(()=>{
      setItin({...MOCK_ITINERARY, destination:form.dest, days:MOCK_ITINERARY.days.slice(0,Math.min(form.days,3))});
      setActiveDay(0); setLoading(false);
    }, 2200);
  };

  const saveTrip = () => {
    setWasSaved(true);
    setSaved(s=>[{id:Date.now(),dest:itin.destination,days:itin.days.length,date:"Just now",cover:"✨",budget:form.budget},...s]);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:62}}>
      {/* Dashboard header */}
      <div style={{background:"#fff",borderBottom:`1px solid ${C.border}`,padding:"20px max(20px,calc((100vw - 1200px)/2))"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <h1 className="serif" style={{fontSize:26,color:C.ink}}>Hey, {user?.name?.split(" ")[0]||"Traveler"} ✈</h1>
            <p style={{color:C.muted,fontSize:13,marginTop:2}}>Where are you heading next?</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[["plan","✈ New Plan"],["saved",`💾 Saved (${saved.length})`]].map(([key,label])=>(
              <Btn key={key} variant={tab===key?"primary":"ghost"} size="sm" onClick={()=>setTab(key)}>{label}</Btn>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 20px"}}>
        {/* ─ Plan Tab ─ */}
        {tab==="plan" && (
          <div style={{display:"grid",gridTemplateColumns:itin||loading?"320px 1fr":"1fr",gap:22,alignItems:"start"}}>

            {/* Input card */}
            <Card style={{padding:24,position:"sticky",top:76}}>
              <h3 style={{fontSize:15,fontWeight:700,color:C.ink,marginBottom:22,display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:28,height:28,borderRadius:8,background:C.lavender,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🎛</span>
                Trip Details
              </h3>

              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div>
                  <label style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:7}}>Destination</label>
                  <input placeholder="e.g. Goa, India" value={form.dest} onChange={e=>setForm({...form,dest:e.target.value})} onKeyDown={e=>e.key==="Enter"&&generate()} />
                </div>

                <div>
                  <label style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:7}}>
                    Days: <span style={{color:C.purple,fontWeight:800}}>{form.days}</span>
                  </label>
                  <input type="range" min={1} max={14} value={form.days} onChange={e=>setForm({...form,days:+e.target.value})}
                    style={{padding:0,border:"none",background:"none",accentColor:C.purple,width:"100%",cursor:"pointer"}} />
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginTop:3}}>
                    <span>1 day</span><span>14 days</span>
                  </div>
                </div>

                <div>
                  <label style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:7}}>Budget</label>
                  <select value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>
                    <option value="low">🟢 Low — Budget friendly</option>
                    <option value="medium">🟡 Medium — Balanced</option>
                    <option value="high">🔴 High — Luxury</option>
                  </select>
                </div>

                <div>
                  <label style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:9}}>Interests</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {INTERESTS.map(i=>(
                      <span key={i} className={`chip ${form.interests.includes(i)?"on":""}`} onClick={()=>toggleI(i)}>{i}</span>
                    ))}
                  </div>
                </div>

                <Btn variant="primary" size="lg" loading={loading} onClick={generate}
                  style={{borderRadius:13,padding:"13px",fontSize:15,width:"100%",marginTop:4}}>
                  {loading ? "Generating..." : "✨ Generate Itinerary"}
                </Btn>
              </div>
            </Card>

            {/* Output area */}
            {loading && (
              <Card style={{padding:"64px 40px",textAlign:"center",animation:"fadeIn .4s ease"}}>
                <div style={{fontSize:52,marginBottom:20,animation:"floatY 2s ease-in-out infinite"}}>🗺️</div>
                <h3 className="serif" style={{fontSize:22,color:C.ink,marginBottom:10}}>Crafting your itinerary…</h3>
                <p style={{color:C.muted,fontSize:14,marginBottom:28}}>Our AI is building the perfect plan for {form.dest || "your trip"}</p>
                <div style={{width:44,height:44,border:`3px solid ${C.lavender}`,borderTopColor:C.purple,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto"}} />
              </Card>
            )}

            {itin && !loading && (
              <div style={{animation:"fadeUp .5s ease"}}>
                {/* Trip meta bar */}
                <Card style={{padding:"16px 22px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <div>
                    <h2 className="serif" style={{fontSize:22,color:C.ink}}>{itin.destination}</h2>
                    <p style={{color:C.muted,fontSize:13,marginTop:2}}>{itin.days.length} Days · {form.budget.charAt(0).toUpperCase()+form.budget.slice(1)} · {form.interests.join(", ")||"All interests"}</p>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {wasSaved
                      ? <div style={{display:"flex",alignItems:"center",gap:6,color:C.green,fontSize:13,fontWeight:700}}>✓ Saved!</div>
                      : <Btn variant="primary" size="sm" onClick={saveTrip}>💾 Save Trip</Btn>
                    }
                    <Btn variant="ghost" size="sm" onClick={()=>setItin(null)}>✕</Btn>
                  </div>
                </Card>

                {/* Day tabs */}
                <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
                  {itin.days.map((d,i)=>(
                    <button key={i} onClick={()=>setActiveDay(i)} style={{
                      padding:"8px 20px",borderRadius:10,fontWeight:700,fontSize:13,whiteSpace:"nowrap",
                      border:`1.5px solid ${activeDay===i?C.purple:C.border}`,
                      background:activeDay===i?`linear-gradient(135deg,${C.purple},${C.purpleM})`:"#fff",
                      color:activeDay===i?"#fff":C.muted,
                      transition:"all .2s",cursor:"pointer",
                      boxShadow:activeDay===i?`0 4px 14px rgba(124,58,237,.3)`:"none"
                    }}>Day {d.day}</button>
                  ))}
                </div>

                {/* Day detail */}
                {itin.days[activeDay] && (
                  <div style={{animation:"fadeIn .3s ease"}}>
                    <div style={{padding:"10px 16px",borderRadius:10,background:C.lavender,borderLeft:`3px solid ${C.purple}`,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.purple}}>Day {itin.days[activeDay].day}:</span>
                      <span style={{fontSize:14,fontWeight:500,color:C.inkMid}}>{itin.days[activeDay].title}</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {itin.days[activeDay].places.map((p,i)=>(
                        <Card key={i} hover style={{padding:"15px 20px",display:"flex",alignItems:"center",gap:14}}>
                          <div style={{width:46,height:46,borderRadius:13,background:`${TYPE_COLORS[p.type]||C.purple}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.icon}</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,color:C.ink,fontSize:15}}>{p.name}</div>
                            <div style={{fontSize:12,color:C.muted,marginTop:3}}>🕐 {p.time} &nbsp;·&nbsp; ⏱ {p.dur}</div>
                          </div>
                          <div style={{padding:"4px 12px",borderRadius:20,background:`${TYPE_COLORS[p.type]||C.purple}15`,color:TYPE_COLORS[p.type]||C.purple,fontSize:11,fontWeight:700}}>{p.type}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map placeholder */}
                <Card style={{marginTop:16,overflow:"hidden"}}>
                  <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.borderL}`,display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>📍</span>
                    <span style={{fontWeight:700,fontSize:14,color:C.ink}}>Route Map — {itin.destination}</span>
                    <span style={{marginLeft:"auto",fontSize:12,color:C.muted,background:C.lavender,borderRadius:6,padding:"2px 10px"}}>Map API</span>
                  </div>
                  <div style={{height:200,background:`linear-gradient(135deg,${C.lavXL},rgba(167,139,250,.1))`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
                    <div style={{fontSize:40}}>🗺️</div>
                    <p style={{color:C.muted,fontSize:13,textAlign:"center"}}>Connect Google Maps or Mapbox to see live routes</p>
                    <div style={{display:"flex",gap:8}}>
                      {itin.days[activeDay]?.places.map((_,i)=>(
                        <div key={i} style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.purpleM})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,border:"2px solid #fff",boxShadow:`0 2px 8px rgba(124,58,237,.3)`}}>{i+1}</div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Empty state (no itinerary, not loading, full width) */}
            {!itin && !loading && (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"64px 40px",textAlign:"center"}}>
                <div style={{fontSize:64,marginBottom:20,animation:"floatY 5s ease-in-out infinite"}}>🌍</div>
                <h3 className="serif" style={{fontSize:26,color:C.ink,marginBottom:12}}>Ready to explore?</h3>
                <p style={{color:C.muted,fontSize:15,maxWidth:360,lineHeight:1.8}}>Fill in your trip details on the left and hit <strong style={{color:C.purple}}>Generate Itinerary</strong> to get your personalized day-by-day plan.</p>
              </div>
            )}
          </div>
        )}

        {/* ─ Saved Tab ─ */}
        {tab==="saved" && (
          <div>
            <h2 className="serif" style={{fontSize:22,color:C.ink,marginBottom:20}}>Your Saved Trips</h2>
            {saved.length===0 ? (
              <Card style={{padding:60,textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:16}}>💾</div>
                <p style={{color:C.muted,fontSize:15}}>No saved trips yet. Generate a plan and save it!</p>
                <Btn variant="primary" size="sm" onClick={()=>setTab("plan")} style={{marginTop:18}}>Plan a Trip →</Btn>
              </Card>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
                {saved.map(t=>(
                  <Card key={t.id} hover style={{padding:0,overflow:"hidden"}}>
                    <div style={{height:90,background:`linear-gradient(135deg,${C.lavender},rgba(167,139,250,.25))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42}}>{t.cover}</div>
                    <div style={{padding:"16px 18px"}}>
                      <h3 style={{fontWeight:700,color:C.ink,fontSize:16,marginBottom:4}}>{t.dest}</h3>
                      <p style={{color:C.muted,fontSize:12,marginBottom:14}}>{t.days} days · {t.budget} · {t.date}</p>
                      <div style={{display:"flex",gap:8}}>
                        <Btn variant="primary" size="sm" style={{flex:1}}>View Plan</Btn>
                        <Btn variant="ghost" size="sm" onClick={()=>setSaved(s=>s.filter(x=>x.id!==t.id))}>🗑</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  useEffect(() => { window.scrollTo(0,0); }, [page]);

  return (
    <>
      <G />
      <Nav page={page} setPage={setPage} user={user} setUser={setUser} />
      {page==="landing"   && <Landing setPage={setPage} />}
      {page==="login"     && <AuthPage mode="login"  setPage={setPage} setUser={setUser} />}
      {page==="signup"    && <AuthPage mode="signup" setPage={setPage} setUser={setUser} />}
      {page==="dashboard" && <Dashboard user={user} setPage={setPage} />}
    </>
  );
}
