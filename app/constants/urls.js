
//================= OVERWATCH BACKEND API ===============================//
export const OW_API_ROOT = `https://overwatch-select-api-prod.herokuapp.com`;
export const OW_SERVER_ROOT = `/api`
export const OW_HEROES_URL = `${OW_SERVER_ROOT}/heroes`;
export const OW_MAPS_URL = `${OW_SERVER_ROOT}/maps`;
export const OW_COUNTER_TIPS_URL = `${OW_API_ROOT}/countertips`;
export const OW_HERO_URL = `${OW_SERVER_ROOT}/hero`;
export const OW_MAP_URL = `${OW_SERVER_ROOT}/map`;
export const OW_TIPS_URL = `${OW_SERVER_ROOT}/tips`;
export const OW_MATCHUPS_URL = `${OW_SERVER_ROOT}/matchups`;

//================= SOLOMID DISCUSSION API ==============================//
// export const OW_COMMUNITY_URL = `http://discussion.solomid.net`;
// export const OW_COMMUNITY_URL = `http://alejandro-discussion.herokuapp.com`;
export const OW_COMMUNITY_URL = `/communityapi`;

//================= SOLOMID AUTH URL ====================================//
export const SOLOMID_AUTH_ROOT = 'http://auth.solomid.net';
export const SOLOMID_AUTH_SIGN_IN_URL = `${SOLOMID_AUTH_ROOT}/token`;
export const SOLOMID_AUTH_SIGN_UP_URL = `${SOLOMID_AUTH_ROOT}/user/create`;
export const SOLOMID_AUTH_FORGOT_PASS_URL = `${SOLOMID_AUTH_ROOT}/user/forgot/password`;
export const SOLOMID_AUTH_RESET_PASS_URL = `${SOLOMID_AUTH_ROOT}/user/update/password`;
