// Vistas: grid, lista e prateleira
function GridView({ games, onSelect, selectedId }) {
  return (
    <div className="grid-view">
      {games.map(g => (
        <button key={g.id}
          className={`grid-card ${selectedId === g.id ? "selected" : ""}`}
          onClick={() => onSelect(g)}>
          <Cover game={g} size="md" />
          <div className="grid-meta">
            <div className="gm-title">{g.title}</div>
            <div className="gm-sub">
              <span className={`status-pip ${g.status}`}/>
              {g.genre} · {g.hours}h
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ListView({ games, onSelect, selectedId }) {
  return (
    <div className="list-view">
      <div className="list-head">
        <span>#</span>
        <span>TÍTULO</span>
        <span>SÉRIE</span>
        <span>GÊNERO</span>
        <span>PLAT.</span>
        <span>ANO</span>
        <span>HORAS</span>
        <span>NOTA</span>
        <span>STATUS</span>
      </div>
      {games.map((g, i) => (
        <button key={g.id}
          className={`list-row ${selectedId === g.id ? "selected" : ""}`}
          onClick={() => onSelect(g)}>
          <span className="lr-idx">{String(i+1).padStart(3,"0")}</span>
          <span className="lr-title">
            <Cover game={g} size="sm" />
            <span>{g.title}</span>
          </span>
          <span className="lr-series">{g.series}</span>
          <span className="lr-genre">{g.genre}</span>
          <span className="lr-plat">{g.platform}</span>
          <span className="lr-year">{g.year}</span>
          <span className="lr-hours">{g.hours}h</span>
          <span className="lr-rating">{g.rating ? "★".repeat(g.rating) : "—"}</span>
          <span className="lr-status">
            <span className={`status-pip ${g.status}`}/>
            {g.status}
          </span>
        </button>
      ))}
    </div>
  );
}

function ShelfView({ games, onSelect, selectedId }) {
  // Agrupar por série
  const grouped = {};
  games.forEach(g => {
    if (!grouped[g.series]) grouped[g.series] = [];
    grouped[g.series].push(g);
  });
  const seriesList = Object.keys(grouped).sort((a,b) => grouped[b].length - grouped[a].length);

  return (
    <div className="shelf-view">
      {seriesList.map(s => (
        <div className="shelf" key={s}>
          <div className="shelf-head">
            <div className="shelf-title">{s}</div>
            <div className="shelf-count">{grouped[s].length} {grouped[s].length === 1 ? "jogo" : "jogos"}</div>
          </div>
          <div className="shelf-row">
            {grouped[s]
              .sort((a,b) => a.year - b.year)
              .map(g => (
                <button key={g.id}
                  className={`shelf-card ${selectedId === g.id ? "selected" : ""}`}
                  onClick={() => onSelect(g)}>
                  <Cover game={g} size="md" />
                  <div className="shelf-meta">
                    <div className="sm-title">{g.title}</div>
                    <div className="sm-sub">
                      <span className={`status-pip ${g.status}`}/>
                      {g.hours}h
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

window.GridView = GridView;
window.ListView = ListView;
window.ShelfView = ShelfView;
