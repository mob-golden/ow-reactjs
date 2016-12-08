const RIOT_API_PATCH = '6.20.1';

// TODO: refactor with path operations
export const RIOT_API_ROOT = `https://ddragon.leagueoflegends.com/cdn/${RIOT_API_PATCH}`;
export const RIOT_HEROES_URL = `${RIOT_API_ROOT}/data/en_US/champion.json`;
export const RIOT_HERO_ICONS_URL = `${RIOT_API_ROOT}/img/champion`;
export const RIOT_SPRITES_URL = `${RIOT_API_ROOT}/img/sprite`;

// development
// export const CS_API_ROOT = 'http://champion-select-api-dev.herokuapp.com';

// non-cached production
// export const CS_API_ROOT = 'http://champion-select-api-prod.herokuapp.com';

// production
export const CS_API_ROOT = 'http://api.championselect.net';

export const CS_CHAMPION_URL = `${CS_API_ROOT}/champion`;
export const CS_COUNTER_TIPS_URL = `${CS_API_ROOT}/countertips`;
export const CS_COMMENTS_URL = `${CS_API_ROOT}/comments`;

export const SOLOMID_AUTH_ROOT = 'http://auth.solomid.net';
// export const SOLOMID_AUTH_ROOT = 'http://localhost:5000';
export const SOLOMID_AUTH_SIGN_IN_URL = `${SOLOMID_AUTH_ROOT}/token`;
export const SOLOMID_AUTH_SIGN_UP_URL = `${SOLOMID_AUTH_ROOT}/user/create`;
export const SOLOMID_AUTH_FORGOT_PASS_URL = `${SOLOMID_AUTH_ROOT}/user/forgot/password`;
export const SOLOMID_AUTH_RESET_PASS_URL = `${SOLOMID_AUTH_ROOT}/user/update/password`;

export const CHAMPION_GG_ROOT = 'http://api.champion.gg';
export const CHAMPION_GG_MOST_PLAYED_URL = `${CHAMPION_GG_ROOT}/stats/champs/mostPlayed`;
