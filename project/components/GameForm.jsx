// Modal para adicionar ou editar jogo
function GameForm({ game, onSave, onCancel, onDelete, existingGenres, existingPlatforms, existingSeries }) {
  const isEdit = !!game;
  const [form, setForm] = useState(game || {
    title: "", series: "", genre: "Ação-Aventura", platform: "PS5",
    year: new Date().getFullYear(), status: "biblioteca", hours: 0, rating: 0,
    tags: [],
    pricePaid: 0, priceFull: 0, purchaseYear: new Date().getFullYear(),
    coverUrl: "", notes: ""
  });

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const discount = form.priceFull > 0 ? Math.round((1 - form.pricePaid / form.priceFull) * 100) : 0;
  const resolvedCover = form.coverUrl || (window.coverUrlFor ? window.coverUrlFor(form) : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-kicker">{isEdit ? "EDITAR JOGO" : "ADICIONAR JOGO"}</div>
            <div className="modal-title">{isEdit ? form.title || "—" : "Novo cadastro"}</div>
          </div>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="cover-field">
            <div className="cover-preview">
              {resolvedCover
                ? <img src={resolvedCover} alt="" referrerPolicy="no-referrer" onError={e => { e.target.style.display='none'; }}/>
                : <span className="cover-preview-empty">sem capa</span>}
            </div>
            <div className="cover-field-input">
              <label>URL da capa (opcional)</label>
              <input value={form.coverUrl || ""} onChange={e => set("coverUrl", e.target.value)} placeholder="cole o link de uma imagem (.jpg/.png)"/>
              <span className="cover-field-hint">Deixe vazio para usar a capa automática (quando disponível) ou o placeholder.</span>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field span-2">
              <label>Título *</label>
              <input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="ex: Resident Evil 4 Remake"/>
            </div>

            <div className="form-field">
              <label>Série / Franquia</label>
              <input list="series-list" value={form.series} onChange={e => set("series", e.target.value)} placeholder="ex: Resident Evil"/>
              <datalist id="series-list">
                {existingSeries.map(s => <option key={s} value={s}/>)}
              </datalist>
            </div>

            <div className="form-field">
              <label>Gênero</label>
              <input list="genre-list" value={form.genre} onChange={e => set("genre", e.target.value)}/>
              <datalist id="genre-list">
                {existingGenres.map(g => <option key={g} value={g}/>)}
              </datalist>
            </div>

            <div className="form-field">
              <label>Plataforma</label>
              <input list="plat-list" value={form.platform} onChange={e => set("platform", e.target.value)}/>
              <datalist id="plat-list">
                {existingPlatforms.map(p => <option key={p} value={p}/>)}
              </datalist>
            </div>

            <div className="form-field">
              <label>Ano de lançamento</label>
              <input type="number" value={form.year} onChange={e => set("year", +e.target.value)}/>
            </div>

            <div className="form-field">
              <label>Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="biblioteca">Na biblioteca</option>
                <option value="jogando">Jogando</option>
                <option value="zerado">Zerado</option>
                <option value="pausado">Pausado</option>
                <option value="abandonado">Abandonado</option>
              </select>
            </div>

            <div className="form-field">
              <label>Horas</label>
              <input type="number" min="0" value={form.hours} onChange={e => set("hours", +e.target.value)}/>
            </div>

            <div className="form-field">
              <label>Nota (0-5)</label>
              <input type="number" min="0" max="5" value={form.rating} onChange={e => set("rating", +e.target.value)}/>
            </div>

            <div className="form-field">
              <label>Tags (vírgulas)</label>
              <input value={form.tags.join(", ")} onChange={e => set("tags", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="horror, remake, dlc"/>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-label">FINANCEIRO</div>
            <div className="form-grid">
              <div className="form-field">
                <label>Preço cheio (R$)</label>
                <input type="number" min="0" step="0.01" value={form.priceFull} onChange={e => set("priceFull", +e.target.value)}/>
              </div>
              <div className="form-field">
                <label>Preço pago (R$)</label>
                <input type="number" min="0" step="0.01" value={form.pricePaid} onChange={e => set("pricePaid", +e.target.value)}/>
              </div>
              <div className="form-field">
                <label>Ano de compra</label>
                <input type="number" value={form.purchaseYear || ""} onChange={e => set("purchaseYear", +e.target.value || null)}/>
              </div>
              <div className="form-field readonly">
                <label>Desconto</label>
                <div className="readonly-val" style={{color: discount > 0 ? "var(--success)" : "var(--fg-2)"}}>
                  {discount > 0 ? `−${discount}%` : discount < 0 ? `+${Math.abs(discount)}%` : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label>Anotações</label>
            <textarea rows="3" value={form.notes || ""} onChange={e => set("notes", e.target.value)}/>
          </div>

          <div className="modal-actions">
            {isEdit && onDelete && (
              <button type="button" className="btn btn-danger" onClick={() => {
                if (confirm(`Remover "${form.title}" da biblioteca?`)) onDelete(form.id);
              }}>Remover jogo</button>
            )}
            <div style={{flex:1}}/>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? "Salvar" : "Adicionar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.GameForm = GameForm;
