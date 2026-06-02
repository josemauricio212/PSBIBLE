// Sidebar — filtros + coleções + stats
function Sidebar({ games, filters, setFilters, view, setView }) {
  const total = games.length;
  const byStatus = games.reduce((a, g) => (a[g.status] = (a[g.status]||0)+1, a), {});
  const totalHours = games.reduce((a,g) => a + g.hours, 0);

  const genres = [...new Set(games.map(g => g.genre))].sort();
  const series = [...new Set(games.map(g => g.series))].sort();
  const platforms = [...new Set(games.map(g => g.platform))].sort();

  const StatusRow = ({ k, label, dotColor }) => (
    <button
      className={`filter-row ${filters.status === k ? "active" : ""}`}
      onClick={() => setFilters(f => ({...f, status: f.status === k ? null : k}))}>
      <span className="dot-mark" style={{background: dotColor}}/>
      <span className="filter-label">{label}</span>
      <span className="filter-count">{k === "all" ? total : (byStatus[k]||0)}</span>
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect x="2" y="5" width="24" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="9" cy="14" r="2" fill="currentColor"/>
            <rect x="16" y="12" width="6" height="1.5" fill="currentColor"/>
            <rect x="16" y="15" width="4" height="1.5" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <div className="brand-name">VAULT</div>
          <div className="brand-sub">biblioteca pessoal</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-num">{total}</div>
          <div className="stat-lbl">jogos</div>
        </div>
        <div className="stat">
          <div className="stat-num">{totalHours.toLocaleString("pt-BR")}</div>
          <div className="stat-lbl">horas</div>
        </div>
        <div className="stat">
          <div className="stat-num">{series.length}</div>
          <div className="stat-lbl">séries</div>
        </div>
      </div>

      <div className="section-label">VISUALIZAÇÃO</div>
      <div className="view-toggle">
        {["grid","list","shelf"].map(v => (
          <button key={v}
            className={`vt-btn ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}>
            {v === "grid" ? "Grid" : v === "list" ? "Lista" : "Prateleira"}
          </button>
        ))}
      </div>

      <div className="section-label">STATUS</div>
      <div className="filter-group">
        <StatusRow k="all"        label="Todos os jogos" dotColor="oklch(0.6 0.02 230)"/>
        <StatusRow k="jogando"    label="Jogando agora"  dotColor="oklch(0.72 0.15 145)"/>
        <StatusRow k="zerado"     label="Zerados"        dotColor="oklch(0.72 0.13 220)"/>
        <StatusRow k="biblioteca" label="Na biblioteca"  dotColor="oklch(0.65 0.02 230)"/>
        <StatusRow k="pausado"    label="Pausados"       dotColor="oklch(0.72 0.13 60)"/>
        <StatusRow k="abandonado" label="Abandonados"    dotColor="oklch(0.55 0.10 25)"/>
      </div>

      <div className="section-label">PLATAFORMA</div>
      <div className="filter-group">
        {platforms.map(p => {
          const count = games.filter(g => g.platform === p).length;
          const active = filters.platform === p;
          return (
            <button key={p} className={`filter-row ${active ? "active" : ""}`}
              onClick={() => setFilters(f => ({...f, platform: active ? null : p}))}>
              <span className="filter-label">{p}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="section-label">GÊNERO</div>
      <div className="filter-group scroll-group">
        {genres.map(g => {
          const count = games.filter(x => x.genre === g).length;
          const active = filters.genre === g;
          return (
            <button key={g} className={`filter-row ${active ? "active" : ""}`}
              onClick={() => setFilters(f => ({...f, genre: active ? null : g}))}>
              <span className="filter-label">{g}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="section-label">SÉRIES ({series.length})</div>
      <div className="filter-group scroll-group">
        {series.map(s => {
          const count = games.filter(g => g.series === s).length;
          const active = filters.series === s;
          return (
            <button key={s} className={`filter-row ${active ? "active" : ""}`}
              onClick={() => setFilters(f => ({...f, series: active ? null : s}))}>
              <span className="filter-label">{s}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-foot">
        <div className="foot-label">ÚLTIMA SINCRONIZAÇÃO</div>
        <div className="foot-val">agora · local</div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
