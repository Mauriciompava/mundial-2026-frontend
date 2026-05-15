/**
 * Utility to get flag image URLs for all World Cup 2026 teams.
 * Uses flagcdn.com for high-quality, cross-platform flag images.
 * This eliminates the emoji flag problem on Windows desktops.
 */

const TEAM_FLAG_CODES = {
  // Grupo A
  'México': 'mx',
  'Sudáfrica': 'za',
  'Corea del Sur': 'kr',
  'Chequia': 'cz',
  // Grupo B
  'Canadá': 'ca',
  'Bosnia y Herzegovina': 'ba',
  'Catar': 'qa',
  'Suiza': 'ch',
  // Grupo C
  'Brasil': 'br',
  'Marruecos': 'ma',
  'Haití': 'ht',
  'Escocia': 'gb-sct',
  // Grupo D
  'Estados Unidos': 'us',
  'Paraguay': 'py',
  'Australia': 'au',
  'Turquía': 'tr',
  // Grupo E
  'Alemania': 'de',
  'Curazao': 'cw',
  'Costa de Marfil': 'ci',
  'Ecuador': 'ec',
  // Grupo F
  'Países Bajos': 'nl',
  'Japón': 'jp',
  'Suecia': 'se',
  'Túnez': 'tn',
  // Grupo G
  'Bélgica': 'be',
  'Egipto': 'eg',
  'Irán': 'ir',
  'Nueva Zelanda': 'nz',
  // Grupo H
  'España': 'es',
  'Cabo Verde': 'cv',
  'Arabia Saudí': 'sa',
  'Uruguay': 'uy',
  // Grupo I
  'Francia': 'fr',
  'Senegal': 'sn',
  'Irak': 'iq',
  'Noruega': 'no',
  // Grupo J
  'Argentina': 'ar',
  'Argelia': 'dz',
  'Austria': 'at',
  'Jordania': 'jo',
  // Grupo K
  'Portugal': 'pt',
  'RD Congo': 'cd',
  'Uzbekistán': 'uz',
  'Colombia': 'co',
  // Grupo L
  'Inglaterra': 'gb-eng',
  'Croacia': 'hr',
  'Ghana': 'gh',
  'Panamá': 'pa',
};

/**
 * Get the ISO code for a team by name.
 * Falls back to checking if flagUrl is already a valid ISO code.
 */
export function getFlagCode(team) {
  if (!team) return 'un'; // UN flag as fallback
  
  // First try by name (most reliable)
  const byName = TEAM_FLAG_CODES[team.name];
  if (byName) return byName;
  
  // If flagUrl is already a short ISO code (not an emoji), use it directly
  if (team.flagUrl && team.flagUrl.length <= 6 && /^[a-z-]+$/.test(team.flagUrl)) {
    return team.flagUrl;
  }
  
  return 'un'; // Fallback
}

/**
 * Get a full flag image URL for a team.
 * @param {Object} team - Team object with name and/or flagUrl
 * @param {number} width - Desired width (default 160)
 * @returns {string} URL to flag image
 */
export function getFlagUrl(team, width = 160) {
  const code = getFlagCode(team);
  return `https://flagcdn.com/w${width}/${code}.png`;
}

export default TEAM_FLAG_CODES;
