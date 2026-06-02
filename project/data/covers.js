// Mapa de capas reais — usa o CDN público de capas verticais do Steam (library_600x900).
// Chave = id do jogo (games.js). Apenas títulos com correspondência confiável.
// Quando a capa não existe/!carrega, o componente Cover cai no placeholder minimalista.
// O usuário também pode colar uma URL própria no formulário (campo coverUrl), que tem prioridade.

window.STEAM_APPIDS = {
  1: 1888930,    // The Last of Us Part I
  3: 1817070,    // Marvel's Spider-Man Remastered
  5: 1593500,    // God of War (2018)
  6: 2322010,    // God of War Ragnarök
  10: 1151640,   // Horizon Zero Dawn
  11: 2215430,   // Ghost of Tsushima
  13: 1649240,   // Returnal
  14: 1895880,   // Ratchet & Clank: Rift Apart
  15: 1190460,   // Death Stranding
  22: 883710,    // Resident Evil 2 Remake
  23: 952060,    // Resident Evil 3 Remake
  24: 2050650,   // Resident Evil 4 Remake
  27: 418370,    // Resident Evil 7
  28: 1196590,   // Resident Evil Village
  35: 222480,    // Resident Evil Revelations
  36: 287290,    // Resident Evil Revelations 2
  40: 1238840,   // Battlefield 1
  41: 1238860,   // Battlefield 4
  50: 310950,    // Street Fighter V
  51: 1364780,   // Street Fighter 6
  55: 976310,    // Mortal Kombat 11
  56: 389730,    // Tekken 7
  57: 678950,    // Dragon Ball FighterZ
  65: 552990,    // Injustice 2
  71: 200260,    // Batman: Arkham City
  72: 208650,    // Batman: Arkham Knight
  73: 1449850,   // Alan Wake Remastered
  74: 2447040,   // Alan Wake 2
  75: 1091500,   // Cyberpunk 2077
  76: 242760,    // The Forest
  77: 292030,    // The Witcher 3
  79: 1172380,   // Star Wars Jedi: Fallen Order
  80: 1774580,   // Star Wars Jedi: Survivor
  81: 379720,    // DOOM (2016)
  83: 249130,    // LEGO Marvel Super Heroes
  85: 271590,    // Grand Theft Auto V
  87: 1088850,   // Marvel's Guardians of the Galaxy
  89: 990080,    // Hogwarts Legacy
  91: 1174180,   // Red Dead Redemption 2
  93: 1222680,   // Need for Speed Heat
  96: 349040,    // Naruto Shippuden: Ultimate Ninja Storm 4
  99: 731490,    // Crash Bandicoot N. Sane Trilogy
  100: 601150,   // Devil May Cry 5
  102: 2124490,  // Silent Hill 2 Remake
  106: 268910,   // Cuphead
  107: 1259420,  // Days Gone
  109: 203160,   // Tomb Raider (2013)
  110: 235460,   // Bully: Scholarship Edition
  111: 363440,   // Mega Man Legacy Collection
};

window.coverUrlFor = function(game) {
  if (game.coverUrl) return game.coverUrl;          // URL manual tem prioridade
  const appid = window.STEAM_APPIDS[game.id];
  if (appid) return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;
  return null;
};
