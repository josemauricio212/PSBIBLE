// Capa do jogo — tenta carregar a arte real; cai num placeholder minimalista e limpo.

const GENRE_HUE = {
  "Ação-Aventura": 25, "Survival Horror": 12, "Ação Horror": 18,
  "RPG": 280, "RPG Ação": 295, "FPS": 50, "Luta": 8, "Corrida": 80,
  "Esporte": 150, "Esporte Luta": 8, "Plataforma": 200, "Aventura": 185,
  "Aventura Narrativa": 220, "Sobrevivência": 110, "Sandbox": 135,
  "Roguelike": 320, "Ação": 38, "Tiro Tático": 60, "Multiplayer": 250,
  "Beat 'em up": 30, "Party": 330,
};

function CoverPlaceholder({ game, s }) {
  const hue = GENRE_HUE[game.genre] ?? 230;
  const initials = game.title
    .replace(/[^A-Za-zÀ-ÿ0-9 ]/g, "")
    .split(" ")
    .filter(w => w.length > 2 && !["the","and","of","de","do","da"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("") || game.title.slice(0,2).toUpperCase();

  return (
    <div className="cover-ph" style={{
      background: `oklch(0.20 0.03 ${hue})`,
      "--ph-accent": `oklch(0.62 0.13 ${hue})`,
    }}>
      <div className="ph-top">
        <span className="ph-genre">{game.genre}</span>
      </div>
      <div className="ph-initials" style={{ fontSize: s.init }}>{initials}</div>
      <div className="ph-bottom">
        <div className="ph-title" style={{ fontSize: s.ti }}>{game.title}</div>
        <div className="ph-meta">{game.platform} · {game.year}</div>
      </div>
    </div>
  );
}

function Cover({ game, size = "md" }) {
  const sizes = {
    sm: { w: 120, h: 160, ti: 11, init: 26 },
    md: { w: 180, h: 240, ti: 13, init: 40 },
    lg: { w: 240, h: 320, ti: 15, init: 56 },
  };
  const s = sizes[size] || sizes.md;

  const url = (window.coverUrlFor ? window.coverUrlFor(game) : game.coverUrl) || null;
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [url]);

  const showImage = url && !failed;

  return (
    <div className="cover" style={{ width: s.w, height: s.h }}>
      {showImage && (
        <img
          className="cover-img"
          src={url}
          alt={game.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
      {!showImage && <CoverPlaceholder game={game} s={s} />}
    </div>
  );
}

window.Cover = Cover;
