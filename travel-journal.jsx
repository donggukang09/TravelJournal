import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Constants & Helpers ────────────────────────────────────────
const COLORS = {
  bg: "#0a0a0f",
  bgCard: "#14141f",
  bgHover: "#1a1a2e",
  accent: "#e8a87c",
  accentDark: "#c47a4a",
  accentLight: "#f5d0b0",
  text: "#e8e6e3",
  textMuted: "#8a8a9a",
  textDim: "#5a5a6a",
  border: "#2a2a3a",
  borderLight: "#3a3a4a",
  success: "#4ade80",
  danger: "#ef4444",
  overlay: "rgba(0,0,0,0.7)",
};

const MONTHS_KR = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAYS_KR = ["일","월","화","수","목","금","토"];

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")}`;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2,5);

// ─── Icons (inline SVG) ─────────────────────────────────────────
const Icon = ({name, size=20, color=COLORS.text, style={}}) => {
  const icons = {
    map: <path d="M9 2L3 5v16l6-3 6 3 6-3V2l-6 3-6-3zm0 3.5v12m6-9v12"/>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    heartFill: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    film: <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    chevLeft: <polyline points="15 18 9 12 15 6"/>,
    chevRight: <polyline points="9 18 15 12 9 6"/>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2 2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    stats: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {icons[name]}
    </svg>
  );
};

// ─── Sample Data ────────────────────────────────────────────────
const SAMPLE_ENTRIES = [
  {
    id: "s1", date: "2024-03-15", location: "Tokyo, Japan",
    lat: 35.6762, lng: 139.6503, country: "Japan",
    memo: "벚꽃이 만개한 우에노 공원",
    tags: ["벚꽃", "공원"], favorite: true,
    photos: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80",
    ],
  },
  {
    id: "s2", date: "2024-07-22", location: "Paris, France",
    lat: 48.8566, lng: 2.3522, country: "France",
    memo: "에펠탑 야경이 환상적",
    tags: ["야경", "랜드마크"], favorite: false,
    photos: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80",
    ],
  },
  {
    id: "s3", date: "2024-07-25", location: "Paris, France",
    lat: 48.8606, lng: 2.3376, country: "France",
    memo: "루브르 박물관에서 하루 종일",
    tags: ["박물관", "예술"], favorite: true,
    photos: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    ],
  },
  {
    id: "s4", date: "2025-01-10", location: "Jeju, South Korea",
    lat: 33.4996, lng: 126.5312, country: "South Korea",
    memo: "한라산 눈 쌓인 겨울 풍경",
    tags: ["산", "겨울"], favorite: false,
    photos: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
      "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800&q=80",
    ],
  },
  {
    id: "s5", date: "2025-04-05", location: "Bangkok, Thailand",
    lat: 13.7563, lng: 100.5018, country: "Thailand",
    memo: "왓 아룬 새벽 일출",
    tags: ["사원", "일출"], favorite: true,
    photos: [
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
    ],
  },
];

// ─── Storage Utils ──────────────────────────────────────────────
const STORAGE_KEY = "travel_journal_data";
const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
};
const saveData = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch(e) {}
};

