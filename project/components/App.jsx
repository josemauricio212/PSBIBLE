// App principal
const { useState, useMemo, useEffect } = React;

function App() {
  // Tweaks
  const [tweaks, setTweaks] = useState(window.__TWEAKS__ || { theme: "midnight", accent: "cyan", density: "comfortable" });

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setShowTweaks(true);
      if (e.data.type === "__deactivate_edit_mode") setShowTweaks(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const [showTweaks, setShowTweaks] = useState(false);

  // Aplicar tweaks ao document
  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.accent = tweaks.accent;
    document.documentElement.dataset.density = tweaks.density;
  }, [tweaks]);

  const persistTweak = (k, v) => {
    setTweaks(t => {
      const next = {...t, [k]: v};
      window.parent.postMessage({type:"__edit_mode_set_keys", edits: next}, "*");
      return next;
    });
  };

  // Carregar jogos do localStorage ou dos dados iniciais
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem("vault-games");
      if (saved) return JSON.parse(saved);
    } catch(e){}
    return window.GAMES_DATA;
  });

  useEffect(() => {
    try { localStorage.setItem("vault-games", JSON.stringify(games)); } catch(e){}
  }, [games]);

  const [filters, setFilters] = useState({ status: null, platform: null, genre: null, series: null, minRating: 0 });
  const [search, setSearch] = useState("");
  const [view, setView] = useState(() => localStorage.getItem("vault-view") || "grid");
  const [sort, setSort] = useState("title");
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [showFinance, setShowFinance] = useState(false);

  useEffect(() => { localStorage.setItem("vault-view", view); }, [view]);

  const filtered = useMemo(() => {
    let list = games;
    if (filters.status && filters.status !== "all") list = list.filter(g => g.status === filters.status);
    if (filters.platform) list = list.filter(g => g.platform === filters.platform);
    if (filters.genre) list = list.filter(g => g.genre === filters.genre);
    if (filters.series) list = list.filter(g => g.series === filters.series);
    if (filters.minRating > 0) list = list.filter(g => g.rating >= filters.minRating);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.series.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    list = [...list].sort((a,b) => {
      if (sort === "title")    return a.title.localeCompare(b.title);
      if (sort === "year")     return b.year - a.year;
      if (sort === "hours")    return b.hours - a.hours;
      if (sort === "rating")   return b.rating - a.rating;
      if (sort === "series")   return a.series.localeCompare(b.series) || a.year - b.year;
      if (sort === "price-high") return (b.pricePaid||0) - (a.pricePaid||0);
      if (sort === "price-low")  return (a.pricePaid||0) - (b.pricePaid||0);
      if (sort === "discount") {
        const dA = a.priceFull ? (1 - (a.pricePaid||0)/a.priceFull) : 0;
        const dB = b.priceFull ? (1 - (b.pricePaid||0)/b.priceFull) : 0;
        return dB - dA;
      }
      return 0;
    });
    return list;
  }, [games, filters, search, sort]);

  const selected = games.find(g => g.id === selectedId);

  const updateGame = (id, patch) => {
    setGames(gs => gs.map(g => g.id === id ? {...g, ...patch} : g));
  };

  const saveGame = (form) => {
    if (form.id) {
      setGames(gs => gs.map(g => g.id === form.id ? {...g, ...form} : g));
    } else {
      const nextId = Math.max(0, ...games.map(g => g.id)) + 1;
      setGames(gs => [...gs, {...form, id: nextId}]);
    }
    setShowForm(false);
    setEditingGame(null);
  };

  const deleteGame = (id) => {
    setGames(gs => gs.filter(g => g.id !== id));
    setShowForm(false);
    setEditingGame(null);
    if (selectedId === id) setSelectedId(null);
  };

  const existingGenres = [...new Set(games.map(g => g.genre))].sort();
  const existingPlatforms = [...new Set(games.map(g => g.platform))].sort();
  const existingSeries = [...new Set(games.map(g => g.series))].sort();

  const clearFilters = () => {
    setFilters({ status: null, platform: null, genre: null, series: null, minRating: 0 });
    setSearch("");
  };

  const activeFilters = [
    filters.status && filters.status !== "all" && {key:"status", val: filters.status},
    filters.platform && {key:"platform", val: filters.platform},
    filters.genre && {key:"genre", val: filters.genre},
    filters.series && {key:"series", val: filters.series},
    filters.minRating > 0 && {key:"minRating", val: `≥ ${filters.minRating}★`},
    search.trim() && {key:"busca", val: `"${search}"`},
  ].filter(Boolean);

  return (
    <div className="app">
      <Sidebar
        games={games}
        filters={filters}
        setFilters={setFilters}
        view={view}
        setView={setView}
      />

      <main className="main">
        <header className="actionbar">
          <div className="actionbar-title">
            <span className="ab-kicker">BIBLIOTECA</span>
            <span className="ab-count">{games.length} jogos · {games.reduce((a,g)=>a+g.hours,0).toLocaleString("pt-BR")}h</span>
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-ghost" onClick={()=>setShowFinance(true)} title="Painel financeiro">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg>
              Financeiro
            </button>
            <button className="btn btn-primary" onClick={()=>{setEditingGame(null); setShowForm(true);}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Adicionar jogo
            </button>
          </div>
        </header>

        <header className="toolbar">
          <div className="search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              placeholder="buscar por título, série ou tag…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="clear-input" onClick={()=>setSearch("")}>×</button>}
          </div>

          <div className="sort-wrap">
            <span className="sort-label">ORDENAR</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="title">Título (A-Z)</option>
              <option value="year">Ano (novo → antigo)</option>
              <option value="hours">Mais jogados</option>
              <option value="rating">Maior nota</option>
              <option value="series">Série</option>
              <option value="price-high">Preço (maior)</option>
              <option value="price-low">Preço (menor)</option>
              <option value="discount">Maior desconto</option>
            </select>
          </div>

          <div className="rating-filter">
            <span className="sort-label">NOTA MÍN.</span>
            {[0,1,2,3,4,5].map(r => (
              <button key={r}
                className={`rf-btn ${filters.minRating===r?"on":""}`}
                onClick={()=>setFilters(f=>({...f, minRating: r}))}>
                {r===0 ? "—" : `${r}★`}
              </button>
            ))}
          </div>

          <div className="results-count">
            {filtered.length} <span>/ {games.length}</span>
          </div>
        </header>

        {activeFilters.length > 0 && (
          <div className="active-filters">
            <span className="af-label">FILTROS ATIVOS</span>
            {activeFilters.map(f => (
              <span key={f.key} className="af-chip">
                {f.key}: {f.val}
                <button onClick={() => {
                  if (f.key === "busca") setSearch("");
                  else setFilters(x => ({...x, [f.key]: null}));
                }}>×</button>
              </span>
            ))}
            <button className="af-clear" onClick={clearFilters}>limpar tudo</button>
          </div>
        )}

        <div className="content-scroll">
          {view === "grid"  && <GridView  games={filtered} onSelect={g => setSelectedId(g.id)} selectedId={selectedId}/>}
          {view === "list"  && <ListView  games={filtered} onSelect={g => setSelectedId(g.id)} selectedId={selectedId}/>}
          {view === "shelf" && <ShelfView games={filtered} onSelect={g => setSelectedId(g.id)} selectedId={selectedId}/>}

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-mark">∅</div>
              <div className="empty-title">Nenhum jogo encontrado</div>
              <div className="empty-sub">Tente ajustar os filtros ou a busca.</div>
              <button className="empty-btn" onClick={clearFilters}>limpar filtros</button>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <DetailPanel
          game={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={updateGame}
          onEdit={() => { setEditingGame(selected); setShowForm(true); }}
          onDelete={deleteGame}
        />
      )}

      {showForm && (
        <GameForm
          game={editingGame}
          onSave={saveGame}
          onCancel={() => { setShowForm(false); setEditingGame(null); }}
          onDelete={editingGame ? deleteGame : null}
          existingGenres={existingGenres}
          existingPlatforms={existingPlatforms}
          existingSeries={existingSeries}
        />
      )}

      {showFinance && <FinancePanel games={games} onClose={()=>setShowFinance(false)}/>}

      {showTweaks && (
        <div className="tweaks-panel">
          <div className="tp-head">
            <span>Tweaks</span>
            <button onClick={()=>setShowTweaks(false)}>×</button>
          </div>
          <div className="tp-field">
            <label>Tema</label>
            <div className="tp-opts">
              {["midnight","obsidian","bone"].map(t =>
                <button key={t} className={tweaks.theme===t?"on":""} onClick={()=>persistTweak("theme",t)}>{t}</button>
              )}
            </div>
          </div>
          <div className="tp-field">
            <label>Acento</label>
            <div className="tp-opts">
              {["cyan","amber","violet","lime"].map(t =>
                <button key={t} className={tweaks.accent===t?"on":""} onClick={()=>persistTweak("accent",t)}>{t}</button>
              )}
            </div>
          </div>
          <div className="tp-field">
            <label>Densidade</label>
            <div className="tp-opts">
              {["comfortable","compact"].map(t =>
                <button key={t} className={tweaks.density===t?"on":""} onClick={()=>persistTweak("density",t)}>{t}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
