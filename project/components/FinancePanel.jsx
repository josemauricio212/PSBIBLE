// Painel financeiro - overview de gastos
function FinancePanel({ games, onClose }) {
  const withPrice = games.filter(g => g.pricePaid > 0 || g.priceFull > 0);
  const totalPaid = games.reduce((a,g) => a + (g.pricePaid || 0), 0);
  const totalFull = games.reduce((a,g) => a + (g.priceFull || 0), 0);
  const totalSaved = totalFull - totalPaid;
  const totalHours = games.reduce((a,g) => a + g.hours, 0);
  const costPerHour = totalHours > 0 ? totalPaid / totalHours : 0;
  const avgPerGame = withPrice.length > 0 ? totalPaid / withPrice.length : 0;

  // Gastos por ano
  const byYear = {};
  games.forEach(g => {
    if (g.pricePaid > 0 && g.purchaseYear) {
      byYear[g.purchaseYear] = (byYear[g.purchaseYear] || 0) + g.pricePaid;
    }
  });
  const years = Object.keys(byYear).sort();
  const maxYear = Math.max(...Object.values(byYear), 1);

  // Top 10 mais caros
  const topExpensive = [...games]
    .filter(g => g.pricePaid > 0)
    .sort((a,b) => b.pricePaid - a.pricePaid)
    .slice(0, 10);

  // Melhores custo/hora
  const bestValue = [...games]
    .filter(g => g.pricePaid > 0 && g.hours > 0)
    .map(g => ({...g, cph: g.pricePaid / g.hours}))
    .sort((a,b) => a.cph - b.cph)
    .slice(0, 10);

  // Gastos por gênero
  const byGenre = {};
  games.forEach(g => {
    if (g.pricePaid > 0) byGenre[g.genre] = (byGenre[g.genre] || 0) + g.pricePaid;
  });
  const genreList = Object.entries(byGenre).sort((a,b) => b[1] - a[1]).slice(0, 8);
  const maxGenre = Math.max(...genreList.map(([,v]) => v), 1);

  const fmt = (v) => `R$ ${v.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  return (
    <div className="finance-overlay">
      <div className="finance-container">
        <header className="finance-head">
          <div>
            <div className="finance-kicker">VAULT · FINANCEIRO</div>
            <h1>Painel de Investimentos</h1>
            <p className="finance-sub">Uso pessoal — organização dos gastos com jogos. Não comercial.</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        <section className="kpi-row">
          <div className="kpi primary">
            <div className="kpi-label">TOTAL INVESTIDO</div>
            <div className="kpi-value">{fmt(totalPaid)}</div>
            <div className="kpi-sub">em {withPrice.length} jogos com preço registrado</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">ECONOMIZADO</div>
            <div className="kpi-value" style={{color:"var(--success)"}}>{fmt(Math.max(0, totalSaved))}</div>
            <div className="kpi-sub">{totalFull > 0 ? `${Math.round((totalSaved/totalFull)*100)}% de desconto médio` : "sem dados"}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">MÉDIA POR JOGO</div>
            <div className="kpi-value">{fmt(avgPerGame)}</div>
            <div className="kpi-sub">ticket médio</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">CUSTO POR HORA</div>
            <div className="kpi-value">{fmt(costPerHour)}</div>
            <div className="kpi-sub">{totalHours.toLocaleString("pt-BR")}h jogadas</div>
          </div>
        </section>

        <section className="finance-grid">
          <div className="finance-card wide">
            <div className="card-title">GASTOS POR ANO</div>
            {years.length === 0 ? (
              <div className="empty-card">— sem dados de compra ainda. Edite os jogos e informe "ano de compra" + "preço pago".</div>
            ) : (
              <>
                <div className="chart-bars">
                  {years.map(y => (
                    <div key={y} className="bar-col">
                      <div className="bar-val">{fmt(byYear[y])}</div>
                      <div className="bar-wrap">
                        <div className="bar-fill" style={{height: `${(byYear[y]/maxYear)*100}%`}}/>
                      </div>
                      <div className="bar-lbl">{y}</div>
                    </div>
                  ))}
                </div>
                <table className="mini-table">
                  <thead>
                    <tr><th>ANO</th><th>JOGOS</th><th style={{textAlign:"right"}}>GASTO</th></tr>
                  </thead>
                  <tbody>
                    {years.slice().reverse().map(y => {
                      const count = games.filter(g => g.purchaseYear === +y && g.pricePaid > 0).length;
                      return <tr key={y}><td>{y}</td><td>{count}</td><td style={{textAlign:"right"}}>{fmt(byYear[y])}</td></tr>;
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className="finance-card">
            <div className="card-title">TOP 10 MAIS CAROS</div>
            {topExpensive.length === 0 ? <div className="empty-card">— sem dados</div> : (
              <ol className="rank-list">
                {topExpensive.map((g, i) => (
                  <li key={g.id}>
                    <span className="rank-idx">{String(i+1).padStart(2,"0")}</span>
                    <span className="rank-title">{g.title}</span>
                    <span className="rank-val">{fmt(g.pricePaid)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="finance-card">
            <div className="card-title">MELHOR CUSTO/HORA</div>
            {bestValue.length === 0 ? <div className="empty-card">— registre preço + horas jogadas</div> : (
              <ol className="rank-list">
                {bestValue.map((g, i) => (
                  <li key={g.id}>
                    <span className="rank-idx">{String(i+1).padStart(2,"0")}</span>
                    <span className="rank-title">{g.title}</span>
                    <span className="rank-val">{fmt(g.cph)}/h</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="finance-card wide">
            <div className="card-title">INVESTIMENTO POR GÊNERO</div>
            {genreList.length === 0 ? <div className="empty-card">— sem dados</div> : (
              <div className="hbar-list">
                {genreList.map(([g, v]) => (
                  <div key={g} className="hbar">
                    <div className="hbar-label">{g}</div>
                    <div className="hbar-track">
                      <div className="hbar-fill" style={{width: `${(v/maxGenre)*100}%`}}/>
                    </div>
                    <div className="hbar-val">{fmt(v)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="finance-foot">
          <span>※ Uso pessoal, sem fins financeiros/comerciais. Valores informados manualmente por você.</span>
        </footer>
      </div>
    </div>
  );
}

window.FinancePanel = FinancePanel;