// ─── Main App ───────────────────────────────────────────────────
export default function TravelJournal() {
  const [entries, setEntries] = useState(() => {
    const saved = loadData();
    return saved && saved.length > 0 ? saved : SAMPLE_ENTRIES;
  });
  const [activeTab, setActiveTab] = useState("gallery");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowTrip, setSlideshowTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [mapPinEntries, setMapPinEntries] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { saveData(entries); }, [entries]);

  const allTags = useMemo(() => {
    const tags = new Set();
    entries.forEach(e => e.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter(e => {
        if (showFavOnly && !e.favorite) return false;
        if (filterTag && !e.tags?.includes(filterTag)) return false;
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          return e.location?.toLowerCase().includes(s) ||
            e.memo?.toLowerCase().includes(s) ||
            e.tags?.some(t => t.toLowerCase().includes(s)) ||
            e.country?.toLowerCase().includes(s);
        }
        return true;
      })
      .sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [entries, searchTerm, filterTag, showFavOnly]);

  const stats = useMemo(() => {
    const countries = new Set(entries.map(e => e.country).filter(Boolean));
    const cities = new Set(entries.map(e => e.location).filter(Boolean));
    const photos = entries.reduce((sum, e) => sum + (e.photos?.length || 0), 0);
    const years = new Set(entries.map(e => new Date(e.date).getFullYear()));
    return { countries: countries.size, cities: cities.size, photos, entries: entries.length, years: years.size };
  }, [entries]);

  const addEntry = (entry) => {
    setEntries(prev => [...prev, { ...entry, id: generateId() }]);
    setShowAddModal(false);
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setSelectedEntry(null);
  };

  const toggleFavorite = (id) => {
    setEntries(prev => prev.map(e => e.id === id ? {...e, favorite: !e.favorite} : e));
  };

  const startSlideshow = (trip) => {
    setSlideshowTrip(trip);
    setShowSlideshow(true);
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: `radial-gradient(${COLORS.accent} 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }}/>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: isMobile ? "12px 16px" : "16px 32px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          maxWidth: 1400, margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="globe" size={20} color="#fff"/>
            </div>
            <div>
              <h1 style={{
                fontSize: isMobile ? 16 : 20, fontWeight: 700, margin: 0,
                letterSpacing: "-0.5px", color: COLORS.text,
              }}>
                Travel Journal
              </h1>
              {!isMobile && (
                <p style={{ fontSize: 11, color: COLORS.textMuted, margin: 0, marginTop: 1 }}>
                  {stats.countries}개국 · {stats.cities}개 도시 · {stats.photos}장의 사진
                </p>
              )}
            </div>
          </div>
          <button onClick={() => setShowAddModal(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
            border: "none", color: "#fff", fontWeight: 600, fontSize: 13,
            cursor: "pointer", transition: "transform 0.15s",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            <Icon name="plus" size={16} color="#fff"/>
            {!isMobile && "새 기록"}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        position: "sticky", top: isMobile ? 60 : 69, zIndex: 99,
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 16px",
      }}>
        <div style={{
          display: "flex", maxWidth: 1400, margin: "0 auto",
          gap: 0, overflowX: "auto",
        }}>
          {[
            { id: "gallery", icon: "grid", label: "갤러리" },
            { id: "map", icon: "map", label: "지도" },
            { id: "calendar", icon: "calendar", label: "캘린더" },
            { id: "timeline", icon: "clock", label: "타임라인" },
            { id: "stats", icon: "stats", label: "통계" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: isMobile ? "10px 12px" : "12px 20px",
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === tab.id ? COLORS.accent : COLORS.textMuted,
              borderBottom: `2px solid ${activeTab === tab.id ? COLORS.accent : "transparent"}`,
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
              <Icon name={tab.icon} size={16}
                color={activeTab === tab.id ? COLORS.accent : COLORS.textMuted}/>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Search & Filter Bar */}
      {(activeTab === "gallery" || activeTab === "timeline") && (
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          padding: isMobile ? "12px 16px" : "16px 32px",
          display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
        }}>
          <div style={{
            flex: 1, minWidth: 200, display: "flex", alignItems: "center",
            background: COLORS.bgCard, borderRadius: 8, padding: "0 12px",
            border: `1px solid ${COLORS.border}`,
          }}>
            <Icon name="search" size={16} color={COLORS.textMuted}/>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="장소, 메모, 태그 검색..."
              style={{
                flex: 1, padding: "10px 8px", background: "none", border: "none",
                color: COLORS.text, fontSize: 13, outline: "none",
              }}/>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{
                background: "none", border: "none", cursor: "pointer", padding: 4,
              }}>
                <Icon name="x" size={14} color={COLORS.textMuted}/>
              </button>
            )}
          </div>
          <button onClick={() => setShowFavOnly(!showFavOnly)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "8px 12px", borderRadius: 8,
            background: showFavOnly ? COLORS.accent+"20" : COLORS.bgCard,
            border: `1px solid ${showFavOnly ? COLORS.accent : COLORS.border}`,
            color: showFavOnly ? COLORS.accent : COLORS.textMuted,
            fontSize: 13, cursor: "pointer",
          }}>
            <Icon name={showFavOnly ? "heartFill" : "heart"} size={14}
              color={showFavOnly ? COLORS.accent : COLORS.textMuted}/>
            즐겨찾기
          </button>
          {allTags.length > 0 && (
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: 8, fontSize: 13,
                background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                color: COLORS.text, cursor: "pointer", outline: "none",
              }}>
              <option value="">모든 태그</option>
              {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>
      )}

      {/* Content */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "0 16px 100px" : "0 32px 60px" }}>
        {activeTab === "gallery" && (
          <GalleryView entries={filteredEntries} onSelect={setSelectedEntry}
            onToggleFav={toggleFavorite} onSlideshow={startSlideshow} isMobile={isMobile}/>
        )}
        {activeTab === "map" && (
          <MapView entries={entries} onSelectPin={setMapPinEntries}
            onSelectEntry={setSelectedEntry} isMobile={isMobile}/>
        )}
        {activeTab === "calendar" && (
          <CalendarView entries={entries} onSelectEntry={setSelectedEntry} isMobile={isMobile}/>
        )}
        {activeTab === "timeline" && (
          <TimelineView entries={filteredEntries} onSelect={setSelectedEntry}
            onToggleFav={toggleFavorite} isMobile={isMobile}/>
        )}
        {activeTab === "stats" && (
          <StatsView entries={entries} isMobile={isMobile}/>
        )}
      </main>

      {/* Modals */}
      {selectedEntry && (
        <EntryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)}
          onDelete={deleteEntry} onToggleFav={toggleFavorite}
          onSlideshow={() => startSlideshow([selectedEntry])} isMobile={isMobile}/>
      )}
      {showAddModal && (
        <AddEntryModal onClose={() => setShowAddModal(false)} onAdd={addEntry} isMobile={isMobile}/>
      )}
      {showSlideshow && (
        <SlideshowView entries={slideshowTrip || filteredEntries}
          onClose={() => { setShowSlideshow(false); setSlideshowTrip(null); }}
          isMobile={isMobile}/>
      )}
      {mapPinEntries && (
        <PinListModal entries={mapPinEntries}
          onClose={() => setMapPinEntries(null)}
          onSelect={(e) => { setMapPinEntries(null); setSelectedEntry(e); }}
          isMobile={isMobile}/>
      )}

      {/* Floating slideshow button */}
      {!showSlideshow && filteredEntries.length > 0 && activeTab === "gallery" && (
        <button onClick={() => startSlideshow(null)} style={{
          position: "fixed", bottom: isMobile ? 80 : 32, right: isMobile ? 16 : 32,
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
          border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(232,168,124,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 90, transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        title="슬라이드쇼"
        >
          <Icon name="play" size={22} color="#fff"/>
        </button>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        input, select, textarea { font-family: inherit; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        @keyframes kenburns {
          0% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.15) translate(-2%,-1%); }
          100% { transform: scale(1.08) translate(1%,-2%); }
        }
        @keyframes progressBar { from { width:0%; } to { width:100%; } }
      `}</style>
    </div>
  );
}

