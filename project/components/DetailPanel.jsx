// Painel de detalhes do jogo
function DetailPanel({ game, onClose, onUpdate, onEdit, onDelete }) {
  if (!game) return null;

  const statusOptions = [
    { key: "jogando",     label: "Jogando",     color: "oklch(0.72 0.15 145)" },
    { key: "zerado",      label: "Zerado",      color: "oklch(0.72 0.13 220)" },
    { key: "biblioteca",  label: "Na biblioteca", color: "oklch(0.65 0.02 230)" },
    { key: "pausado",     label: "Pausado",     color: "oklch(0.72 0.13 60)" },
    { key: "abandonado",  label: "Abandonado",  color: "oklch(0.55 0.10 25)" },
  ];

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <button className="close-btn" onClick={onClose} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="detail-index">VAULT · #{String(game.id).padStart(3,"0")}</div>
        <div style={{flex:1}}/>
        {onEdit && <button className="detail-action-btn" onClick={onEdit} title="Editar">✎</button>}
        {onDelete && <button className="detail-action-btn danger" onClick={()=>{if(confirm(`Remover "${game.title}"?`)) onDelete(game.id);}} title="Remover">🗑</button>}
      </div>

      <div className="detail-cover-wrap">
        <Cover game={game} size="lg" />
      </div>

      <div className="detail-body">
        <div className="detail-series">{game.series}</div>
        <h2 className="detail-title">{game.title}</h2>

        <div className="detail-meta">
          <span>{game.genre}</span>
          <span className="dot">·</span>
          <span>{game.platform}</span>
          <span className="dot">·</span>
          <span>{game.year}</span>
        </div>

        <div className="detail-rating">
          {[1,2,3,4,5].map(i => (
            <button key={i}
              className={`star ${i <= game.rating ? "on" : ""}`}
              onClick={() => onUpdate(game.id, { rating: i === game.rating ? 0 : i })}>
              ★
            </button>
          ))}
          <span className="rating-label">
            {game.rating ? `${game.rating}/5` : "sem nota"}
          </span>
        </div>

        <div className="field-label">STATUS</div>
        <div className="status-grid">
          {statusOptions.map(s => (
            <button
              key={s.key}
              className={`status-chip ${game.status === s.key ? "active" : ""}`}
              onClick={() => onUpdate(game.id, { status: s.key })}
              style={game.status === s.key ? {
                borderColor: s.color, color: s.color, boxShadow:`inset 0 0 0 1px ${s.color}`
              } : {}}>
              <span className="dot-mark" style={{background: s.color}}/>
              {s.label}
            </button>
          ))}
        </div>

        <div className="field-label">HORAS JOGADAS</div>
        <div className="hours-row">
          <button className="adj-btn" onClick={() => onUpdate(game.id, { hours: Math.max(0, game.hours - 5) })}>−5h</button>
          <button className="adj-btn" onClick={() => onUpdate(game.id, { hours: Math.max(0, game.hours - 1) })}>−1h</button>
          <div className="hours-display">
            <span className="hours-number">{game.hours}</span>
            <span className="hours-unit">h</span>
          </div>
          <button className="adj-btn" onClick={() => onUpdate(game.id, { hours: game.hours + 1 })}>+1h</button>
          <button className="adj-btn" onClick={() => onUpdate(game.id, { hours: game.hours + 5 })}>+5h</button>
        </div>

        <div className="field-label">TAGS</div>
        <div className="tag-list">
          {game.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <div className="field-label">FINANCEIRO</div>
        <div className="finance-inline">
          <div className="fi-cell">
            <span className="fi-lbl">Preço pago</span>
            <span className="fi-val">{game.pricePaid ? `R$ ${Number(game.pricePaid).toFixed(2)}` : "—"}</span>
          </div>
          <div className="fi-cell">
            <span className="fi-lbl">Preço cheio</span>
            <span className="fi-val">{game.priceFull ? `R$ ${Number(game.priceFull).toFixed(2)}` : "—"}</span>
          </div>
          <div className="fi-cell">
            <span className="fi-lbl">Desconto</span>
            <span className="fi-val" style={{color: game.priceFull && game.pricePaid ? (game.pricePaid < game.priceFull ? "var(--success)" : "var(--fg-2)") : "var(--fg-3)"}}>
              {game.priceFull > 0 ? `${Math.round((1 - game.pricePaid/game.priceFull)*100)}%` : "—"}
            </span>
          </div>
          <div className="fi-cell">
            <span className="fi-lbl">Ano compra</span>
            <span className="fi-val">{game.purchaseYear || "—"}</span>
          </div>
        </div>
        {onEdit && <button className="edit-hint" onClick={onEdit}>editar dados financeiros ↗</button>}

        <div className="field-label">ANOTAÇÕES</div>
        <textarea
          className="notes"
          placeholder="— observações pessoais, progresso, achievements…"
          value={game.notes || ""}
          onChange={e => onUpdate(game.id, { notes: e.target.value })}
        />
      </div>
    </div>
  );
}

window.DetailPanel = DetailPanel;