// ─── Gallery View ───────────────────────────────────────────────
function GalleryView({ entries, onSelect, onToggleFav, isMobile }) {
  if (entries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textMuted }}>
        <Icon name="image" size={48} color={COLORS.textDim} style={{ margin: "0 auto 16px" }}/>
        <p style={{ fontSize: 16 }}>아직 기록이 없습니다</p>
        <p style={{ fontSize: 13, marginTop: 4 }}>새 기록을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(280px, 1fr))",
      gap: isMobile ? 8 : 16, paddingTop: 8,
    }}>
      {entries.map((entry, i) => (
        <div key={entry.id} style={{
          borderRadius: 12, overflow: "hidden",
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          cursor: "pointer", transition: "all 0.3s",
          animation: `fadeIn 0.4s ease ${i * 0.05}s both`,
        }}
        onClick={() => onSelect(entry)}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = COLORS.accent+"60";
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(232,168,124,0.15)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = COLORS.border;
          e.currentTarget.style.boxShadow = "none";
        }}
        >
          <div style={{ position: "relative", paddingTop: "75%", overflow: "hidden" }}>
            <img src={entry.photos?.[0] || ""} alt=""
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", transition: "transform 0.5s",
              }}
              onError={e => e.target.style.display = "none"}
            />
            {entry.photos?.length > 1 && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                background: "rgba(0,0,0,0.6)", borderRadius: 6,
                padding: "3px 8px", fontSize: 11, color: "#fff",
                backdropFilter: "blur(4px)",
              }}>
                <Icon name="image" size={12} color="#fff" style={{ verticalAlign: "middle", marginRight: 3 }}/>
                {entry.photos.length}
              </div>
            )}
            <button onClick={e => { e.stopPropagation(); onToggleFav(entry.id); }}
              style={{
                position: "absolute", top: 8, left: 8,
                background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
                width: 32, height: 32, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}>
              <Icon name={entry.favorite ? "heartFill" : "heart"} size={16}
                color={entry.favorite ? "#ef4444" : "#fff"}/>
            </button>
          </div>
          <div style={{ padding: isMobile ? "8px 10px" : "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <Icon name="pin" size={12} color={COLORS.accent}/>
              <span style={{
                fontSize: isMobile ? 12 : 14, fontWeight: 600, color: COLORS.text,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{entry.location}</span>
            </div>
            <p style={{
              fontSize: 11, color: COLORS.textMuted, marginBottom: 6,
            }}>{formatDate(entry.date)}</p>
            {entry.memo && (
              <p style={{
                fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{entry.memo}</p>
            )}
            {entry.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                {entry.tags.slice(0, 3).map(t => (
                  <span key={t} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 10,
                    background: COLORS.accent + "15", color: COLORS.accent,
                    border: `1px solid ${COLORS.accent}30`,
                  }}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Map View ───────────────────────────────────────────────────
function MapView({ entries, onSelectPin, onSelectEntry, isMobile }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 450 });
  const [tooltip, setTooltip] = useState(null);

  // Group by location
  const locationGroups = useMemo(() => {
    const groups = {};
    entries.forEach(e => {
      if (!e.lat || !e.lng) return;
      const key = `${e.lat.toFixed(2)},${e.lng.toFixed(2)}`;
      if (!groups[key]) groups[key] = { lat: e.lat, lng: e.lng, location: e.location, entries: [] };
      groups[key].entries.push(e);
    });
    return Object.values(groups);
  }, [entries]);

  // Simple Mercator projection
  const project = (lat, lng) => {
    const x = (lng + 180) * (800 / 360);
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 225 - (mercN * 800) / (2 * Math.PI);
    return { x, y };
  };

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Search */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap",
      }}>
        <div style={{
          flex: 1, minWidth: 200, display: "flex", alignItems: "center",
          background: COLORS.bgCard, borderRadius: 8, padding: "0 12px",
          border: `1px solid ${COLORS.border}`,
        }}>
          <Icon name="search" size={16} color={COLORS.textMuted}/>
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="장소 검색..."
            style={{
              flex: 1, padding: "10px 8px", background: "none", border: "none",
              color: COLORS.text, fontSize: 13, outline: "none",
            }}/>
        </div>
      </div>

      {/* Map */}
      <div style={{
        borderRadius: 16, overflow: "hidden", border: `1px solid ${COLORS.border}`,
        background: "#0d1b2a", position: "relative",
      }}>
        <svg viewBox="0 0 800 450" style={{ width: "100%", display: "block" }}>
          {/* Ocean background */}
          <rect width="800" height="450" fill="#0d1b2a"/>
          {/* Simplified world map paths */}
          <g fill="#1b2838" stroke="#2a3a4a" strokeWidth="0.5">
            {/* Continents simplified */}
            <ellipse cx="150" cy="180" rx="70" ry="50" opacity="0.8"/>
            <ellipse cx="250" cy="170" rx="30" ry="60" opacity="0.8"/>
            <ellipse cx="400" cy="160" rx="80" ry="70" opacity="0.8"/>
            <ellipse cx="420" cy="280" rx="40" ry="50" opacity="0.8"/>
            <ellipse cx="540" cy="180" rx="60" ry="60" opacity="0.8"/>
            <ellipse cx="570" cy="270" rx="20" ry="15" opacity="0.8"/>
            <ellipse cx="660" cy="200" rx="50" ry="40" opacity="0.8"/>
            <ellipse cx="680" cy="310" rx="30" ry="25" opacity="0.8"/>
            {/* Grid lines */}
            {[...Array(7)].map((_,i) => (
              <line key={`h${i}`} x1="0" y1={i*75} x2="800" y2={i*75}
                stroke="#1a2a3a" strokeWidth="0.3" strokeDasharray="4,4"/>
            ))}
            {[...Array(9)].map((_,i) => (
              <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="450"
                stroke="#1a2a3a" strokeWidth="0.3" strokeDasharray="4,4"/>
            ))}
          </g>

          {/* Pins */}
          {locationGroups.map((group, i) => {
            const pos = project(group.lat, group.lng);
            const isSearched = searchInput && group.location?.toLowerCase().includes(searchInput.toLowerCase());
            const pinSize = Math.min(8 + group.entries.length * 2, 16);
            return (
              <g key={i} style={{ cursor: "pointer" }}
                onClick={() => {
                  if (group.entries.length === 1) onSelectEntry(group.entries[0]);
                  else onSelectPin(group.entries);
                }}
                onMouseEnter={e => setTooltip({ x: pos.x, y: pos.y, group })}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle cx={pos.x} cy={pos.y} r={pinSize + 4}
                  fill={COLORS.accent} opacity="0.15">
                  <animate attributeName="r" values={`${pinSize+4};${pinSize+8};${pinSize+4}`}
                    dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx={pos.x} cy={pos.y} r={pinSize}
                  fill={isSearched ? COLORS.success : COLORS.accent}
                  stroke="#fff" strokeWidth="2"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}/>
                {group.entries.length > 1 && (
                  <text x={pos.x} y={pos.y + 1} textAnchor="middle"
                    dominantBaseline="middle" fill="#fff" fontSize="9" fontWeight="700">
                    {group.entries.length}
                  </text>
                )}
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect x={tooltip.x - 60} y={tooltip.y - 40} width="120" height="30"
                rx="6" fill="rgba(0,0,0,0.85)" stroke={COLORS.accent} strokeWidth="0.5"/>
              <text x={tooltip.x} y={tooltip.y - 22} textAnchor="middle"
                fill="#fff" fontSize="10" fontWeight="500">
                {tooltip.group.location}
              </text>
              <text x={tooltip.x} y={tooltip.y - 12} textAnchor="middle"
                fill={COLORS.textMuted} fontSize="8">
                {tooltip.group.entries.length}개의 기록
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "8px 12px",
          backdropFilter: "blur(8px)", fontSize: 11, color: COLORS.textMuted,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent }}/>
            방문 장소 ({locationGroups.length}곳)
          </div>
        </div>
      </div>

      {/* Location List */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: COLORS.textMuted }}>
          방문 장소 목록
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 8 }}>
          {locationGroups
            .filter(g => !searchInput || g.location?.toLowerCase().includes(searchInput.toLowerCase()))
            .map((group, i) => (
            <div key={i} onClick={() => {
              if (group.entries.length === 1) onSelectEntry(group.entries[0]);
              else onSelectPin(group.entries);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 10,
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent+"60"}
            onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0,
              }}>
                <img src={group.entries[0].photos?.[0]} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => e.target.style.display = "none"}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{group.location}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  {group.entries.length}개의 기록
                </div>
              </div>
              <Icon name="chevRight" size={16} color={COLORS.textDim}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Calendar View ──────────────────────────────────────────────
function CalendarView({ entries, onSelectEntry, isMobile }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const entriesByDate = useMemo(() => {
    const map = {};
    entries.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate();
        if (!map[key]) map[key] = [];
        map[key].push(e);
      }
    });
    return map;
  }, [entries, year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div style={{ paddingTop: 16, maxWidth: 800, margin: "0 auto" }}>
      {/* Month nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <button onClick={prevMonth} style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          borderRadius: 8, padding: 8, cursor: "pointer",
        }}>
          <Icon name="chevLeft" size={20} color={COLORS.text}/>
        </button>
        <h2 style={{
          fontSize: 20, fontWeight: 700,
          fontFamily: "'Playfair Display', serif",
        }}>
          {year}년 {MONTHS_KR[month]}
        </h2>
        <button onClick={nextMonth} style={{
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          borderRadius: 8, padding: 8, cursor: "pointer",
        }}>
          <Icon name="chevRight" size={20} color={COLORS.text}/>
        </button>
      </div>

      {/* Day headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
      }}>
        {DAYS_KR.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 12, fontWeight: 600,
            color: COLORS.textMuted, padding: "8px 0",
          }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
      }}>
        {days.map((day, i) => {
          const dayEntries = day ? entriesByDate[day] : null;
          const hasEntries = dayEntries && dayEntries.length > 0;
          const isToday = day && year === new Date().getFullYear() &&
            month === new Date().getMonth() && day === new Date().getDate();

          return (
            <div key={i} onClick={() => {
              if (hasEntries) {
                if (dayEntries.length === 1) onSelectEntry(dayEntries[0]);
              }
            }}
            style={{
              minHeight: isMobile ? 48 : 80, borderRadius: 8,
              background: day ? COLORS.bgCard : "transparent",
              border: day ? `1px solid ${isToday ? COLORS.accent : COLORS.border}` : "none",
              padding: isMobile ? 4 : 6,
              cursor: hasEntries ? "pointer" : "default",
              position: "relative", transition: "all 0.2s",
              ...(hasEntries && {
                borderColor: COLORS.accent + "40",
                background: COLORS.accent + "08",
              }),
            }}
            onMouseEnter={e => { if (hasEntries) e.currentTarget.style.borderColor = COLORS.accent; }}
            onMouseLeave={e => { if (hasEntries) e.currentTarget.style.borderColor = COLORS.accent+"40"; }}
            >
              {day && (
                <>
                  <span style={{
                    fontSize: isMobile ? 11 : 12, fontWeight: isToday ? 700 : 400,
                    color: isToday ? COLORS.accent : COLORS.text,
                  }}>{day}</span>
                  {hasEntries && (
                    <div style={{ marginTop: 2 }}>
                      {dayEntries.slice(0, isMobile ? 1 : 2).map(e => (
                        <div key={e.id} style={{
                          fontSize: 9, color: COLORS.accent,
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap", lineHeight: 1.6,
                        }}
                        onClick={(ev) => { ev.stopPropagation(); onSelectEntry(e); }}
                        >
                          📍 {e.location?.split(",")[0]}
                        </div>
                      ))}
                      {dayEntries.length > (isMobile ? 1 : 2) && (
                        <span style={{ fontSize: 9, color: COLORS.textDim }}>
                          +{dayEntries.length - (isMobile ? 1 : 2)}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Month entries list */}
      {Object.keys(entriesByDate).length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted, marginBottom: 12 }}>
            이번 달 기록 ({Object.values(entriesByDate).flat().length}건)
          </h3>
          {Object.entries(entriesByDate)
            .sort((a,b) => Number(a[0]) - Number(b[0]))
            .map(([day, dayEntries]) => (
              dayEntries.map(e => (
                <div key={e.id} onClick={() => onSelectEntry(e)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", marginBottom: 6, borderRadius: 10,
                    background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent+"60"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                  }}>
                    <img src={e.photos?.[0]} alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={ev => ev.target.style.display = "none"}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.location}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                      {month+1}/{day} · {e.memo || ""}
                    </div>
                  </div>
                </div>
              ))
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Timeline View ──────────────────────────────────────────────
function TimelineView({ entries, onSelect, onToggleFav, isMobile }) {
  const grouped = useMemo(() => {
    const groups = {};
    entries.forEach(e => {
      const key = new Date(e.date).getFullYear();
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort((a,b) => Number(b[0]) - Number(a[0]));
  }, [entries]);

  return (
    <div style={{ paddingTop: 16, maxWidth: 700, margin: "0 auto" }}>
      {grouped.map(([year, yearEntries]) => (
        <div key={year} style={{ marginBottom: 40 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          }}>
            <span style={{
              fontSize: 28, fontWeight: 700, color: COLORS.accent,
              fontFamily: "'Playfair Display', serif",
            }}>{year}</span>
            <div style={{ flex: 1, height: 1, background: COLORS.border }}/>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>
              {yearEntries.length}개의 기록
            </span>
          </div>

          <div style={{ position: "relative", paddingLeft: isMobile ? 20 : 32 }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute", left: isMobile ? 6 : 12, top: 0, bottom: 0,
              width: 2, background: `linear-gradient(to bottom, ${COLORS.accent}40, transparent)`,
            }}/>

            {yearEntries.map((entry, i) => (
              <div key={entry.id} onClick={() => onSelect(entry)}
                style={{
                  position: "relative", marginBottom: 16,
                  animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                  cursor: "pointer",
                }}>
                {/* Dot */}
                <div style={{
                  position: "absolute", left: isMobile ? -18 : -26,
                  top: 14, width: 10, height: 10, borderRadius: "50%",
                  background: COLORS.accent, border: `2px solid ${COLORS.bg}`,
                }}/>

                <div style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent+"60"}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <span style={{ fontSize: 12, color: COLORS.textMuted }}>{formatDate(entry.date)}</span>
                      <h4 style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                        <Icon name="pin" size={12} color={COLORS.accent}
                          style={{ verticalAlign: "middle", marginRight: 4 }}/>
                        {entry.location}
                      </h4>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onToggleFav(entry.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Icon name={entry.favorite ? "heartFill" : "heart"} size={16}
                        color={entry.favorite ? "#ef4444" : COLORS.textDim}/>
                    </button>
                  </div>
                  {entry.memo && (
                    <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6, lineHeight: 1.5 }}>
                      {entry.memo}
                    </p>
                  )}
                  {entry.photos?.length > 0 && (
                    <div style={{
                      display: "flex", gap: 6, marginTop: 10, overflowX: "auto",
                      paddingBottom: 4,
                    }}>
                      {entry.photos.slice(0, 4).map((p, j) => (
                        <img key={j} src={p} alt=""
                          style={{
                            width: isMobile ? 60 : 80, height: isMobile ? 60 : 80,
                            borderRadius: 8, objectFit: "cover", flexShrink: 0,
                          }}
                          onError={e => e.target.style.display = "none"}
                        />
                      ))}
                      {entry.photos.length > 4 && (
                        <div style={{
                          width: isMobile ? 60 : 80, height: isMobile ? 60 : 80,
                          borderRadius: 8, background: COLORS.bgHover,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, color: COLORS.textMuted, flexShrink: 0,
                        }}>+{entry.photos.length - 4}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stats View ─────────────────────────────────────────────────
function StatsView({ entries, isMobile }) {
  const stats = useMemo(() => {
    const countries = {};
    const cities = {};
    const monthlyCount = Array(12).fill(0);
    const yearlyCount = {};
    let totalPhotos = 0;
    let favCount = 0;

    entries.forEach(e => {
      if (e.country) countries[e.country] = (countries[e.country] || 0) + 1;
      if (e.location) cities[e.location] = (cities[e.location] || 0) + 1;
      const d = new Date(e.date);
      monthlyCount[d.getMonth()]++;
      const yr = d.getFullYear();
      yearlyCount[yr] = (yearlyCount[yr] || 0) + 1;
      totalPhotos += e.photos?.length || 0;
      if (e.favorite) favCount++;
    });

    const topCountries = Object.entries(countries).sort((a,b) => b[1]-a[1]).slice(0, 5);
    const topCities = Object.entries(cities).sort((a,b) => b[1]-a[1]).slice(0, 5);
    const maxMonthly = Math.max(...monthlyCount, 1);

    return {
      totalEntries: entries.length, totalPhotos, favCount,
      countryCount: Object.keys(countries).length,
      cityCount: Object.keys(cities).length,
      topCountries, topCities, monthlyCount, maxMonthly,
      yearlyCount: Object.entries(yearlyCount).sort((a,b) => Number(a[0]) - Number(b[0])),
    };
  }, [entries]);

  const StatCard = ({ icon, label, value, color = COLORS.accent }) => (
    <div style={{
      padding: 20, borderRadius: 12,
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      textAlign: "center",
    }}>
      <Icon name={icon} size={24} color={color} style={{ margin: "0 auto 8px" }}/>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ paddingTop: 16, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{
        fontSize: 22, fontWeight: 700, marginBottom: 20,
        fontFamily: "'Playfair Display', serif",
      }}>
        나의 여행 통계
      </h2>

      {/* Summary cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: 12, marginBottom: 24,
      }}>
        <StatCard icon="globe" label="방문 국가" value={stats.countryCount}/>
        <StatCard icon="pin" label="방문 도시" value={stats.cityCount} color="#60a5fa"/>
        <StatCard icon="image" label="총 사진" value={stats.totalPhotos} color="#4ade80"/>
        <StatCard icon="heart" label="즐겨찾기" value={stats.favCount} color="#ef4444"/>
      </div>

      {/* Monthly chart */}
      <div style={{
        padding: 20, borderRadius: 12, marginBottom: 16,
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>월별 기록</h3>
        <div style={{ display: "flex", alignItems: "end", gap: 6, height: 120 }}>
          {stats.monthlyCount.map((count, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>
                {count > 0 ? count : ""}
              </span>
              <div style={{
                width: "100%", maxWidth: 40, borderRadius: 4,
                height: `${Math.max((count / stats.maxMonthly) * 80, count > 0 ? 8 : 2)}px`,
                background: count > 0
                  ? `linear-gradient(to top, ${COLORS.accentDark}, ${COLORS.accent})`
                  : COLORS.border,
                transition: "height 0.5s ease",
              }}/>
              <span style={{ fontSize: 9, color: COLORS.textDim, marginTop: 4 }}>
                {MONTHS_KR[i].replace("월","")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top destinations */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div style={{
          padding: 20, borderRadius: 12,
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top 국가</h3>
          {stats.topCountries.map(([name, count], i) => (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, width: 20 }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 13 }}>{name}</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{count}회</span>
            </div>
          ))}
        </div>
        <div style={{
          padding: 20, borderRadius: 12,
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top 도시</h3>
          {stats.topCities.map(([name, count], i) => (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa", width: 20 }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 13 }}>{name}</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{count}회</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Entry Detail Modal ─────────────────────────────────────────
function EntryDetail({ entry, onClose, onDelete, onToggleFav, onSlideshow, isMobile }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = entry.photos || [];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: COLORS.overlay, backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: isMobile ? 0 : 20, animation: "fadeIn 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 600,
        height: isMobile ? "100%" : "auto",
        maxHeight: isMobile ? "100%" : "90vh",
        background: COLORS.bg, borderRadius: isMobile ? 0 : 16,
        overflow: "auto", animation: "slideUp 0.4s ease",
        border: isMobile ? "none" : `1px solid ${COLORS.border}`,
      }}>
        {/* Photo viewer */}
        {photos.length > 0 && (
          <div style={{ position: "relative" }}>
            <img src={photos[photoIdx]} alt=""
              style={{
                width: "100%", aspectRatio: "4/3", objectFit: "cover",
                display: "block",
              }}/>

            {/* Nav arrows */}
            {photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                  style={{
                    position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
                    width: 36, height: 36, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  <Icon name="chevLeft" size={20} color="#fff"/>
                </button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
                    width: 36, height: 36, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  <Icon name="chevRight" size={20} color="#fff"/>
                </button>
                {/* Dots */}
                <div style={{
                  position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: 6,
                }}>
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      style={{
                        width: i === photoIdx ? 20 : 8, height: 8,
                        borderRadius: 4, border: "none", cursor: "pointer",
                        background: i === photoIdx ? COLORS.accent : "rgba(255,255,255,0.5)",
                        transition: "all 0.3s",
                      }}/>
                  ))}
                </div>
              </>
            )}

            {/* Close button */}
            <button onClick={onClose} style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
              width: 36, height: 36, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="x" size={20} color="#fff"/>
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{
                fontSize: 20, fontWeight: 700, marginBottom: 4,
                fontFamily: "'Playfair Display', serif",
              }}>
                {entry.location}
              </h2>
              <p style={{ fontSize: 13, color: COLORS.textMuted }}>
                {formatDate(entry.date)}
                {entry.country && ` · ${entry.country}`}
              </p>
            </div>
            <button onClick={() => onToggleFav(entry.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Icon name={entry.favorite ? "heartFill" : "heart"} size={24}
                color={entry.favorite ? "#ef4444" : COLORS.textDim}/>
            </button>
          </div>

          {entry.memo && (
            <p style={{
              fontSize: 14, color: COLORS.text, marginTop: 16, lineHeight: 1.7,
            }}>{entry.memo}</p>
          )}

          {entry.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
              {entry.tags.map(t => (
                <span key={t} style={{
                  fontSize: 12, padding: "4px 12px", borderRadius: 20,
                  background: COLORS.accent + "15", color: COLORS.accent,
                  border: `1px solid ${COLORS.accent}30`,
                }}>#{t}</span>
              ))}
            </div>
          )}

          {/* Photo thumbnails */}
          {photos.length > 1 && (
            <div style={{
              display: "flex", gap: 6, marginTop: 16, overflowX: "auto", paddingBottom: 4,
            }}>
              {photos.map((p, i) => (
                <img key={i} src={p} alt="" onClick={() => setPhotoIdx(i)}
                  style={{
                    width: 56, height: 56, borderRadius: 8, objectFit: "cover",
                    flexShrink: 0, cursor: "pointer",
                    border: i === photoIdx ? `2px solid ${COLORS.accent}` : `2px solid transparent`,
                    opacity: i === photoIdx ? 1 : 0.6,
                    transition: "all 0.2s",
                  }}/>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{
            display: "flex", gap: 8, marginTop: 24,
            borderTop: `1px solid ${COLORS.border}`, paddingTop: 16,
          }}>
            <button onClick={onSlideshow} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 0", borderRadius: 8,
              background: COLORS.accent + "15", border: `1px solid ${COLORS.accent}30`,
              color: COLORS.accent, fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>
              <Icon name="play" size={16} color={COLORS.accent}/> 슬라이드쇼
            </button>
            <button onClick={() => { if (confirm("이 기록을 삭제할까요?")) onDelete(entry.id); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "10px 16px", borderRadius: 8,
                background: COLORS.danger + "15", border: `1px solid ${COLORS.danger}30`,
                color: COLORS.danger, fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>
              <Icon name="trash" size={16} color={COLORS.danger}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Entry Modal ────────────────────────────────────────────
function AddEntryModal({ onClose, onAdd, isMobile }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    location: "", country: "", lat: "", lng: "",
    memo: "", tags: "", favorite: false, photos: [],
  });
  const [photoUrls, setPhotoUrls] = useState("");
  const [localPhotos, setLocalPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLocalPhotos(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (!form.location || !form.date) {
      alert("날짜와 장소는 필수입니다!");
      return;
    }
    const urlPhotos = photoUrls.split("\n").map(u => u.trim()).filter(Boolean);
    const allPhotos = [...localPhotos, ...urlPhotos];

    onAdd({
      ...form,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      photos: allPhotos,
    });
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13,
    background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
    color: COLORS.text, outline: "none",
  };
  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: COLORS.textMuted,
    marginBottom: 4, display: "block",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: COLORS.overlay, backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: isMobile ? 0 : 20, animation: "fadeIn 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 500,
        height: isMobile ? "100%" : "auto",
        maxHeight: isMobile ? "100%" : "90vh",
        background: COLORS.bg, borderRadius: isMobile ? 0 : 16,
        overflow: "auto", animation: "slideUp 0.4s ease",
        border: isMobile ? "none" : `1px solid ${COLORS.border}`,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`,
          position: "sticky", top: 0, background: COLORS.bg, zIndex: 10,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>새 여행 기록</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
          }}>
            <Icon name="x" size={22} color={COLORS.textMuted}/>
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Photo upload */}
          <div>
            <label style={labelStyle}>📸 사진</label>
            <input type="file" ref={fileInputRef} multiple accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}/>
            <button onClick={() => fileInputRef.current?.click()} style={{
              width: "100%", padding: "20px", borderRadius: 10,
              background: COLORS.bgCard, border: `2px dashed ${COLORS.border}`,
              color: COLORS.textMuted, fontSize: 13, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >
              <Icon name="upload" size={24} color={COLORS.textMuted}/>
              사진을 선택하세요
            </button>

            {/* Preview */}
            {localPhotos.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {localPhotos.map((p, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={p} alt=""
                      style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }}/>
                    <button onClick={() => setLocalPhotos(prev => prev.filter((_,j) => j !== i))}
                      style={{
                        position: "absolute", top: -4, right: -4,
                        width: 18, height: 18, borderRadius: "50%",
                        background: COLORS.danger, border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      <Icon name="x" size={10} color="#fff"/>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 11, color: COLORS.textDim, cursor: "pointer" }}>
                URL로 사진 추가하기
              </summary>
              <textarea value={photoUrls} onChange={e => setPhotoUrls(e.target.value)}
                placeholder="사진 URL을 한 줄에 하나씩 입력..."
                style={{ ...inputStyle, marginTop: 6, minHeight: 60, resize: "vertical" }}/>
            </details>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>📅 날짜</label>
              <input type="date" value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>🌍 국가</label>
              <input value={form.country}
                onChange={e => setForm({...form, country: e.target.value})}
                placeholder="Japan" style={inputStyle}/>
            </div>
          </div>

          <div>
            <label style={labelStyle}>📍 장소</label>
            <input value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              placeholder="Tokyo, Japan" style={inputStyle}/>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>위도 (선택)</label>
              <input value={form.lat}
                onChange={e => setForm({...form, lat: e.target.value})}
                placeholder="35.6762" style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>경도 (선택)</label>
              <input value={form.lng}
                onChange={e => setForm({...form, lng: e.target.value})}
                placeholder="139.6503" style={inputStyle}/>
            </div>
          </div>

          <div>
            <label style={labelStyle}>📝 메모</label>
            <textarea value={form.memo}
              onChange={e => setForm({...form, memo: e.target.value})}
              placeholder="짧은 메모를 남겨보세요"
              style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}/>
          </div>

          <div>
            <label style={labelStyle}>🏷️ 태그 (쉼표로 구분)</label>
            <input value={form.tags}
              onChange={e => setForm({...form, tags: e.target.value})}
              placeholder="벚꽃, 맛집, 야경" style={inputStyle}/>
          </div>

          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", fontSize: 13,
          }}>
            <input type="checkbox" checked={form.favorite}
              onChange={e => setForm({...form, favorite: e.target.checked})}
              style={{ accentColor: COLORS.accent }}/>
            ❤️ 즐겨찾기에 추가
          </label>

          <button onClick={handleSubmit} style={{
            width: "100%", padding: "12px 0", borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
            border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer", transition: "transform 0.15s",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            기록 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Slideshow View ─────────────────────────────────────────────
function SlideshowView({ entries, onClose, isMobile }) {
  const allPhotos = useMemo(() => {
    const photos = [];
    entries.forEach(e => {
      (e.photos || []).forEach(p => {
        photos.push({ url: p, location: e.location, date: e.date, memo: e.memo });
      });
    });
    return photos;
  }, [entries]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(4000);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const [musicFile, setMusicFile] = useState(null);
  const [musicName, setMusicName] = useState("");
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!isPlaying || allPhotos.length === 0) return;

    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(elapsed / duration, 1));
    }, 30);

    timerRef.current = setTimeout(() => {
      setCurrentIdx(i => (i + 1) % allPhotos.length);
      setProgress(0);
    }, duration);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [currentIdx, isPlaying, duration, allPhotos.length]);

  const handleMusicUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMusicFile(url);
      setMusicName(file.name);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
  };

  if (allPhotos.length === 0) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 300, background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16,
      }}>
        <p style={{ color: COLORS.textMuted }}>사진이 없습니다</p>
        <button onClick={onClose} style={{
          padding: "8px 20px", borderRadius: 8,
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
          color: COLORS.text, cursor: "pointer",
        }}>닫기</button>
      </div>
    );
  }

  const current = allPhotos[currentIdx];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300, background: "#000",
      animation: "fadeIn 0.5s ease",
    }}>
      <audio ref={audioRef} loop/>

      {/* Photo */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
      }}>
        <img key={currentIdx} src={current.url} alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            animation: `kenburns ${duration}ms ease-in-out`,
          }}/>
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(transparent 50%, rgba(0,0,0,0.8))",
        }}/>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "rgba(255,255,255,0.15)", zIndex: 10,
      }}>
        <div style={{
          height: "100%", background: COLORS.accent,
          width: `${progress * 100}%`, transition: "width 0.03s linear",
        }}/>
      </div>

      {/* Top controls */}
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
          {currentIdx + 1} / {allPhotos.length}
        </span>
        <button onClick={onClose} style={{
          background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
          width: 36, height: 36, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="x" size={20} color="#fff"/>
        </button>
      </div>

      {/* Info overlay */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: isMobile ? "40px 20px 100px" : "40px 40px 40px",
        zIndex: 10,
      }}>
        <h2 style={{
          fontSize: isMobile ? 22 : 32, fontWeight: 700, color: "#fff",
          fontFamily: "'Playfair Display', serif",
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}>
          {current.location}
        </h2>
        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4,
        }}>{formatDate(current.date)}</p>
        {current.memo && (
          <p style={{
            fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 8,
            lineHeight: 1.6, maxWidth: 500,
          }}>{current.memo}</p>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{
        position: "absolute", bottom: isMobile ? 30 : 16, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 16,
        zIndex: 10,
      }}>
        <button onClick={() => setCurrentIdx(i => (i - 1 + allPhotos.length) % allPhotos.length)}
          style={{
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: 40, height: 40, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <Icon name="chevLeft" size={20} color="#fff"/>
        </button>
        <button onClick={togglePlay} style={{
          background: `rgba(232,168,124,0.3)`, border: `2px solid ${COLORS.accent}`,
          borderRadius: "50%", width: 52, height: 52, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={isPlaying ? "pause" : "play"} size={22} color={COLORS.accent}/>
        </button>
        <button onClick={() => setCurrentIdx(i => (i + 1) % allPhotos.length)}
          style={{
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: 40, height: 40, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <Icon name="chevRight" size={20} color="#fff"/>
        </button>

        {/* Music button */}
        <input type="file" ref={fileInputRef} accept="audio/*"
          onChange={handleMusicUpload} style={{ display: "none" }}/>
        <button onClick={() => fileInputRef.current?.click()} style={{
          background: musicFile ? "rgba(232,168,124,0.3)" : "rgba(0,0,0,0.4)",
          border: musicFile ? `1px solid ${COLORS.accent}` : "none",
          borderRadius: "50%", width: 40, height: 40, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} title={musicName || "음악 추가"}>
          <Icon name="music" size={18} color={musicFile ? COLORS.accent : "#fff"}/>
        </button>
      </div>

      {musicName && (
        <div style={{
          position: "absolute", bottom: isMobile ? 80 : 64, left: "50%",
          transform: "translateX(-50%)", zIndex: 10,
          background: "rgba(0,0,0,0.5)", borderRadius: 20,
          padding: "4px 14px", fontSize: 11, color: "rgba(255,255,255,0.6)",
        }}>
          🎵 {musicName}
        </div>
      )}
    </div>
  );
}

// ─── Pin List Modal ─────────────────────────────────────────────
function PinListModal({ entries, onClose, onSelect, isMobile }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: COLORS.overlay, backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 420,
        maxHeight: "80vh", overflow: "auto",
        background: COLORS.bg, borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        animation: "scaleIn 0.3s ease",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`,
          position: "sticky", top: 0, background: COLORS.bg, zIndex: 10,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>
            📍 {entries[0]?.location} ({entries.length}개)
          </h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
          }}>
            <Icon name="x" size={20} color={COLORS.textMuted}/>
          </button>
        </div>
        <div style={{ padding: 12 }}>
          {entries
            .sort((a,b) => new Date(b.date) - new Date(a.date))
            .map(e => (
            <div key={e.id} onClick={() => onSelect(e)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", marginBottom: 6, borderRadius: 10,
                background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = COLORS.accent+"60"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = COLORS.border}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 8, overflow: "hidden", flexShrink: 0,
              }}>
                <img src={e.photos?.[0]} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={ev => ev.target.style.display = "none"}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(e.date)}</div>
                {e.memo && (
                  <div style={{
                    fontSize: 12, color: COLORS.textMuted, marginTop: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{e.memo}</div>
                )}
              </div>
              {e.favorite && <Icon name="heartFill" size={14} color="#ef4444"/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
